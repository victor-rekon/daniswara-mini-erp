import type { InvoicePaymentSummary } from "@/types/invoice-payment";

function fmtCur(v: number) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v); }

const CARD = "relative min-w-0 cursor-pointer overflow-hidden rounded-[14px] border border-[rgba(255,255,255,0.08)] bg-[#12151f] shadow-card transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]";
const VALUE = "mt-1 whitespace-normal break-words text-sm font-bold tabular-nums leading-tight tracking-tight [overflow-wrap:anywhere] md:mt-1.5 md:text-base xl:text-lg";

export function InvoicePaymentSummaryCards({ summary }: { summary: InvoicePaymentSummary }) {
  const cards = [
    { label: "Invoices",         value: String(summary.invoice_count),          stripe: "bg-[#2f4a9e]", val: "text-[#e2e8f0]" },
    { label: "Invoice Value",    value: fmtCur(summary.total_invoice_value),    stripe: "bg-gradient-to-r from-[#c99a2e] to-[#d9b25c]", val: "text-[#e8c878]" },
    { label: "Payment Received", value: fmtCur(summary.total_payment_received), stripe: "bg-[#34d399]", val: "text-[#34d399]" },
    { label: "Outstanding",      value: fmtCur(summary.total_outstanding),      stripe: "bg-[#f87171]", val: "text-[#f87171]" },
    { label: "Unpaid",           value: String(summary.unpaid_count),           stripe: "bg-[#d97706]", val: "text-[#fbbf24]" },
    { label: "Overdue",          value: String(summary.overdue_count),          stripe: "bg-[#f87171]", val: "text-[#f87171]" },
    { label: "Paid",             value: String(summary.paid_count),             stripe: "bg-[#34d399]", val: "text-[#34d399]" },
  ];
  return (
    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 xl:grid-cols-7">
      {cards.map((c) => (
        <div key={c.label} className={CARD}>
          <div className={`absolute inset-x-0 top-0 h-[2.5px] ${c.stripe}`} />
          <div className="min-w-0 px-2.5 pb-2 pt-2.5 md:px-3.5 md:pb-3 md:pt-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94a3b8]">{c.label}</p>
            <p className={`${VALUE} ${c.val}`}>{c.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
