import type { DashboardSummary } from "@/types/dashboard";
import { formatDashboardCurrency } from "@/lib/calculations/dashboard";

type DashboardAttentionPanelProps = {
  summary: DashboardSummary;
};

export function DashboardAttentionPanel({ summary }: DashboardAttentionPanelProps) {
  const items = [
    {
      label: "Customer Outstanding",
      value: formatDashboardCurrency(summary.outstanding),
      note: "Collect manually. No bank reconciliation in Phase 1.",
    },
    {
      label: "Pending Delivery",
      value: String(summary.pending_delivery_count),
      note: "Check SO/PO and surat jalan records.",
    },
    {
      label: "Overdue Invoice",
      value: String(summary.overdue_invoice_count),
      note: "Follow up customer payment manually.",
    },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-lg font-semibold">Owner Attention</h3>
        <p className="mt-1 text-sm text-slate-500">Items that need management attention.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl bg-slate-50 p-4">
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-2 text-xl font-bold text-slate-950">{item.value}</p>
            <p className="mt-2 text-xs text-slate-500">{item.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
