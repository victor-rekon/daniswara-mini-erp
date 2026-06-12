import { csvResponse } from "@/lib/server/csv";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function asRows(data: unknown): Record<string, unknown>[] {
  return Array.isArray(data) ? (data as Record<string, unknown>[]) : [];
}

export async function GET() {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("invoices")
    .select("invoice_number, invoice_date, due_date, customer_id, delivery_record_id, invoice_value, payment_received, outstanding_amount, payment_status, notes, created_at")
    .order("invoice_date", { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return csvResponse("invoice-payment-report.csv", asRows(data));
}
