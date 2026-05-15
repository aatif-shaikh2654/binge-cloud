import { TMDB_BASE_URL } from "@/app/constants/tmdb";
import { AsyncWrapper, ErrorHandler } from "@/app/lib/api-handler";
import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy API for TMDB
 * Expects 'endpoint' as a query parameter (e.g., endpoint=3/movie/popular)
 * All other query parameters are forwarded to TMDB
 */
export const GET = AsyncWrapper(async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get("endpoint");

  if (!endpoint) {
    throw new ErrorHandler(
      400,
      'The "endpoint" parameter is required (e.g., ?endpoint=3/movie/popular)',
    );
  }

  // Ensure endpoint starts with a slash if not already present
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = new URL(`${TMDB_BASE_URL}${cleanEndpoint}`);

  // Forward all other search parameters
  searchParams.forEach((value, key) => {
    if (key !== "endpoint") {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
      accept: "application/json",
      "User-Agent": "BingeCloud/1.0",
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ErrorHandler(
      response.status,
      `TMDB API responded with status ${response.status}`,
      errorData,
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
});
