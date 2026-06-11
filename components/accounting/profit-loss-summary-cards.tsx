import type { ProfitLossSummary } from "@/types/accounting";

type ProfitLossSummaryCardsProps = {
  summary: ProfitLossSummary;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ProfitLossSummaryCards({ summary }: ProfitLossSummaryCardsProps) {
  const cards = [
    { label: "Revenue", value: formatCurrency(summary.revenue) },
    { label: "COGS / HPP", value: formatCurrency(summary.cogs) },
    { label: "Gross Profit", value: formatCurrency(summary.gross_profit) },
    { label: "Operating Expense", value: formatCurrency(summary.operating_expense) },
    { label: "Net Profit", value: formatCurrency(summary.net_profit) },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-lg font-semibold">Management P&amp;L</h3>
        <p className="mt-1 text-sm text-slate-500">
          Simple management report only. Formula must be validated by client/accounting team.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">{card.label}</p>
            <p className="mt-2 text-xl font-bold text-slate-950">{card.value}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
