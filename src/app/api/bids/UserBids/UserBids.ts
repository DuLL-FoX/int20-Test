"use server";

import { db } from "@/lib/db";

type BidsProps = {
  lotId: number;
  username: string;
};

export async function GetUserBids(username: string) {
  try {
    return await db.auctionBid.findMany({
      where: { user: { username: username } },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error creating lot: ", error);
    throw error;
  }
}
