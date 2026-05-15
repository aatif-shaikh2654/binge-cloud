import { NextRequest, NextResponse } from "next/server";

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
