import authConfig from "@/auth-config";
import NextAuth from "next-auth";

const { auth } = NextAuth(authConfig);

export { auth as GET, auth as POST };
