"use server";

import { toSlug } from "@/lib/utils";
import { createAuctionSchema } from "@/lib/validation";
import { nanoid } from "nanoid";
import { put } from "@vercel/blob";
import path from "path";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function createAuctionPosting(formData: FormData) {
  const values = Object.fromEntries(formData.entries());

  const {
    title,
    contactPointContactName,
    briefDescription,
    auctionDate,
    auctionLotLogo,
  } = createAuctionSchema.parse(values);

  const slug = `${toSlug(title)}-${nanoid(10)}`;

  let auctionLotLogoUrl: string | undefined = undefined;

  if (auctionLotLogo instanceof File) {
    const blob = await put(
      `auction_logos/${slug}${path.extname(auctionLotLogo.name)}`,
      auctionLotLogo,
      {
        access: "public",
        addRandomSuffix: false,
      }
    );
    auctionLotLogoUrl = blob.url;
  }

  await db.auction.create({
    data: {
      slug,
      title: title.trim(),
      auctionLotLogoUrl,
      briefDescription: briefDescription.trim(),
      auctionDate,
      contactPointContactName,
      authorId: 11,
      chatId: 1,
    },
  });

  redirect("/auction/auction-submitted");
}
