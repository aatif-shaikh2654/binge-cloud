import { AsyncWrapper, ErrorHandler } from "@/app/lib/api-handler";
import { getUserFromCookies } from "@/app/lib/auth";
import { History } from "@/models/History";
import { HistoryItem } from "@/app/store/useHistoryStore";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const POST = AsyncWrapper(async (req) => {
  const decodedToken = await getUserFromCookies();
  const userId = decodedToken?.id;
  if (!userId) throw new ErrorHandler(401, "Unauthorized");

  const body = await req.json();
  const items = Array.isArray(body) ? body : [];

  if (items.length > 0) {
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const bulkOps = items.map((item: HistoryItem) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
      const { _id, createdAt, updatedAt, __v, ...cleanItem } = item as any;
      return {
        updateOne: {
          filter: { userId: userObjectId, id: item.id, media_type: item.media_type },
          update: { $set: { ...cleanItem, userId: userObjectId } },
          upsert: true,
        },
      };
    });
    await History.bulkWrite(bulkOps);
  }

  const history = await History.find({ userId }).sort({ watchedAt: -1 });
  return NextResponse.json(history);
});
