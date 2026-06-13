import type { SalesDeliverySummary } from "@/types/sales-delivery";

function fmt(v: number) { return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(v); }
function fmtCur(v: number) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v); }

const CARD = "relative cursor-pointer overflow-hidden rounded-[14px] border border-[rgba(255,255,255,0.08)] bg-[#12151f] shadow-card transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]";

export function SalesDeliverySummaryCards({ summary }: { summary: SalesDeliverySummary }) {
  const cards = [
    { label: "Sales Records",     value: String(summary.total_sales_records),    stripe: "bg-[#2f4a9e]", val: "text-[#e2e8f0]" },
    { label: "Total Qty",         value: fmt(summary.total_quantity),            stripe: "bg-[#2f4a9e]", val: "text-[#e2e8f0]" },
    { label: "Delivered Qty",     value: fmt(summary.total_delivered),           stripe: "bg-[#34d399]", val: "text-[#34d399]" },
    { label: "Pending Qty",       value: fmt(summary.total_pending),             stripe: "bg-[#d97706]", val: "text-[#fbbf24]" },
    { label: "Pending Delivery",  value: String(summary.pending_delivery_count), stripe: "bg-[#d97706]", val: "text-[#fbbf24]" },
    { label: "Delivered Records", value: String(summary.delivered_count),        stripe: "bg-[#34d399]", val: "text-[#34d399]" },
    { label: "Sales Value",       value: fmtCur(summary.total_sales_value),      stripe: "bg-gradient-to-r from-[#c99a2e] to-[#d9b25c]", val: "text-[#e8c878]" },
  ];
  return (
    <div className="grid grid-cols-2 gap-2 md:gap-3 md:grid-cols-4 md:gap-3 lg:grid-cols-7">
      {cards.map((c) => (
        <div key={c.label} className={CARD}>
          <div className={`absolute inset-x-0 top-0 h-[2.5px] ${c.stripe}`} />
          <div className="px-2.5 pb-2 pt-2.5 md:px-3.5 md:pb-3 md:pt-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8]">{c.label}</p>
            <p className={`mt-1 text-base font-bold md:mt-1.5 md:text-lg tabular-nums leading-tight tracking-tight ${c.val}`}>{c.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
