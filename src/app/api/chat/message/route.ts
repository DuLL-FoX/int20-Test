import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { respondWithError } from '@/lib/respond';
import { publishEvent } from '@/lib/redis';

export async function POST(req: NextRequest) {
    const chatId = Number(req.nextUrl.searchParams.get('chatId'));

    const { chatMessage } = await req.json();
    const username = Number(req.nextUrl.searchParams.get('username'));

    if (!chatMessage) return respondWithError('Message is required.', 400);
    if (!username) return respondWithError('User is required.', 400);
    if (isNaN(chatId)) return respondWithError('Invalid chatId.', 400);

    const user = await db.user.findFirst({
        where: { username: String(username) },
        select: { id: true },
    });

    if (!user) return respondWithError('User not found.', 404);

    const chat = await db.chatSession.findFirst({
        where: { id: chatId },
        select: { id: true, auctionId: true },
    });

    if (!chat) return respondWithError('Chat not found.', 404);

    const newMessage = await db.message.create({
        data: {
            messageText: String(chatMessage),
            auctionId: chat.auctionId,
            userId: user.id,
            chatId,
        },
    });

    await publishEvent('newMessage', newMessage);

    return NextResponse.json(newMessage, { status: 201 });
}

export async function GET(req: NextRequest) {
    const chatId = Number(req.nextUrl.searchParams.get('chatId'));

    if (isNaN(chatId)) return respondWithError('Invalid chatId.', 400);

    const messages = await db.message.findMany({
        where: { chatId },
        orderBy: { id: 'asc' },
    });

    if (!messages) return respondWithError('Messages not found.', 404);

    return NextResponse.json(messages, { status: 200 });
}
