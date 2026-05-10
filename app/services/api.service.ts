import type { AxiosRequestConfig, Method } from "axios";
import axiosInstance from "./axios";

export interface ApiResponse<T> {
  data: T;
  success?: boolean;
  status?: number;
  message?: string;
}

interface ApiServiceOptions<TPayload = unknown> extends AxiosRequestConfig {
  method: Method;
  url: string; // TMDB endpoint (e.g., "3/trending/all/day")
  params?: Record<string, unknown>;
  payload?: TPayload;
}

/**
 * Main API Service that communicates with our local TMDB proxy.
 * This handles mapping the 'url' to the 'endpoint' parameter required by the proxy
 * and adds default parameters like language.
 */
export const ApiService = async <TResponse, TPayload = unknown>(
  options: ApiServiceOptions<TPayload>,
): Promise<TResponse> => {
  const { method, url, params, payload, ...rest } = options;

  // In Next.js, for server-side calls, we need an absolute URL.
  const isServer = typeof window === "undefined";
  const requestUrl = isServer
    ? `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/movies`
    : "/api/movies";

  try {
    const response = await axiosInstance.request<TResponse>({
      method,
      url: requestUrl,
      params: {
        endpoint: url,
        language: "en-US", // Set default language here
        ...params,
      },
      data: payload,
      ...rest,
    });

    return response as TResponse;
  } catch (error) {
    console.error(`ApiService Error [${method} ${url}]:`, error);
    throw error;
  }
};
