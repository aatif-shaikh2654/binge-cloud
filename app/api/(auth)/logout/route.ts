import { AsyncWrapper } from "@/shared/lib/api-handler";
import { deleteAuthCookies } from "@/features/auth/server/auth";
import { NextResponse } from "next/server";

export const POST = AsyncWrapper(async () => {
  await deleteAuthCookies();
  return NextResponse.json({ success: true, message: "Logged out successfully" });
});
