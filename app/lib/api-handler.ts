import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

// Initialize Redis only if env variables are present to avoid dev crashes
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis =
  redisUrl && redisToken
    ? new Redis({
        url: redisUrl,
        token: redisToken,
      })
    : null;

// Create a rate limiter: 15 requests per 10 seconds per IP
const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "10 s"),
      analytics: true,
    })
  : null;

/**
 * Custom error class for API-related errors.
 * Allows specifying a status code and optional details.
 */
export class ErrorHandler extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Higher-order function to wrap API route handlers with error handling.
 * Automatically catches ApiError and returns the appropriate response,
 * and handles unexpected errors with a generic 500 response.
 */
export function AsyncWrapper(
  handler: (req: NextRequest) => Promise<NextResponse>,
) {
  return async (req: NextRequest) => {
    try {
      if (ratelimit) {
        const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
        const { success } = await ratelimit.limit(ip);
        if (!success) {
          throw new ErrorHandler(429, "Too Many Requests");
        }
      }
      return await handler(req);
    } catch (error) {
      if (error instanceof ErrorHandler) {
        return NextResponse.json(
          {
            error: error.message,
            ...(error.details ? { details: error.details } : {}),
          },
          { status: error.status },
        );
      }

      console.error("[API Error]:", error);

      return NextResponse.json(
        {
          error: "Internal Server Error",
          ...(process.env.NODE_ENV === "development" && error instanceof Error
            ? { details: error.message }
            : {}),
        },
        { status: 500 },
      );
    }
  };
}
