"use server";

import { updateAuctionSchema } from "@/lib/Auction/validation";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export const updateAuction = async (form: FormData, slug: string) => {
  const auction = await db.auction.findUnique({
    where: { slug },
  });

  const values = Object.fromEntries(form.entries());

  const { title, briefDescription, auctionDate, auctionLotLogo } =
    updateAuctionSchema.parse(values);
  try {
    fetch(`http://localhost:3000/api/auction?id=${auction?.id}`, {
      method: "PACTH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        updateData: {
          title,
          description: briefDescription,
          auctionDate,
          lotLogo: auctionLotLogo,
        },
      }),
    });
  } catch (error) {
    alert("Error: " + error);
  }
  redirect(`/auctions/${auction?.slug}`);
};
