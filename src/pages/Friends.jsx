import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import FriendCard from "../components/FriendCard.jsx";
import NoFriendsFound from "../components/NoFriendsFound.jsx";
import useOnlineFriendsStore from "../store/useOnlineFriendsStore.js";
import useSocketStore from "../store/socketStore.js";

function Friends() {
  const { 
    data: friends = [], 
    isLoading: loadingFriends, 
    error: friendsError 
  } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });

  const onlineFriends = useOnlineFriendsStore((state) => state.onlineFriends);
  const { 
    isUserTyping, 
    getUnreadCount, 
    isConnected, 
    connectionError 
  } = useSocketStore();

  // Show connection error if present
  if (connectionError) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto">
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Connection Error: {connectionError}</span>
          </div>
        </div>
      </div>
    );
  }

  // Show friends error if present
  if (friendsError) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto">
          <div className="alert alert-error">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Failed to load friends: {friendsError.message}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Your Friends</h2>
            {/* Connection status indicator */}
            <div className={`badge ${isConnected ? 'badge-success' : 'badge-error'} gap-2`}>
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></div>
              {isConnected ? 'Online' : 'Offline'}
            </div>
          </div>
          {friends.length > 0 && (
            <div className="text-sm text-gray-500">
              {friends.length} friend{friends.length !== 1 ? 's' : ''} • {onlineFriends.size} online
            </div>
          )}
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendCard
                key={friend._id}
                friend={friend}
                isOnline={onlineFriends.has(friend._id)}
                isTyping={isUserTyping(friend._id)}
                unseenMessageCount={getUnreadCount(friend._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Friends;