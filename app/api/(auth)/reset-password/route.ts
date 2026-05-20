import { AsyncWrapper, ErrorHandler } from "@/app/lib/api-handler";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "";

interface ResetTokenPayload {
  id: string;
  purpose: string;
}

export const POST = AsyncWrapper(async (req: Request) => {
  const { token, password } = await req.json();

  if (!token || !password) {
    throw new ErrorHandler(400, "Token and new password are required.");
  }

  if (password.length < 6) {
    throw new ErrorHandler(400, "Password must be at least 6 characters.");
  }

  // Verify the reset token
  let decoded: ResetTokenPayload;
  try {
    decoded = jwt.verify(token, JWT_SECRET) as ResetTokenPayload;
  } catch {
    throw new ErrorHandler(400, "Invalid or expired reset link. Please request a new one.");
  }

  if (decoded.purpose !== "reset") {
    throw new ErrorHandler(400, "Invalid reset token.");
  }

  const user = await User.findByPk(decoded.id);
  if (!user) {
    throw new ErrorHandler(404, "User not found.");
  }

  // Hash the new password and update
  const hashedPassword = await bcrypt.hash(password, 10);
  await user.update({ password: hashedPassword });

  return NextResponse.json({
    message: "Password has been reset successfully.",
  });
});
