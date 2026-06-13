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
    <section className="rounded-2xl border border-white/[0.07] surface p-5 shadow-card md:p-6">
      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d9e0ee]">
        Owner <span className="text-[#e8c878]">Attention</span>
      </h3>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.label}
            className={`relative flex items-start gap-3 overflow-hidden rounded-xl border p-3.5 transition-shadow duration-200 ${
              item.isAlert
                ? "border-[#d9b25c]/25 bg-gradient-to-br from-[#d9b25c]/[0.10] to-[#c99a2e]/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_8px_-4px_rgba(217,178,92,0.25)]"
                : "border-emerald-400/25 bg-gradient-to-br from-emerald-400/[0.10] to-emerald-400/[0.05] shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_2px_8px_-4px_rgba(21,128,61,0.15)]"
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                item.isAlert
                  ? "bg-gradient-to-br from-[#e8c878] to-[#c99a2e] text-[#1a2456] shadow-[0_2px_6px_-2px_rgba(201,154,46,0.5)]"
                  : "bg-gradient-to-br from-[#34d399]/15 to-[#34d399]/5 text-[#34d399] ring-1 ring-[#34d399]/10"
              }`}
            >
              <item.Icon className="h-4 w-4" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#94a3b8]">
                {item.label}
              </p>
              <p
                className={`mt-0.5 text-base font-bold tabular-nums leading-tight ${
                  item.isAlert ? "text-[#e8c878]" : "text-[#34d399]"
                }`}
              >
                {item.value}
              </p>
              <p className="mt-1 text-[10px] leading-relaxed text-[#94a3b8]">
                {item.note}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
