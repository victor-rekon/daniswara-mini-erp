import type { ProfitLossSummary } from "@/types/accounting";

function fmtCur(v: number) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v); }

export function ProfitLossSummaryCards({ summary }: { summary: ProfitLossSummary }) {
  const cards = [
    { label: "Revenue",           value: fmtCur(summary.revenue),           stripe: "bg-gradient-to-r from-[#c99a2e] to-[#d9b25c]", val: "text-[#b8860b]" },
    { label: "COGS / HPP",        value: fmtCur(summary.cogs),              stripe: "bg-[#d97706]", val: "text-[#b45309]" },
    { label: "Gross Profit",      value: fmtCur(summary.gross_profit),      stripe: "bg-[#15803d]", val: "text-[#15803d]" },
    { label: "Operating Expense", value: fmtCur(summary.operating_expense), stripe: "bg-[#d97706]", val: "text-[#b45309]" },
    {
      label: "Net Profit",
      value: fmtCur(summary.net_profit),
      stripe: summary.net_profit >= 0 ? "bg-[#15803d]" : "bg-[#b91c1c]",
      val:    summary.net_profit >= 0 ? "text-[#15803d]" : "text-[#b91c1c]",
    },
  ];
  return (
    <section className="rounded-2xl border border-[#e6e8ef] bg-white p-4 shadow-[0_1px_3px_rgba(26,36,86,0.05)] md:p-5">
      <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#233575]">
        Management <span className="text-[#b8860b]">P&amp;L</span>
      </h3>
      <p className="mb-4 mt-1 text-[10px] text-[#a4aabe]">
        Simple management report only. Must be validated by accounting team.
      </p>
      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-5 md:gap-3">
        {cards.map((c) => (
          <div key={c.label} className="relative cursor-pointer overflow-hidden rounded-[14px] border border-[#e6e8ef] bg-[#fafbfd] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]">
            <div className={`absolute inset-x-0 top-0 h-[2.5px] ${c.stripe}`} />
            <div className="px-3.5 pb-3 pt-3.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7a829b]">{c.label}</p>
              <p className={`mt-1.5 text-base font-bold tabular-nums leading-tight tracking-tight ${c.val}`}>{c.value}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
