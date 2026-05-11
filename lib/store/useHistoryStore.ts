import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";

export interface HistoryItem {
  id: number;
  media_type: "movie" | "tv";
  title: string;
  poster_path: string;
  backdrop_path: string;
  server: string;
  season?: number;
  episode?: number;
  watchedAt: number;
}

interface HistoryState {
  history: HistoryItem[];
  addToHistory: (item: HistoryItem) => void;
  removeFromHistory: (id: number) => void;
  clearHistory: () => void;
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

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      history: [],
      addToHistory: (item) =>
        set((state) => {
          // Remove existing item if it exists (check both id and media_type)
          const filteredHistory = state.history.filter(
            (h) => !(h.id === item.id && h.media_type === item.media_type)
          );
          // Add new item and sort by watchedAt descending
          const newHistory = [item, ...filteredHistory].sort(
            (a, b) => b.watchedAt - a.watchedAt
          );
          return {
            history: newHistory.slice(0, 20), // Keep last 20 items
          };
        }),
      removeFromHistory: (id) =>
        set((state) => ({
          history: state.history.filter((h) => h.id !== id),
        })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "binge-watch-history",
      storage: createJSONStorage(() => idbStorage),
    }
  )
);
