import type { DashboardSummary } from "@/types/dashboard";
import { formatDashboardCurrency } from "@/lib/calculations/dashboard";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";

type DashboardAttentionPanelProps = {
  summary: DashboardSummary;
};

export function DashboardAttentionPanel({ summary }: DashboardAttentionPanelProps) {
  const items = [
    {
      label: "Customer Outstanding",
      value: formatDashboardCurrency(summary.outstanding),
      note: "Collect manually. No bank reconciliation in Phase 1.",
      isAlert: summary.outstanding > 0,
      Icon: summary.outstanding > 0 ? AlertTriangle : CheckCircle2,
    },
    {
      label: "Pending Delivery",
      value: String(summary.pending_delivery_count),
      note: "Check SO/PO and surat jalan records.",
      isAlert: summary.pending_delivery_count > 0,
      Icon: summary.pending_delivery_count > 0 ? Clock : CheckCircle2,
    },
    {
      label: "Overdue Invoice",
      value: String(summary.overdue_invoice_count),
      note: "Follow up customer payment manually.",
      isAlert: summary.overdue_invoice_count > 0,
      Icon: summary.overdue_invoice_count > 0 ? AlertTriangle : CheckCircle2,
    },
  ];

  return (
    <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/[0.06] md:p-5">
      <div className="mb-3">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Owner Attention
        </h3>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.label}
            className={`relative overflow-hidden rounded-lg p-3.5 ring-1 ${
              item.isAlert
                ? "bg-amber-50 ring-amber-200"
                : "bg-emerald-50 ring-emerald-200"
            }`}
          >
            <div className={`absolute inset-y-0 left-0 w-1 ${item.isAlert ? "bg-[#f59e0b]" : "bg-[#22c55e]"}`} />
            <div className="pl-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  {item.label}
                </p>
                <item.Icon
                  className={`h-3.5 w-3.5 shrink-0 ${item.isAlert ? "text-[#f59e0b]" : "text-[#22c55e]"}`}
                  aria-hidden="true"
                />
              </div>
              <p className={`text-xl font-bold tabular-nums ${item.isAlert ? "text-amber-800" : "text-[#15803d]"}`}>
                {item.value}
              </p>
              <p className="mt-1.5 text-[10px] leading-relaxed text-slate-500">
                {item.note}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
