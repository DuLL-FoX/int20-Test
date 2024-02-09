"use server";

import {createLotSchema} from "@/lib/Lots/validation";
import {nanoid} from "nanoid";
import {toSlug} from "@/lib/utils";
import {put} from "@vercel/blob";
import path from "path";
import {db} from "@/lib/db";

export async function CreateLotPosting(formData: FormData) {
    const {
        objectClassifier,
        startPrice,
        lotLogo,
        naming
    } = createLotSchema.parse(Object.fromEntries(formData.entries()));

    const slug = `${toSlug(naming.trim())}-${nanoid(10)}`;

    let lotLogoUrl: string = '';
    if (lotLogo instanceof File) {
        const blob = await put(`auctionLots_logos/${slug}${path.extname(lotLogo.name)}`, lotLogo, {
            access: "public",
            addRandomSuffix: false
        });
        lotLogoUrl = blob.url;
    }

    try {
        await db.auctionLot.create({
            data: {
                lotSlug: slug,
                objectClassifier: objectClassifier.trim(),
                startPrice: parseFloat(startPrice),
                lotLogoUrl,
                naming,
                auctionId: 1,
                userId: 11,
            },
        });
    } catch (error) {
        console.error("Error creating lot: ", error);
        throw error;
    }
}
