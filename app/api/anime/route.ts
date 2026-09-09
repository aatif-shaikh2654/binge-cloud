import {
  ANILIST_ENDPOINT,
  APOLLO_STUDIO_ORIGIN,
} from "@/features/anime/constants/anilist";
import { AsyncWrapper, ErrorHandler } from "@/shared/lib/api-handler";
import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy for AniList GraphQL API.
 * Forwards POST requests with { query, variables } to AniList,
 * keeping server headers and tokens protected server-side.
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
      Origin: APOLLO_STUDIO_ORIGIN,
      Referer: `${APOLLO_STUDIO_ORIGIN}/`,
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
});
