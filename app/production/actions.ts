"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createActivityLog } from "@/lib/server/activity-log";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

const productionSchema = z.object({
  production_date: z.string().min(1, "Production date is required"),
  branch_id: z.string().optional().nullable(),
  product_id: z.string().min(1, "Product is required"),
  batch_code: z.string().optional().nullable(),
  quantity_produced: z.coerce.number().min(0, "Quantity produced cannot be negative"),
  unit: z.string().min(1, "Unit is required"),
  losses_quantity: z.coerce.number().min(0, "Losses cannot be negative"),
  hpp_base_cost: z.coerce.number().min(0, "HPP base cost cannot be negative"),
  notes: z.string().optional().nullable(),
});

export async function createProductionRecord(formData: FormData) {
  const rawBranchId = formData.get("branch_id");

  const payload = productionSchema.parse({
    production_date: formData.get("production_date"),
    branch_id: rawBranchId ? String(rawBranchId) : null,
    product_id: formData.get("product_id"),
    batch_code: formData.get("batch_code") || null,
    quantity_produced: formData.get("quantity_produced"),
    unit: formData.get("unit"),
    losses_quantity: formData.get("losses_quantity") || 0,
    hpp_base_cost: formData.get("hpp_base_cost") || 0,
    notes: formData.get("notes") || null,
  });

  if (payload.losses_quantity > payload.quantity_produced) {
    throw new Error("Losses cannot exceed quantity produced.");
  }

  const supabase = createSupabaseAdmin();

  if (payload.batch_code) {
    const { data: existingBatch, error: batchCheckError } = await supabase
      .from("production_records")
      .select("id")
      .eq("product_id", payload.product_id)
      .eq("production_date", payload.production_date)
      .eq("batch_code", payload.batch_code)
      .maybeSingle();

    if (batchCheckError) throw new Error(batchCheckError.message);
    if (existingBatch) throw new Error("Batch code already exists for this product and production date.");
  }

  const { data, error } = await supabase
    .from("production_records")
    .insert(payload)
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  await createActivityLog({
    module: "production",
    action: "create_production_record",
    recordId: data.id,
    notes: `Production date ${payload.production_date}, produced ${payload.quantity_produced} ${payload.unit}, losses ${payload.losses_quantity}.`,
  });

  revalidatePath("/production");
  revalidatePath("/dashboard");
}
