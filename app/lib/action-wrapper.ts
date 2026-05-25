import { getUserFromCookies } from "@/app/lib/auth";
import connectToDatabase from "@/lib/db";

/**
 * A middleware-like wrapper for Next.js Server Actions or server-side functions.
 * It automatically checks authentication, connects to the database, wraps in a
 * try-catch block, and serializes the Mongoose document results to plain JSON objects.
 */
export function withAuthAndDB<Args extends unknown[], ReturnType>(
  handler: (userId: string, ...args: Args) => Promise<ReturnType>,
) {
  return async (...args: Args): Promise<ReturnType | null> => {
    try {
      const user = await getUserFromCookies();
      if (!user?.id) {
        return null;
      }
      await connectToDatabase();
      const result = await handler(user.id, ...args);
      return result ? JSON.parse(JSON.stringify(result)) : null;
    } catch (error) {
      console.error("Error in server action:", error);
      return null;
    }
  };
}
