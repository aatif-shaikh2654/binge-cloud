import { ANILIST_ENDPOINT } from "@/app/constants/anilist";
import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy for AniList GraphQL API.
 * Forwards POST requests with { query, variables } to AniList,
 * keeping the client_secret server-side only.
 */
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
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
  } catch (error) {
    console.error("[AniList Proxy] Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
