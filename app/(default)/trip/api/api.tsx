import { Backend_URL } from "@/lib/Constants";

export const tripService = {
  fetchTripData: async (token: string) => {
    const response = await fetch(`${Backend_URL}/trip`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const responseData = await response.json();
    return responseData.data;
  },

  fetchGuideData: async (token: string) => {
    try {
      const response = await fetch(`${Backend_URL}/user?role=user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const responseData = await response.json();
      return responseData.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  },

  fetchPilgrimData: async (token: string) => {
    try {
      const response = await fetch(`${Backend_URL}/pilgrim`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const responseData = await response.json();
      const pilgrimData = responseData.data;
      return pilgrimData;
    } catch (error) {
      console.error("Error fetching trip data:", error);
      throw error;
    }
  },

  fetchTripDataById: async (tripId: string, token: string) => {
    try {
      const response = await fetch(`${Backend_URL}/trip/${tripId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const responseData = await response.json();
      const tripData = responseData.data;
      return tripData;
    } catch (error) {
      console.error("Error fetching trip data:", error);
      throw error;
    }
  },

  deleteTrip: async (id: any, token: string) => {
    const response = await fetch(`${Backend_URL}/trip/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Gagal menghapus data");
    }
  },

  updateTrip: async (tripId: string, data: any, token: string) => {
    const response = await fetch(`${Backend_URL}/trip/${tripId}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Gagal memperbaharui data");
    }
  },

  createTrip: async (data: any, token: string) => {
    try {
      const response = await fetch(`${Backend_URL}/trip`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(`response`)
      if (!response.ok) {
        throw new Error("Gagal memperbaharui data");
      }
    } catch (error) {
      throw new Error("Gagal memperbaharui data");
    }
  },
};
