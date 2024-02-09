import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "redis";

const redisClient = createClient({ url: "redis://130.162.253.235:6379" });
redisClient.connect().catch(console.error);

async function publishEvent(channel: string, message: any) {
  try {
    await redisClient.publish(channel, JSON.stringify(message));
    console.log(`Published event to channel ${channel}`);
  } catch (error) {
    console.error(`Failed to publish event: ${error}`);
  }
}

export async function POST(req: NextRequest) {
  const lotId = Number(req.nextUrl.searchParams.get("lotId"));
  const userId = Number(req.nextUrl.searchParams.get("userId"));
  const bidAmount = Number(req.nextUrl.searchParams.get("bidAmount"));
  const lot = await db.auctionLot.findUnique({ where: { id: lotId } });

  if (!lot) return respondWithError("Lot not found.", 404);
  if (lot.userId === userId)
    return respondWithError("You can't bid on your own lot.", 400);
  if (lot.startPrice >= bidAmount)
    return respondWithError(
      "Bid amount should be greater than the start price.",
      400
    );

  const bid = await db.auctionBid.create({
    data: { lotId: lot.id, userId, bidAmount },
  });

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return respondWithError("User not found.", 404);
  const newBid = { ...bid, user: { username: user.username } };

  await publishEvent("newBidChannel", newBid);

  return respondWithSuccess(bid, 201);
}

export async function GET(req: NextRequest) {
  const lotId = req.nextUrl.searchParams.get("lotId");

  const bids = await db.auctionBid.findMany({
    where: { lotId: Number(lotId) },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { username: true } } },
  });
  return respondWithSuccess(bids, 200);
}

function respondWithError(message: string, status: number) {
  return new NextResponse(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function respondWithSuccess(data: any, status: number) {
  return new NextResponse(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
