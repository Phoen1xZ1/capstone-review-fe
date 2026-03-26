import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that DO require authentication (exact match or prefix)
const PROTECTED_PREFIXES = ["/team", "/lecturer", "/moderator", "/schedule"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;

  const isProtected =
    pathname === "/" ||
    PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));

  // Redirect unauthenticated users to /login
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Redirect authenticated users away from /login
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Only run on app pages — skip all Next.js internals, static, and API proxy routes
  matcher: [
    "/((?!_next|api|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};

