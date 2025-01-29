import authConfig from "@/auth-config";
import NextAuth from "next-auth";

import {
  apiAuthPrefix,
  DEFAULT_LOGIN_REDIRECT,
  privateRoutes,
  publicRoutes,
} from "./routes";

const { auth } = NextAuth(authConfig);
export default auth((req): any => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isPrivateRoutes = privateRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return null;
  }
  if (isPrivateRoutes) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/sign-in", nextUrl));
  }
  return null;
});
export const config = {
  matcher:
    "/((?!api|_next/static|site.webmanifest|images|image|videos|fonts|site.webmanifest|favicon.ico|opengraph-image.png).*)",
};
