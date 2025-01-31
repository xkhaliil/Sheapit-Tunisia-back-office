import { Role } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  name: string;
  email: string;
  phone: string;
  image: string;
  role: Role;
  isTwoFactorEnabled: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

declare module "next-auth/react" {
  function getCsrfToken(): Promise<string>;
}
