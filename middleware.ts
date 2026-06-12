import { NextRequest, NextResponse } from "next/server";
import { ACCESS_COOKIE_NAME, createAccessToken, getAccessPassword } from "@/lib/server/access-control";

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

  if (currentToken === expectedToken) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.searchParams.set("next", pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!.*\\..*).*)", "/api/:path*"],
};
