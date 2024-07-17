import axiosInstance from "@/app/api/axios";

export const accountService = {
  createUser: async (body: any) => {
    try {
      const response = await axiosInstance.post('/auth/register', body, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data.data;
    } catch (error) {
      throw new Error("Gagal menambahkan data");
    }
  },

  updateUser: async (id: any, body: any, token: string) => {
    try {
      const response = await axiosInstance.patch(`/user/${id}`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      throw new Error("Gagal menghapus data");
    }
  },

  deleteUser: async (id: any, token: string) => {
    try {
      const response = await axiosInstance.delete(`/user/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      throw new Error("Gagal menghapus data");
    }
  },

  fetchAccountData: async (token: string) => {
    try {
      const response = await axiosInstance.get('/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error) {
      throw new Error("Failed to fetch data");
    }
  },
};
