import {
  ANILIST_ENDPOINT,
  ANIME_DETAIL_QUERY,
  ANIME_PAGE_QUERY,
} from "@/app/constants/anilist";
import {
  type AniListDetailResponse,
  type AniListMediaDetail,
  type AniListPageResponse,
  type AniListResponse,
  type AniListSort,
} from "@/app/types/anilist";

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
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`AniList request failed with status ${response.status}`);
  }

  const data = await response.json();

  if (data.errors?.length) {
    throw new Error(data.errors[0].message);
  }

  return data as T;
};

const getAnimeBySort = async (
  sort: AniListSort[],
  page: number = 1,
  perPage: number = 20,
): Promise<AniListPageResponse> => {
  const data = await fetchAniList<AniListResponse>(ANIME_PAGE_QUERY, {
    page,
    perPage,
    sort,
  });
  return data.data.Page;
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
