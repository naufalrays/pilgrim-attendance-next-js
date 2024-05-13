import { Pilgrim } from "@/interfaces/reports/types";
import { Backend_URL } from "@/lib/Constants";

export const jamaahService = {

  fetchJamaahData: async (token: string) => {
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
      return responseData.data;
    } catch (error) {
      console.error("Error fetching trip data:", error);
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

  fetchJamaahByPortionNumber: async (portionNumber:string, token: string) => {
    try {
      const response = await fetch(`${Backend_URL}/pilgrim/byPortion/${portionNumber}`, {
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


   createJamaah : async (body: any, token: string) => {
    const response = await fetch(`${Backend_URL}/pilgrim`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,

      },
    });
    if (!response.ok) {
      throw new Error("Gagal menambahkan data");
    }
  },


  createMultipleJamaah : async (body: any, token: string) => {
    const response = await fetch(`${Backend_URL}/pilgrim/many`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,

      },
    });
    if (response.status === 409) {
      throw new Error("Ada jamaah yang sudah terdaftar");
  }
    if (!response.ok) {
      throw new Error("Gagal menambahkan data");
    }
  },

  updateJamaah: async (id: any, body: any, token: string) => {
    const response = await fetch(`${Backend_URL}/pilgrim/${id}`, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Gagal menghapus data");
    }
  },

  deleteJamaahById: async (id: any, token: string) => {
    const response = await fetch(`${Backend_URL}/pilgrim/byId/${id}`, {
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

  deleteJamaahByPortionNumber: async (portion_number: any, token: string) => {
    const response = await fetch(`${Backend_URL}/pilgrim/byPortionNumber/${portion_number}`, {
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
};
