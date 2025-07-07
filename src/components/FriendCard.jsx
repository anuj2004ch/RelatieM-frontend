
// export default FriendCard;
import { Link } from "react-router";


const FriendCard = ({ friend, isOnline, unseenMessageCount = 0, isTyping = false }) => {
  return (
    <div className="card bg-base-200 hover:shadow-md transition-shadow relative">
      {isOnline && (
        <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
      )}

      <div className="card-body p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="avatar size-12">
            <img src={friend.profilePic} alt={friend.fullName} className="rounded-full" />
          </div>
          <div className="flex-1">
            <h3 className={`font-semibold truncate ${
              unseenMessageCount > 0 ? 'text-orange-600' : ''
            }`}>
              {friend.fullName}
              {unseenMessageCount > 0 && (
                <span className="ml-3 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                  {unseenMessageCount}
                </span>
              )}
            </h3>
            {isTyping && (
              <div className="text-xs text-gray-500 italic">typing...</div>
            )}
          </div>
        </div>

        <Link to={`/chat/${friend._id}`} className="btn btn-primary w-full rounded-full">
          Message
        </Link>
      </div>
    </div>
  );
};

export default FriendCard;