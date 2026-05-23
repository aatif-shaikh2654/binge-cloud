import { AsyncWrapper, ErrorHandler } from "@/app/lib/api-handler";
import { getUserFromCookies } from "@/app/lib/auth";
import { History } from "@/models/History";
import { NextResponse } from "next/server";

export const GET = AsyncWrapper(async () => {
  const decodedToken = await getUserFromCookies();
  const userId = decodedToken?.id;
  if (!userId) throw new ErrorHandler(401, "Unauthorized");

  const history = await History.find({ userId })
    .sort({ watchedAt: -1 });
  return NextResponse.json(history);
});

export const POST = AsyncWrapper(async (req) => {
  const decodedToken = await getUserFromCookies();
  const userId = decodedToken?.id;
  if (!userId) throw new ErrorHandler(401, "Unauthorized");

  const body = await req.json();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id, createdAt, updatedAt, __v, ...cleanBody } = body;
  const updated = await History.findOneAndUpdate(
    { userId, id: body.id, media_type: body.media_type },
    { ...cleanBody, userId },
    { upsert: true, new: true },
  );

  return NextResponse.json(updated);
});

export const DELETE = AsyncWrapper(async (req) => {
  const decodedToken = await getUserFromCookies();
  const userId = decodedToken?.id;
  if (!userId) throw new ErrorHandler(401, "Unauthorized");

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const media_type = searchParams.get("media_type");

  if (!id || !media_type) {
    throw new ErrorHandler(400, "Missing id or media_type");
  }

  await History.findOneAndDelete({
    userId,
    id: Number(id),
    media_type: media_type as "movie" | "tv" | "anime",
  });
  return NextResponse.json({ success: true });
});
