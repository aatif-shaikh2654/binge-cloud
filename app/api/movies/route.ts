import { TMDB_BASE_URL } from "@/features/media/constants/tmdb";
import { AsyncWrapper, ErrorHandler } from "@/shared/lib/api-handler";
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
    throw new ErrorHandler(400, "The endpoint parameter is required");
  }

  // Ensure endpoint starts with a slash if not already present
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const baseUrl = process.env.TMDB_BASE_URL || TMDB_BASE_URL;
  const url = new URL(`${baseUrl}${cleanEndpoint}`);

  // Forward all other search parameters
  searchParams.forEach((value, key) => {
    if (key !== "endpoint") {
      url.searchParams.set(key, value);
    }
  });

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
        accept: "application/json",
        "User-Agent": "BingeCloud/1.0",
      },
    });
  } catch (networkError) {
    // Retry with fallback domain if original failed due to ECONNRESET / network block
    let fallbackUrlStr: string | null = null;
    const currentUrlStr = url.toString();
    if (currentUrlStr.includes("api.themoviedb.org")) {
      fallbackUrlStr = currentUrlStr.replace("api.themoviedb.org", "api.tmdb.org");
    } else if (currentUrlStr.includes("api.tmdb.org")) {
      fallbackUrlStr = currentUrlStr.replace("api.tmdb.org", "api.themoviedb.org");
    }

    if (fallbackUrlStr) {
      try {
        response = await fetch(fallbackUrlStr, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${process.env.AUTH_TOKEN}`,
            accept: "application/json",
            "User-Agent": "BingeCloud/1.0",
          },
        });
      } catch {
        throw new ErrorHandler(500, "Failed to connect to TMDB API", networkError);
      }
    } else {
      throw new ErrorHandler(500, "Failed to connect to TMDB API", networkError);
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ErrorHandler(
      response.status,
      `API responded with status ${response.status}`,
      errorData,
    );
  }

  const data = await response.json();
  return NextResponse.json(data);
});
