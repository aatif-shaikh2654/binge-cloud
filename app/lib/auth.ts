import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export interface JWTPayload {
  id: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "";

/**
 * Generates a signed JWT token for the user.
 */
export function generateToken(payload: JWTPayload, expiresIn: string = "30d"): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as jwt.SignOptions["expiresIn"] });
}

/**
 * Generates a signed refresh token for the user (no expiry).
 */
export function generateRefreshToken(payload: JWTPayload): string {
  const refreshSecret = process.env.JWT_REFRESH_SECRET || JWT_SECRET;
  if (!refreshSecret) {
    throw new Error("JWT secret is not configured");
  }
  return jwt.sign(payload, refreshSecret);
}

/**
 * Stores the access JWT token in a cookie.
 */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
}

/**
 * Stores the refresh token in a cookie with no expiry.
 */
export async function setRefreshTokenCookie(refreshToken: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("refreshToken", refreshToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    // No maxAge or expires properties to ensure it has no expiry
    path: "/",
  });
}

/**
 * Deletes both the auth and refresh cookies.
 */
export async function deleteAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("refreshToken");
}

/**
 * Retrieves the raw JWT token string from the server cookies.
 */
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value || null;
}

/**
 * Retrieves the raw refresh token string from the server cookies.
 */
export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("refreshToken")?.value || null;
}

/**
 * Verifies an access JWT token and returns the decoded payload if valid.
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    if (!JWT_SECRET) {
      console.warn("JWT_SECRET is not set in environment variables");
      return null;
    }
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Verifies a refresh token and returns the decoded payload if valid.
 */
export function verifyRefreshToken(token: string): JWTPayload | null {
  try {
    const refreshSecret = process.env.JWT_REFRESH_SECRET || JWT_SECRET;
    if (!refreshSecret) {
      console.warn("JWT secret is not set in environment variables");
      return null;
    }
    return jwt.verify(token, refreshSecret) as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Gets the decoded user data from the cookies if authenticated.
 * If the access token has expired, it automatically refreshes it using the refresh token.
 */
export async function getUserFromCookies(): Promise<JWTPayload | null> {
  const token = await getAuthToken();
  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      return decoded;
    }
  }

  // Access token is missing or expired, check the refresh token
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  const decodedRefresh = verifyRefreshToken(refreshToken);
  if (!decodedRefresh) {
    return null;
  }

  // Refresh token is valid! Generate and set a new access token
  const newAccessToken = generateToken({ id: decodedRefresh.id });
  try {
    await setAuthCookie(newAccessToken);
  } catch (error) {
    console.warn("Failed to set refreshed access token cookie in current context:", error);
  }

  return { id: decodedRefresh.id };
}
