import {NextRequest, NextResponse} from "next/server";
import {db} from "@/lib/db";
import {respondWithError, respondWithSuccess} from "@/lib/respond";
import {publishEvent} from "@/lib/redis";

export async function POST(req: NextRequest) {
    const auctionSlug = req.nextUrl.searchParams.get('auctionSlug');

    const { chatMessage } = await req.json();
    const username = req.nextUrl.searchParams.get('username');

    if (!chatMessage) return respondWithError('Message is required.', 400);
    if (!username) return respondWithError('User is required.', 400);
    if (!auctionSlug) return respondWithError('Invalid auctionSlug.', 400);

    const user = await db.user.findFirst({
        where: { username },
        select: { id: true },
    });

    if (!user) return respondWithError('User not found.', 404);

    const chat = await db.chatSession.findFirst({
        where: { auctionSlug },
        select: { id: true, auctionSlug: true },
    });

    if (!chat) return respondWithError("Chat not found.", 404);

    const newMessage = await db.message.create({
        data: {
            messageText: chatMessage,
            auctionSlug,
            userId: user.id,
            chatId: chat.id,
        },
    });

    await publishEvent("newMessage", newMessage);

    return NextResponse.json(newMessage, { status: 201 });
}

export async function GET(req: NextRequest) {
    const auctionSlug = req.nextUrl.searchParams.get("auctionSlug");

    if (!auctionSlug) return respondWithError("Invalid auctionSlug.", 400);

    const chat = await db.chatSession.findFirst({
        where: { auctionSlug },
        select: { id: true },
    });

    if (!chat) return respondWithError("Chat not found.", 404);

    const messages = await db.message.findMany({
        where: { chatId: chat.id },
        orderBy: { id: "asc" },
    });

    if (!messages) return respondWithError("Messages not found.", 404);

    return NextResponse.json(messages, { status: 200 });
}
