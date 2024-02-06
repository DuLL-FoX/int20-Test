import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await db.auction.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(res);
  } catch (err) {
    console.error(err);
  }
}
