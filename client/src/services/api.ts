import axios from "axios";
import { getAccessToken } from "../utils/common-utils";

const API = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // ✅ Correct way in Vite
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
API.interceptors.request.use(
  (config) => {
    // Add token if exists
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default API;
