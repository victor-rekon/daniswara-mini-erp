import type { InvoicePaymentSummary } from "@/types/invoice-payment";

function fmtCur(v: number) { return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v); }

const CARD = "relative cursor-pointer overflow-hidden rounded-[14px] border border-[#e6e8ef] bg-white shadow-[0_1px_2px_rgba(26,36,86,0.04)] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]";

export function InvoicePaymentSummaryCards({ summary }: { summary: InvoicePaymentSummary }) {
  const cards = [
    { label: "Invoices",         value: String(summary.invoice_count),          stripe: "bg-[#2f4a9e]", val: "text-[#233575]" },
    { label: "Invoice Value",    value: fmtCur(summary.total_invoice_value),    stripe: "bg-gradient-to-r from-[#c99a2e] to-[#d9b25c]", val: "text-[#b8860b]" },
    { label: "Payment Received", value: fmtCur(summary.total_payment_received), stripe: "bg-[#15803d]", val: "text-[#15803d]" },
    { label: "Outstanding",      value: fmtCur(summary.total_outstanding),      stripe: "bg-[#b91c1c]", val: "text-[#b91c1c]" },
    { label: "Unpaid",           value: String(summary.unpaid_count),           stripe: "bg-[#d97706]", val: "text-[#b45309]" },
    { label: "Overdue",          value: String(summary.overdue_count),          stripe: "bg-[#b91c1c]", val: "text-[#b91c1c]" },
    { label: "Paid",             value: String(summary.paid_count),             stripe: "bg-[#15803d]", val: "text-[#15803d]" },
  ];
  return (
    <div className="grid grid-cols-2 gap-2 md:gap-3 md:grid-cols-4 md:gap-3 lg:grid-cols-7">
      {cards.map((c) => (
        <div key={c.label} className={CARD}>
          <div className={`absolute inset-x-0 top-0 h-[2.5px] ${c.stripe}`} />
          <div className="px-2.5 pb-2 pt-2.5 md:px-3.5 md:pb-3 md:pt-3.5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7a829b]">{c.label}</p>
            <p className={`mt-1 text-base font-bold md:mt-1.5 md:text-lg tabular-nums leading-tight tracking-tight ${c.val}`}>{c.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
