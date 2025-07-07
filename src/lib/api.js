import { axiosInstance } from "./axios";


export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
}
export const requestOtp=async (email)=>{
  const response = await axiosInstance.post("/auth/request-otp", { email });
  return response.data;
}
export const checkUsername= async (username) => {
  const response = await axiosInstance.get(`/auth/check-username/${username}`);
  return response.data;
}
export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
}
export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  console.log(response.data);
  
  return response.data;
}
export const getAuthUser = async () => {
  try {
    const response = await axiosInstance.get("/auth/me");
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const completeOnboarding = async (userData) => {
  const response = await axiosInstance.post("/auth/onboarding", userData);
  return response.data;

}
export const getUserFriends = async () => {
  const response = await axiosInstance.get("/users/friends");
  return response.data;
};
export const getRecommendedUsers = async () => {
  const response = await axiosInstance.get("/users");
  return response.data;
};
export const getOutgoingFriendReqs = async () => {
  const response = await axiosInstance.get("/users/outgoing-friend-requests")
  return response.data;
}
export async function sendFriendRequest(userId) {
  const response = await axiosInstance.post(`/users/friend-request/${userId}`);
  return response.data;
}
export async function getFriendRequests() {
  const response = await axiosInstance.get("/users/friend-requests");
  return response.data;
}
export async function acceptFriendRequest(requestId) {
  const response = await axiosInstance.put(`/users/friend-request/${requestId}/accept`);
  return response.data;
}
export const createOrGetChat = async (otherUserId) => {
  const res = await axiosInstance.post("/chat", otherUserId);
  return res.data;
};
export const sendMessage = async (data) => {
  const res = await axiosInstance.post("/chat/message", data);
  return res.data;
};
export const fetchMessages = async (chatId) => {
  const res = await axiosInstance.get(`/chat/messages/${chatId}`);
  return res.data;
};
export const getFriendId = async () => {
  const res = await axiosInstance.get("/users/friends");
  return res.data;
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  // The backend for "/upload" should return { mediaUrl, mediaType, publicId }
  const response = await axiosInstance.post("/upload", formData);
  return response.data;
};


export const getSignedUrlForFile = async (data) => {
  const response = await axiosInstance.post("/upload/get-signed-url", data);
  return response.data;
};
export const deleteMessage = async ({ messageId, deleteType }) => {
  const response = await axiosInstance.delete(`/chat/messages/${messageId}`, {
    data: { deleteType },
  });
  return response.data;
};
