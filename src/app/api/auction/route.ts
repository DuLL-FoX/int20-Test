import {db} from "@/lib/db";
import {NextRequest, NextResponse} from "next/server";
import {respondWithError, respondWithSuccess} from "@/lib/respond";

export async function GET(req: NextRequest) {
    const usernameParam = req.nextUrl.searchParams.get("username");

    try {
        if (usernameParam) {
            const user = await db.user.findUnique({
                where: {username: usernameParam},
                select: {password: false, username: true},
            });

            if (!user) {
                return respondWithError("User not found.", 404)
            }

            const userAuctions = await db.auction.findMany({
                where: {authorName: user.username},
                orderBy: {createdAt: "desc"},
            });

            return respondWithSuccess(userAuctions, 200);
        } else {
            const auctions = await db.auction.findMany({
                where: {status: "ACTIVE"},
                orderBy: {createdAt: "desc"},
            });
            return respondWithSuccess(auctions, 200);
        }
    } catch (err) {
        return NextResponse.json({error: "An error occurred while processing your request."}, {status: 500});
    }
}

export async function PATCH(req: NextRequest) {
    const auctionId = req.nextUrl.searchParams.get("id");

    const existingAuction = await db.auction.findUnique({where: {id: Number(auctionId)}});
    if (!existingAuction) {
        return respondWithError("Auction not found.", 404)
    }

    const {title, description, auctionDate, lotLogo} = await req.json();

    if (!auctionId || !title || !description || !auctionDate || !lotLogo) {
        return respondWithError("Invalid request body.", 400)
    }

    if (isNaN(Date.parse(auctionDate))) {
        return respondWithError("Invalid auctionDate value.", 400)
    }

    if (!lotLogo.startsWith("http")) {
        return respondWithError("Invalid lotLogo value.", 400)
    }

    if (isNaN(Number(auctionId))) {
        return respondWithError("Invalid auctionId value.", 400)
    }

    try {
        const updatedAuction = await db.auction.update({
            where: {id: Number(auctionId)},
            data: {
                title: title,
                briefDescription: description,
                auctionDate: new Date(auctionDate),
                auctionLotLogoUrl: lotLogo,
            },
        });

        return respondWithSuccess(updatedAuction, 200);
    } catch (err) {
        return NextResponse.json({error: "An error occurred while processing your request."}, {status: 500});
    }

}

