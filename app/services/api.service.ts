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
  url: string; // TMDB endpoint (e.g., "3/trending/all/day") or internal route (e.g., "/api/signup")
  params?: Record<string, unknown>;
  payload?: TPayload;
}

/**
 * Main API Service that communicates with TMDB and internal APIs.
 * - For internal API routes (starting with "/api"): Calls axiosInstance directly.
 * - TMDB routes: Proxied via local API route (/api/movies) for both client and server side.
 */
export const ApiService = async <TResponse, TPayload = unknown>(
  options: ApiServiceOptions<TPayload>,
): Promise<TResponse> => {
  const { method, url, params, payload, ...rest } = options;

  const isServer = typeof window === "undefined";
  const isInternal = url.startsWith("/api");

  try {
    if (isInternal) {
      // Direct call to local API for internal endpoints.
      const response = await axiosInstance.request<TResponse>({
        method,
        url,
        params,
        data: payload,
        ...rest,
      });

      return response as TResponse;
    }

    // Proxy call via local API route on the server and client.
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
  } catch (error) {
    console.error(
      `ApiService ${isServer ? "[Server]" : "[Client]"} Error [${method} ${url}]:`,
      error,
    );
    throw error;
  }
};
