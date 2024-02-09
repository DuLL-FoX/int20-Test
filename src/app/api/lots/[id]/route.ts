import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: { params: { slug: string } }) {
  try {
    const { slug } = request.params;
    const auctionLots = await db.auctionLot.findUnique({
      where: { lotSlug: slug },
    });
    return NextResponse.json(auctionLots);
  } catch (err) {
    console.error(err);
    return NextResponse.error();
  }
}
