import type { ProductionSummary } from "@/types/production";

type ProductionSummaryCardsProps = {
  summary: ProductionSummary;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(value);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ProductionSummaryCards({ summary }: ProductionSummaryCardsProps) {
  const cards = [
    { label: "Total Produksi", value: formatNumber(summary.total_produced), stripe: "bg-slate-300", val: "text-slate-900" },
    { label: "Total Losses", value: formatNumber(summary.total_losses), stripe: "bg-amber-400", val: "text-amber-700" },
    { label: "Net Quantity", value: formatNumber(summary.total_net_quantity), stripe: "bg-indigo-500", val: "text-slate-900" },
    { label: "Losses %", value: `${formatNumber(summary.losses_percentage)}%`, stripe: "bg-amber-400", val: "text-amber-700" },
    { label: "Total HPP Base Cost", value: formatCurrency(summary.total_hpp_base_cost), stripe: "bg-slate-300", val: "text-slate-900" },
    { label: "Avg HPP / Unit", value: formatCurrency(summary.average_hpp_per_unit), stripe: "bg-slate-300", val: "text-slate-900" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
        >
          <div className={`absolute inset-y-0 left-0 w-1 ${card.stripe}`} />
          <div className="py-5 pl-5 pr-5">
            <p className="text-xs font-medium text-slate-500">{card.label}</p>
            <p className={`mt-2 text-2xl font-bold tabular-nums ${card.val}`}>{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
