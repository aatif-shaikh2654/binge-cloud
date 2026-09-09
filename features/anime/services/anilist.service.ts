import {
  ANILIST_ENDPOINT,
  APOLLO_STUDIO_ORIGIN,
  ANIME_DETAIL_QUERY,
  ANIME_GENRE_QUERY,
  ANIME_PAGE_QUERY,
} from "@/features/anime/constants/anilist";
import {
  type AniListDetailResponse,
  type AniListMediaDetail,
  type AniListPageResponse,
  type AniListResponse,
  type AniListSort,
} from "@/features/anime/types/anilist";

const fetchAniList = async <T extends AniListResponse | AniListDetailResponse>(
  query: string,
  variables: Record<string, unknown>,
): Promise<T> => {
  const isServer = typeof window === "undefined";
  const url = isServer ? ANILIST_ENDPOINT : "/api/anime";

  const response = await fetch(url, {
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
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.errors?.[0]?.message ||
      `AniList request failed with status ${response.status}`;
    throw new Error(message);
  }

  if (data?.errors?.length) {
    throw new Error(data.errors[0].message);
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
  const data = await fetchAniList<AniListResponse>(ANIME_PAGE_QUERY, {
    page,
    perPage,
    sort,
    format,
    status_in,
    genre_in,
    seasonYear,
  });
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

export const getAnimeDetails = async (
  id: number | string,
): Promise<AniListMediaDetail> => {
  const data = await fetchAniList<AniListDetailResponse>(ANIME_DETAIL_QUERY, {
    id: Number(id),
  });
  return data.data.Media;
};

export const searchAnime = async (
  query: string,
  page: number = 1,
  perPage: number = 20,
): Promise<AniListPageResponse> => {
  const data = await fetchAniList<AniListResponse>(ANIME_PAGE_QUERY, {
    search: query,
    page,
    perPage,
    sort: ["SEARCH_MATCH", "TRENDING_DESC"],
  });
  return data.data.Page;
};

export const getAnimeByGenre = async (
  genres: string[],
  excludeId?: number,
  page: number = 1,
  perPage: number = 20,
): Promise<AniListPageResponse> => {
  const data = await fetchAniList<AniListResponse>(ANIME_GENRE_QUERY, {
    page,
    perPage,
    genre_in: genres,
    id_not: excludeId,
    sort: ["POPULARITY_DESC"],
  });
  return data.data.Page;
};
