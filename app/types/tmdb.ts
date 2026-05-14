/**
 * Type definitions for TMDB API entities
 */

import { type MediaType } from "./common";

export interface TMDBMovie {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  logo_path?: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  overview?: string;
  media_type?: MediaType;
  genre_ids?: number[];
  genres?: TMDBGenre[];
  runtime?: number;
  episode_run_time?: number[];
  status?: string;
  tagline?: string;
  popularity?: number;
  seasons?: TMDBSeason[];
  number_of_seasons?: number;
  number_of_episodes?: number;
}

export interface TMDBSeason {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episode_count: number;
  air_date: string;
}

export interface TMDBEpisode {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  episode_number: number;
  season_number: number;
  air_date: string;
  vote_average: number;
  runtime: number | null;
}

export interface TMDBSeasonDetails {
  _id: string;
  air_date: string;
  episodes: TMDBEpisode[];
  name: string;
  overview: string;
  id: number;
  poster_path: string | null;
  season_number: number;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBCast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TMDBCreditsResponse {
  id: number;
  cast: TMDBCast[];
}

export interface TMDBResponse<T> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}

export interface TMDBImageResponse {
  id: number;
  logos?: TMDBLogo[];
  backdrops?: TMDBLogo[];
  posters?: TMDBLogo[];
}

export interface TMDBLogo {
  aspect_ratio: number;
  file_path: string;
  height: number;
  id?: string;
  iso_639_1?: string;
  vote_average: number;
  vote_count: number;
  width: number;
}
