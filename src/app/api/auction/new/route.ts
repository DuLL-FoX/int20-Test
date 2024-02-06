"use server";

import { toSlug } from "@/lib/utils";
import { createAuctionSchema } from "@/lib/Auction/validation";
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
            await prisma.auction.create({
                data: {
                    slug,
                    title: trimmedTitle,
                    auctionLotLogoUrl,
                    briefDescription: trimmedBriefDescription,
                    auctionDate,
                    contactPointContactName,
                    authorId: 11,
                    chatId: 1,
                },
            });
        });
    } catch (error) {
        console.error("Error creating auction: ", error);
        throw error;
    }

    redirect("/auction/auction-submitted");
}