"use server";

import { createHash } from "node:crypto";
import { revalidatePath } from "next/cache";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { normalizeRole } from "@/lib/access/roles";

function text(value: FormDataEntryValue | null) {
  return String(value ?? "").trim();
}

function makeDigest(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export async function createAppUser(formData: FormData) {
  const supabase = createSupabaseAdmin();
  const name = text(formData.get("name"));
  const username = text(formData.get("username")).toLowerCase();
  const email = text(formData.get("email")).toLowerCase();
  const accessKey = text(formData.get("access_key"));
  const role = normalizeRole(formData.get("role"));

  if (!name || !username || !email || !accessKey) return;

  await supabase.from("app_users").insert({
    name,
    username,
    email,
    role,
    is_active: true,
    login_hash: makeDigest(accessKey),
    require_password_update: true,
  });

  await supabase.from("activity_logs").insert({
    module: "users",
    action: "create_employee_user",
    notes: `Created ${role} user: ${name} (${username})`,
  });

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

  await supabase.from("activity_logs").insert({
    module: "users",
    action: nextStatus ? "activate_employee_user" : "deactivate_employee_user",
    record_id: id,
    notes: nextStatus ? "Activated employee user" : "Deactivated employee user",
  });

  revalidatePath("/users");
}
