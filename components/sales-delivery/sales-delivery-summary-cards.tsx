import type { SalesDeliverySummary } from "@/types/sales-delivery";

type SalesDeliverySummaryCardsProps = {
  summary: SalesDeliverySummary;
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

export function SalesDeliverySummaryCards({ summary }: SalesDeliverySummaryCardsProps) {
  const cards = [
    { label: "Sales Records", value: String(summary.total_sales_records) },
    { label: "Total Qty", value: formatNumber(summary.total_quantity) },
    { label: "Delivered Qty", value: formatNumber(summary.total_delivered) },
    { label: "Pending Qty", value: formatNumber(summary.total_pending) },
    { label: "Pending Delivery", value: String(summary.pending_delivery_count) },
    { label: "Delivered Records", value: String(summary.delivered_count) },
    { label: "Sales Value", value: formatCurrency(summary.total_sales_value) },
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
