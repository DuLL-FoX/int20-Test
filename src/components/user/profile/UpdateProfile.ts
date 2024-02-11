"use server";

import { db } from "@/lib/db";

export async function UpdateProfile(formData: FormData, username: string) {
  const values = Object.fromEntries(formData.entries());

  const trimmedUsername = values.username as string;
  const trimmedPassword = values.password as string;

  try {
    if (trimmedUsername && !trimmedPassword) {
      await db.user.update({
        where: { username: username },
        data: {
          username: trimmedUsername,
        },
      });
    } else if (trimmedPassword && !trimmedUsername) {
      await db.user.update({
        where: { username: username },
        data: {
          password: trimmedPassword,
        },
      });
    } else {
      await db.$transaction(async (prisma) => {
        await prisma.user.update({
          where: { username: username },
          data: { username: trimmedUsername, password: trimmedPassword },
        });
      });
    }
  } catch (error) {
    console.log("Помилка в оновленні профілю");
    throw error;
  }
}
