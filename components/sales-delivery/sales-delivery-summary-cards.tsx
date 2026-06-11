import type { SalesDeliverySummary } from "@/types/sales-delivery";

function fmt(v: number) { return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 2 }).format(v); }
function fmtCur(v: number) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v); }

export function SalesDeliverySummaryCards({ summary }: { summary: SalesDeliverySummary }) {
  const cards = [
    { label: "Sales Records",     value: String(summary.total_sales_records), stripe: "bg-slate-300",    val: "text-slate-900" },
    { label: "Total Qty",         value: fmt(summary.total_quantity),          stripe: "bg-slate-300",    val: "text-slate-900" },
    { label: "Delivered Qty",     value: fmt(summary.total_delivered),         stripe: "bg-[#22c55e]",    val: "text-[#15803d]" },
    { label: "Pending Qty",       value: fmt(summary.total_pending),           stripe: "bg-[#f59e0b]",    val: "text-[#b45309]" },
    { label: "Pending Delivery",  value: String(summary.pending_delivery_count), stripe: "bg-[#f59e0b]", val: "text-[#b45309]" },
    { label: "Delivered Records", value: String(summary.delivered_count),      stripe: "bg-[#22c55e]",    val: "text-[#15803d]" },
    { label: "Sales Value",       value: fmtCur(summary.total_sales_value),    stripe: "bg-[#3b82f6]",    val: "text-[#1e40af]" },
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
