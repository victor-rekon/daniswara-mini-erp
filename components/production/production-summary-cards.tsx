import type { ProductionSummary } from "@/types/production";

function fmt(v: number) { return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(v); }
function fmtCur(v: number) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v); }

const CARD = "relative cursor-pointer overflow-hidden rounded-[14px] border border-[rgba(255,255,255,0.08)] bg-[#12151f] shadow-card transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]";

export function ProductionSummaryCards({ summary }: { summary: ProductionSummary }) {
  const cards = [
    { label: "Total Produksi",      value: fmt(summary.total_produced),          stripe: "bg-[#2f4a9e]", val: "text-[#e2e8f0]" },
    { label: "Total Losses",        value: fmt(summary.total_losses),            stripe: "bg-[#d97706]", val: "text-[#fbbf24]" },
    { label: "Net Quantity",        value: fmt(summary.total_net_quantity),      stripe: "bg-[#2f4a9e]", val: "text-[#e2e8f0]" },
    { label: "Losses %",            value: `${fmt(summary.losses_percentage)}%`, stripe: "bg-[#d97706]", val: "text-[#fbbf24]" },
    { label: "Total HPP Base Cost", value: fmtCur(summary.total_hpp_base_cost),  stripe: "bg-gradient-to-r from-[#c99a2e] to-[#d9b25c]", val: "text-[#e8c878]" },
    { label: "Avg HPP / Unit",      value: fmtCur(summary.average_hpp_per_unit), stripe: "bg-gradient-to-r from-[#c99a2e] to-[#d9b25c]", val: "text-[#e8c878]" },
  ];
  return (
    <div className="grid grid-cols-2 gap-2 md:gap-3 md:grid-cols-3 md:gap-3 lg:grid-cols-6">
      {cards.map((c) => (
        <div key={c.label} className={CARD}>
          <div className={`absolute inset-x-0 top-0 h-[2.5px] ${c.stripe}`} />
          <div className="px-2.5 pb-2 pt-2.5 md:px-3.5 md:pb-3 md:pt-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8]">{c.label}</p>
            <p className={`mt-1 text-base font-bold md:mt-1.5 md:text-lg tabular-nums leading-tight tracking-tight ${c.val}`}>{c.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
