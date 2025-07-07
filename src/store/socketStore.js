import { create } from 'zustand';
import { io } from 'socket.io-client';
import useOnlineFriendsStore from './useOnlineFriendsStore';

let socket = null;

const useSocketStore = create((set, get) => ({
  // Core state
  socket: null,
  isConnected: false,
  connectionError: null,
  
  // Maps for efficient lookups
  typingUsers: new Map(),
  unreadMessages: new Map(),
  chatMembersStatus: new Map(),
  typingInChat: new Set(),
  currentChatId: null,

  // Helper to update state
  updateState: (updates) => set(updates),

  // Clear all timers
  clearTimers: () => {
    get().typingUsers.forEach(data => data.timeout && clearTimeout(data.timeout));
  },

  // The connect function now accepts an `onMessageDeleted` callback
  connect: (userId, onReceiveMessage, onMessageError, onMessageDeleted) => {
    if (!userId || socket) return;

    socket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { userId },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    // Connection events
    socket.on('connect', () => {
      set({ isConnected: true, connectionError: null });
      socket.emit('join', userId);
    });

    socket.on('disconnect', (reason) => {
      get().clearTimers();
      set({
        isConnected: false,
        connectionError: reason === 'io server disconnect' ? 'Server disconnected' : 'Connection lost',
        typingUsers: new Map(),
        typingInChat: new Set(),
        chatMembersStatus: new Map(),
      });
    });

    socket.on('connect_error', () => {
      set({ isConnected: false, connectionError: 'Connection failed' });
    });

    socket.on('reconnect', () => {
      set({ isConnected: true, connectionError: null });
      socket.emit('join', userId);
      const chatId = get().currentChatId;
      if (chatId) socket.emit('join-chat', chatId);
    });

    // --- Message Events ---
    socket.on('receive-message', (msg) => {
        // The unread count is now handled by 'unread-count-update'
        onReceiveMessage?.(msg);
    });

    // --- NEW: EVENT LISTENER FOR DELETED MESSAGES ---
    socket.on('message-deleted', (data) => {
        // This event informs the app that a message has been updated (deleted).
        // The UI component listening will handle the state update.
        // The `data` payload will be { messageId, chatId, deleteType, newText }
        onMessageDeleted?.(data);
    });

    socket.on('message-error', onMessageError);

    // --- Friends Events ---
    socket.on('online-friends', (ids) => {
      useOnlineFriendsStore.getState().setOnlineFriends(ids);
    });

    socket.on('friend-status-change', ({ userId, status }) => {
      const store = useOnlineFriendsStore.getState();
      status === 'online' ? store.addOnlineFriend(userId) : store.removeOnlineFriend(userId);
      
      if (status === 'offline') {
        const typing = new Map(get().typingUsers);
        const data = typing.get(userId);
        if (data?.timeout) clearTimeout(data.timeout);
        typing.delete(userId);
        set({ typingUsers: typing });
      }
    });

    // --- Typing Events ---
    socket.on('user-typing', ({ userId, isTyping }) => {
        const typing = new Map(get().typingUsers);
        const existing = typing.get(userId);
        
        if (existing?.timeout) clearTimeout(existing.timeout);
        
        if (isTyping) {
            const timeout = setTimeout(() => {
                const current = new Map(get().typingUsers);
                current.delete(userId);
                set({ typingUsers: current });
            }, 3000);
            typing.set(userId, { isTyping: true, timeout });
        } else {
            if (existing?.timeout) clearTimeout(existing.timeout);
            typing.delete(userId);
        }
        
        set({ typingUsers: typing });
    });


    // --- Chat Events ---
    socket.on('chat-members-status', ({ onlineMembers = [], offlineMembers = [] }) => {
      const members = new Map();
      [...onlineMembers, ...offlineMembers].forEach(member => {
        members.set(member.userId, {
          status: onlineMembers.some(m => m.userId === member.userId) ? 'online' : 'offline',
          name: member.name,
        });
      });
      set({ chatMembersStatus: members });
    });

    socket.on('chat-member-status-change', ({ userId, status, chatId }) => {
      if (chatId === get().currentChatId) {
        const members = new Map(get().chatMembersStatus);
        const member = members.get(userId);
        if (member) {
          members.set(userId, { ...member, status });
          set({ chatMembersStatus: members });
        }
        
        if (status === 'offline') {
          const typing = new Set(get().typingInChat);
          typing.delete(userId);
          set({ typingInChat: typing });
        }
      }
    });

    socket.on('user-typing-in-chat', ({ userId, isTyping, chatId }) => {
      if (chatId === get().currentChatId) {
        const typing = new Set(get().typingInChat);
        isTyping ? typing.add(userId) : typing.delete(userId);
        set({ typingInChat: typing });
      }
    });

    // --- Unread Count Events ---
    socket.on('unread-counts', (counts) => {
        const unread = new Map(Object.entries(counts));
        set({ unreadMessages: unread });
    });

    socket.on('unread-count-update', ({ senderId, count }) => {
        const unread = new Map(get().unreadMessages);
        unread.set(senderId, count);
        set({ unreadMessages: unread });
    });


    // --- Error Events ---
    socket.on('error', (error) => {
      set({ connectionError: error.message || 'Socket error' });
    });

    socket.on('auth-error', () => {
      set({ connectionError: 'Authentication failed' });
    });

    set({ socket });
  },

  disconnect: () => {
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
    }
    
    get().clearTimers();
    socket = null;
    
    set({
      socket: null,
      isConnected: false,
      connectionError: null,
      typingUsers: new Map(),
      unreadMessages: new Map(),
      currentChatId: null,
      chatMembersStatus: new Map(),
      typingInChat: new Set(),
    });
  },

  // Chat methods
  joinChat: (chatId) => {
    if (!chatId || !socket?.connected) return false;
    const current = get().currentChatId;
    if (current && current !== chatId) socket.emit('leave-chat', current);
    
    socket.emit('join-chat', chatId);
    set({
      currentChatId: chatId,
      typingInChat: new Set(),
      chatMembersStatus: new Map(),
    });
    return true;
  },

  leaveChat: (chatId) => {
    if (!chatId || !socket?.connected) return false;
    socket.emit('leave-chat', chatId);
    set({
      currentChatId: null,
      typingInChat: new Set(),
      chatMembersStatus: new Map(),
    });
    return true;
  },

  // Messaging methods
  sendMessage: (msg) => {
    if (!msg || !socket?.connected) return false;
    socket.emit('send-message', msg);
    return true;
  },

  setTyping: (recipientId, isTyping) => {
    if (!recipientId || !socket?.connected) return false;
    socket.emit('typing', { recipientId, isTyping });
    return true;
  },

  setTypingInChat: (chatId, isTyping) => {
    if (!chatId || !socket?.connected) return false;
    socket.emit('typing-in-chat', { chatId, isTyping });
    return true;
  },

  markMessagesAsRead: (senderId) => {
    if (!senderId || !socket?.connected) return false;
    socket.emit('mark-as-read', { senderId });
    const unread = new Map(get().unreadMessages);
    unread.delete(senderId);
    set({ unreadMessages: unread });
    return true;
  },

  // Getters
  isUserTyping: (userId) => get().typingUsers.get(userId)?.isTyping || false,
  getUnreadCount: (userId) => get().unreadMessages.get(userId) || 0,
  getChatMemberStatus: (userId) => get().chatMembersStatus.get(userId),
  isMemberOnline: (userId) => get().chatMembersStatus.get(userId)?.status === 'online',
  isUserTypingInChat: (userId) => get().typingInChat.has(userId),
  
  // Array getters
  getTypingUsers: () => Array.from(get().typingUsers.keys()).filter(id => get().typingUsers.get(id).isTyping),
  getUsersTypingInChat: () => Array.from(get().typingInChat),
  getAllUnreadCounts: () => new Map(get().unreadMessages),

  reconnect: () => {
    if (socket) {
      socket.disconnect();
      setTimeout(() => socket.connect(), 500);
    }
  },

  getSocket: () => socket,
}));

export default useSocketStore;