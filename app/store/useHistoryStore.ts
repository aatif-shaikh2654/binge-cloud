import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";
import { addToHistory as apiAddToHistory, removeFromHistory as apiRemoveFromHistory } from "@/app/services/history.service";

export interface HistoryItem {
  id: number;
  media_type: "movie" | "tv" | "anime";
  title: string;
  poster_path: string;
  backdrop_path: string;
  server: string;
  season?: number;
  episode?: number;
  watchedAt: number;
  currentTime?: number;
  duration?: number;
}

interface HistoryState {
  history: HistoryItem[];
  setHistory: (items: HistoryItem[]) => void;
  addToHistory: (item: HistoryItem) => void;
  removeFromHistory: (id: number, media_type: string) => void;
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
      setHistory: (items) => set({ history: items }),
      addToHistory: (item) => {
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
            history: newHistory,
          };
        });
        apiAddToHistory(item).catch(() => { /* ignore guest */ });
      },
      removeFromHistory: (id, media_type) => {
        set((state) => ({
          history: state.history.filter((h) => !(h.id === id && h.media_type === media_type)),
        }));
        apiRemoveFromHistory(id, media_type).catch(() => { /* ignore guest */ });
      },
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "binge-watch-history",
      storage: createJSONStorage(() => idbStorage),
    }
  )
);
