"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";

export async function getUserByEmail(email: string) {
  return db.user.findFirst({
    where: { email },
  });
}
