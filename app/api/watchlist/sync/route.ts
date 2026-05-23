import { AsyncWrapper, ErrorHandler } from "@/app/lib/api-handler";
import { getUserFromCookies } from "@/app/lib/auth";
import { WatchlistItem } from "@/app/store/useWatchlistStore";
import { Watchlist } from "@/models/Watchlist";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const POST = AsyncWrapper(async (req) => {
  const decodedToken = await getUserFromCookies();
  const userId = decodedToken?.id;
  if (!userId) throw new ErrorHandler(401, "Unauthorized");

  const body = await req.json();
  const items = Array.isArray(body) ? body : [];

  if (items.length > 0) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const bulkOps = items.map((item: WatchlistItem) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
      const { _id, createdAt, updatedAt, __v, ...cleanItem } = item as any;
      return {
        updateOne: {
          filter: {
            userId: userObjectId,
            id: item.id,
            media_type: item.media_type,
          },
          update: { $setOnInsert: { ...cleanItem, userId: userObjectId } }, // Do not override existing properties if already saved
          upsert: true,
        },
      };
    });
    await Watchlist.bulkWrite(bulkOps);
  }

  const watchlist = await Watchlist.find({ userId }).sort({ createdAt: -1 });
  return NextResponse.json(watchlist);
});
