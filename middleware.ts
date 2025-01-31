import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import authConfig from "@/auth-config";
import { Role } from "@prisma/client";
import NextAuth, { DefaultSession } from "next-auth";

import {
  apiAuthPrefix,
  DEFAULT_LOGIN_REDIRECT,
  privateRoutes,
  publicRoutes,
} from "./routes";

declare module "next-auth" {
  interface Session {
    user: {
      role?: Role;
    } & DefaultSession["user"];
  }
  interface User {
    role?: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
  }
}

const { auth } = NextAuth(authConfig);

export async function middleware(request: NextRequest) {
  const session = await auth();

  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!session?.user) {
      return NextResponse.redirect(new URL("/forbidden", request.url));
    }

    if (session.user.role !== Role.ADMIN) {
      return NextResponse.redirect(new URL("/forbidden", request.url));
    }
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/admin/:path*"],
};
