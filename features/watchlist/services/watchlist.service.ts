import { ApiService } from "@/shared/lib/api-service";
import { WatchlistItem } from "@/features/watchlist/store/useWatchlistStore";

export const getWatchlist = async () => {
  return await ApiService<WatchlistItem[]>({
    method: "GET",
    url: "/api/watchlist",
  });
};

export const syncWatchlist = async (items: WatchlistItem[]) => {
  return await ApiService<WatchlistItem[]>({
    method: "POST",
    url: "/api/watchlist/sync",
    payload: items,
  });
};

export const addToWatchlist = async (item: WatchlistItem) => {
  return await ApiService<WatchlistItem>({
    method: "POST",
    url: "/api/watchlist",
    payload: item,
  });
};

export const removeFromWatchlist = async (id: number, media_type: string) => {
  return await ApiService<{ success: boolean }>({
    method: "DELETE",
    url: "/api/watchlist",
    params: { id, media_type },
  });
};
