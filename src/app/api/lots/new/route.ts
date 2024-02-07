"use server";

import { createLotSchema } from "@/lib/Lots/validation";
import { nanoid } from "nanoid";
import { toSlug } from "@/lib/utils";
import { put } from "@vercel/blob";
import path from "path";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function createLotPosting(formData: FormData) {
  const values = Object.fromEntries(formData.entries());

  const { objectClassifier, startPrice, lotLogo, naming } =
    createLotSchema.parse(values);

  const trimmedObjectClassifier = objectClassifier.trim();
  const trimmedNaming = naming.trim();

  const slug = `${toSlug(trimmedNaming)}-${nanoid(10)}`;

  let lotLogoUrl: string;

  if (lotLogo instanceof File) {
    const blob = await put(
      `auction_logos/${slug}${path.extname(lotLogo.name)}`,
      lotLogo,
      {
        access: "public",
        addRandomSuffix: false,
      }
    );
    lotLogoUrl = blob.url;
  }

  try {
    await db.$transaction(async (prisma) => {
      await prisma.auctionLot.create({
        data: {
          lotSlug: slug,
          objectClassifier: trimmedObjectClassifier,
          startPrice,
          lotLogoUrl,
          naming,
          auctionId: 11,
          userId: 1,
        },
      });
    });
  } catch (error) {
    console.error("Error creating lot: ", error);
    throw error;
  }
}
