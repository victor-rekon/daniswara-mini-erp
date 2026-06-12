"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createActivityLog } from "@/lib/server/activity-log";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

const optionalText = z.preprocess((value) => (value === "" ? null : value), z.string().nullable().optional());

const quotationSchema = z.object({
  quotation_number: z.string().min(1, "Quotation number is required"),
  quotation_date: z.string().min(1, "Quotation date is required"),
  branch_id: optionalText,
  customer_id: z.string().min(1, "Customer is required"),
  status: z.enum(["draft", "sent", "accepted", "rejected"]),
  notes: optionalText,
  product_id: z.string().min(1, "Product is required"),
  quantity: z.coerce.number().positive("Quantity must be greater than zero"),
  selling_price: z.coerce.number().min(0, "Selling price cannot be negative"),
  item_notes: optionalText,
});

export async function createQuotation(formData: FormData) {
  const rawBranchId = formData.get("branch_id");

  const payload = quotationSchema.parse({
    quotation_number: formData.get("quotation_number"),
    quotation_date: formData.get("quotation_date"),
    branch_id: rawBranchId ? String(rawBranchId) : null,
    customer_id: formData.get("customer_id"),
    status: formData.get("status") || "draft",
    notes: formData.get("notes") || null,
    product_id: formData.get("product_id"),
    quantity: formData.get("quantity"),
    selling_price: formData.get("selling_price"),
    item_notes: formData.get("item_notes") || null,
  });

  const supabase = createSupabaseAdmin();

  const { data: existingQuotation, error: quotationCheckError } = await supabase
    .from("quotations")
    .select("id")
    .eq("quotation_number", payload.quotation_number)
    .maybeSingle();

  if (quotationCheckError) throw new Error(quotationCheckError.message);
  if (existingQuotation) throw new Error("Quotation number already exists.");

  const { data: quotation, error: quotationError } = await supabase
    .from("quotations")
    .insert({
      quotation_number: payload.quotation_number,
      quotation_date: payload.quotation_date,
      branch_id: payload.branch_id,
      customer_id: payload.customer_id,
      status: payload.status,
      notes: payload.notes,
    })
    .select("id")
    .single();

  if (quotationError) throw new Error(quotationError.message);
  if (!quotation?.id) throw new Error("Quotation was not created.");

  const { error: itemError } = await supabase.from("quotation_items").insert({
    quotation_id: quotation.id,
    product_id: payload.product_id,
    quantity: payload.quantity,
    selling_price: payload.selling_price,
    notes: payload.item_notes,
  });

  if (itemError) {
    await supabase.from("quotations").delete().eq("id", quotation.id);
    throw new Error(itemError.message);
  }

  await createActivityLog({
    module: "quotation",
    action: "create_quotation",
    recordId: quotation.id,
    notes: `Quotation ${payload.quotation_number} created with status ${payload.status}.`,
  });

  revalidatePath("/quotation");
  revalidatePath("/dashboard");
}
