// src/js/utils/authservice.js
import axios from "axios";
import { authStore } from "./authStore";
import { global_base_url } from "./global";

// Axios instance configuration
export const apiClient = axios.create({
  baseURL: global_base_url(),
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor para sa auth headers
apiClient.interceptors.request.use((config) => {
  // Magdagdag ng auth token kung available
  const token = authStore.getAccessToken();
  if (token && !config.url.includes("/api/v1/auth/login")) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor para sa token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await authService.refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        authService.logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
