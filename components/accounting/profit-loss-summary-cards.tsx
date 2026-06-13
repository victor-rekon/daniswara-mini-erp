import type { ProfitLossSummary } from "@/types/accounting";

function fmtCur(v: number) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v); }

export function ProfitLossSummaryCards({ summary }: { summary: ProfitLossSummary }) {
  const cards = [
    { label: "Revenue",           value: fmtCur(summary.revenue),           stripe: "bg-gradient-to-r from-[#c99a2e] to-[#d9b25c]", val: "text-[#e8c878]" },
    { label: "COGS / HPP",        value: fmtCur(summary.cogs),              stripe: "bg-[#d97706]", val: "text-[#fbbf24]" },
    { label: "Gross Profit",      value: fmtCur(summary.gross_profit),      stripe: "bg-[#34d399]", val: "text-[#34d399]" },
    { label: "Operating Expense", value: fmtCur(summary.operating_expense), stripe: "bg-[#d97706]", val: "text-[#fbbf24]" },
    {
      label: "Net Profit",
      value: fmtCur(summary.net_profit),
      stripe: summary.net_profit >= 0 ? "bg-[#34d399]" : "bg-[#f87171]",
      val:    summary.net_profit >= 0 ? "text-[#34d399]" : "text-[#f87171]",
    },
  ];
  return (
    <section className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#12151f] p-4 shadow-card md:p-5">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#e2e8f0]">
        Management <span className="text-[#e8c878]">P&amp;L</span>
      </h3>
      <p className="mb-4 mt-1 text-[10px] text-[#64748b]">
        Simple management report only. Must be validated by accounting team.
      </p>
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-5 md:gap-3">
        {cards.map((c) => (
          <div key={c.label} className="relative cursor-pointer overflow-hidden rounded-[14px] border border-[rgba(255,255,255,0.08)] bg-[#161a26] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]">
            <div className={`absolute inset-x-0 top-0 h-[2.5px] ${c.stripe}`} />
            <div className="px-3.5 pb-3 pt-3.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8]">{c.label}</p>
              <p className={`mt-1.5 text-base font-bold tabular-nums leading-tight tracking-tight ${c.val}`}>{c.value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
