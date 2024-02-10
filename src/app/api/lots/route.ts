import {db} from "@/lib/db";
import {NextRequest} from "next/server";
import {AuctionLotStatus} from "@prisma/client";
import {respondWithError, respondWithSuccess} from "@/lib/respond";

export async function GET(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get("userId");

    try {
        if (!userId) {
            const allActiveAuctions = await db.auctionLot.findMany({
                where: {lotStatus: "ACTIVE"},
                orderBy: {objectClassifier: "desc"},
            });
            return respondWithSuccess(allActiveAuctions, 200);
        }

        const numericUserId = Number(userId);
        if (isNaN(numericUserId)) {
            console.error("Invalid userId:", userId);
            return respondWithError("Invalid userId value.", 400);
        }

        const userAuctions = await db.auctionLot.findMany({
            where: {userId: numericUserId},
            orderBy: {createdAt: "desc"},
        });

        return respondWithSuccess(userAuctions, 200);

    } catch (err) {
        console.error(err);
        return respondWithError("An error occurred while processing your request.", 500);
    }
}

export async function PATCH(req: NextRequest) {
    const lotId = req.nextUrl.searchParams.get("lotId");
    const {lotStatus} = await req.json();

    if (!lotId || !lotStatus) {
        return respondWithError("Invalid request body.", 400);
    }

    if (!Object.values(AuctionLotStatus).includes(lotStatus)) {
        return respondWithError("Invalid lotStatus value.", 400);
    }

    const existingAuctionLot = await db.auctionLot.findUnique({where: {id: Number(lotId)}});
    if (!existingAuctionLot) {
        return respondWithError("Auction lot not found.", 404)
    }

    try {
        const updatedAuctionLot = await db.auctionLot.update({
            where: {id: Number(lotId)},
            data: {
                lotStatus: lotStatus,
            },
        });

        return respondWithSuccess(updatedAuctionLot, 200);
    } catch (err) {
        console.error(err);
        return respondWithError("An error occurred while processing your request.", 500);
    }
}
