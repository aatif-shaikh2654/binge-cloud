import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";
import { TMDBMovie } from "@/app/types/tmdb";

interface WatchlistState {
  watchlist: TMDBMovie[];
  addToWatchlist: (movie: TMDBMovie) => void;
  removeFromWatchlist: (id: number, media_type?: "movie" | "tv") => void;
  toggleWatchlist: (movie: TMDBMovie) => void;
  isInWatchlist: (id: number, media_type?: "movie" | "tv") => boolean;
}

// Custom storage for IndexedDB using idb-keyval
const idbStorage = {
  getItem: async (name: string): Promise<string | null> => {
    const value = await get(name);
    return value ? JSON.stringify(value) : null;
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await set(name, JSON.parse(value));
  },
  removeItem: async (name: string): Promise<void> => {
    await del(name);
  },
};

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set, get) => ({
      watchlist: [],
      addToWatchlist: (movie) =>
        set((state) => ({
          watchlist: [movie, ...state.watchlist],
        })),
      removeFromWatchlist: (id, media_type) =>
        set((state) => ({
          watchlist: state.watchlist.filter(
            (m) => !(m.id === id && (m.media_type || media_type) === (media_type || m.media_type))
          ),
        })),
      toggleWatchlist: (movie) => {
        const { watchlist, addToWatchlist, removeFromWatchlist } = get();
        const isIn = watchlist.some(
          (m) =>
            m.id === movie.id &&
            (m.media_type || movie.media_type) === (movie.media_type || m.media_type)
        );
        if (isIn) {
          removeFromWatchlist(movie.id, movie.media_type);
        } else {
          addToWatchlist(movie);
        }
      },
      isInWatchlist: (id, media_type) => {
        return get().watchlist.some(
          (m) =>
            m.id === id &&
            (m.media_type || media_type) === (media_type || m.media_type)
        );
      },
    }),
    {
      name: "binge-watchlist",
      storage: createJSONStorage(() => idbStorage),
    }
  )
);
