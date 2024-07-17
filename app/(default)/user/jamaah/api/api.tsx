import axiosInstance from "@/app/api/axios";

export const jamaahService = {
  fetchJamaahData: async (token: string) => {
    try {
      const response = await axiosInstance.get('/pilgrim', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data)
      return response.data.data;
    } catch (error) {
      console.error("Error fetching trip data:", error);
      throw error;
    }
  },

  fetchJamaahById: async (id: string, token: string) => {
    try {
      const response = await axiosInstance.get(`/pilgrim/${id}`, {
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

  fetchJamaahByPortionNumber: async (portionNumber: string, token: string) => {
    try {
      const response = await axiosInstance.get(`/pilgrim/byPortion/${portionNumber}`, {
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

  createJamaah: async (body: any, token: string) => {
    try {
      const response = await axiosInstance.post('/pilgrim', body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error creating jamaah:", error);
      throw error;
    }
  },

  createMultipleJamaah: async (body: any, token: string) => {
    try {
      const response = await axiosInstance.post('/pilgrim/many', body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error creating multiple jamaah:", error);
      throw error;
    }
  },

  updateJamaah: async (id: any, body: any, token: string) => {
    try {
      const response = await axiosInstance.patch(`/pilgrim/${id}`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error updating jamaah:", error);
      throw error;
    }
  },

  deleteJamaahById: async (id: any, token: string) => {
    try {
      const response = await axiosInstance.delete(`/pilgrim/byId/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error deleting jamaah by id:", error);
      throw error;
    }
  },

  deleteJamaahByPortionNumber: async (portion_number: any, token: string) => {
    try {
      const response = await axiosInstance.delete(`/pilgrim/byPortionNumber/${portion_number}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error("Error deleting jamaah by portion number:", error);
      throw error;
    }
  },
};
