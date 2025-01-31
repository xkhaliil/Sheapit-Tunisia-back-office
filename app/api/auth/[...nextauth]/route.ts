import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const {
  handlers: { GET, POST },
} = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
    }),
  ],
});

export { GET, POST };
