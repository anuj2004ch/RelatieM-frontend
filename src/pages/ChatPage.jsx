

import { useState, useEffect, useRef } from 'react';

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router';
import { REACTIONS } from '../constants/index.js';
import toast from 'react-hot-toast';

import {
    ArrowLeft, Send, Smile, Phone, Video, Info, Check, CheckCheck, Paperclip, Mic, StopCircle, File as FileIcon, Download, X, MoreVertical, Trash2, Users, User,
} from 'lucide-react';
import useSocketStore from '../store/socketStore.js';
import useAuthUser from '../hooks/useAuthUser.js';
// ✅ deleteMessage function is imported from the API
import { createOrGetChat, fetchMessages, uploadFile, getSignedUrlForFile, deleteMessage } from '../lib/api.js';


import FilePreviewModal from '../components/FilePreviewModal';
import FriendInfoPanel from '../components/FriendInfoPanel.jsx';

const getFriendFromMembers = (members, currentUserId) => {
    if (!members || !Array.isArray(members)) return null;
    return members.find(member => member._id !== currentUserId);
};


const MessageStatus = ({ message, currentUserId }) => {
    if (message.sender._id !== currentUserId) return null;
    const isSeen = message.seenBy?.some(user => user._id !== currentUserId && user._id !== message.sender._id);
    const isDelivered = message.readBy?.length > 0;
    if (isSeen) return <CheckCheck className="w-4 h-4 text-cyan-400" />;
    if (isDelivered) return <CheckCheck className="w-4 h-4 text-gray-400" />;
    return <Check className="w-4 h-4 text-gray-400" />;
};

// Component: Reaction Picker (Original logic)
const ReactionPicker = ({ onReact, position = 'left' }) => (
    <div className={`absolute bottom-full mb-2 bg-white/95 backdrop-blur-lg rounded-full shadow-xl border border-gray-200 p-2 flex gap-1 z-30 animate-in slide-in-from-bottom-2 duration-200 ${
        position === 'right' ? 'right-0' : 'left-0'
    }`}>
        {REACTIONS.map(emoji => (
            <button 
                key={emoji} 
                onClick={() => onReact(emoji)} 
                className="p-1.5 hover:bg-gray-100 rounded-full text-2xl transition-transform duration-150 hover:scale-125 active:scale-100"
            >
                {emoji}
            </button>
        ))}
    </div>
);

const MessageOptions = ({ onDelete, isOwn, position = 'left' }) => (
    <div className={`absolute top-full mt-2 w-48 bg-white/95 backdrop-blur-md rounded-lg shadow-2xl border border-gray-200/80 z-30 p-2 animate-in fade-in zoom-in-95 duration-150 ${
        position === 'right' ? 'right-0' : 'left-0'
    }`}>
        {/* Always show "Delete for me" option */}
        <button 
            onClick={() => onDelete('me')} 
            className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
        >
            <User className="w-4 h-4" />
            <span>Delete for me</span>
        </button>
        
        {/* Only show "Delete for everyone" if user is the sender */}
        {isOwn && (
            <button 
                onClick={() => onDelete('everyone')} 
                className="w-full text-left flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
                <Users className="w-4 h-4" />
                <span>Delete for everyone</span>
            </button>
        )}
    </div>
);


// File Download Handler (Original logic, fully preserved)
const handleFileDownload = async (message) => {
    const { mediaUrl, mediaType, publicId } = message;
    const fileName = mediaUrl.split('/').pop().split('?')[0].split('-').slice(1).join('-') || 'download';
    const toastId = toast.loading('Preparing download...');
    try {
        let downloadUrl = mediaUrl;
        const isRaw = mediaType?.startsWith('audio/') || ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'].includes(mediaType);
        if (isRaw && publicId) {
            toast.loading('Requesting secure link...', { id: toastId });
            const { signedUrl } = await getSignedUrlForFile({ public_id: publicId, resource_type: 'raw' });
            downloadUrl = signedUrl;
        }
        toast.loading('Downloading file...', { id: toastId });
        const response = await fetch(downloadUrl);
        if (!response.ok) throw new Error(`Download failed: Server responded with ${response.status}`);
        const blob = await response.blob();
        const objectUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = objectUrl;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(objectUrl);
        toast.success('Download successful!', { id: toastId });
    } catch (error) {
        console.error('Download failed:', error);
        toast.error(`Download failed: ${error.message}`, { id: toastId });
    }
};




const MessageBubble = ({ 
    message, 
    isOwn, 
    currentUserId, 
    onReact, 
    onPreview, 
    friend, 
    onDelete, 
    handleFileDownload 
}) => {
    const [showReactions, setShowReactions] = useState(false);
    const [showDeleteMenu, setShowDeleteMenu] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const optionsTimeoutRef = useRef(null);

    const formatTime = (date) => new Date(date).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
    });

    const handleMouseEnter = () => {
        clearTimeout(optionsTimeoutRef.current);
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        optionsTimeoutRef.current = setTimeout(() => {
            setIsHovered(false);
            setShowReactions(false);
            setShowDeleteMenu(false);
        }, 300);
    };

    const getFileExtension = (url, mediaType) => {
        if (!url) return '';
        const urlParts = url.split('/').pop().split('?')[0];
        const fileName = urlParts.split('-').slice(1).join('-');
        if (fileName && fileName.includes('.')) { 
            return fileName.split('.').pop().toLowerCase(); 
        }
        if (mediaType) {
            const typeMap = { 
                'application/pdf': 'pdf', 
                'application/msword': 'doc', 
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx', 
                'text/plain': 'txt', 
                'application/zip': 'zip' 
            };
            return typeMap[mediaType] || mediaType.split('/')[1] || '';
        }
        return '';
    };

    const renderMedia = () => {
        if (!message.mediaUrl || !message.mediaType) return null;
        const primaryType = message.mediaType.split('/')[0];
        
        switch (primaryType) {
            case 'image':
                return (
                    <div className="relative group max-w-sm" onClick={() => onPreview(message)}>
                        <img 
                            src={message.mediaUrl} 
                            alt="Sent content" 
                            className="rounded-lg mt-2 w-full h-auto max-h-[250px] object-cover shadow-md cursor-pointer" 
                        />
                        <div className="absolute inset-0 mt-2 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                            <span className="text-white font-bold text-sm">Click to view</span>
                        </div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleFileDownload(message); }} 
                            className="absolute top-4 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70" 
                            title="Download"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                );
            case 'video':
                return (
                    <div className="relative group max-w-sm" onClick={() => onPreview(message)}>
                        <video 
                            src={message.mediaUrl} 
                            className="rounded-lg mt-2 w-full h-auto max-h-[250px] object-cover shadow-md cursor-pointer bg-black" 
                        />
                        <div className="absolute inset-0 mt-2 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white font-bold text-sm">Click to Preview</span>
                        </div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleFileDownload(message); }} 
                            className="absolute top-4 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70" 
                            title="Download"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                );
            case 'audio':
                return (
                    <div className="flex items-center gap-2 mt-2 max-w-[250px]">
                        <audio src={message.mediaUrl} controls className="flex-1 h-10" />
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleFileDownload(message); }} 
                            className="p-2 text-gray-600 hover:text-blue-500 hover:bg-gray-200 rounded-full transition-colors flex-shrink-0" 
                            title="Download"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                );
            default: {
                const fileName = message.mediaUrl.split('/').pop().split('?')[0].split('-').slice(1).join('-') || 'Download File';
                const fileExtension = getFileExtension(message.mediaUrl, message.mediaType);
                const displayName = fileName;
                const finalDisplayName = fileExtension && !displayName.toLowerCase().endsWith(`.${fileExtension}`) 
                    ? `${displayName}.${fileExtension}` 
                    : displayName;
                
                return (
                    <button 
                        onClick={() => onPreview(message)} 
                        className={`flex items-center gap-3 p-3 rounded-xl hover:shadow-md transition-all duration-200 max-w-sm w-full text-left focus:outline-none focus:ring-2 ${
                            isOwn 
                                ? 'bg-blue-700/50 hover:bg-blue-700/70 focus:ring-white' 
                                : 'bg-gray-200 hover:bg-gray-300 focus:ring-blue-500'
                        }`}
                    >
                        <FileIcon className={`w-6 h-6 flex-shrink-0 ${isOwn ? 'text-blue-100' : 'text-gray-600'}`} />
                        <span className={`text-sm font-medium truncate flex-1 ${isOwn ? 'text-white' : 'text-gray-800'}`}>
                            {finalDisplayName}
                        </span>
                        <Download className={`w-4 h-4 flex-shrink-0 ${isOwn ? 'text-blue-200' : 'text-gray-500'}`} />
                    </button>
                );
            }
        }
    };

    // Handle deleted messages
    if (message.isDeletedGlobally) {
        if (isOwn) return null;
        return (
            <div className="flex items-end gap-2 justify-start mb-3">
                <div className="w-8 h-8 flex-shrink-0" />
                <div className="max-w-[75%] lg:max-w-[65%]">
                    <div className="px-4 py-2 italic text-sm rounded-xl bg-gray-100 text-gray-500 border">
                        🚫 This message was deleted
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`relative flex items-end gap-2 ${isOwn ? 'justify-end' : 'justify-start'} mb-3 group`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Friend's avatar */}
            {!isOwn && (
                <img 
                    src={friend?.profilePic || 'https://via.placeholder.com/40'} 
                    alt={friend?.fullName} 
                    className="w-8 h-8 rounded-full self-start shadow-sm flex-shrink-0" 
                />
            )}

            {/* Message content container with relative positioning for floating buttons */}
            <div className="max-w-[75%] lg:max-w-[65%] relative">
                {/* Floating action buttons positioned OUTSIDE the message bubble */}
                {isHovered && (
                    <div className={`absolute top-0 ${isOwn ? 'left-0 -translate-x-full pl-2' : 'right-0 translate-x-full pr-2'} flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 z-40`}>
                        {/* Reaction button (only for received messages) */}
                        {!isOwn && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowReactions(!showReactions)}
                                    className="p-2 bg-white/95 backdrop-blur-sm border border-gray-200/80 text-gray-600 hover:bg-gray-50 hover:text-orange-500 transition-all duration-200 shadow-lg rounded-full hover:scale-110"
                                    title="Add reaction"
                                >
                                    <Smile className="w-4 h-4" />
                                </button>
                                {showReactions && (
                                    <ReactionPicker 
                                        onReact={(emoji) => { 
                                            onReact(message._id, emoji); 
                                            setShowReactions(false); 
                                        }} 
                                        position="left"
                                    />
                                )}
                            </div>
                        )}
                        
                        {/* Delete button */}
                        <div className="relative">
                            <button
                                onClick={() => setShowDeleteMenu(!showDeleteMenu)}
                                className="p-2 bg-white/95 backdrop-blur-sm border border-gray-200/80 text-gray-600 hover:bg-gray-50 hover:text-red-500 transition-all duration-200 shadow-lg rounded-full hover:scale-110"
                                title="Delete message"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            {showDeleteMenu && (
                                <MessageOptions 
                                    onDelete={(type) => { 
                                        onDelete(message._id, type); 
                                        setShowDeleteMenu(false); 
                                    }} 
                                    isOwn={isOwn}
                                    position={isOwn ? 'right' : 'left'}
                                />
                            )}
                        </div>
                    </div>
                )}

                {/* Main message bubble */}
                <div className={`relative shadow-sm transition-all duration-200 ${
                    isOwn 
                        ? 'bg-blue-600 text-white rounded-t-xl rounded-bl-xl' 
                        : 'bg-white text-gray-900 rounded-t-xl rounded-br-xl border border-gray-200'
                }`}>
                    <div className="px-4 py-2">
                        {renderMedia()}
                        
                        {message.text && (
                            <p className="text-base break-words whitespace-pre-wrap leading-relaxed my-1">
                                {message.text}
                            </p>
                        )}
                        
                        <div className={`flex items-center gap-1.5 mt-2 text-xs ${
                            isOwn ? 'text-blue-100/90 justify-end' : 'text-gray-500 justify-start'
                        }`}>
                            <span>{formatTime(message.createdAt)}</span>
                            <MessageStatus message={message} currentUserId={currentUserId} />
                        </div>
                    </div>
                </div>

                {/* Message reactions */}
                {message.reactions?.length > 0 && (
                    <div className={`flex flex-wrap gap-1 mt-1 ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        {Object.entries(
                            message.reactions.reduce((acc, r) => { 
                                acc[r.emoji] = (acc[r.emoji] || 0) + 1; 
                                return acc; 
                            }, {})
                        ).map(([emoji, count]) => (
                            <span 
                                key={emoji} 
                                className="bg-white/90 backdrop-blur-sm border border-gray-200/80 rounded-full px-2 py-0.5 text-xs flex items-center gap-1 shadow-sm transition-transform hover:scale-105 cursor-default"
                            >
                                {emoji} 
                                {count > 1 && (
                                    <span className="font-semibold text-gray-700 text-[10px]">
                                        {count}
                                    </span>
                                )}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};


// TypingIndicator (Original logic)
const TypingIndicator = ({ isTyping }) => {
    if (!isTyping) return null;
    return (
        <div className="flex justify-start mb-4 animate-in fade-in duration-300">
             <div className="bg-white text-gray-900 rounded-t-xl rounded-br-xl border border-gray-200 px-4 py-3 shadow-md">
                 <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                 </div>
             </div>
        </div>
    );
};



const ChatPage = () => {

    const { id: friendId } = useParams();
    const { authUser } = useAuthUser();
    const queryClient = useQueryClient();
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const typingTimeoutRef = useRef(null);
    const recordingIntervalRef = useRef(null);
    const [newMessage, setNewMessage] = useState('');
    const [chatId, setChatId] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [uploading, setUploading] = useState(false);
    const [previewingFile, setPreviewingFile] = useState(null);
    const [isInfoOpen, setIsInfoOpen] = useState(false);

    // All original hooks and function calls are preserved
    const { socket, isConnected, joinChat, leaveChat, sendMessage: socketSendMessage, markMessagesAsRead, getSocket, getChatMemberStatus, isUserTypingInChat, setTypingInChat, setTyping } = useSocketStore();
    const { data: chat, isLoading: chatLoading } = useQuery({ queryKey: ['chat', friendId], queryFn: () => createOrGetChat({ otherUserId: friendId }), enabled: !!friendId });
    const friend = chat?.members ? getFriendFromMembers(chat.members, authUser._id) : null;
    useEffect(() => { if (chat?._id) setChatId(chat._id); }, [chat]);
    const { data: messages = [], isLoading: messagesLoading } = useQuery({ queryKey: ['messages', chatId], queryFn: () => fetchMessages(chatId), enabled: !!chatId, refetchOnWindowFocus: false });
    const friendTyping = isUserTypingInChat(friendId);

    // ✅ NEW: React Query Mutation for deleting messages
    const deleteMutation = useMutation({
        mutationFn: deleteMessage,
        onSuccess: (data, variables) => {
            // "Delete for me" is handled optimistically on the client.
            // The backend doesn't need to send a socket event just for the sender.
            if (variables.deleteType === 'me') {
                toast.success(data.message || 'Message deleted for you.');
                queryClient.setQueryData(['messages', chatId], (old = []) =>
                    // We don't filter here. Instead, we rely on the `deletedFor` array
                    // and the `visibleMessages` filter below. This is more robust.
                    old.map(msg => msg._id === variables.messageId ? { ...msg, deletedFor: [...(msg.deletedFor || []), authUser._id] } : msg)
                );
            }
            // "Delete for everyone" is handled via a socket event to update all clients.
            // A success toast for the sender is still useful.
            if(variables.deleteType === 'everyone'){
                toast.success(data.message || 'Message deleted for everyone.');
            }
        },
        onError: (error) => {
            toast.error(error?.response?.data?.message || 'Failed to delete message.');
        },
    });

    // All original useEffect hooks are preserved
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, friendTyping]);
    useEffect(() => { return () => { if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current); if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current); }; }, []);
    useEffect(() => {
        if (chatId && socket && isConnected) { joinChat(chatId); markMessagesAsRead(friendId); }
        return () => { if (chatId && socket) leaveChat(chatId); };
    }, [chatId, socket, isConnected, joinChat, leaveChat, friendId, markMessagesAsRead]);
    
    // ✅ This useEffect hook is updated to include the delete listener
    useEffect(() => {
        const currentSocket = getSocket();
        if (!currentSocket || !chatId) return;

        const handleNewMessage = (message) => { if (message.chat === chatId) { queryClient.setQueryData(['messages', chatId], (old = []) => [...old, message]); } };
        const handleReactionUpdate = (data) => { queryClient.setQueryData(['messages', chatId], (old = []) => old.map(msg => msg._id === data.messageId ? { ...msg, reactions: data.reactions || [] } : msg)); };
        const handleMessageSeenUpdate = (data) => {
            queryClient.setQueryData(['messages', chatId], (old = []) => old.map(msg => {
                if (msg._id === data.messageId) {
                    const newSeenBy = [...(msg.seenBy || [])];
                    if (!newSeenBy.some(u => u._id === data.userId)) newSeenBy.push({ _id: data.userId });
                    return { ...msg, seenBy: newSeenBy };
                }
                return msg;
            }));
        };

        // ✅ NEW: Socket listener for when a message is deleted for everyone
        const handleMessageDeleted = (data) => {
            // data = { messageId, chatId, deleteType }
            if (data.chatId === chatId && data.deleteType === 'everyone') {
                if (data.userId !== authUser?._id) {
                    toast.success('A message was deleted.', { icon: '🗑️' });
                }
                queryClient.setQueryData(['messages', chatId], (old = []) =>
                    old.map((msg) =>
                        msg._id === data.messageId
                            // Mark the message as globally deleted
                            ? { ...msg, text: null, mediaUrl: null, mediaType: null, publicId: null, reactions: [], isDeletedGlobally: true }
                            : msg
                    )
                );
            }
        };

        currentSocket.on('receive-message', handleNewMessage);
        currentSocket.on('reaction-update', handleReactionUpdate);
        currentSocket.on('message-seen-update', handleMessageSeenUpdate);
        currentSocket.on('message-deleted', handleMessageDeleted); // ✅ Listener attached

        return () => {
            currentSocket.off('receive-message', handleNewMessage);
            currentSocket.off('reaction-update', handleReactionUpdate);
            currentSocket.off('message-seen-update', handleMessageSeenUpdate);
            currentSocket.off('message-deleted', handleMessageDeleted); // ✅ Listener detached
        };
    }, [chatId, queryClient, getSocket, authUser?._id]);
    
    useEffect(() => {
        const currentSocket = getSocket();
        if (!currentSocket || !chatId || !authUser) return;
        messages.filter(msg => msg.sender._id !== authUser._id && !msg.seenBy?.some(u => u._id === authUser._id))
            .forEach(msg => currentSocket.emit('message-seen', { messageId: msg._id, userId: authUser._id, chatId }));
    }, [messages, chatId, authUser, getSocket]);

    // All original handler functions are preserved
    const handleInputChange = (e) => {
        setNewMessage(e.target.value);
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        setTypingInChat(chatId, true);
        setTyping(friendId, true);
        typingTimeoutRef.current = setTimeout(() => { setTypingInChat(chatId, false); setTyping(friendId, false); }, 1000);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if ((!newMessage.trim() && !filePreview) || uploading || !chatId || !socket?.connected) return;
        let messageData = { chatId, sender: authUser._id, text: newMessage.trim() };
        if (filePreview) {
            setUploading(true);
            const toastId = toast.loading('Uploading file...');
            try {
                const { mediaUrl, mediaType, publicId } = await uploadFile(filePreview.file);
                messageData = { ...messageData, mediaUrl, mediaType, publicId };
            } catch (error) {
                console.error("File upload failed:", error);
                toast.error('File upload failed.', { id: toastId });
                setUploading(false); return;
            } finally { toast.dismiss(toastId); }
        }
        if (socketSendMessage(messageData)) {
            setNewMessage(''); setFilePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            setTypingInChat(chatId, false); setTyping(friendId, false);
        } else { toast.error('Failed to send message.'); }
        setUploading(false);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) { setFilePreview({ file, name: file.name, type: file.type.split('/')[0] }); }
    };

    const handleToggleRecording = async () => {
        if (isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            clearInterval(recordingIntervalRef.current);
        } else {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const chunks = [];
                const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
                recorder.ondataavailable = (event) => { if (event.data.size > 0) chunks.push(event.data); };
                recorder.onstop = () => {
                    const audioBlob = new Blob(chunks, { type: 'audio/webm' });
                    const audioFile = new File([audioBlob], "voice-note.webm", { type: "audio/webm" });
                    const previewUrl = URL.createObjectURL(audioBlob);
                    setFilePreview({ file: audioFile, name: "Voice Note.webm", type: 'audio', previewUrl });
                    stream.getTracks().forEach(track => track.stop());
                };
                mediaRecorderRef.current = recorder; recorder.start(); setIsRecording(true); setRecordingTime(0);
                recordingIntervalRef.current = setInterval(() => { setRecordingTime(prev => prev + 1); }, 1000);
            } catch (err) { console.error("Audio recording failed:", err); toast.error("Could not start recording."); }
        }
    };

    const handleReaction = (messageId, emoji) => { getSocket()?.emit('message-react', { messageId, userId: authUser._id, emoji, chatId }); };
    
    // ✅ NEW: Handler to trigger the delete mutation
    const handleDeleteMessage = (messageId, deleteType) => {
        if (!chatId) return;
        deleteMutation.mutate({ messageId, deleteType });
    };

    const formatRecordingTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
    const friendStatus = getChatMemberStatus(friendId);
    const isOnline = friendStatus?.status === 'online';

    // ✅ NEW: Filter messages to exclude ones deleted only by the current user
    const visibleMessages = messages.filter(msg => !msg.deletedFor?.includes(authUser?._id));

    if (chatLoading || (!chat && !friendId)) {
        return <div className="flex items-center justify-center h-screen bg-gray-100"><div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-300 border-t-blue-600"></div></div>;
    }

    return (
        <>
            <div className="flex flex-col h-screen bg-gray-100" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"52\" height=\"26\" viewBox=\"0 0 52 26\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23d4d4d8\" fill-opacity=\"0.4\"%3E%3Cpath d=\"M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z\" /%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}>
                <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/90 px-4 md:px-6 py-3 flex items-center justify-between shadow-sm z-10 flex-shrink-0">
                    <div className="flex items-center gap-4">
                        <button onClick={() => window.history.back()} className="p-2 -ml-2 hover:bg-gray-200 rounded-full transition-colors">
                            <ArrowLeft className="w-6 h-6 text-gray-800" />
                        </button>
                        <div className="relative">
                            <img src={friend?.profilePic || 'https://via.placeholder.com/48'} alt={friend?.fullName} className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-md" />
                            {isOnline && <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full"></div>}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-lg leading-tight">{friend?.fullName || 'User'}</h3>
                            <p className="text-sm font-medium h-5 text-gray-500">
                                {friendTyping ? <span className="text-blue-500 font-semibold animate-pulse">typing...</span> : (isOnline ? <span className="text-green-600 font-medium">Online</span> : <span>Offline</span>)}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="p-2.5 hover:bg-gray-200 rounded-full transition-colors"><Phone className="w-5 h-5 text-gray-700" /></button>
                        <button className="p-2.5 hover:bg-gray-200 rounded-full transition-colors"><Video className="w-5 h-5 text-gray-700" /></button>
                         <button onClick={() => setIsInfoOpen(true)} className="p-2.5 hover:bg-gray-200 rounded-full transition-colors">
              <Info className="w-5 h-5 text-gray-700" />
            </button>
                       
                    </div>
                </header>
                

                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <div className="space-y-4">
                        {messagesLoading ? (
                             <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div></div>
                        ) : (
                            <>
                                {/* ✅ UPDATED: Map over visibleMessages and pass onDelete handler */}
                                {visibleMessages.map((msg) => (
                                    <MessageBubble
                                        key={msg._id || msg.text + msg.createdAt}
                                        message={msg}
                                        isOwn={msg.sender._id === authUser._id}
                                        currentUserId={authUser._id}
                                        onReact={handleReaction}
                                        onPreview={setPreviewingFile}
                                        friend={friend}
                                        onDelete={handleDeleteMessage}
                                    />
                                ))}
                                <TypingIndicator isTyping={friendTyping} />
                            </>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </main>

                <footer className="bg-white/80 backdrop-blur-xl border-t border-gray-200/90 px-4 py-3 shadow-top z-10 flex-shrink-0">
                     {filePreview && !isRecording && (
                         <div className="flex items-center justify-between bg-blue-100 border border-blue-200 p-2 rounded-lg mb-2 animate-in fade-in-5 duration-200">
                             <div className="flex items-center gap-2 overflow-hidden">
                                 {filePreview.type === 'audio' && filePreview.previewUrl ? (
                                     <audio src={filePreview.previewUrl} controls className="h-10" />
                                 ) : (
                                     <>
                                         <FileIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                         <span className="text-sm text-blue-800 font-medium truncate">{filePreview.name}</span>
                                     </>
                                 )}
                             </div>
                             <button onClick={() => { setFilePreview(null); if (fileInputRef.current) fileInputRef.current.value = null; }} className="p-1.5 text-blue-500 hover:bg-white hover:text-red-500 rounded-full transition-colors">
                                 <X className="w-4 h-4" />
                             </button>
                         </div>
                     )}
                     <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                         {isRecording ? (
                             <div className="flex-1 flex items-center gap-3 bg-red-100 px-4 py-2 rounded-full border border-red-200">
                                 <button type="button" onClick={handleToggleRecording}>
                                     <StopCircle className="w-7 h-7 text-red-500 cursor-pointer hover:text-red-700 transition-colors" />
                                 </button>
                                 <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
                                 <span className="font-mono text-sm text-red-800 font-semibold">{formatRecordingTime(recordingTime)}</span>
                             </div>
                         ) : (
                             <>
                                 <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" disabled={uploading} />
                                 <button type="button" onClick={() => fileInputRef.current.click()} className="p-3 text-gray-500 hover:text-blue-600 hover:bg-gray-200 rounded-full transition-all" disabled={uploading} title="Attach file">
                                     <Paperclip className="w-5 h-5" />
                                 </button>
                                 <div className="flex-1 relative">
                                     <input type="text" value={newMessage} onChange={handleInputChange} placeholder={uploading ? "Uploading file..." : `Message ${friend?.fullName || 'User'}`} className="w-full px-5 py-3 bg-gray-200 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 transition-all placeholder-gray-500" disabled={!isConnected || uploading} />
                                 </div>
                                  <button type="button" onClick={handleToggleRecording} className="p-3 text-gray-500 hover:text-blue-600 hover:bg-gray-200 rounded-full transition-all" disabled={uploading || !!newMessage} title="Record voice message">
                                     <Mic className="w-5 h-5" />
                                 </button>
                                 <button type="submit" disabled={(!newMessage.trim() && !filePreview) || !isConnected || uploading} className="p-3 bg-blue-600 text-white rounded-full disabled:opacity-50 disabled:scale-100 transition-all shadow-lg hover:scale-110 hover:bg-blue-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                     <Send className="w-5 h-5" />
                                 </button>
                             </>
                         )}
                     </form>
                </footer>
                   <FriendInfoPanel 
        friend={friend}
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />
            </div>
         

            <FilePreviewModal
                message={previewingFile}
                onClose={() => setPreviewingFile(null)}
                onDownload={handleFileDownload}
            />
        </>
    );
};

export default ChatPage;

