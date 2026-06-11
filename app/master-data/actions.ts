"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

const optionalText = z.preprocess((value) => (value === "" ? null : value), z.string().nullable().optional());

const productSchema = z.object({
  product_name: z.string().min(1, "Product name is required"),
  unit: z.string().min(1, "Unit is required"),
});

const branchSchema = z.object({
  branch_name: z.string().min(1, "Branch name is required"),
  location: optionalText,
});

const customerSchema = z.object({
  customer_name: z.string().min(1, "Customer name is required"),
  contact: optionalText,
  branch_id: optionalText,
  notes: optionalText,
});

const accountSchema = z.object({
  account_code: z.string().min(1, "Account code is required"),
  account_name: z.string().min(1, "Account name is required"),
  account_type: z.enum(["asset", "liability", "equity", "revenue", "cost_of_goods_sold", "expense"]),
});

export async function createProduct(formData: FormData) {
  const payload = productSchema.parse({
    product_name: formData.get("product_name"),
    unit: formData.get("unit"),
  });

  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("products").insert(payload);

  if (error) throw new Error(error.message);
  revalidatePath("/master-data");
}

export async function createBranch(formData: FormData) {
  const payload = branchSchema.parse({
    branch_name: formData.get("branch_name"),
    location: formData.get("location") || null,
  });

  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("branches").insert(payload);

  if (error) throw new Error(error.message);
  revalidatePath("/master-data");
}

export async function createCustomer(formData: FormData) {
  const rawBranchId = formData.get("branch_id");
  const payload = customerSchema.parse({
    customer_name: formData.get("customer_name"),
    contact: formData.get("contact") || null,
    branch_id: rawBranchId ? String(rawBranchId) : null,
    notes: formData.get("notes") || null,
  });

  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("customers").insert(payload);

  if (error) throw new Error(error.message);
  revalidatePath("/master-data");
}

export async function createChartOfAccount(formData: FormData) {
  const payload = accountSchema.parse({
    account_code: formData.get("account_code"),
    account_name: formData.get("account_name"),
    account_type: formData.get("account_type"),
  });

  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from("chart_of_accounts").insert(payload);

  if (error) throw new Error(error.message);
  revalidatePath("/master-data");
}
