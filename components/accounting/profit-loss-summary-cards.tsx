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
    { label: "Revenue", value: formatCurrency(summary.revenue), stripe: "bg-indigo-500", val: "text-slate-900" },
    { label: "COGS / HPP", value: formatCurrency(summary.cogs), stripe: "bg-amber-400", val: "text-amber-700" },
    { label: "Gross Profit", value: formatCurrency(summary.gross_profit), stripe: "bg-emerald-500", val: "text-emerald-700" },
    { label: "Operating Expense", value: formatCurrency(summary.operating_expense), stripe: "bg-amber-400", val: "text-amber-700" },
    {
      label: "Net Profit",
      value: formatCurrency(summary.net_profit),
      stripe: summary.net_profit >= 0 ? "bg-emerald-500" : "bg-red-500",
      val: summary.net_profit >= 0 ? "text-emerald-700" : "text-red-700",
    },
  ];

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-slate-900">
          Management P&amp;L
        </h3>
        <p className="mt-0.5 text-sm text-slate-500">
          Simple management report only. Formula must be validated by client/accounting team.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <div
            key={card.label}
            className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className={`absolute inset-y-0 left-0 w-1 ${card.stripe}`} />
            <div className="py-4 pl-5 pr-4">
              <p className="text-xs font-medium text-slate-500">{card.label}</p>
              <p className={`mt-2 text-xl font-bold tabular-nums ${card.val}`}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
