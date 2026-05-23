import { MediaType, UnifiedMediaItem } from "@/app/types/common";
import { del, get, set } from "idb-keyval";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { addToWatchlist as apiAddToWatchlist, removeFromWatchlist as apiRemoveFromWatchlist } from "@/app/services/watchlist.service";


export type WatchlistItem = UnifiedMediaItem;

interface WatchlistState {
  watchlist: WatchlistItem[];
  setWatchlist: (items: WatchlistItem[]) => void;
  addToWatchlist: (item: WatchlistItem) => void;
  removeFromWatchlist: (id: number, media_type: MediaType) => void;
  toggleWatchlist: (item: WatchlistItem) => void;
  isInWatchlist: (id: number, media_type: MediaType) => boolean;
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
      setWatchlist: (items) => set({ watchlist: items }),
      addToWatchlist: (item) => {
        set((state) => ({
          watchlist: [item, ...state.watchlist],
        }));
        if (typeof document !== "undefined" && document.cookie.includes("token=")) {
          apiAddToWatchlist(item).catch(() => { /* ignore error */ });
        }
      },
      removeFromWatchlist: (id, media_type) => {
        set((state) => ({
          watchlist: state.watchlist.filter(
            (m) => !(m.id === id && m.media_type === media_type),
          ),
        }));
        if (typeof document !== "undefined" && document.cookie.includes("token=")) {
          apiRemoveFromWatchlist(id, media_type).catch(() => { /* ignore error */ });
        }
      },
      toggleWatchlist: (item) => {
        const { watchlist, addToWatchlist, removeFromWatchlist } = get();
        const isIn = watchlist.some(
          (m) => m.id === item.id && m.media_type === item.media_type,
        );
        if (isIn) {
          removeFromWatchlist(item.id, item.media_type);
        } else {
          addToWatchlist(item);
        }
      },
      isInWatchlist: (id, media_type) => {
        return get().watchlist.some(
          (m) => m.id === id && m.media_type === media_type,
        );
      },
    }),
    {
      name: "binge-watchlist",
      storage: createJSONStorage(() => idbStorage),
    },
  ),
);
