import type { QuotationSummary } from "@/types/quotation";

function fmtCur(v: number) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v); }

export function QuotationSummaryCards({ summary }: { summary: QuotationSummary }) {
  const cards = [
    { label: "Total Quotation", value: String(summary.total_quotations), stripe: "bg-slate-300",    val: "text-slate-900" },
    { label: "Draft",           value: String(summary.draft_count),       stripe: "bg-slate-300",    val: "text-slate-900" },
    { label: "Sent",            value: String(summary.sent_count),        stripe: "bg-[#3b82f6]",    val: "text-[#1e40af]" },
    { label: "Accepted",        value: String(summary.accepted_count),    stripe: "bg-[#22c55e]",    val: "text-[#15803d]" },
    { label: "Rejected",        value: String(summary.rejected_count),    stripe: "bg-[#ef4444]",    val: "text-[#dc2626]" },
    { label: "Total Value",     value: fmtCur(summary.total_value),       stripe: "bg-[#3b82f6]",    val: "text-[#1e40af]" },
    { label: "Accepted Value",  value: fmtCur(summary.accepted_value),    stripe: "bg-[#22c55e]",    val: "text-[#15803d]" },
  ];
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
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
