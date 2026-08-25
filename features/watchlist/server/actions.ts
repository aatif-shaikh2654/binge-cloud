"use server";

import { withAuthAndDB } from "@/shared/lib/action-wrapper";
import { Watchlist } from "./Watchlist";

export const getWatchlist = withAuthAndDB(async (userId) => {
  return await Watchlist.find({ userId }).sort({ createdAt: -1 });
});
