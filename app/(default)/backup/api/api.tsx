import axiosInstance from "@/app/api/axios";
import { Backend_URL } from "@/lib/Constants";
import { signOut } from "next-auth/react";

export const backupService = {
  fetchSqlData: async (token: string) => {
    try {
      const response = await axiosInstance.get('/data-management/backup', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob', // Ensure the response is a blob
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching backup data:", error);
      throw error;
    }
  },

  restoreData: async (token: string, sqlFile: File) => {
    const formData = new FormData();
    formData.append('database', sqlFile);

    try {
      const response = await axiosInstance.post('/data-management/restore', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error restoring backup data:", error);
      throw error;
    }
  },


  deleteData: async (token: string) => {
    try {
      const response = await fetch(`${Backend_URL}/data-management/delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const responseData = await response.json();
      // await signOut();
      // Clear session pada next auth auth options
      return responseData.data;
    } catch (error) {
      throw error;
    }
  },

  // deleteData: async (token: string) => {
  //   console.log("dijalankan")
  //   try {
  //     const response = await axiosInstance.post('/data-management/delete', {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     console.log("berhasil")
  //     return response.data;
  //   } catch (error) {
  //     console.log("gagal")
  //     console.error("Error restoring backup data:", error);
  //     throw error;
  //   }
  // },
};
