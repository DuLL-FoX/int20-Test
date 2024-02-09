import {db} from "@/lib/db";
import {NextRequest, NextResponse} from "next/server";

export async function GET(req: NextRequest) {
    const userIdParam = req.nextUrl.searchParams.get("userId");
    try {
        if (userIdParam) {
            const userId = parseInt(userIdParam, 10);
            if (isNaN(userId)) {
                return NextResponse.json({error: "Invalid userId provided."}, {status: 400});
            }

            const user = await db.user.findUnique({
                where: {id: userId},
                select: {password: false, username: true},
            });

            if (!user) {
                return NextResponse.json({error: "User not found."}, {status: 404});
            }

            const userAuctions = await db.auction.findMany({
                where: {authorName: user.username},
                orderBy: {createdAt: "desc"},
            });

            return NextResponse.json(userAuctions);
        } else {
            const auctions = await db.auction.findMany({
                where: {status: "ACTIVE"},
                orderBy: {createdAt: "desc"},
            });
            return NextResponse.json(auctions);
        }
    } catch (err) {
        return NextResponse.json({error: "An error occurred while processing your request."}, {status: 500});
    }
}
