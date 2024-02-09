import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await db.auctionLot.findMany({
      where: { lotStatus: "ACTIVE" },
      orderBy: { objectClassifier: "desc" },
    });
    return NextResponse.json(res);
  } catch (err) {
    console.error(err);
  }
}