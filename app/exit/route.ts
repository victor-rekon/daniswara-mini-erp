import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ACCESS_COOKIE_NAME } from "@/lib/server/access-control";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_COOKIE_NAME);

  const url = new URL(request.url);
  url.pathname = "/login";
  url.search = "";

  return NextResponse.redirect(url);
}
