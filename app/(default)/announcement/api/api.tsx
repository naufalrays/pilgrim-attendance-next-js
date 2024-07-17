import axiosInstance from "@/app/api/axios";
import { Backend_URL } from "@/lib/Constants";

export const announcementService = {
  fetchAllUser: async (token: string) => {
    try {
      const response = await axiosInstance.get('/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  },

  fetchAllMessage: async (token: string, senderId: string) => {
    try {
      const response = await axiosInstance.get(`/announcement/sender/${senderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching message data:", error);
      throw error;
    }
  },

  deleteMessage: async (token: string, messageId: string) => {
    try {
      const response = await axiosInstance.delete(`/announcement/${messageId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error deleting message:", error);
      throw error;
    }
  },

  sendMessage: async (token: string, data: RequestSendMessage) => {
    try {
      const response = await axiosInstance.post('/announcement/message', data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },
};
