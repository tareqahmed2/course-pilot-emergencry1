import { create } from "zustand";
import { toast } from "react-toastify";
import useAxiosPublic from "./useAxiosPublic";

const axiosPublic = useAxiosPublic();

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isRendered: true,
  setIsRendered: (value) => set({ isRendered: value }),
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosPublic.get("/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const { isRendered } = get(); // get the current value from the store

      const res = await axiosPublic.get(`/messages/${userId}`);
      set({ messages: res.data });
      set({ isRendered: false });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosPublic.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, messageData] });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send message");
    }
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user });
  },
}));
