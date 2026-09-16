import {
  ANILIST_ENDPOINT,
  APOLLO_STUDIO_ORIGIN,
} from "@/features/anime/constants/anilist";
import { AsyncWrapper, ErrorHandler } from "@/shared/lib/api-handler";
import { NextRequest, NextResponse } from "next/server";

interface CacheEntry {
  data: unknown;
  status: number;
  timestamp: number;
  ttl: number;
}

const routeCache = new Map<string, CacheEntry>();
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Proxy for AniList GraphQL API.
 * Forwards POST requests with { query, variables } to AniList,
 * keeping server headers protected server-side and caching queries.
 */
export const POST = AsyncWrapper(async (request: NextRequest) => {
  let body: { query?: string; variables?: Record<string, unknown> };
  try {
    body = await request.json();
  } catch {
    throw new ErrorHandler(400, "Invalid JSON body");
  }

  const query = body?.query || "";
  const variables = body?.variables || {};
  const cacheKey = `${query.trim()}::${JSON.stringify(variables)}`;

  // Return from cache if available and fresh
  const cached = routeCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return NextResponse.json(cached.data, {
      status: cached.status,
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "X-Cache": "HIT",
      },
    });
  }

  const executeFetch = async (retryCount = 0): Promise<Response> => {
    const res = await fetch(ANILIST_ENDPOINT, {
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
      next: { revalidate: 3600 },
    });

    if (res.status === 429 && retryCount < 1) {
      await wait(1500);
      return executeFetch(retryCount + 1);
    }

    return res;
  };

  let response: Response;
  try {
    response = await executeFetch();
  } catch (err) {
    const cached = routeCache.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached.data, {
        status: cached.status,
        headers: { "X-Cache": "STALE" },
      });
    }
    throw err;
  }

  const data = await response.json().catch(() => null);

  if (response.ok && data) {
    // Cache results for 1 hour (3600s)
    routeCache.set(cacheKey, {
      data,
      status: response.status,
      timestamp: Date.now(),
      ttl: 3600 * 1000,
    });
  } else if (response.status === 429) {
    // If rate limited, fallback to cached data if present
    const cached = routeCache.get(cacheKey);
    if (cached) {
      return NextResponse.json(cached.data, {
        status: cached.status,
        headers: { "X-Cache": "STALE" },
      });
    }
  }

  return NextResponse.json(data, {
    status: response.status,
    headers: {
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      "X-Cache": "MISS",
    },
  });
});

