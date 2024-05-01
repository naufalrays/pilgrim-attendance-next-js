import { ResponseUpdateAttendancePilgrim } from "@/interfaces/reports/types";
import { Backend_URL } from "@/lib/Constants";

export const reportService = {

  fetchTripData: async (token: string) => {
    try {
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
    } catch (error) {
      console.error("Error fetching trip data:", error);
      throw error;
    }
  },

  updateAttendancePilgrimById: async (tripId:string,pilgrimId: string,data: ResponseUpdateAttendancePilgrim, token: string) => {
    try {
      const response = await fetch(`${Backend_URL}/trip/${tripId}/pilgrim/${pilgrimId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error("Gagal memperbarui data absensi");
      }
      const responseData = await response.json();
      return responseData.data;
    } catch (error) {
      console.error("Gagal memperbarui data absensi:", error);
      throw error;
    }
  },

  fetchJamaahById: async (id:string, token: string) => {
    try {
      const response = await fetch(`${Backend_URL}/pilgrim/${id}`, {
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
};
