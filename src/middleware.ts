import { NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE, verifyAuthToken } from "@/utils/auth";
import { protectedRoutes } from "@/resources/protectedRoutes";

/**
 * Server-side enforcement for password-protected routes.
 *
 * The client-side RouteGuard only decides what to *render*; without this
 * middleware the page would still be server-rendered and shipped in the RSC
 * payload, readable with JavaScript disabled. Blocking here means protected
 * content never leaves the server unauthenticated.
 */

const PROTECTED_PATHS = Object.entries(protectedRoutes)
  .filter(([, enabled]) => enabled)
  .map(([path]) => path);

function isProtected(pathname: string): boolean {
  return PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isProtected(pathname)) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_COOKIE)?.value;

  if (await verifyAuthToken(token)) {
    return NextResponse.next();
  }

  // Rewrite (not redirect) so the URL is preserved and RouteGuard can show the
  // password prompt, while the protected page itself is never rendered.
  const url = request.nextUrl.clone();
  url.pathname = "/unauthorized";

  const response = NextResponse.rewrite(url);
  response.headers.set("Cache-Control", "no-store");
  return response;
}

export const config = {
  // Skip static assets and Next internals; auth endpoints handle their own checks.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/|images/|.*\\.[\\w]+$).*)"],
};
