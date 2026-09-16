"use server";

import { withAuthAndDB } from "@/shared/lib/action-wrapper";
import { History } from "./History";

export const getHistory = withAuthAndDB(async (userId) => {
  return await History.find({ userId }).sort({ watchedAt: -1 });
});
