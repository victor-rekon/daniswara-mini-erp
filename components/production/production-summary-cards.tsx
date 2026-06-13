import type { ProductionSummary } from "@/types/production";

function fmt(v: number) { return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(v); }
function fmtCur(v: number) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v); }

const CARD = "relative cursor-pointer overflow-hidden rounded-[14px] border border-[#e6e8ef] bg-white shadow-[0_1px_2px_rgba(26,36,86,0.04)] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]";

export function ProductionSummaryCards({ summary }: { summary: ProductionSummary }) {
  const cards = [
    { label: "Total Produksi",      value: fmt(summary.total_produced),          stripe: "bg-[#2f4a9e]", val: "text-[#233575]" },
    { label: "Total Losses",        value: fmt(summary.total_losses),            stripe: "bg-[#d97706]", val: "text-[#b45309]" },
    { label: "Net Quantity",        value: fmt(summary.total_net_quantity),      stripe: "bg-[#2f4a9e]", val: "text-[#233575]" },
    { label: "Losses %",            value: `${fmt(summary.losses_percentage)}%`, stripe: "bg-[#d97706]", val: "text-[#b45309]" },
    { label: "Total HPP Base Cost", value: fmtCur(summary.total_hpp_base_cost),  stripe: "bg-gradient-to-r from-[#c99a2e] to-[#d9b25c]", val: "text-[#b8860b]" },
    { label: "Avg HPP / Unit",      value: fmtCur(summary.average_hpp_per_unit), stripe: "bg-gradient-to-r from-[#c99a2e] to-[#d9b25c]", val: "text-[#b8860b]" },
  ];
  return (
    <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3 md:gap-3 lg:grid-cols-6">
      {cards.map((c) => (
        <div key={c.label} className={CARD}>
          <div className={`absolute inset-x-0 top-0 h-[2.5px] ${c.stripe}`} />
          <div className="px-3.5 pb-3 pt-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7a829b]">{c.label}</p>
            <p className={`mt-1.5 text-lg font-bold tabular-nums leading-tight tracking-tight ${c.val}`}>{c.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
