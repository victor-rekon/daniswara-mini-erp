import type { ProductionSummary } from "@/types/production";

function fmt(v: number) { return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(v); }
function fmtCur(v: number) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v); }

export function ProductionSummaryCards({ summary }: { summary: ProductionSummary }) {
  const cards = [
    { label: "Total Produksi",    value: fmt(summary.total_produced),      stripe: "bg-slate-300",    val: "text-slate-900" },
    { label: "Total Losses",      value: fmt(summary.total_losses),        stripe: "bg-[#f59e0b]",    val: "text-[#b45309]" },
    { label: "Net Quantity",      value: fmt(summary.total_net_quantity),  stripe: "bg-[#3b82f6]",    val: "text-[#1e40af]" },
    { label: "Losses %",          value: `${fmt(summary.losses_percentage)}%`, stripe: "bg-[#f59e0b]", val: "text-[#b45309]" },
    { label: "Total HPP Base Cost", value: fmtCur(summary.total_hpp_base_cost), stripe: "bg-slate-300", val: "text-slate-900" },
    { label: "Avg HPP / Unit",    value: fmtCur(summary.average_hpp_per_unit), stripe: "bg-slate-300", val: "text-slate-900" },
  ];
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3">
      {cards.map((c) => (
        <div key={c.label} className="relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/[0.06] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className={`absolute inset-y-0 left-0 w-1.5 ${c.stripe}`} />
          <div className="py-3.5 pl-5 pr-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{c.label}</p>
            <p className={`mt-1.5 text-lg font-bold tabular-nums leading-tight ${c.val}`}>{c.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
