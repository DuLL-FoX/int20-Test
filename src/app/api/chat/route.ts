import {db} from '@/lib/db';
import {NextRequest} from 'next/server';
import {respondWithError, respondWithSuccess} from '@/lib/respond';

export async function GET(req: NextRequest) {
    const auctionId = req.nextUrl.searchParams.get('auctionId');

    const chat = await db.chatSession.findFirst({
        where: {auctionId: Number(auctionId)},
        select: {id: true},
    });

    if (!chat) {
        return respondWithError('Chat not found', 404);
    }

    return respondWithSuccess({chatId: chat.id}, 200);
}

export async function POST(req: NextRequest) {
    const auctionId = req.nextUrl.searchParams.get('auctionId');

    const auction = await db.auction.findFirst({
        where: {id: Number(auctionId)},
    });

    if (!auction) {
        return respondWithError('Auction not found', 404);
    }

    const chatExists = await db.chatSession.findFirst({
        where: {auctionId: Number(auctionId)},
    });

    if (chatExists) {
        return respondWithError('Chat already exists for this auction', 400);
    }

    const chat = await db.chatSession.create({
        data: {
            auctionId: Number(auctionId),
        },
    });

    return respondWithSuccess(chat, 201);
}
