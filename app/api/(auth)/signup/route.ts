import { AsyncWrapper, ErrorHandler } from "@/shared/lib/api-handler";
import { User } from "@/features/auth/server/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = AsyncWrapper(async (req: Request) => {
  const { usernameOrEmail, password } = await req.json();
  
  if (!usernameOrEmail || !password) {
    throw new ErrorHandler(400, "Username/Email and Password are required.");
  }

  let username: string | undefined, email: string | undefined;
  if (!usernameOrEmail.includes("@")) {
    username = usernameOrEmail;
  } else {
    email = usernameOrEmail;
  }

  // ✅ Check if username already exists
  if (username) {
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      throw new ErrorHandler(400, "Username is already taken.");
    }
  }

  // ✅ Check if email already exists
  if (email) {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      throw new ErrorHandler(400, "Email is already registered.");
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    ...(username && { username }),
    ...(email && { email }),
    password: hashedPassword,
  });
  return NextResponse.json(user);
});
