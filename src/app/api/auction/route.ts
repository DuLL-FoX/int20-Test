import {db} from "@/lib/db";
import {NextRequest, NextResponse} from "next/server";
import {respondWithError, respondWithSuccess} from "@/lib/respond";
import type {Auction} from "@prisma/client";

interface User {
    username: string;
}

async function findUserByUsername(username: string): Promise<User | null> {
    return db.user.findUnique({
        where: {username},
        select: {password: false, username: true},
    });
}

async function findAuctions(condition: object): Promise<Auction[]> {
    return db.auction.findMany({
        where: condition,
        orderBy: {createdAt: "desc"},
    });
}

export async function GET(req: NextRequest) {
    const usernameParam = req.nextUrl.searchParams.get("username");

    try {
        if (usernameParam) {
            const user = await findUserByUsername(usernameParam);
            if (!user) return respondWithError("User not found.", 404);

            const userAuctions = await findAuctions({authorName: user.username});
            return respondWithSuccess(userAuctions, 200);
        } else {
            const auctions = await findAuctions({status: "ACTIVE"});
            return respondWithSuccess(auctions, 200);
        }
    } catch (err) {
        return NextResponse.json({error: "An error occurred while processing your request."}, {status: 500});
    }
}

export async function PATCH(req: NextRequest) {
    const auctionIdParam = req.nextUrl.searchParams.get("id");
    const usernameParam = req.nextUrl.searchParams.get("username");
    const auctionId = Number(auctionIdParam);

    if (!usernameParam) {
        return respondWithError("Invalid username value.", 400);
    }

    const user = await findUserByUsername(usernameParam);
    if (!user) {
        return respondWithError("User not found.", 404);
    }

    const userAuctions = await findAuctions({authorName: user.username});
    const userAuctionIds = userAuctions.map((auction) => auction.id);
    if (!userAuctionIds.includes(auctionId)) {
        return respondWithError("User is not the author of the auction.", 403);
    }

    if (!auctionIdParam || isNaN(auctionId)) {
        return respondWithError("Invalid auctionId value.", 400);
    }

    const existingAuction = await db.auction.findUnique({where: {id: auctionId}});
    if (!existingAuction) {
        return respondWithError("Auction not found.", 404);
    }

    const updateData = await req.json();
    const updateFields: Partial<Auction> = {};

    if (updateData.title) updateFields.title = updateData.title;
    if (updateData.description) updateFields.briefDescription = updateData.description;
    if (updateData.auctionDate && !isNaN(Date.parse(updateData.auctionDate))) updateFields.auctionDate = new Date(updateData.auctionDate);
    if (updateData.lotLogo && updateData.lotLogo.startsWith("http")) updateFields.auctionLotLogoUrl = updateData.lotLogo;

    if (Object.keys(updateFields).length === 0) {
        return respondWithError("No valid fields provided for update.", 400);
    }

    try {
        const updatedAuction = await db.auction.update({
            where: {id: auctionId},
            data: updateFields,
        });

        return respondWithSuccess(updatedAuction, 200);
    } catch (err) {
        return respondWithError("An error occurred while processing your request.", 500);
    }
}
