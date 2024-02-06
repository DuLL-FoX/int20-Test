import { z } from "zod";

const requiredString = z.string().min(1, "Обов'язкове поле");

const lotLogoSchema = z
    .custom<File | undefined>()
    .refine(
        (file) => !file || (file instanceof File && file.type.startsWith("image/")),
        "Файл повинен бути картинкою"
    )
    .refine((file) => {
        return !file || file.size < 1024 * 1024 * 2;
    }, "Файл повинен бути менше 2MB");
export const createLotSchema = z.object({
    objectClassifier: requiredString.max(100),
    startPrice: z.number().min(0),
    lotLogo: lotLogoSchema
});

export type createLotValues = z.infer<typeof createLotSchema>;

export const lotFilterSchema = z.object({
    q: z.string().optional(),
    status: z.string().optional(),
});