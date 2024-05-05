import { Backend_URL } from "@/lib/Constants";

export const accountService = {
  createUser: async (body: any) => {
    const response = await fetch(`${Backend_URL}/auth/register`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Gagal menambahkan data");
    }
  },

  updateUser: async (id: any, body: any, token: string) => {
    const response = await fetch(`${Backend_URL}/user/${id}`, {
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

  deleteUser: async (id: any, token: string) => {
    const response = await fetch(`${Backend_URL}/user/${id}`, {
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

  fetchAccountData: async (token: string) => {
    try {
      const response = await fetch(`${Backend_URL}/user`, {
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
