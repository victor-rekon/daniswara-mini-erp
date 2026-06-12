import type { QuotationSummary } from "@/types/quotation";

function fmtCur(v: number) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v); }

const CARD = "relative cursor-pointer overflow-hidden rounded-[14px] border border-[#e6e8ef] bg-white shadow-[0_1px_2px_rgba(26,36,86,0.04)] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]";

export function QuotationSummaryCards({ summary }: { summary: QuotationSummary }) {
  const cards = [
    { label: "Total Quotation", value: String(summary.total_quotations), stripe: "bg-[#2f4a9e]", val: "text-[#233575]" },
    { label: "Draft",           value: String(summary.draft_count),      stripe: "bg-[#9aa3c0]", val: "text-[#1a2456]" },
    { label: "Sent",            value: String(summary.sent_count),       stripe: "bg-[#2f4a9e]", val: "text-[#233575]" },
    { label: "Accepted",        value: String(summary.accepted_count),   stripe: "bg-[#15803d]", val: "text-[#15803d]" },
    { label: "Rejected",        value: String(summary.rejected_count),   stripe: "bg-[#b91c1c]", val: "text-[#b91c1c]" },
    { label: "Total Value",     value: fmtCur(summary.total_value),      stripe: "bg-gradient-to-r from-[#c99a2e] to-[#d9b25c]", val: "text-[#b8860b]" },
    { label: "Accepted Value",  value: fmtCur(summary.accepted_value),   stripe: "bg-[#15803d]", val: "text-[#15803d]" },
  ];
  return (
    <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4 md:gap-3">
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
