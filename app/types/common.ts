export interface RefreshResponse {
  accessToken: string;
}

export interface ApiError {
  message: string;
  success: boolean | string;
  statusCode?: number;
}

export type MediaType = "movie" | "tv";
