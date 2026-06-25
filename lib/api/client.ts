import axios, { AxiosError } from "axios";
import { useAuthStore } from "@/lib/store/authStore";
import type { ApiError } from "@/types/api";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    if (response.data?.success === false) {
      const err = response.data as ApiError;
      return Promise.reject(new Error(err.error.message));
    }
    return response;
  },
  (error: AxiosError<ApiError>) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    const message =
      error.response?.data?.error?.message ??
      error.message ??
      "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export default apiClient;

export function unwrap<T>(response: { data: { data: T } }): T {
  return response.data.data;
}
