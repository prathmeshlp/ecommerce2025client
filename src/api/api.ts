import axios, { AxiosError } from "axios";
import { getToken } from "../utils/auth";
import { API_CONSTANTS } from "./constants";

export const api = axios.create({
  baseURL: `${API_CONSTANTS.BASE_URL}/api/`,
  withCredentials: true,
  timeout: API_CONSTANTS.TIMEOUT,
});

// Request interceptor to add Authorization header
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor for global error handling (optional)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const message = (error.response?.data as { message?: string })?.message || "An error occurred while communicating with the server.";
    return Promise.reject(new Error(message));
  }
);