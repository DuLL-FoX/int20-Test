"use server";

import { createLotSchema } from "@/lib/Lots/validation";
import { nanoid } from "nanoid";
import { toSlug } from "@/lib/utils";
import { put } from "@vercel/blob";
import path from "path";
import { db } from "@/lib/db";

export async function СreateLotPosting(formData: FormData) {
  const values = Object.fromEntries(formData.entries());

  const { objectClassifier, startPrice, lotLogo, naming } =
    createLotSchema.parse(values);

  const trimmedObjectClassifier = objectClassifier.trim();
  const trimmedNaming = naming.trim();

  const slug = `${toSlug(trimmedNaming)}-${nanoid(10)}`;

  let lotLogoUrl: string;

  if (lotLogo instanceof File) {
    const blob = await put(
      `auctionLots_logos/${slug}${path.extname(lotLogo.name)}`,
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
          startPrice:  parseFloat(startPrice),
          lotLogoUrl,
          naming,
          auctionId: 1,
          userId: 11,
        },
      });
    });
  } catch (error) {
    console.error("Error creating lot: ", error);
    throw error;
  }
}
