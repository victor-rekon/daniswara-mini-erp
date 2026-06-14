"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { normalizeRole } from "@/lib/access/roles";

function text(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

export async function createAppUser(formData: FormData) {
  const supabase = createSupabaseAdmin();
  const name = text(formData.get("name"));
  const email = text(formData.get("email")).toLowerCase();
  const role = normalizeRole(formData.get("role"));

  if (!name || !email) return;

  await supabase.from("app_users").insert({ name, email, role, is_active: true });

  revalidatePath("/users");
}

export async function setAppUserStatus(formData: FormData) {
  const supabase = createSupabaseAdmin();
  const id = text(formData.get("id"));
  const nextStatus = text(formData.get("next_status")) === "true";

  if (!id) return;

  await supabase
    .from("app_users")
    .update({ is_active: nextStatus, updated_at: new Date().toISOString() })
    .eq("id", id);

  revalidatePath("/users");
}
