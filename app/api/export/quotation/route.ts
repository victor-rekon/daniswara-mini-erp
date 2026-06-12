import { csvResponse } from "@/lib/server/csv";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function asRows(data: unknown): Record<string, unknown>[] {
  return Array.isArray(data) ? (data as Record<string, unknown>[]) : [];
}

export async function GET() {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("quotations")
    .select("quotation_number, quotation_date, customer_id, status, notes, created_at")
    .order("quotation_date", { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return csvResponse("quotation-report.csv", asRows(data));
}
