import type { InvoicePaymentSummary } from "@/types/invoice-payment";

type InvoicePaymentSummaryCardsProps = {
  summary: InvoicePaymentSummary;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function InvoicePaymentSummaryCards({ summary }: InvoicePaymentSummaryCardsProps) {
  const cards = [
    { label: "Invoices", value: String(summary.invoice_count) },
    { label: "Invoice Value", value: formatCurrency(summary.total_invoice_value) },
    { label: "Payment Received", value: formatCurrency(summary.total_payment_received) },
    { label: "Outstanding", value: formatCurrency(summary.total_outstanding) },
    { label: "Unpaid", value: String(summary.unpaid_count) },
    { label: "Overdue", value: String(summary.overdue_count) },
    { label: "Paid", value: String(summary.paid_count) },
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
