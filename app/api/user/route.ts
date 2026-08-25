import { AsyncWrapper, ErrorHandler } from "@/shared/lib/api-handler";
import { getUserFromCookies } from "@/features/auth/server/auth";
import { User } from "@/features/auth/server/User";
import { NextResponse } from "next/server";

export const GET = AsyncWrapper(async () => {
    const decodedToken = await getUserFromCookies();
    const userId = decodedToken?.id || null;
    if (!userId) {
        throw new ErrorHandler(401, "Unauthorized");
    }

    const user = await User.findById(userId);
    if (!user) {
        throw new ErrorHandler(401, "Unauthorized");
    }
    return NextResponse.json(user);
});
