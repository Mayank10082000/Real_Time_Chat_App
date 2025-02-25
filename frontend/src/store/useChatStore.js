import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/user");
      const usersArray = res.data?.filteredUsers || [];
      set({ users: usersArray });
    } catch (error) {
      console.log("Error in getUser: ", error);
      toast.error(error?.response?.data?.message || "Failed to fetch users");
      set({ users: [] });
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`); // Endpoint for backend
      set({ messages: res.data });
    } catch (error) {
      console.log("Error in getMessages: ", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.log("Error in sendMessage: ", error);
      toast.error(error.response.data.message);
    }
  },
  // Todo: Optimize it later
  setSelectedUser: (selectedUser) => set({ selectedUser }),
}));
