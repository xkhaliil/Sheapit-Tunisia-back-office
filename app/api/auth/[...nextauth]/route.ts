import authConfig from "@/auth-config";
import NextAuth from "next-auth";

const { handlers } = NextAuth(authConfig);

export const GET = handlers.GET;
export const POST = handlers.POST;
