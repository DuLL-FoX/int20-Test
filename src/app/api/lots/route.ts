import {db} from "@/lib/db";
import {NextRequest, NextResponse} from "next/server";

export async function GET(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get("userId");

    try {
        if (!userId) {
            const allActiveAuctions = await db.auctionLot.findMany({
                where: {lotStatus: "ACTIVE"},
                orderBy: {objectClassifier: "desc"},
            });
            return NextResponse.json(allActiveAuctions);
        }

        const numericUserId = Number(userId);
        if (isNaN(numericUserId)) {
            console.error("Invalid userId:", userId);
            return NextResponse.json({error: "Invalid userId provided"}, {status: 400});
        }

        const userAuctions = await db.auctionLot.findMany({
            where: {userId: numericUserId},
            orderBy: {createdAt: "desc"},
        });

        return NextResponse.json(userAuctions);

    } catch (err) {
        console.error(err);
        return NextResponse.json({error: "An error occurred while processing your request"}, {status: 500});
    }
}
