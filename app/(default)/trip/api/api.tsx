export const tripService = {
  fetchGuideData: async (token: string) => {
    try {
      const response = await fetch("http://localhost:8000/user?role=user", {
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
      const response = await fetch("http://localhost:8000/pilgrim", {
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

  fetchTripData: async (tripId: string, token: string) => {
    try {
      const response = await fetch(`http://localhost:8000/trip/${tripId}`, {
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
  }
};
