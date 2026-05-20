import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export interface JWTPayload {
  id: string;
}

const JWT_SECRET = process.env.JWT_SECRET || "";

/**
 * Generates a signed JWT token for the user.
 */
export function generateToken(payload: JWTPayload): string {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
}

/**
 * Stores the JWT token in an HTTP-only cookie.
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
 * Deletes the auth cookies.
 */
export async function deleteAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}

/**
 * Retrieves the raw JWT token string from the server cookies.
 */
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value || null;
}

/**
 * Verifies a JWT token and returns the decoded payload if valid.
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
 * Gets the decoded user data from the cookies if authenticated.
 */
export async function getUserFromCookies(): Promise<JWTPayload | null> {
  const token = await getAuthToken();
  if (!token) return null;
  return verifyToken(token);
}
