export interface AniListTitle {
  romaji: string | null;
  english: string | null;
  native: string | null;
  userPreferred?: string | null;
}

export interface AniListCoverImage {
  large: string | null;
  extraLarge: string | null;
  color: string | null;
}

export interface AniListStudio {
  name: string;
  siteUrl?: string | null;
}

export interface AniListStudios {
  nodes: AniListStudio[];
}

export type AniListStatus =
  | "FINISHED"
  | "RELEASING"
  | "NOT_YET_RELEASED"
  | "CANCELLED"
  | "HIATUS";

export type AniListFormat =
  | "TV"
  | "TV_SHORT"
  | "MOVIE"
  | "SPECIAL"
  | "OVA"
  | "ONA"
  | "MUSIC";

export type AniListSeason = "WINTER" | "SPRING" | "SUMMER" | "FALL";

export type AniListSort =
  | "TRENDING_DESC"
  | "POPULARITY_DESC"
  | "SCORE_DESC"
  | "START_DATE_DESC"
  | "FAVOURITES_DESC";

export interface AniListMedia {
  id: number;
  title: AniListTitle;
  coverImage: AniListCoverImage;
  bannerImage: string | null;
  episodes: number | null;
  averageScore: number | null;
  popularity: number | null;
  trending: number | null;
  genres: string[];
  status: AniListStatus | null;
  description: string | null;
  season: AniListSeason | null;
  seasonYear: number | null;
  format: AniListFormat | null;
  studios: AniListStudios | null;
}

// ─── Detail types ─────────────────────────────────────────────────────────────

export interface AniListFuzzyDate {
  year: number | null;
  month: number | null;
  day: number | null;
}

export interface AniListTag {
  name: string;
  rank: number;
  isMediaSpoiler: boolean;
}

export interface AniListTrailer {
  id: string;
  site: string;
}

export interface AniListCharacterName {
  first: string | null;
  last: string | null;
  full: string | null;
  native: string | null;
}

export interface AniListCharacterImage {
  large: string | null;
}

export interface AniListCharacterNode {
  id: number;
  name: AniListCharacterName;
  image: AniListCharacterImage;
}

export interface AniListVoiceActor {
  id: number;
  name: AniListCharacterName;
  image: AniListCharacterImage;
  language: string | null;
}

export interface AniListCharacterEdge {
  role: "MAIN" | "SUPPORTING" | "BACKGROUND";
  node: AniListCharacterNode;
  voiceActors: AniListVoiceActor[];
}

export interface AniListCharacters {
  edges: AniListCharacterEdge[];
}

export interface AniListRelationNode {
  id: number;
  title: AniListTitle;
  coverImage: AniListCoverImage;
  format: AniListFormat | null;
  status: AniListStatus | null;
  type: "ANIME" | "MANGA";
}

export interface AniListRelationEdge {
  relationType: string;
  node: AniListRelationNode;
}

export interface AniListRelations {
  edges: AniListRelationEdge[];
}

export interface AniListStreamingEpisode {
  title: string | null;
  thumbnail: string | null;
  url: string | null;
  site: string | null;
}

export interface AniListNextAiringEpisode {
  episode: number;
  airingAt: number;
}

export interface AniListMediaDetail extends AniListMedia {
  duration: number | null;
  source: string | null;
  countryOfOrigin: string | null;
  synonyms: string[];
  startDate: AniListFuzzyDate | null;
  endDate: AniListFuzzyDate | null;
  tags: AniListTag[];
  trailer: AniListTrailer | null;
  characters: AniListCharacters | null;
  relations: AniListRelations | null;
  streamingEpisodes: AniListStreamingEpisode[];
  nextAiringEpisode: AniListNextAiringEpisode | null;
}

// ─── Response wrappers ────────────────────────────────────────────────────────

export interface AniListPageInfo {
  hasNextPage: boolean;
  currentPage: number;
  total: number;
}

export interface AniListPageResponse {
  pageInfo: AniListPageInfo;
  media: AniListMedia[];
}

export interface AniListGraphQLError {
  message: string;
  status: number;
}

export interface AniListResponse {
  data: {
    Page: AniListPageResponse;
  };
  errors?: AniListGraphQLError[];
}

export interface AniListDetailResponse {
  data: {
    Media: AniListMediaDetail;
  };
  errors?: AniListGraphQLError[];
}
