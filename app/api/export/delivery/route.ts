import { csvResponse } from "@/lib/server/csv";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function asRows(data: unknown): Record<string, unknown>[] {
  return Array.isArray(data) ? (data as Record<string, unknown>[]) : [];
}

export async function GET() {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("delivery_records")
    .select("delivery_date, so_number, customer_po_number, surat_jalan_number, customer_id, product_id, quantity_delivered, quantity_pending, delivery_status, receiver, notes, created_at")
    .order("delivery_date", { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return csvResponse("delivery-report.csv", asRows(data));
}
