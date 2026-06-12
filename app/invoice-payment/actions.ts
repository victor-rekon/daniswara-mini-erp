"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createActivityLog } from "@/lib/server/activity-log";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

const optionalText = z.preprocess((value) => (value === "" ? null : value), z.string().nullable().optional());

const invoiceSchema = z.object({
  invoice_number: z.string().min(1, "Invoice number is required"),
  invoice_date: z.string().min(1, "Invoice date is required"),
  branch_id: optionalText,
  customer_id: z.string().min(1, "Customer is required"),
  delivery_record_id: optionalText,
  invoice_value: z.coerce.number().positive("Invoice value must be greater than zero"),
  due_date: optionalText,
  payment_status: z.enum(["belum_ditagih", "sudah_ditagih", "sebagian_dibayar", "lunas", "overdue"]),
  notes: optionalText,
});

const paymentSchema = z.object({
  invoice_id: z.string().min(1, "Invoice is required"),
  payment_date: z.string().min(1, "Payment date is required"),
  amount: z.coerce.number().positive("Payment amount must be greater than zero"),
  notes: optionalText,
});

function resolvePaymentStatus(invoiceValue: number, paidAmount: number, dueDate: string | null) {
  if (paidAmount >= invoiceValue) return "lunas" as const;
  if (paidAmount > 0) return "sebagian_dibayar" as const;

  if (dueDate) {
    const due = new Date(`${dueDate}T00:00:00`);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (due.getTime() < today.getTime()) return "overdue" as const;
  }

  return "sudah_ditagih" as const;
}

export async function createInvoice(formData: FormData) {
  const payload = invoiceSchema.parse({
    invoice_number: formData.get("invoice_number"),
    invoice_date: formData.get("invoice_date"),
    branch_id: formData.get("branch_id") || null,
    customer_id: formData.get("customer_id"),
    delivery_record_id: formData.get("delivery_record_id") || null,
    invoice_value: formData.get("invoice_value"),
    due_date: formData.get("due_date") || null,
    payment_status: formData.get("payment_status") || "sudah_ditagih",
    notes: formData.get("notes") || null,
  });

  const supabase = createSupabaseAdmin();

  const { data: existingInvoice, error: invoiceCheckError } = await supabase
    .from("invoices")
    .select("id")
    .eq("invoice_number", payload.invoice_number)
    .maybeSingle();

  if (invoiceCheckError) throw new Error(invoiceCheckError.message);
  if (existingInvoice) throw new Error("Invoice number already exists.");

  if (payload.delivery_record_id) {
    const { data: existingDeliveryInvoice, error: deliveryInvoiceCheckError } = await supabase
      .from("invoices")
      .select("id")
      .eq("delivery_record_id", payload.delivery_record_id)
      .maybeSingle();

    if (deliveryInvoiceCheckError) throw new Error(deliveryInvoiceCheckError.message);
    if (existingDeliveryInvoice) throw new Error("This delivery record already has an invoice.");
  }

  const { data: invoice, error } = await supabase
    .from("invoices")
    .insert({
      ...payload,
      payment_received: 0,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  await createActivityLog({
    module: "invoice_payment",
    action: "create_invoice",
    recordId: invoice.id,
    notes: `Invoice ${payload.invoice_number} created with value ${payload.invoice_value}.`,
  });

  revalidatePath("/invoice-payment");
  revalidatePath("/dashboard");
}

export async function createPayment(formData: FormData) {
  const payload = paymentSchema.parse({
    invoice_id: formData.get("invoice_id"),
    payment_date: formData.get("payment_date"),
    amount: formData.get("amount"),
    notes: formData.get("notes") || null,
  });

  const supabase = createSupabaseAdmin();

  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select("id, invoice_number, invoice_value, due_date")
    .eq("id", payload.invoice_id)
    .single();

  if (invoiceError) throw new Error(invoiceError.message);
  if (!invoice) throw new Error("Invoice not found.");

  const { data: existingPayments, error: existingPaymentsError } = await supabase
    .from("payments")
    .select("amount")
    .eq("invoice_id", payload.invoice_id);

  if (existingPaymentsError) throw new Error(existingPaymentsError.message);

  const currentPaidAmount = (existingPayments ?? []).reduce((sum, payment) => sum + Number(payment.amount ?? 0), 0);
  const invoiceValue = Number(invoice.invoice_value ?? 0);
  const nextPaidAmount = currentPaidAmount + payload.amount;

  if (nextPaidAmount > invoiceValue) {
    const remaining = Math.max(invoiceValue - currentPaidAmount, 0);
    throw new Error(`Payment exceeds invoice outstanding amount. Remaining amount is ${remaining}.`);
  }

  const { error: paymentError } = await supabase.from("payments").insert(payload);
  if (paymentError) throw new Error(paymentError.message);

  const paymentStatus = resolvePaymentStatus(invoiceValue, nextPaidAmount, invoice.due_date ?? null);

  const { error: updateError } = await supabase
    .from("invoices")
    .update({
      payment_received: nextPaidAmount,
      payment_status: paymentStatus,
    })
    .eq("id", payload.invoice_id);

  if (updateError) throw new Error(updateError.message);

  await createActivityLog({
    module: "invoice_payment",
    action: "create_payment",
    recordId: payload.invoice_id,
    notes: `Payment recorded for invoice ${invoice.invoice_number ?? payload.invoice_id}. New status ${paymentStatus}.`,
  });

  revalidatePath("/invoice-payment");
  revalidatePath("/dashboard");
}
