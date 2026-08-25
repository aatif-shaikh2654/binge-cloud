"use server";

import { withAuthAndDB } from "@/shared/lib/action-wrapper";
import { History } from "@/features/history/server/History";
import { Watchlist } from "@/features/watchlist/server/Watchlist";

export const getWatchlist = withAuthAndDB(async (userId) => {
  return await Watchlist.find({ userId }).sort({ createdAt: -1 });
});

export const getHistory = withAuthAndDB(async (userId) => {
  return await History.find({ userId }).sort({ watchedAt: -1 });
});
