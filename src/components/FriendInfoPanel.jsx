
// import { X, Mail, MapPin, User, Calendar, Globe } from 'lucide-react';

// const FriendInfoPanel = ({ friend, isOpen, onClose }) => {
//   return (
//     <>
//       {/* Backdrop overlay - covers only the chat area */}
//       {isOpen && (
//         <div 
//           className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
//           onClick={onClose}
//           style={{ left: '266px' }} // Adjust this value to match your sidebar width
//         />
//       )}
      
//       {/* Sliding panel - positioned to respect the sidebar */}
//       <div className={`
//         fixed top-0 right-0 bottom-0 z-50 w-96
//         bg-white/98 backdrop-blur-xl border-l border-gray-200/90 shadow-2xl
//         transform transition-all duration-300 ease-out
//         ${isOpen ? 'translate-x-0' : 'translate-x-full'}
//         overflow-y-auto
//       `}>
//         <div className="p-6">
//           {/* Header */}
//           <div className="flex justify-between items-center mb-8">
//             <h3 className="text-xl font-semibold text-gray-900">Contact Info</h3>
//             <button 
//               onClick={onClose} 
//               className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
//             >
//               <X className="w-5 h-5 text-gray-600" />
//             </button>
//           </div>

//           {/* Profile section */}
//           <div className="flex flex-col items-center text-center space-y-6 mb-8">
//             <div className="relative">
//               <img
//                 src={friend?.profilePic || 'https://via.placeholder.com/120'}
//                 alt={friend?.fullName}
//                 className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-gray-100"
//               />
//               {/* Online status indicator */}
//               <div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 rounded-full border-3 border-white shadow-md"></div>
//             </div>
            
//             <div className="space-y-3">
//               <div>
//                 <h2 className="text-2xl font-bold text-gray-900 mb-1">
//                   {friend?.fullName || 'User'}
//                 </h2>
//                 {friend?.username && (
//                   <p className="text-gray-500 font-medium">
//                     @{friend.username}
//                   </p>
//                 )}
//               </div>
              
//               {friend?.bio && (
//                 <p className="text-gray-600 leading-relaxed max-w-xs text-sm">
//                   {friend.bio}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Contact Information */}
//           <div className="space-y-1">
//             <h4 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wide">
//               Contact Details
//             </h4>
            
//             {friend?.email && (
//               <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100/50 hover:shadow-sm transition-shadow">
//                 <div className="p-2 bg-blue-100 rounded-lg">
//                   <Mail className="w-4 h-4 text-blue-600" />
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500 font-medium">Email</p>
//                   <p className="text-gray-900 text-sm font-medium">{friend.email}</p>
//                 </div>
//               </div>
//             )}
            
//             {friend?.location && (
//               <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100/50 hover:shadow-sm transition-shadow">
//                 <div className="p-2 bg-green-100 rounded-lg">
//                   <MapPin className="w-4 h-4 text-green-600" />
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500 font-medium">Location</p>
//                   <p className="text-gray-900 text-sm font-medium">{friend.location}</p>
//                 </div>
//               </div>
//             )}

//             {friend?.joinedDate && (
//               <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100/50 hover:shadow-sm transition-shadow">
//                 <div className="p-2 bg-purple-100 rounded-lg">
//                   <Calendar className="w-4 h-4 text-purple-600" />
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500 font-medium">Joined</p>
//                   <p className="text-gray-900 text-sm font-medium">{friend.joinedDate}</p>
//                 </div>
//               </div>
//             )}

//             {friend?.website && (
//               <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100/50 hover:shadow-sm transition-shadow">
//                 <div className="p-2 bg-orange-100 rounded-lg">
//                   <Globe className="w-4 h-4 text-orange-600" />
//                 </div>
//                 <div>
//                   <p className="text-xs text-gray-500 font-medium">Website</p>
//                   <p className="text-gray-900 text-sm font-medium">{friend.website}</p>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Additional actions or info can go here */}
//           <div className="mt-8 pt-6 border-t border-gray-200">
//             <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//               <User className="w-5 h-5 text-gray-600" />
//               <div>
//                 <p className="text-xs text-gray-500 font-medium">Member since</p>
//                 <p className="text-gray-900 text-sm font-medium">
//                   {friend?.joinedDate || 'Recently joined'}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default FriendInfoPanel;
import { X, Mail, MapPin, Calendar, Globe } from 'lucide-react';

const FriendInfoPanel = ({ friend, isOpen, onClose }) => {
  return (
    <>
      {/* Backdrop overlay - covers only the chat area */}
      {isOpen && (
        <div 
          className="fixed inset-0  z-40 transition-opacity duration-300"
          onClick={onClose}
          style={{ left: '266px' }} // Adjust this value to match your sidebar width
        />
      )}
      
      {/* Sliding panel - positioned to respect the sidebar */}
      <div className={`
        fixed top-0 right-0 bottom-0 z-50 w-96
        bg-white/98 backdrop-blur-xl border-l border-gray-200/90 shadow-2xl
        transform transition-all duration-300 ease-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        overflow-y-auto
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-semibold text-gray-900">User Info</h3>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Profile section */}
          <div className="flex flex-col items-center text-center space-y-6 mb-8">
            <div className="relative">
              <img
                src={friend?.profilePic || 'https://via.placeholder.com/120'}
                alt={friend?.fullName}
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg ring-2 ring-gray-100"
              />
              {/* Online status indicator */}
             
            </div>
            
            <div className="space-y-3">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {friend?.fullName || 'User'}
                </h2>
                {friend?.username && (
                  <p className="text-gray-500 font-medium">
                    @{friend.username}
                  </p>
                )}
              </div>
              
              {friend?.bio && (
                <p className="text-gray-600 leading-relaxed max-w-xs text-sm">
                  {friend.bio}
                </p>
              )}
            </div>
          </div>

         
          <div className="space-y-1">
            
            
            {friend?.email && (
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100/50 hover:shadow-sm transition-shadow">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Email</p>
                  <p className="text-gray-900 text-sm font-medium">{friend.email}</p>
                </div>
              </div>
            )}
            
            {friend?.location && (
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100/50 hover:shadow-sm transition-shadow">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MapPin className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Location</p>
                  <p className="text-gray-900 text-sm font-medium">{friend.location}</p>
                </div>
              </div>
            )}

            {friend?.createdAt && (
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100/50 hover:shadow-sm transition-shadow">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Joined</p>
                  <p className="text-gray-900 text-sm font-medium">
                    {new Date(friend.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}

            {friend?.website && (
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100/50 hover:shadow-sm transition-shadow">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Globe className="w-4 h-4 text-orange-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Website</p>
                  <p className="text-gray-900 text-sm font-medium">{friend.website}</p>
                </div>
              </div>
            )}
          </div>

         
        </div>
      </div>
    </>
  );
};

export default FriendInfoPanel;