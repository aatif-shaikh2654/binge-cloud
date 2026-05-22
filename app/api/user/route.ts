import { AsyncWrapper, ErrorHandler } from "@/app/lib/api-handler";
import { getUserFromCookies } from "@/app/lib/auth";
import { User } from "@/models/User";
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
