import { ANILIST_ENDPOINT } from "@/features/anime/constants/anilist";
import { AsyncWrapper, ErrorHandler } from "@/shared/lib/api-handler";
import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy for AniList GraphQL API.
 * Forwards POST requests with { query, variables } to AniList,
 * keeping the client_secret server-side only.
 */
export const POST = AsyncWrapper(async (request: NextRequest) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new ErrorHandler(400, "Invalid JSON body");
  }

  const response = await fetch(ANILIST_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(process.env.ANILIST_CLIENT_SECRET
        ? {
            Authorization: `Bearer ${process.env.ANILIST_CLIENT_SECRET}`,
          }
        : {}),
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
});
