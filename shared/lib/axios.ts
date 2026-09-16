import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";
import { TMDB_BASE_URL } from "@/features/media/constants/tmdb";
import { ApiError } from "@/shared/types/common";

let serverHttpsAgent: unknown = undefined;
if (typeof window === "undefined") {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const https = require("https");
    serverHttpsAgent = new https.Agent({
      keepAlive: true,
      keepAliveMsecs: 10000,
      maxSockets: 50,
      maxFreeSockets: 10,
      timeout: 30000,
    });
  } catch {
    // browser or environment without node https
  }
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "/",
  timeout: 50000,
});

/**
 * Dedicated instance for direct TMDB API calls (Server-side)
 */
export const tmdbInstance: AxiosInstance = axios.create({
  baseURL: TMDB_BASE_URL,
  timeout: 20000,
  ...(serverHttpsAgent ? { httpsAgent: serverHttpsAgent } : {}),
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

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retryCount?: number;
}

const isRetryableError = (error: AxiosError) => {
  const code = error.code;
  const message = error.message || "";
  const status = error.response?.status;

  return (
    code === "ECONNRESET" ||
    code === "ETIMEDOUT" ||
    code === "ECONNABORTED" ||
    code === "ENOTFOUND" ||
    code === "ERR_NETWORK" ||
    message.includes("ECONNRESET") ||
    message.includes("socket hang up") ||
    message.includes("timeout") ||
    (typeof status === "number" && (status === 429 || status >= 500))
  );
};

// ✅ Request interceptor for direct TMDB calls
tmdbInstance.interceptors.request.use((config) => {
  if (typeof window === "undefined" && process.env.AUTH_TOKEN) {
    config.headers.Authorization = `Bearer ${process.env.AUTH_TOKEN}`;
  }
  config.headers.accept = "application/json";
  config.headers["User-Agent"] =
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";
  config.headers["Accept-Encoding"] = "gzip, deflate, br";
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

// ✅ Response interceptor: handle data and errors for both instances
const responseInterceptor = (response: AxiosResponse) => response.data;

const createErrorInterceptor = (instance: AxiosInstance) => {
  return async (error: AxiosError<ApiError>) => {
    const config = error.config as CustomAxiosRequestConfig | undefined;

    // Retry logic for transient network & socket reset errors
    if (config && isRetryableError(error)) {
      config._retryCount = (config._retryCount || 0) + 1;
      if (config._retryCount <= 3) {
        const backoffDelay = Math.min(
          300 * Math.pow(2, config._retryCount - 1),
          2000,
        );
        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
        return instance.request(config);
      }
    }

    const normalizedError = normalizeError(error);

    // Only show toasts on the client
    if (typeof window !== "undefined") {
      toast.error(normalizedError.message);
    } else {
      console.error(`[API Error] ${error.config?.url}:`, normalizedError.message);
    }

    return Promise.reject(normalizedError);
  };
};

axiosInstance.interceptors.response.use(
  responseInterceptor,
  createErrorInterceptor(axiosInstance),
);
tmdbInstance.interceptors.response.use(
  responseInterceptor,
  createErrorInterceptor(tmdbInstance),
);

export default axiosInstance;
