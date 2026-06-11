import type { DashboardSummary } from "@/types/dashboard";
import { formatDashboardCurrency } from "@/lib/calculations/dashboard";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";

type DashboardAttentionPanelProps = {
  summary: DashboardSummary;
};

export function DashboardAttentionPanel({
  summary,
}: DashboardAttentionPanelProps) {
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
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-slate-900">
          Owner Attention
        </h3>
        <p className="mt-0.5 text-sm text-slate-500">
          Items that need management attention.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.label}
            className={`rounded-lg border p-4 transition-all duration-200 ${
              item.isAlert
                ? "border-amber-200 bg-amber-50"
                : "border-emerald-200 bg-emerald-50"
            }`}
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <p className="text-xs font-medium text-slate-600">{item.label}</p>
              <item.Icon
                className={`mt-0.5 h-4 w-4 shrink-0 ${
                  item.isAlert ? "text-amber-500" : "text-emerald-500"
                }`}
                aria-hidden="true"
              />
            </div>
            <p
              className={`text-xl font-bold tabular-nums ${
                item.isAlert ? "text-amber-800" : "text-emerald-800"
              }`}
            >
              {item.value}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              {item.note}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
