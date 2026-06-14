"use server";

import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_COOKIE_NAME, createAccessToken, getAccessPassword } from "@/lib/server/access-control";
import { ROLE_COOKIE_NAME, normalizeRole } from "@/lib/access/roles";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

function safeNext(value: FormDataEntryValue | null) {
  const fallback = "/dashboard";
  const nextValue = typeof value === "string" ? value : fallback;

  if (!nextValue.startsWith("/") || nextValue.startsWith("//")) return fallback;
  if (nextValue.startsWith("/login") || nextValue.startsWith("/logout")) return fallback;

  return nextValue;
}

function digestCredential(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function submitAccess(formData: FormData) {
  const configuredCode = getAccessPassword();
  const nextPath = safeNext(formData.get("next"));

  if (!configuredCode) redirect(nextPath);

  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const submittedPassword = String(formData.get("password") ?? "");

  if (!username || !submittedPassword) {
    redirect(`/login?error=1&next=${encodeURIComponent(nextPath)}`);
  }

  const supabase = createSupabaseAdmin();
  const { data: user } = await supabase
    .from("app_users")
    .select("id, name, username, role, login_hash")
    .ilike("username", username)
    .eq("is_active", true)
    .maybeSingle();

  if (!user?.role) {
    redirect(`/login?error=1&next=${encodeURIComponent(nextPath)}`);
  }

  const expectedHash = typeof user.login_hash === "string" && user.login_hash.length > 0 ? user.login_hash : null;
  const isValidPassword = expectedHash
    ? digestCredential(submittedPassword) === expectedHash
    : submittedPassword === configuredCode;

  if (!isValidPassword) {
    redirect(`/login?error=1&next=${encodeURIComponent(nextPath)}`);
  }

  await supabase
    .from("app_users")
    .update({ last_login_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", user.id);

  const selectedRole = normalizeRole(user.role);
  const cookieStore = await cookies();
  cookieStore.set(ACCESS_COOKIE_NAME, await createAccessToken(configuredCode), {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  cookieStore.set(ROLE_COOKIE_NAME, selectedRole, {
    httpOnly: false,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  redirect(nextPath);
}
