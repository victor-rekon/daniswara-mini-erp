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
    { label: "Total Quotation", value: String(summary.total_quotations) },
    { label: "Draft", value: String(summary.draft_count) },
    { label: "Sent", value: String(summary.sent_count) },
    { label: "Accepted", value: String(summary.accepted_count) },
    { label: "Rejected", value: String(summary.rejected_count) },
    { label: "Total Value", value: formatCurrency(summary.total_value) },
    { label: "Accepted Value", value: formatCurrency(summary.accepted_value) },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">{card.label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-950">{card.value}</p>
        </div>
      ))}
    </div>
  );
}
