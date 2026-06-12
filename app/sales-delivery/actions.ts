"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createActivityLog } from "@/lib/server/activity-log";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

const optionalText = z.preprocess((value) => (value === "" ? null : value), z.string().nullable().optional());

const salesDeliverySchema = z.object({
  sales_date: z.string().min(1, "Sales date is required"),
  delivery_date: z.string().min(1, "Delivery date is required"),
  branch_id: optionalText,
  customer_id: z.string().min(1, "Customer is required"),
  quotation_id: optionalText,
  so_number: optionalText,
  customer_po_number: optionalText,
  surat_jalan_number: z.string().min(1, "Surat jalan number is required"),
  product_id: z.string().min(1, "Product is required"),
  quantity: z.coerce.number().positive("Quantity must be greater than zero"),
  selling_price: z.coerce.number().min(0, "Selling price cannot be negative"),
  quantity_delivered: z.coerce.number().min(0, "Delivered quantity cannot be negative"),
  receiver: optionalText,
  notes: optionalText,
});

function resolveStatuses(quantity: number, delivered: number) {
  const pending = Math.max(quantity - delivered, 0);

  if (delivered <= 0) {
    return {
      sales_status: "open" as const,
      delivery_status: "pending" as const,
      pending,
    };
  }

  if (pending > 0) {
    return {
      sales_status: "partially_delivered" as const,
      delivery_status: "partially_delivered" as const,
      pending,
    };
  }

  return {
    sales_status: "delivered" as const,
    delivery_status: "delivered" as const,
    pending,
  };
}

export async function createSalesDelivery(formData: FormData) {
  const rawBranchId = formData.get("branch_id");
  const rawQuotationId = formData.get("quotation_id");

  const payload = salesDeliverySchema.parse({
    sales_date: formData.get("sales_date"),
    delivery_date: formData.get("delivery_date"),
    branch_id: rawBranchId ? String(rawBranchId) : null,
    customer_id: formData.get("customer_id"),
    quotation_id: rawQuotationId ? String(rawQuotationId) : null,
    so_number: formData.get("so_number") || null,
    customer_po_number: formData.get("customer_po_number") || null,
    surat_jalan_number: formData.get("surat_jalan_number"),
    product_id: formData.get("product_id"),
    quantity: formData.get("quantity"),
    selling_price: formData.get("selling_price"),
    quantity_delivered: formData.get("quantity_delivered") || 0,
    receiver: formData.get("receiver") || null,
    notes: formData.get("notes") || null,
  });

  if (payload.quantity_delivered > payload.quantity) {
    throw new Error("Delivered quantity cannot exceed sales quantity.");
  }

  const statuses = resolveStatuses(payload.quantity, payload.quantity_delivered);
  const supabase = createSupabaseAdmin();

  const { data: existingSuratJalan, error: suratJalanCheckError } = await supabase
    .from("delivery_records")
    .select("id")
    .eq("surat_jalan_number", payload.surat_jalan_number)
    .maybeSingle();

  if (suratJalanCheckError) throw new Error(suratJalanCheckError.message);
  if (existingSuratJalan) throw new Error("Surat jalan number already exists.");

  if (payload.so_number) {
    const { data: existingSalesOrder, error: salesOrderCheckError } = await supabase
      .from("sales_records")
      .select("id")
      .eq("so_number", payload.so_number)
      .maybeSingle();

    if (salesOrderCheckError) throw new Error(salesOrderCheckError.message);
    if (existingSalesOrder) throw new Error("Sales order number already exists.");
  }

  const { data: salesRecord, error: salesError } = await supabase
    .from("sales_records")
    .insert({
      sales_date: payload.sales_date,
      branch_id: payload.branch_id,
      customer_id: payload.customer_id,
      quotation_id: payload.quotation_id,
      so_number: payload.so_number,
      customer_po_number: payload.customer_po_number,
      surat_jalan_number: payload.surat_jalan_number,
      product_id: payload.product_id,
      quantity: payload.quantity,
      selling_price: payload.selling_price,
      sales_status: statuses.sales_status,
      notes: payload.notes,
    })
    .select("id")
    .single();

  if (salesError) throw new Error(salesError.message);
  if (!salesRecord?.id) throw new Error("Sales record was not created.");

  const { data: deliveryRecord, error: deliveryError } = await supabase
    .from("delivery_records")
    .insert({
      branch_id: payload.branch_id,
      sales_record_id: salesRecord.id,
      so_number: payload.so_number,
      customer_po_number: payload.customer_po_number,
      surat_jalan_number: payload.surat_jalan_number,
      delivery_date: payload.delivery_date,
      customer_id: payload.customer_id,
      product_id: payload.product_id,
      quantity_delivered: payload.quantity_delivered,
      quantity_pending: statuses.pending,
      delivery_status: statuses.delivery_status,
      receiver: payload.receiver,
      notes: payload.notes,
    })
    .select("id")
    .single();

  if (deliveryError) {
    await supabase.from("sales_records").delete().eq("id", salesRecord.id);
    throw new Error(deliveryError.message);
  }

  await createActivityLog({
    module: "sales_delivery",
    action: "create_sales_delivery",
    recordId: deliveryRecord.id,
    notes: `SO ${payload.so_number ?? "-"}, SJ ${payload.surat_jalan_number}, status ${statuses.delivery_status}.`,
  });

  revalidatePath("/sales-delivery");
  revalidatePath("/dashboard");
}
