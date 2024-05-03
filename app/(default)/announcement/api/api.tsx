import { ResponseUpdateAttendancePilgrim } from "@/interfaces/reports/types";
import { Backend_URL } from "@/lib/Constants";

export const announcementService = {

  fetchAllUser: async (token: string) => {
    try {
      const response = await fetch(`${Backend_URL}/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const responseData = await response.json();
      return responseData.data;
    } catch (error) {
      console.error("Error fetching trip data:", error);
      throw error;
    }
  },


  fetchAllMessage: async (token: string, senderId: string) => {
    try {
      const response = await fetch(`${Backend_URL}/announcement/sender/${senderId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const responseData = await response.json();
      return responseData.data;
    } catch (error) {
      console.error("Error fetching trip data:", error);
      throw error;
    }
  },


  deleteMessage: async (token: string, messageId: string) => {
    try {
      const response = await fetch(`${Backend_URL}/announcement/${messageId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const responseData = await response.json();
      return responseData.data;
    } catch (error) {
      console.error("Error fetching trip data:", error);
      throw error;
    }
  },


  sendMessage: async (token: string, data : RequestSendMessage) => {
    try {
      const response = await fetch(`${Backend_URL}/announcement/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const responseData = await response.json();
      return responseData.data;
    } catch (error) {
      console.error("Error fetching trip data:", error);
      throw error;
    }
  },
};
