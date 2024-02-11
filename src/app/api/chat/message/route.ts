import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { respondWithError } from "@/lib/respond";
import { publishEvent } from "@/lib/redis";

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

    const newMessageWithUsername = {
        ...newMessage,
        username: username,
        userId: undefined,
    };

    await publishEvent("newMessage", newMessageWithUsername);

    return NextResponse.json(newMessageWithUsername, { status: 201 });
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

    const users = await db.user.findMany({
        where: { id: { in: messages.map((message) => message.userId) } },
    });

    if (!messages) return respondWithError("Messages not found.", 404);

    const messagesWithUsername = messages.map(message => {
        const user = users.find(user => user.id === message.userId);
        return {
            ...message,
            username: user ? user.username : 'Unknown user',
            userId: undefined,
        };
    });

    return NextResponse.json(messagesWithUsername, { status: 200 });
}
