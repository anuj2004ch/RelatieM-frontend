import useAuthUser from "../hooks/useAuthUser"

import { useQueryClient,useMutation} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { logout } from "../lib/api.js";
import { BellIcon, LogOutIcon } from "lucide-react";
import { Link } from "react-router";
import ThemeSelector from "./ThemeSelector.jsx";

import useFriendRequests from "../hooks/useFriendRequests.js";
function Navbar() {
    const {authUser}=useAuthUser();
    
    const {friendRequests}=useFriendRequests();
    const incomingRequest=friendRequests?.incomingReqs.length || 0;
   

    const queryClient=useQueryClient();
  const { mutate: logoutMutation } = useMutation({
  mutationFn: logout,
  onSuccess: () => {
    toast.success("Logged out successfully!");
    
    queryClient.invalidateQueries({ queryKey: ["authUser"] });
    console.log(authUser);
  },
  onError: (error) => {
    toast.error(error.response?.data?.message || "Failed to logout. Please try again.");
  }
});

   

  return (
    <nav className="bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center">
        <div  className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-end w-full">
               
                <div className="flex items-center gap-3 sm:gap-4 ml-auto">
                   <Link to="/notifications">
  <div className="relative">
    <button className="btn btn-ghost btn-circle">
      <BellIcon className="h-6 w-6 text-base-content opacity-70" />
    </button>
    {incomingRequest > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5">
        {incomingRequest}
      </span>
    )}
  </div>
</Link>



                </div>
                <ThemeSelector/>
               <Link to="/profile">
  <div className="avatar cursor-pointer">
    <div className="w-9 rounded-full">
      <img src={authUser?.profilePic} alt="User Avatar" rel="noreferrer" />
    </div>
  </div>
</Link>

                <button className="btn btn-ghost btn-circle" onClick={logoutMutation}>
                    <LogOutIcon className="h-6 w-6 text-base-content opacity-70"/>
                </button>
            </div>
        </div>

    </nav>
  )
}

export default Navbar