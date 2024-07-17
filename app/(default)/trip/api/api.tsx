import axiosInstance from "@/app/api/axios";
import { Backend_URL } from "@/lib/Constants";

export const tripService = {
  fetchTripData: async (token: string) => {
    try {
      const response = await axiosInstance.get('/trip', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching trip data:", error);
      throw error;
    }
  },

  fetchGuideData: async (token: string) => {
    try {
      const response = await axiosInstance.get('/user', {
        params: {
          role: 'user'
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching guide data:", error);
      throw error;
    }
  },

  fetchPilgrimData: async (token: string) => {
    try {
      const response = await axiosInstance.get('/pilgrim', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching pilgrim data:", error);
      throw error;
    }
  },

  fetchTripDataById: async (tripId: string, token: string) => {
    try {
      const response = await axiosInstance.get(`/trip/id/${tripId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching trip data by ID:", error);
      throw error;
    }
  },

  deleteTrip: async (id: any, token: string) => {
    try {
      const response = await axiosInstance.delete(`/trip/id/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error deleting trip:", error);
      throw error;
    }
  },

  updateTrip: async (tripId: string, data: any, token: string) => {
    try {
      const response = await axiosInstance.patch(`/trip/id/${tripId}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error updating trip:", error);
      throw error;
    }
  },

  createTrip: async (data: any, token: string) => {
    try {
      const response = await axiosInstance.post('/trip', data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error creating trip:", error);
      throw error;
    }
  },

  fetchBusDataById: async (tripId: string, token: string) => {
    try {
      const response = await axiosInstance.get(`/trip/bus/${tripId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error fetching bus data:", error);
      throw error;
    }
  },
};
