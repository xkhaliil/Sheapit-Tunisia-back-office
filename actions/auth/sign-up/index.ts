"use server";

import { SignUpData, SignUpSchema } from "@/schemas";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";

export async function signUp(values: SignUpData) {
  const validatedFields = SignUpSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const {
    name,
    email,
    password,
    phone,
    role,
    businessName,
    taxReference,
    postalCode,
  } = validatedFields.data;

  const hashedPassword = await bcrypt.hash(password, 12);

  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return { error: "This email is already in use. Please try another." };
  }

  const user = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      role: role as Role,
    },
  });

  if (role === Role.SENDER) {
    await db.sender.create({
      data: {
        userId: user.id,
        businessName,
        taxReference: taxReference ?? "",
        postalCode,
      },
    });

    return { success: "Account created successfully!" };
  } else {
    await db.carrier.create({
      data: {
        userId: user.id,
        companyName: businessName,
        postalCode,
      },
    });

    return { success: "Account created successfully!" };
  }
}
