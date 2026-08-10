import { type MediaType } from "@/app/types/common";
import {
  type TMDBCreditsResponse,
  type TMDBImageResponse,
  type TMDBMovie,
  type TMDBResponse,
  type TMDBSeasonDetails,
  type TMDBPerson,
  type TMDBPersonCredits,
} from "@/app/types/tmdb";
import { ApiService } from "./api.service";

/**
 * Helper to fetch a movie/show logo path directly from TMDB
 */
export const fetchMovieLogo = async (
  id: number,
  type: MediaType,
): Promise<string | undefined> => {
  try {
    const data = await ApiService<TMDBImageResponse>({
      method: "GET",
      url: `/${type}/${id}/images`,
      params: { include_image_language: "en,null" },
    });

    const logo =
      data.logos?.find(
        (l) => l.file_path.endsWith(".png") || l.file_path.endsWith(".svg"),
      ) || data.logos?.[0];

    return logo?.file_path;
  } catch {
    // Error is already logged by axios interceptor
    return undefined;
  }
};

/**
 * Service to fetch trending movies/series/all from TMDB
 */
export const getTrendingMovies = async (
  page: number = 1,
): Promise<TMDBResponse<TMDBMovie>> => {
  const trending = await ApiService<TMDBResponse<TMDBMovie>>({
    method: "GET",
    url: "/trending/all/day",
    params: { page },
  });

  const results = trending.results || [];

  // Fetch logos for the first 8 items for the Hero Section (Server-side only, page 1 only)
  if (typeof window === "undefined" && results.length > 0 && page === 1) {
    const moviesWithLogos = await Promise.all(
      results.slice(0, 8).map(async (item) => {
        const type = item.media_type === "tv" ? "tv" : "movie";
        const logo_path = await fetchMovieLogo(item.id, type);
        return { ...item, logo_path };
      }),
    );

    return {
      ...trending,
      results: [...moviesWithLogos, ...results.slice(8)],
    };
  }

  return trending;
};

/**
 * Service to fetch trending media by type and time window
 */
export const getTrendingMedia = async (
  type: "movie" | "tv" | "all",
  timeWindow: "day" | "week" = "day",
  page: number = 1,
): Promise<TMDBResponse<TMDBMovie>> => {
  return ApiService<TMDBResponse<TMDBMovie>>({
    method: "GET",
    url: `/trending/${type}/${timeWindow}`,
    params: { page },
  });
};

/**
 * Service to fetch popular movies
 */
export const getPopularMovies = async (
  page: number = 1,
): Promise<TMDBResponse<TMDBMovie>> => {
  return ApiService<TMDBResponse<TMDBMovie>>({
    method: "GET",
    url: "/movie/popular",
    params: { page },
  });
};

/**
 * Service to fetch movie/TV show videos (trailers)
 */
export const getMovieVideos = async (
  id: number,
  type: MediaType,
): Promise<
  TMDBResponse<{
    id: string;
    key: string;
    name: string;
    type: string;
    site: string;
  }>
> => {
  return ApiService<
    TMDBResponse<{
      id: string;
      key: string;
      name: string;
      type: string;
      site: string;
    }>
  >({
    method: "GET",
    url: `/${type}/${id}/videos`,
  });
};

/**
 * Service to fetch a list of movies or TV shows
 */
export const getMediaList = async (
  type: MediaType,
  category: string = "popular",
  page: number = 1,
): Promise<TMDBResponse<TMDBMovie>> => {
  return ApiService<TMDBResponse<TMDBMovie>>({
    method: "GET",
    url: `/${type}/${category}`,
    params: { page },
  });
};

/**
 * Service to fetch media details
 */
export const getMediaDetails = async (
  id: string | number,
  type: MediaType,
): Promise<TMDBMovie> => {
  return ApiService<TMDBMovie>({
    method: "GET",
    url: `/${type}/${id}`,
    params: {
      append_to_response: "external_ids",
    },
  });
};

/**
 * Service to fetch media credits (casting)
 */
export const getMediaCredits = async (
  id: string | number,
  type: MediaType,
): Promise<TMDBCreditsResponse> => {
  return ApiService<TMDBCreditsResponse>({
    method: "GET",
    url: `/${type}/${id}/credits`,
  });
};

/**
 * Service to fetch season details (episodes)
 */
export const getSeasonDetails = async (
  tvId: string | number,
  seasonNumber: number,
): Promise<TMDBSeasonDetails> => {
  return ApiService<TMDBSeasonDetails>({
    method: "GET",
    url: `/tv/${tvId}/season/${seasonNumber}`,
  });
};

/**
 * Service to search for movies, TV shows, and people
 */
export const searchMedia = async (
  query: string,
  page: number = 1,
): Promise<TMDBResponse<TMDBMovie>> => {
  return ApiService<TMDBResponse<TMDBMovie>>({
    method: "GET",
    url: "/search/multi",
    params: { query, page, include_adult: false },
  });
};

/**
 * Service to discover media with advanced filters
 */
export const discoverMedia = async (
  type: MediaType,
  params: {
    page?: number;
    with_genres?: string;
    primary_release_year?: string;
    first_air_date_year?: string;
    "vote_average.gte"?: number;
    sort_by?: string;
    include_adult?: boolean;
    with_watch_providers?: string;
    watch_region?: string;
    with_watch_monetization_types?: string;
    with_original_language?: string;
    with_origin_country?: string;
    [key: string]: unknown;
  },
): Promise<TMDBResponse<TMDBMovie>> => {
  return ApiService<TMDBResponse<TMDBMovie>>({
    method: "GET",
    url: `/discover/${type}`,
    params: { ...params, include_adult: false },
  });
};
/**
 * Service to fetch similar media (recommendations)
 */
export const getSimilarMedia = async (
  id: string | number,
  type: MediaType,
  page: number = 1,
): Promise<TMDBResponse<TMDBMovie>> => {
  return ApiService<TMDBResponse<TMDBMovie>>({
    method: "GET",
    url: `/${type}/${id}/recommendations`,
    params: { page },
  });
};

/**
 * Service to fetch person details
 */
export const getPersonDetails = async (
  id: string | number,
): Promise<TMDBPerson> => {
  return ApiService<TMDBPerson>({
    method: "GET",
    url: `/person/${id}`,
  });
};

/**
 * Service to fetch person combined credits (movies and TV shows)
 */
export const getPersonCredits = async (
  id: string | number,
): Promise<TMDBPersonCredits> => {
  return ApiService<TMDBPersonCredits>({
    method: "GET",
    url: `/person/${id}/combined_credits`,
  });
};
