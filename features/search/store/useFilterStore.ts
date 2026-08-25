import { create } from "zustand";

interface FilterState {
  // TMDB (Movie & TV Shows)
  selectedGenres: string[];
  selectedYear: string;
  selectedPlatform: string;
  selectedSort: string;

  // Anime
  animeSelectedGenres: string[];
  animeSelectedYear: string;
  animeSelectedFormat: string;
  animeSelectedSort: string;

  // Setters
  setSelectedGenres: (genres: string[]) => void;
  setSelectedYear: (year: string) => void;
  setSelectedPlatform: (platform: string) => void;
  setSelectedSort: (sort: string) => void;

  setAnimeSelectedGenres: (genres: string[]) => void;
  setAnimeSelectedYear: (year: string) => void;
  setAnimeSelectedFormat: (format: string) => void;
  setAnimeSelectedSort: (sort: string) => void;

  // Resets
  resetTmdbFilters: () => void;
  resetAnimeFilters: () => void;
  resetAllFilters: () => void;
}

const initialTmdb = {
  selectedGenres: [],
  selectedYear: "all",
  selectedPlatform: "all",
  selectedSort: "popularity.desc",
};

const initialAnime = {
  animeSelectedGenres: [],
  animeSelectedYear: "all",
  animeSelectedFormat: "all",
  animeSelectedSort: "POPULARITY_DESC",
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initialTmdb,
  ...initialAnime,

  setSelectedGenres: (selectedGenres) => set({ selectedGenres }),
  setSelectedYear: (selectedYear) => set({ selectedYear }),
  setSelectedPlatform: (selectedPlatform) => set({ selectedPlatform }),
  setSelectedSort: (selectedSort) => set({ selectedSort }),

  setAnimeSelectedGenres: (animeSelectedGenres) => set({ animeSelectedGenres }),
  setAnimeSelectedYear: (animeSelectedYear) => set({ animeSelectedYear }),
  setAnimeSelectedFormat: (animeSelectedFormat) => set({ animeSelectedFormat }),
  setAnimeSelectedSort: (animeSelectedSort) => set({ animeSelectedSort }),

  resetTmdbFilters: () => set({ ...initialTmdb }),
  resetAnimeFilters: () => set({ ...initialAnime }),
  resetAllFilters: () => set({ ...initialTmdb, ...initialAnime }),
}));
export default useFilterStore;
