import { db } from "@/lib/db";
import { NextRequest } from "next/server";
import { respondWithError, respondWithSuccess } from "@/lib/respond";

export async function GET(req: NextRequest) {
  const auctionSlug = req.nextUrl.searchParams.get("auctionSlug");

  const chat = await db.chatSession.findUnique({
    where: { auctionSlug: auctionSlug as string },
    select: { id: true },
  });

  if (!chat) {
    return respondWithError("Chat not found", 404);
  }

  return respondWithSuccess({ chatId: chat.id }, 200);
}

export async function POST(req: NextRequest) {
  const auctionSlug = req.nextUrl.searchParams.get("auctionSlug");

  const auction = await db.auction.findUnique({
    where: { slug: auctionSlug as string },
  });

  if (!auction) {
    return respondWithError("Auction not found", 404);
  }

  const chatExists = await db.chatSession.findUnique({
    where: { auctionSlug: auctionSlug as string },
  });

  if (chatExists) {
    return respondWithError("Chat already exists for this auction", 400);
  }

  const chat = await db.chatSession.create({
    data: {
      auctionSlug: auctionSlug as string,
    },
  });

  return respondWithSuccess(chat, 201);
}
