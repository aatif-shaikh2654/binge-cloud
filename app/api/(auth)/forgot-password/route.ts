import { AsyncWrapper, ErrorHandler } from "@/app/lib/api-handler";
import { sendMail } from "@/app/lib/mail";
import { User } from "@/models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const POST = AsyncWrapper(async (req: Request) => {
  const { email } = await req.json();

  if (!email) {
    throw new ErrorHandler(400, "Email is required.");
  }

  const user = await User.findOne({ email });

  // Always return success to prevent user enumeration
  if (!user) {
    return NextResponse.json({
      message:
        "If an account exists with that email, a reset link has been sent.",
    });
  }

  // Generate a short-lived reset token (15 minutes)
  const resetToken = jwt.sign({ id: user.id, purpose: "reset" }, JWT_SECRET, {
    expiresIn: "15m",
  });

  const resetLink = `${BASE_URL}/reset-password?token=${resetToken}`;

  await sendMail({
    to: email,
    subject: "Reset Your BingeCloud Password",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #0a0a0a; border-radius: 16px; overflow: hidden; border: 1px solid #1a1a2e;">
        <div style="padding: 40px 32px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 22px; font-weight: 700; margin: 0 0 8px;">
            Reset Your Password
          </h1>
          <p style="color: #8197a4; font-size: 14px; line-height: 1.6; margin: 0 0 28px;">
            We received a request to reset your password. Click the button below to choose a new one. This link expires in 15 minutes.
          </p>
          <a
            href="${resetLink}"
            style="display: inline-block; padding: 14px 36px; background: linear-gradient(135deg, #3b82f6, #6366f1); color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 12px;"
          >
            Reset Password
          </a>
          <p style="color: #52525b; font-size: 12px; margin-top: 28px; line-height: 1.5;">
            If you didn't request this, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  });

  return NextResponse.json({
    message:
      "If an account exists with that email, a reset link has been sent.",
  });
});
