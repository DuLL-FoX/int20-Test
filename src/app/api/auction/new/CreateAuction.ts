"use server";

import { toSlug } from "@/lib/utils";
import { createAuctionSchema } from "@/lib/Auction/validation";
import { nanoid } from "nanoid";
import { put } from "@vercel/blob";
import path from "path";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function CreateAuctionPosting(formData: FormData) {
  const values = Object.fromEntries(formData.entries());

  const {
    title,
    contactPhone,
    briefDescription,
    auctionDate,
    auctionLotLogo,
    email,
    username,
  } = createAuctionSchema.parse(values);

  const trimmedTitle = title.trim();
  const trimmedBriefDescription = briefDescription.trim();

  const slug = `${toSlug(trimmedTitle)}-${nanoid(10)}`;

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

  try {
    await db.$transaction(async (prisma) => {
      await prisma.contactPoint.upsert({
        where: { contactPhone },
        update: {},
        create: {
          contactName: username,
          contactEmail: email,
          contactPhone,
        },
      });

     await prisma.user.findUnique({
        where: { username },
        select: { username: true },
      });

      await prisma.auction.create({
        data: {
          slug,
          title: trimmedTitle,
          auctionLotLogoUrl,
          briefDescription: trimmedBriefDescription,
          auctionDate,
          contactPhone,
          authorName: username,
        },
      });
      await prisma.chatSession.create({
        data: {
          auction: { connect: { slug } },
        },
      });
    });
  } catch (error) {
    console.error("Error creating auction: ", error);
    throw error;
  }

  redirect("/auctions/auction-submitted");
}
