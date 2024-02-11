import { z } from "zod";

const requiredString = z.string().min(1, "Обов'язкове поле");

export const updateProfileSchema = z.object({
  username: z.string().max(30).optional(),
  password: z.string()?.max(20).optional(),
});

export type updateProfileValues = z.infer<typeof updateProfileSchema>;
