import { csvResponse } from "@/lib/server/csv";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

function asRows(data: unknown): Record<string, unknown>[] {
  return Array.isArray(data) ? (data as Record<string, unknown>[]) : [];
}

export async function GET() {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase
    .from("activity_logs")
    .select("created_at, module, action, record_id, notes")
    .order("created_at", { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return csvResponse("activity-log.csv", asRows(data));
}
