import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";
import { TMDB_BASE_URL } from "../constants/tmdb";
import { ApiError } from "../types/common";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "/",
  timeout: 50000,
});

/**
 * Dedicated instance for direct TMDB API calls (Server-side)
 */
export const tmdbInstance: AxiosInstance = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 15000,
});

// Helper to normalize errors
const normalizeError = (error: AxiosError<ApiError>) => {
  const data = error.response?.data;
  return {
    success: data?.success ?? false,
    statusCode: data?.statusCode ?? error.response?.status ?? 500,
    message:
      data?.message ||
      (data as any)?.error ||
      error.message ||
      "An unexpected error occurred",
  };
};

// ✅ Request interceptor for direct TMDB calls
tmdbInstance.interceptors.request.use((config) => {
  if (typeof window === "undefined" && process.env.AUTH_TOKEN) {
    config.headers.Authorization = `Bearer ${process.env.AUTH_TOKEN}`;
  }
  config.headers.accept = "application/json";
  return config;
});

// ✅ Request interceptor for local proxy
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Add any client-side auth logic here if needed
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ✅ Response interceptor: handle data and errors for both instances
const responseInterceptor = (response: AxiosResponse) => response.data;
const errorInterceptor = async (error: AxiosError<ApiError>) => {
  const normalizedError = normalizeError(error);

  // Only show toasts on the client
  if (typeof window !== "undefined") {
    toast.error(normalizedError.message);
  } else {
    console.error(`[API Error] ${error.config?.url}:`, normalizedError.message);
  }

  return Promise.reject(normalizedError);
};

axiosInstance.interceptors.response.use(responseInterceptor, errorInterceptor);
tmdbInstance.interceptors.response.use(responseInterceptor, errorInterceptor);

export default axiosInstance;
