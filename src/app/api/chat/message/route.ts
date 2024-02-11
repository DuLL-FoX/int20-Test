import {NextRequest} from "next/server";
import {db} from "@/lib/db";
import {respondWithError, respondWithSuccess} from "@/lib/respond";
import {publishEvent} from "@/lib/redis";

export async function POST(req: NextRequest) {
    const {chatMessage, chatId} = await req.json();
    const userId = Number(req.nextUrl.searchParams.get("userId"));

    if (!chatMessage) return respondWithError("Message is required.", 400);
    if (isNaN(userId)) return respondWithError("Invalid userId.", 400);
    if (isNaN(chatId)) return respondWithError("Invalid chatId.", 400);

    const chat = await db.chatSession.findFirst({
        where: {id: chatId},
        select: {id: true, auctionSlug: true},
    });

    if (!chat) return respondWithError("Chat not found.", 404);

    const newMessage = await db.message.create({
        data: {
            messageText: String(chatMessage),
            auctionSlug: chat.auctionSlug,
            userId,
            chatId,
        },
    });

    await publishEvent("newMessage", newMessage);

    return respondWithSuccess(newMessage, 201);
}

export async function GET(req: NextRequest) {
    const auctionSlug = req.nextUrl.searchParams.get("auctionSlug");

    if (!auctionSlug) return respondWithError("Auction slug is required.", 400);

    const auction = await db.auction.findFirst({
        where: {slug: auctionSlug},
    });

    if (!auction) return respondWithError("Auction not found.", 404);


    const messages = await db.message.findMany({
        where: {auctionSlug},
        orderBy: {id: "asc"},
    });

    if (!messages) return respondWithError("Messages not found.", 404);

    return respondWithSuccess(messages, 200);
}
