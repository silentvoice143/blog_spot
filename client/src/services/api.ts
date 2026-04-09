import axios from "axios";
import { getAccessToken } from "../utils/common-utils";
import { toast } from "sonner";
import { useStore } from "@/store";

const baseurl = import.meta.env.VITE_BASE_URL;

const API = axios.create({
  baseURL: baseurl,
  headers: {
    "Content-Type": "application/json",
  },
});

let isLoggingOut = false;

// ======================
// Request Interceptor
// ======================
API.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ======================
// Response Interceptor
// ======================
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || "Something went wrong";

    console.error("API Error:", error);

    switch (status) {
      case 401:
        if (!isLoggingOut) {
          const { logout } = useStore.getState();
          isLoggingOut = true;

          toast.error("Session expired. Please login again.");

          // clearAuth(); // remove token, user data etc
          logout();
          setTimeout(() => {
            window.location.href = "/login";
          }, 1000);
        }
        break;

      case 403:
        toast.error("You are not authorized to perform this action.");
        break;

      case 404:
        toast.error(message ?? "Resource not found.");
        break;

      case 500:
        toast.error("Server error. Please try again later.");
        break;

      default:
        // Network error or unknown
        if (!error.response) {
          toast.error("Network error. Check your internet.");
        } else {
          toast.error(message);
        }
        break;
    }

    return Promise.reject(error);
  },
);

export default API;
