import { createSupabaseAdmin } from "@/lib/supabase/admin";

type ActivityLogInput = {
  module: string;
  action: string;
  recordId?: string | null;
  notes?: string | null;
};

export async function createActivityLog({ module, action, recordId = null, notes = null }: ActivityLogInput) {
  const supabase = createSupabaseAdmin();

  const { error } = await supabase.from("activity_logs").insert({
    module,
    action,
    record_id: recordId,
    notes,
  });

  if (error) {
    console.error("Failed to create activity log", {
      module,
      action,
      recordId,
      message: error.message,
    });
  }
}
