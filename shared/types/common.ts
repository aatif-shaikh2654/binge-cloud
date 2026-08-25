import { type AniListCoverImage } from "./anilist";

export interface RefreshResponse {
  accessToken: string;
}

export interface ApiError {
  message: string;
  success: boolean | string;
  statusCode?: number;
}

export type MediaType = "movie" | "tv" | "anime";

export interface UnifiedMediaItem {
  id: number;
  media_type: MediaType;
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
  // AniList specific
  coverImage?: AniListCoverImage | null;
  bannerImage?: string | null;
  averageScore?: number | null;
  seasonYear?: number | null;
  status?: string | null;
  description?: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  genres?: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
