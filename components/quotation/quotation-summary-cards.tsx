import type { QuotationSummary } from "@/types/quotation";

type QuotationSummaryCardsProps = {
  summary: QuotationSummary;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function QuotationSummaryCards({ summary }: QuotationSummaryCardsProps) {
  const cards = [
    { label: "Total Quotation", value: String(summary.total_quotations), stripe: "bg-slate-300", val: "text-slate-900" },
    { label: "Draft", value: String(summary.draft_count), stripe: "bg-slate-300", val: "text-slate-900" },
    { label: "Sent", value: String(summary.sent_count), stripe: "bg-indigo-500", val: "text-slate-900" },
    { label: "Accepted", value: String(summary.accepted_count), stripe: "bg-emerald-500", val: "text-emerald-700" },
    { label: "Rejected", value: String(summary.rejected_count), stripe: "bg-red-500", val: "text-red-700" },
    { label: "Total Value", value: formatCurrency(summary.total_value), stripe: "bg-indigo-500", val: "text-slate-900" },
    { label: "Accepted Value", value: formatCurrency(summary.accepted_value), stripe: "bg-emerald-500", val: "text-emerald-700" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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
