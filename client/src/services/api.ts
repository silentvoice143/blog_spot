import axios from "axios";
import { getAccessToken } from "../utils/common-utils";
const baseurl = process.env.VITE_BASE_URL;
const API = axios.create({
  baseURL: `${baseurl}/api`, // ✅ Correct way in Vite
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
