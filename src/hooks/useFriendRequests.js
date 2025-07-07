import { useQuery } from "@tanstack/react-query";
import { getFriendRequests } from "../lib/api.js";

export default function useFriendRequests() {
     const {data:friendRequests,isLoading}=useQuery({
        queryKey:["FriendsRequests"],
        queryFn:getFriendRequests
      });

     return {friendRequests,isLoading};
}