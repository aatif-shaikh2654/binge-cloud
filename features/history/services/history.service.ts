import { ApiService } from "./api.service";
import { HistoryItem } from "@/app/store/useHistoryStore";

export const getHistory = async () => {
  return await ApiService<HistoryItem[]>({
    method: "GET",
    url: "/api/history",
  });
};

export const syncHistory = async (items: HistoryItem[]) => {
  return await ApiService<HistoryItem[]>({
    method: "POST",
    url: "/api/history/sync",
    payload: items,
  });
};

export const addToHistory = async (item: HistoryItem) => {
  return await ApiService<HistoryItem>({
    method: "POST",
    url: "/api/history",
    payload: item,
  });
};

export const removeFromHistory = async (id: number, media_type: string) => {
  return await ApiService<{ success: boolean }>({
    method: "DELETE",
    url: "/api/history",
    params: { id, media_type },
  });
};
