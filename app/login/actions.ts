"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_COOKIE_NAME, createAccessToken, getAccessPassword } from "@/lib/server/access-control";

function safeNext(value: FormDataEntryValue | null) {
  const fallback = "/dashboard";
  const nextValue = typeof value === "string" ? value : fallback;

  if (!nextValue.startsWith("/") || nextValue.startsWith("//")) return fallback;
  if (nextValue.startsWith("/login") || nextValue.startsWith("/logout")) return fallback;

  return nextValue;
}

export async function submitAccess(formData: FormData) {
  const configuredCode = getAccessPassword();
  const nextPath = safeNext(formData.get("next"));

  if (!configuredCode) redirect(nextPath);

  const submittedCode = String(formData.get("access_code") ?? "");
  if (submittedCode !== configuredCode) {
    redirect(`/login?error=1&next=${encodeURIComponent(nextPath)}`);
  }

  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE_NAME, await createAccessToken(configuredCode), {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  redirect(nextPath);
}
