import { AsyncWrapper } from "@/app/lib/api-handler";
import { deleteAuthCookies } from "@/app/lib/auth";
import { NextResponse } from "next/server";

export const POST = AsyncWrapper(async () => {
  await deleteAuthCookies();
  return NextResponse.json({ success: true, message: "Logged out successfully" });
});
