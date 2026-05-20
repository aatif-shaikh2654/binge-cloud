import { AsyncWrapper, ErrorHandler } from "@/app/lib/api-handler";
import { generateToken, setAuthCookie } from "@/app/lib/auth";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = AsyncWrapper(async (req: Request) => {
  const { usernameOrEmail, password } = await req.json();
  
  if (!usernameOrEmail || !password) {
    throw new ErrorHandler(400, "Username/Email and Password are required.");
  }

  let user;
  if (usernameOrEmail.includes("@")) {
    user = await User.scope("withPassword").findOne({ where: { email: usernameOrEmail } });
  } else {
    user = await User.scope("withPassword").findOne({ where: { username: usernameOrEmail } });
  }

  if (!user) {
    throw new ErrorHandler(401, "Invalid username/email or password.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ErrorHandler(401, "Invalid username/email or password.");
  }

  // Generate JWT Token
  const token = generateToken({
    id: user.id
  });

  // Store in HTTP-only Cookie
  await setAuthCookie(token);

  return NextResponse.json(user);
});
