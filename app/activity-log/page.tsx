import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export const revalidate = 30;

type ActivityLogRow = {
  id: string;
  user_id: string | null;
  module: string;
  action: string;
  record_id: string | null;
  notes: string | null;
  created_at: string;
};

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Jakarta",
  }).format(new Date(value));
}

function formatModule(value: string) {
  return value
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function shortId(value: string | null) {
  if (!value) return "-";
  return value.length > 12 ? `${value.slice(0, 8)}...` : value;
}

function activityTarget(module: string, recordId: string | null) {
  if (!recordId) return null;

  if (module.includes("production")) return `/production`;
  if (module.includes("quotation")) return `/quotation`;
  if (module.includes("sales") || module.includes("delivery")) return `/sales-delivery`;
  if (module.includes("invoice") || module.includes("payment")) return `/invoice-payment`;
  if (module.includes("accounting") || module.includes("expense") || module.includes("journal")) return `/accounting`;
  if (module.includes("master")) return `/master-data`;

  return null;
}

export default async function ActivityLogPage() {
  const supabase = createSupabaseAdmin();

  const { data, error } = await supabase
    .from("activity_logs")
    .select("id,user_id,module,action,record_id,notes,created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  const rows = ((data ?? []) as ActivityLogRow[]);
  const hasRows = rows.length > 0;

  return (
    <AppShell title="Activity Log" description="Owner audit trail for system input and workflow changes.">
      <div className="grid gap-3 md:gap-4">
        <section className="rounded-2xl border border-[#d9b25c]/20 bg-[#d9b25c]/[0.08] p-4 shadow-card">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e8c878]">Audit Trail</p>
              <h3 className="mt-1 text-base font-bold text-[#e2e8f0]">Latest 100 system activities</h3>
              <p className="mt-1 text-xs leading-relaxed text-[#cbd5e1]">
                Use this page to check what was input, from which module, and when it happened.
              </p>
            </div>
            <a
              href="/api/export/activity-log"
              className="rounded-xl bg-gradient-to-br from-[#e8c878] via-[#d9b25c] to-[#c99a2e] px-4 py-2.5 text-xs font-bold text-[#1a2456] shadow-[0_2px_10px_-2px_rgba(217,178,92,0.45)]"
            >
              Export CSV
            </a>
          </div>
        </section>

        {error ? (
          <section className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200 shadow-card">
            Failed to load activity log. Check Supabase connection and table permissions.
          </section>
        ) : null}

        {!error && !hasRows ? (
          <section className="rounded-2xl border border-white/[0.08] bg-[#12151f] p-5 text-center shadow-card">
            <p className="text-sm font-bold text-[#e2e8f0]">No activity recorded yet.</p>
            <p className="mt-1 text-xs text-[#94a3b8]">
              Activity will appear after staff submit forms such as production, quotation, sales/delivery, invoice/payment, or accounting.
            </p>
          </section>
        ) : null}

        {hasRows ? (
          <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#12151f] shadow-card">
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[860px] text-left text-xs">
                <thead className="border-b border-white/[0.08] bg-white/[0.03] text-[10px] uppercase tracking-[0.16em] text-[#94a3b8]">
                  <tr>
                    <th className="px-4 py-3 font-bold">Time</th>
                    <th className="px-4 py-3 font-bold">Module</th>
                    <th className="px-4 py-3 font-bold">Action</th>
                    <th className="px-4 py-3 font-bold">Record</th>
                    <th className="px-4 py-3 font-bold">Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {rows.map((row) => {
                    const target = activityTarget(row.module, row.record_id);

                    return (
                      <tr key={row.id} className="text-[#cbd5e1]">
                        <td className="whitespace-nowrap px-4 py-3 text-[#94a3b8]">{formatDateTime(row.created_at)}</td>
                        <td className="px-4 py-3 font-bold text-[#e2e8f0]">{formatModule(row.module)}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-[#1a2456] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#d9b25c]">
                            {row.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] text-[#94a3b8]">
                          {target ? (
                            <Link href={target} className="text-[#e8c878] hover:underline">
                              {shortId(row.record_id)}
                            </Link>
                          ) : (
                            shortId(row.record_id)
                          )}
                        </td>
                        <td className="px-4 py-3 text-[#94a3b8]">{row.notes || "-"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="grid gap-2 p-3 lg:hidden">
              {rows.map((row) => {
                const target = activityTarget(row.module, row.record_id);

                return (
                  <div key={row.id} className="rounded-xl border border-white/[0.08] bg-[#161a26] p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-[#e2e8f0]">{formatModule(row.module)}</p>
                        <p className="mt-1 text-[11px] text-[#94a3b8]">{formatDateTime(row.created_at)}</p>
                      </div>
                      <span className="rounded-full bg-[#1a2456] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#d9b25c]">
                        {row.action}
                      </span>
                    </div>
                    <div className="mt-3 grid gap-1 text-xs text-[#94a3b8]">
                      <p>
                        Record: {target ? <Link href={target} className="text-[#e8c878]">{shortId(row.record_id)}</Link> : shortId(row.record_id)}
                      </p>
                      <p>Notes: {row.notes || "-"}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ) : null}
      </div>
    </AppShell>
  );
}
