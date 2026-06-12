import { csvResponse } from "@/lib/server/csv";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function asRows(data: unknown): Record<string, unknown>[] {
  return Array.isArray(data) ? (data as Record<string, unknown>[]) : [];
}

export async function GET() {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("production_records")
    .select("production_date, batch_code, quantity_produced, unit, losses_quantity, hpp_base_cost, notes, created_at")
    .order("production_date", { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return csvResponse("production-report.csv", asRows(data));
}
