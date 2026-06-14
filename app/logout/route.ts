import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE_NAME } from "@/lib/server/access-control";
import { ROLE_COOKIE_NAME } from "@/lib/access/roles";

export function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete(ACCESS_COOKIE_NAME);
  response.cookies.delete(ROLE_COOKIE_NAME);
  return response;
}
