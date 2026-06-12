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
    <section className="rounded-2xl border border-[#e6e8ef] bg-white p-4 shadow-[0_1px_3px_rgba(26,36,86,0.05)] md:p-5">
      <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#233575]">
        Owner <span className="text-[#b8860b]">Attention</span>
      </h3>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.label}
            className={`flex items-start gap-3 rounded-xl border p-3.5 ${
              item.isAlert
                ? "border-[#f3e3bd] bg-[#fdf9ef]"
                : "border-[#d3eedb] bg-[#f0faf3]"
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                item.isAlert
                  ? "bg-gradient-to-br from-[#d9b25c] to-[#c99a2e] text-[#1a2456]"
                  : "bg-[#15803d]/10 text-[#15803d]"
              }`}
            >
              <item.Icon className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#7a829b]">
                {item.label}
              </p>
              <p
                className={`mt-0.5 text-base font-bold tabular-nums leading-tight ${
                  item.isAlert ? "text-[#b8860b]" : "text-[#15803d]"
                }`}
              >
                {item.value}
              </p>
              <p className="mt-1 text-[10px] leading-relaxed text-[#7a829b]">
                {item.note}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
