import type { AxiosRequestConfig, Method } from "axios";
import axiosInstance, { tmdbInstance } from "./axios";

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
 * Main API Service that communicates with TMDB.
 * - Server-side: Calls TMDB directly via tmdbInstance for performance and reliability.
 * - Client-side: Calls our local /api/movies proxy to avoid CORS and hide API keys.
 */
export const ApiService = async <TResponse, TPayload = unknown>(
  options: ApiServiceOptions<TPayload>,
): Promise<TResponse> => {
  const { method, url, params, payload, ...rest } = options;

  const isServer = typeof window === "undefined";

  try {
    if (isServer) {
      // Direct call to TMDB on the server.
      // tmdbInstance has baseURL: ".../3", so we strip any leading "3/" or "/3/" from the url.
      const cleanUrl = url.replace(/^\/?3\//, "");

      const response = await tmdbInstance.request<TResponse>({
        method,
        url: cleanUrl,
        params: {
          language: "en-US",
          ...params,
        },
        data: payload,
        ...rest,
      });

      return response as TResponse;
    } else {
      // Proxy call via local API route on the client.
      const response = await axiosInstance.request<TResponse>({
        method,
        url: "/api/movies",
        params: {
          endpoint: url,
          language: "en-US",
          ...params,
        },
        data: payload,
        ...rest,
      });

      return response as TResponse;
    }
  } catch (error) {
    console.error(
      `ApiService ${isServer ? "[Server]" : "[Client]"} Error [${method} ${url}]:`,
      error,
    );
    throw error;
  }
};
