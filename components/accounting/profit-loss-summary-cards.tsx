import type { ProfitLossSummary } from "@/types/accounting";

function fmtCur(v: number) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v); }

export function ProfitLossSummaryCards({ summary }: { summary: ProfitLossSummary }) {
  const cards = [
    { label: "Revenue",           value: fmtCur(summary.revenue),           stripe: "bg-[#3b82f6]",   val: "text-[#1e40af]" },
    { label: "COGS / HPP",        value: fmtCur(summary.cogs),              stripe: "bg-[#f59e0b]",   val: "text-[#b45309]" },
    { label: "Gross Profit",      value: fmtCur(summary.gross_profit),      stripe: "bg-[#22c55e]",   val: "text-[#15803d]" },
    { label: "Operating Expense", value: fmtCur(summary.operating_expense), stripe: "bg-[#f59e0b]",   val: "text-[#b45309]" },
    {
      label: "Net Profit",
      value: fmtCur(summary.net_profit),
      stripe: summary.net_profit >= 0 ? "bg-[#22c55e]" : "bg-[#ef4444]",
      val:    summary.net_profit >= 0 ? "text-[#15803d]" : "text-[#dc2626]",
    },
  ];
  return (
    <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/[0.06] md:p-5">
      <h3 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
        Management P&amp;L
      </h3>
      <p className="mb-4 text-xs text-slate-400">
        Simple management report only. Must be validated by accounting team.
      </p>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-5 md:gap-3">
        {cards.map((c) => (
          <div key={c.label} className="relative overflow-hidden rounded-xl bg-slate-50 ring-1 ring-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className={`absolute inset-y-0 left-0 w-1.5 ${c.stripe}`} />
            <div className="py-3.5 pl-5 pr-3.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{c.label}</p>
              <p className={`mt-1.5 text-base font-bold tabular-nums leading-tight ${c.val}`}>{c.value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
