import { createPayment } from "@/app/invoice-payment/actions";
import type { InvoicePaymentView } from "@/types/invoice-payment";

type PaymentFormProps = {
  invoices: InvoicePaymentView[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function PaymentForm({ invoices }: PaymentFormProps) {
  const openInvoices = invoices.filter((invoice) => invoice.actual_outstanding_amount > 0);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-base font-semibold">Register Payment</h3>
        <p className="mt-1 text-sm text-slate-500">Manual payment input only. No bank mutation or auto-reconciliation in Phase 1.</p>
      </div>

      <form action={createPayment} className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <select name="invoice_id" className="rounded-xl border border-slate-200 px-3 py-2" required>
          <option value="">Select invoice</option>
          {openInvoices.map((invoice) => (
            <option key={invoice.id} value={invoice.id}>
              {invoice.invoice_number} — {invoice.customer_name} — {formatCurrency(invoice.actual_outstanding_amount)} outstanding
            </option>
          ))}
        </select>

        <input name="payment_date" type="date" className="rounded-xl border border-slate-200 px-3 py-2" required />
        <input name="amount" type="number" min="0.01" step="0.01" placeholder="Payment amount" className="rounded-xl border border-slate-200 px-3 py-2" required />
        <input name="notes" placeholder="Payment notes" className="rounded-xl border border-slate-200 px-3 py-2" />

        <button type="submit" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white xl:col-start-4">
          Save Payment
        </button>
      </form>

      {openInvoices.length === 0 ? (
        <p className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No open invoices available for payment.</p>
      ) : null}
    </section>
  );
}
