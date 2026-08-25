import { AsyncWrapper, ErrorHandler } from "@/shared/lib/api-handler";
import { generateToken, setAuthCookie, generateRefreshToken, setRefreshTokenCookie } from "@/features/auth/server/auth";
import { User } from "@/features/auth/server/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = AsyncWrapper(async (req: Request) => {
  const { usernameOrEmail, password } = await req.json();

  if (!usernameOrEmail || !password) {
    throw new ErrorHandler(400, "Username/Email and Password are required.");
  }

  let user;
  if (usernameOrEmail.includes("@")) {
    user = await User.findOne({ email: usernameOrEmail }).select("+password");
  } else {
    user = await User.findOne({ username: usernameOrEmail }).select(
      "+password",
    );
  }

  if (!user || !user.password) {
    throw new ErrorHandler(401, "Invalid username/email or password.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ErrorHandler(401, "Invalid username/email or password.");
  }

  // Generate JWT Token
  const token = generateToken({
    id: user.id,
  });

  // Generate Refresh Token
  const refreshToken = generateRefreshToken({
    id: user.id,
  });

  // Store in cookies
  await setAuthCookie(token);
  await setRefreshTokenCookie(refreshToken);

  const userObj = user.toJSON();

  return NextResponse.json(userObj);
});
