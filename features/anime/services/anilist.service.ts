import {
  ANILIST_ENDPOINT,
  ANIME_DETAIL_QUERY,
  ANIME_GENRE_QUERY,
  ANIME_PAGE_QUERY,
  APOLLO_STUDIO_ORIGIN,
} from "@/features/anime/constants/anilist";
import {
  type AniListDetailResponse,
  type AniListMediaDetail,
  type AniListPageResponse,
  type AniListResponse,
  type AniListSort,
} from "@/features/anime/types/anilist";
import { cache } from "react";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

// In-memory cache for server-side responses
const serverCache = new Map<string, CacheEntry<unknown>>();

interface FetchOptions {
  revalidate?: number; // TTL in seconds (0 means no cache)
  cache?: RequestCache;
}

const getCacheKey = (query: string, variables: Record<string, unknown>): string => {
  return `${query.trim()}::${JSON.stringify(variables)}`;
};

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchAniList = async <T extends AniListResponse | AniListDetailResponse>(
  query: string,
  variables: Record<string, unknown>,
  options: FetchOptions = { revalidate: 3600 },
): Promise<T> => {
  const isServer = typeof window === "undefined";
  const url = isServer ? ANILIST_ENDPOINT : "/api/anime";
  const revalidate = options.revalidate ?? 3600;
  const isNoCache = revalidate === 0 || options.cache === "no-store";
  const cacheKey = getCacheKey(query, variables);

  // 1. Check in-memory cache for server requests if caching is enabled
  if (isServer && !isNoCache) {
    const cached = serverCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < cached.ttl) {
      return cached.data as T;
    }
  }

  // 2. Fetch from endpoint with retry on rate limit (429)
  const executeFetch = async (retryCount = 0): Promise<Response> => {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(isServer
          ? {
              Origin: APOLLO_STUDIO_ORIGIN,
              Referer: `${APOLLO_STUDIO_ORIGIN}/`,
              "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            }
          : {}),
      },
      body: JSON.stringify({ query, variables }),
      ...(isServer
        ? isNoCache
          ? { cache: "no-store" }
          : { next: { revalidate } }
        : {}),
    });

    if (res.status === 429 && retryCount < 1) {
      // Short backoff if rate limited
      await wait(1500);
      return executeFetch(retryCount + 1);
    }

    return res;
  };

  let response: Response;
  try {
    response = await executeFetch();
  } catch (error) {
    // If network error occurred and we have stale cached data on the server, serve it
    if (isServer && !isNoCache) {
      const cached = serverCache.get(cacheKey);
      if (cached) {
        console.warn("AniList network error, serving stale cache for:", query.slice(0, 40));
        return cached.data as T;
      }
    }
    throw error;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // If 429 rate limit hit and stale data exists, serve stale data as fallback
    if (response.status === 429 && isServer && !isNoCache) {
      const cached = serverCache.get(cacheKey);
      if (cached) {
        console.warn("AniList 429 rate limit hit, serving stale cache for:", query.slice(0, 40));
        return cached.data as T;
      }
    }

    const message =
      data?.errors?.[0]?.message ||
      `AniList request failed with status ${response.status}`;
    throw new Error(message);
  }

  if (data?.errors?.length) {
    throw new Error(data.errors[0].message);
  }

  // 3. Store in cache if enabled
  if (isServer && !isNoCache && data) {
    serverCache.set(cacheKey, {
      data,
      timestamp: Date.now(),
      ttl: revalidate * 1000,
    });
  }

  return data as T;
};

const getAnimeBySort = async (
  sort: AniListSort[],
  page: number = 1,
  perPage: number = 20,
  format?: string,
  status_in?: string[],
  genre_in?: string[],
  seasonYear?: number,
): Promise<AniListPageResponse> => {
  const data = await fetchAniList<AniListResponse>(
    ANIME_PAGE_QUERY,
    {
      page,
      perPage,
      sort,
      format,
      status_in,
      genre_in,
      seasonYear,
    },
    { revalidate: 3600 },
  );
  return data.data.Page;
};

export const getFilteredAnime = async (options: {
  sort: AniListSort[];
  page?: number;
  perPage?: number;
  format?: string;
  status_in?: string[];
  genre_in?: string[];
  seasonYear?: number;
}): Promise<AniListPageResponse> => {
  return getAnimeBySort(
    options.sort,
    options.page,
    options.perPage,
    options.format,
    options.status_in,
    options.genre_in,
    options.seasonYear,
  );
};

export const getTrendingAnime = (
  page: number = 1,
  perPage: number = 20,
): Promise<AniListPageResponse> =>
  getAnimeBySort(["TRENDING_DESC"], page, perPage);

export const getPopularAnime = (
  page: number = 1,
  perPage: number = 20,
): Promise<AniListPageResponse> =>
  getAnimeBySort(["POPULARITY_DESC"], page, perPage);

export const getAnimeMovies = (
  page: number = 1,
  perPage: number = 20,
): Promise<AniListPageResponse> =>
  getAnimeBySort(["POPULARITY_DESC"], page, perPage, "MOVIE");

export const getTopRatedAnime = (
  page: number = 1,
  perPage: number = 20,
): Promise<AniListPageResponse> =>
  getAnimeBySort(["SCORE_DESC"], page, perPage);

/**
 * Fetch Anime Details.
 * Cached for 1 hour across requests, memoized per render pass with React cache.
 */
export const getAnimeDetails = cache(
  async (id: number | string): Promise<AniListMediaDetail> => {
    const data = await fetchAniList<AniListDetailResponse>(
      ANIME_DETAIL_QUERY,
      {
        id: Number(id),
      },
      { revalidate: 3600 },
    );
    return data.data.Media;
  },
);

export const searchAnime = async (
  query: string,
  page: number = 1,
  perPage: number = 20,
): Promise<AniListPageResponse> => {
  const data = await fetchAniList<AniListResponse>(
    ANIME_PAGE_QUERY,
    {
      search: query,
      page,
      perPage,
      sort: ["SEARCH_MATCH", "TRENDING_DESC"],
    },
    { revalidate: 600 },
  );
  return data.data.Page;
};

export const getAnimeByGenre = async (
  genres: string[],
  excludeId?: number,
  page: number = 1,
  perPage: number = 20,
): Promise<AniListPageResponse> => {
  const data = await fetchAniList<AniListResponse>(
    ANIME_GENRE_QUERY,
    {
      page,
      perPage,
      genre_in: genres,
      id_not: excludeId,
      sort: ["POPULARITY_DESC"],
    },
    { revalidate: 3600 },
  );
  return data.data.Page;
};
