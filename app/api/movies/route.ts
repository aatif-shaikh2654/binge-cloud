import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy API for TMDB
 * Expects 'endpoint' as a query parameter (e.g., endpoint=3/movie/popular)
 * All other query parameters are forwarded to TMDB
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get("endpoint");

  if (!endpoint) {
    return NextResponse.json(
      {
        error:
          'The "endpoint" parameter is required (e.g., ?endpoint=3/movie/popular)',
      },
      { status: 400 },
    );
  }

  // Base URL as specified by the user
  const baseUrl = "https://api.themoviedb.org";

  // Ensure endpoint starts with a slash if not already present
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = new URL(`${baseUrl}${cleanEndpoint}`);

  // Forward all other search parameters
  searchParams.forEach((value, key) => {
    if (key !== "endpoint") {
      url.searchParams.set(key, value);
    }
  });

  console.log(`[Proxy] Fetching: ${url.toString()}`);
  
  try {
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
      return NextResponse.json(
        {
          error: `TMDB API responded with status ${response.status}`,
          details: errorData,
        },
        { status: response.status },
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying TMDB request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
