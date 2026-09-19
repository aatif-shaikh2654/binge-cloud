import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";
import { TMDB_BASE_URL } from "@/features/media/constants/tmdb";
import { ApiError } from "@/shared/types/common";

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
      (data as { error?: string })?.error ||
      error.message ||
      "An unexpected error occurred",
  };
};

// ✅ Request interceptor for direct TMDB calls
tmdbInstance.interceptors.request.use((config) => {
  if (typeof window === "undefined") {
    if (process.env.TMDB_BASE_URL) {
      config.baseURL = process.env.TMDB_BASE_URL;
    }
    if (process.env.AUTH_TOKEN) {
      config.headers.Authorization = `Bearer ${process.env.AUTH_TOKEN}`;
    }
  }
  config.headers.accept = "application/json";
  return config;
});

// ✅ Request interceptor for local proxy
axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (typeof window === "undefined") {
      config.baseURL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ✅ Response interceptor: handle data and errors for local instance
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error: AxiosError<ApiError>) => {
    const normalizedError = normalizeError(error);
    if (typeof window !== "undefined") {
      toast.error(normalizedError.message);
    } else {
      console.error(`[API Error] ${error.config?.url}:`, normalizedError.message);
    }
    return Promise.reject(normalizedError);
  },
);

// ✅ Response interceptor with automatic domain fallback for TMDB instance
tmdbInstance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error: AxiosError<ApiError>) => {
    const config = error.config as (InternalAxiosRequestConfig & { _retryCount?: number }) | undefined;
    const isNetworkError =
      !error.response ||
      error.code === "ECONNRESET" ||
      error.code === "ETIMEDOUT" ||
      error.code === "ERR_NETWORK" ||
      error.message?.includes("ECONNRESET");

    // Attempt fallback from api.themoviedb.org to api.tmdb.org or vice-versa on network/reset errors
    if (config && isNetworkError && (!config._retryCount || config._retryCount < 1)) {
      config._retryCount = (config._retryCount || 0) + 1;
      const currentBaseURL = config.baseURL || TMDB_BASE_URL;

      let fallbackBaseURL: string | null = null;
      if (currentBaseURL.includes("api.themoviedb.org")) {
        fallbackBaseURL = currentBaseURL.replace("api.themoviedb.org", "api.tmdb.org");
      } else if (currentBaseURL.includes("api.tmdb.org")) {
        fallbackBaseURL = currentBaseURL.replace("api.tmdb.org", "api.themoviedb.org");
      }

      if (fallbackBaseURL && fallbackBaseURL !== currentBaseURL) {
        config.baseURL = fallbackBaseURL;
        try {
          return await tmdbInstance.request(config);
        } catch (fallbackError) {
          // Fall through to standard error handler
        }
      }
    }

    const normalizedError = normalizeError(error);

    if (typeof window !== "undefined") {
      toast.error(normalizedError.message);
    } else {
      console.error(`[API Error] ${error.config?.url}:`, normalizedError.message);
    }

    return Promise.reject(normalizedError);
  },
);

export default axiosInstance;
