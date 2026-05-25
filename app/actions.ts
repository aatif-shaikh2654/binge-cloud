"use server";

import { withAuthAndDB } from "@/app/lib/action-wrapper";
import { History } from "@/models/History";
import { Watchlist } from "@/models/Watchlist";

export const getWatchlist = withAuthAndDB(async (userId) => {
  return await Watchlist.find({ userId }).sort({ createdAt: -1 });
});

export const getHistory = withAuthAndDB(async (userId) => {
  return await History.find({ userId }).sort({ watchedAt: -1 });
});
