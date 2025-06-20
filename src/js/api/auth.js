// src/js/utils/authservice.js
import axios from "axios";
import { authStore } from "./authStore";
import { global_base_url } from "./global";
import { showError, showSuccess } from "../utils/notifications";

// Axios instance configuration
const apiClient = axios.create({
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

export const authService = {
  handleAuthError(err) {
    const res = err?.response;
    const data = res?.data || {};
    const status = res?.status || 0;

    /* --- extract server-side text ---------------------------------- */
    let msg;
    if (typeof data === "string") {
      msg = data;
    } else if (data && typeof data === "object") {
      msg =
        data.message ||
        data.detail ||
        (Array.isArray(data.non_field_errors)
          ? data.non_field_errors.join(" ")
          : null) ||
        // first string we can find in field errors
        Object.values(data)
          .flat()
          .find((v) => typeof v === "string");
    }

    /* --- fallbacks when server is silent --------------------------- */
    if (!msg) {
      const fallback = {
        400: "Invalid email or password format",
        401: "Authentication failed",
        403: "Account not verified",
        404: "Resource not found",
        500: "Server error",
      };
      msg = fallback[status] || "Connection error";
    }

    /* --- notify UI once ------------------------------------------- */
    showError(msg);

    /* --- propagate as Error object -------------------------------- */
    return new Error(msg);
  },

  /* Token refresh request (adapt URL / payload to your backend) */
  async refreshToken() {
    const { data } = await apiClient.post(`${global_base_url()}/auth/refresh`, {
      refresh: authStore.getRefreshToken(),
    });
    authStore.setAccessToken(data.access);
    return data.access;
  },

  logout() {
    authStore.clear();
    window.location.href = "/login";
  },
};
