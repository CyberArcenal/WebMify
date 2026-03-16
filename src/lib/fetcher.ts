// src/lib/authService.ts
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig  // ← import this
} from "axios";
import { global_base_url } from "./global";

interface AuthenticatedRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}


export const apiClient: AxiosInstance = axios.create({
  baseURL: global_base_url(),
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  }
});

// REQUEST INTERCEPTOR
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // Ensure headers object exists
    config.headers = config.headers || {};

    // Skip auth for login
    if (config.url?.includes("/api/login")) {
      return config;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR (unchanged)
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError): Promise<any> => {
    const originalRequest = error.config as AuthenticatedRequest;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
    }
    return Promise.reject(error);
  }
);

