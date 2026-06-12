"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createActivityLog } from "@/lib/server/activity-log";
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

async function assertNoExistingRecord(table: string, column: string, value: string, message: string) {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.from(table).select("id").eq(column, value).maybeSingle();

  if (error) throw new Error(error.message);
  if (data) throw new Error(message);
}

export async function createProduct(formData: FormData) {
  const payload = productSchema.parse({
    product_name: formData.get("product_name"),
    unit: formData.get("unit"),
  });

  await assertNoExistingRecord("products", "product_name", payload.product_name, "Product name already exists.");

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.from("products").insert(payload).select("id").single();

  if (error) throw new Error(error.message);

  await createActivityLog({
    module: "master_data",
    action: "create_product",
    recordId: data.id,
    notes: `Product ${payload.product_name} created.`,
  });

  revalidatePath("/master-data");
}

export async function createBranch(formData: FormData) {
  const payload = branchSchema.parse({
    branch_name: formData.get("branch_name"),
    location: formData.get("location") || null,
  });

  await assertNoExistingRecord("branches", "branch_name", payload.branch_name, "Branch name already exists.");

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.from("branches").insert(payload).select("id").single();

  if (error) throw new Error(error.message);

  await createActivityLog({
    module: "master_data",
    action: "create_branch",
    recordId: data.id,
    notes: `Branch ${payload.branch_name} created.`,
  });

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

  await assertNoExistingRecord("customers", "customer_name", payload.customer_name, "Customer name already exists.");

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.from("customers").insert(payload).select("id").single();

  if (error) throw new Error(error.message);

  await createActivityLog({
    module: "master_data",
    action: "create_customer",
    recordId: data.id,
    notes: `Customer ${payload.customer_name} created.`,
  });

  revalidatePath("/master-data");
}

export async function createChartOfAccount(formData: FormData) {
  const payload = accountSchema.parse({
    account_code: formData.get("account_code"),
    account_name: formData.get("account_name"),
    account_type: formData.get("account_type"),
  });

  await assertNoExistingRecord("chart_of_accounts", "account_code", payload.account_code, "Account code already exists.");

  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.from("chart_of_accounts").insert(payload).select("id").single();

  if (error) throw new Error(error.message);

  await createActivityLog({
    module: "master_data",
    action: "create_chart_of_account",
    recordId: data.id,
    notes: `Account ${payload.account_code} ${payload.account_name} created.`,
  });

  revalidatePath("/master-data");
}
