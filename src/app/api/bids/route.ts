import {db} from "@/lib/db";
import {NextRequest} from "next/server";
import {publishEvent} from "@/lib/redis";
import {respondWithError, respondWithSuccess} from "@/lib/respond";

export async function POST(req: NextRequest) {
    const lotId = Number(req.nextUrl.searchParams.get("lotId"));
    const username = req.nextUrl.searchParams.get("username");
    const bidAmount = Number(req.nextUrl.searchParams.get("bidAmount"));

    try {
        const [lot, user, latestBid] = await Promise.all([
            db.auctionLot.findUnique({where: {id: lotId}}),
            db.user.findUnique({
                where: {username: username as string},
                select: {id: true}
            }),
            db.auctionBid.findFirst({
                where: {lotId: lotId},
                orderBy: {createdAt: 'desc'}
            })
        ]);

        if (!user) return respondWithError("User not found.", 404);
        if (!lot) return respondWithError("Lot not found.", 404);
        if (lot.userId === user.id)
            return respondWithError("You can't bid on your own lot.", 400);
        if (lot.startPrice >= bidAmount)
            return respondWithError(
                "Bid amount should be greater than the start price.",
                400
            );

        if (latestBid && latestBid.bidAmount >= bidAmount)
            return respondWithError(
                "Bid amount should be greater than the last highest bid.",
                400
            );

        const bid = await db.auctionBid.create({
            data: {lotId: lot.id, userId: user.id, bidAmount},
        });

        const newBid = {...bid, user: {username: username}};

        await publishEvent("newBidChannel", newBid);

        return respondWithSuccess(bid, 201);
    } catch (error: any) {
        return respondWithError(error.message, 500);
    }
}


export async function GET(req: NextRequest) {
    const lotId = req.nextUrl.searchParams.get("lotId");

    const bids = await db.auctionBid.findMany({
        where: {lotId: Number(lotId)},
        orderBy: {createdAt: "desc"},
        include: {user: {select: {username: true}}},
    });
    return respondWithSuccess(bids, 200);
}


