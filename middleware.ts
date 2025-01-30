import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import authConfig from "@/auth-config";
import NextAuth from "next-auth";

import {
  apiAuthPrefix,
  DEFAULT_LOGIN_REDIRECT,
  privateRoutes,
  publicRoutes,
} from "./routes";

const { auth } = NextAuth(authConfig);

export async function middleware(request: NextRequest) {
  const session = await auth();

  // Check if the user is trying to access protected routes
  if (
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/settings")
  ) {
    if (!session) {
      // If no session exists, redirect to sign in
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }

    // Add your role-based access control here
    // Example: if trying to access admin routes without admin role
    if (
      request.nextUrl.pathname.startsWith("/admin") &&
      session.user.role !== "admin"
    ) {
      return NextResponse.redirect(new URL("/forbidden", request.url));
    }
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*", "/admin/:path*"],
};
