import type { SalesDeliverySummary } from "@/types/sales-delivery";

type SalesDeliverySummaryCardsProps = {
  summary: SalesDeliverySummary;
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(value);
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
    { label: "Sales Records", value: String(summary.total_sales_records), stripe: "bg-slate-300", val: "text-slate-900" },
    { label: "Total Qty", value: formatNumber(summary.total_quantity), stripe: "bg-slate-300", val: "text-slate-900" },
    { label: "Delivered Qty", value: formatNumber(summary.total_delivered), stripe: "bg-emerald-500", val: "text-emerald-700" },
    { label: "Pending Qty", value: formatNumber(summary.total_pending), stripe: "bg-amber-400", val: "text-amber-700" },
    { label: "Pending Delivery", value: String(summary.pending_delivery_count), stripe: "bg-amber-400", val: "text-amber-700" },
    { label: "Delivered Records", value: String(summary.delivered_count), stripe: "bg-emerald-500", val: "text-emerald-700" },
    { label: "Sales Value", value: formatCurrency(summary.total_sales_value), stripe: "bg-indigo-500", val: "text-slate-900" },
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
