import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = [
  "/dashboard",
  "/items",
  "/stock-in",
  "/stock-out",
  "/expiring",
  "/transactions",
  "/shops",
  "/users",
  "/settings",
];

const authPaths = ["/login", "/signup", "/accept-invite"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("ghala_token")?.value;

  const isProtected = protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
  const isAuthPath = authPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/items/:path*",
    "/stock-in/:path*",
    "/stock-out/:path*",
    "/expiring/:path*",
    "/transactions/:path*",
    "/shops/:path*",
    "/users/:path*",
    "/settings/:path*",
    "/login",
    "/signup",
    "/accept-invite",
  ],
};
