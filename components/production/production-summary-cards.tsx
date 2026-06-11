import type { ProductionSummary } from "@/types/production";

type ProductionSummaryCardsProps = {
  summary: ProductionSummary;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 2,
  }).format(value);
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
    {
      label: "Total Produksi",
      value: formatNumber(summary.total_produced),
    },
    {
      label: "Total Losses",
      value: formatNumber(summary.total_losses),
    },
    {
      label: "Net Quantity",
      value: formatNumber(summary.total_net_quantity),
    },
    {
      label: "Losses %",
      value: `${formatNumber(summary.losses_percentage)}%`,
    },
    {
      label: "Total HPP Base Cost",
      value: formatCurrency(summary.total_hpp_base_cost),
    },
    {
      label: "Avg HPP / Unit",
      value: formatCurrency(summary.average_hpp_per_unit),
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => (
        <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">{card.label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-950">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
