import { Backend_URL } from '@/lib/Constants';
import axios from 'axios';
import { signOut } from 'next-auth/react'; // Pastikan untuk mengimpor signOut dari next-auth/react

// Set up axios instance
const axiosInstance = axios.create({
  baseURL: `${Backend_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Check if the error response status is 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      // Perform async operation inside a Promise
      return new Promise(async (resolve, reject) => {
        try {
          // Perform signOut asynchronously
          await signOut();
          // After signOut, reject the error with a new Error instance
          reject(new Error("Unauthorized access. Redirecting to sign in."));
        } catch (error) {
          // If there's an error during signOut, log the error and reject with the original error
          console.error("Error during signOut:", error);
          reject(error);
        }
      });
    }
    // If the error is not 401, just reject with the original error
    return Promise.reject(error);
  }
);

export default axiosInstance;
