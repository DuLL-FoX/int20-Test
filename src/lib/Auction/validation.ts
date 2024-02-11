import { z } from "zod";
import { statusAuc } from "@/lib/auction-types";

const requiredString = z.string().min(1, "Обов'язкове поле");

const auctionLogoSchema = z
  .custom<File | undefined>()
  .refine(
    (file) => !file || (file instanceof File && file.type.startsWith("image/")),
    "Файл повинен бути картинкою"
  )
  .refine((file) => {
    return !file || file.size < 1024 * 1024 * 2;
  }, "Файл повинен бути менше 2MB");

export const createAuctionSchema = z.object({
  title: requiredString.max(100),
  contactPhone: requiredString,
  auctionLotLogo: auctionLogoSchema,
  briefDescription: z.string().max(5000),
  auctionDate: z.coerce.date(),
  email: z.string().max(50),
  username: requiredString.max(20),
});

export type createAuctionValues = z.infer<typeof createAuctionSchema>;

export const auctionFilterSchema = z.object({
  q: z.string().optional(),
});

export type AuctionFilterValues = z.infer<typeof auctionFilterSchema>;

export const updateAuctionSchema = z.object({
  title: requiredString.max(100),
  auctionLotLogo: auctionLogoSchema,
  briefDescription: z.string().max(5000),
  auctionDate: z.coerce.date(),
});

export type updateAuctionValues = z.infer<typeof updateAuctionSchema>;
