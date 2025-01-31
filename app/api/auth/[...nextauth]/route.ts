import authConfig from "@/auth-config";
import NextAuth from "next-auth";

const handler = NextAuth(authConfig);

export const GET = handler;
export const POST = handler;
