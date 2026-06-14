import { NextRequest, NextResponse } from "next/server";
import { ACCESS_COOKIE_NAME, createAccessToken, getAccessPassword } from "@/lib/server/access-control";
import { ROLE_COOKIE_NAME, canAccessPath, getFallbackPath, normalizeRole } from "@/lib/access/roles";

const PUBLIC_PATH_PREFIXES = [
  "/login",
  "/logout",
  "/_next",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
];

function isPublicPath(pathname: string) {
  return PUBLIC_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export async function middleware(request: NextRequest) {
  const accessPassword = getAccessPassword();

  if (!accessPassword) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const expectedToken = await createAccessToken(accessPassword);
  const currentToken = request.cookies.get(ACCESS_COOKIE_NAME)?.value;

  if (currentToken !== expectedToken) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  const role = normalizeRole(request.cookies.get(ROLE_COOKIE_NAME)?.value);

  if (!pathname.startsWith("/api/") && !canAccessPath(role, pathname)) {
    const fallbackUrl = request.nextUrl.clone();
    fallbackUrl.pathname = getFallbackPath(role);
    fallbackUrl.searchParams.set("restricted", "1");
    return NextResponse.redirect(fallbackUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*).*)", "/api/:path*"],
};
