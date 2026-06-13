import { CurrencyInput } from "@/components/forms/currency-input";
import { createPayment } from "@/app/invoice-payment/actions";
import type { InvoicePaymentView } from "@/types/invoice-payment";

type PaymentFormProps = {
  invoices: InvoicePaymentView[];
};

const FIELD = "rounded-xl border border-white/[0.08] bg-white/[0.04] px-2.5 py-2 text-sm text-slate-100 placeholder:text-slate-400";
const LABEL = "mb-1 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#94a3b8]";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function PaymentForm({ invoices }: PaymentFormProps) {
  const today = new Date().toISOString().slice(0, 10);
  const openInvoices = invoices.filter((invoice) => invoice.actual_outstanding_amount > 0);

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#12151f] p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-base font-semibold">Register Payment</h3>
        <p className="mt-1 text-sm text-slate-400">Manual payment input only. No bank mutation or auto-reconciliation in Phase 1.</p>
      </div>

      <form action={createPayment} className="grid grid-cols-2 gap-2.5 md:grid-cols-2 xl:grid-cols-4">
        <select name="invoice_id" className={FIELD} required>
          <option value="">Select invoice</option>
          {openInvoices.map((invoice) => (
            <option key={invoice.id} value={invoice.id}>
              {invoice.invoice_number} — {invoice.customer_name} — {formatCurrency(invoice.actual_outstanding_amount)} outstanding
            </option>
          ))}
        </select>

        <label>
          <span className={LABEL}>Payment date</span>
          <input name="payment_date" type="date" defaultValue={today} className={FIELD} required />
        </label>
        <CurrencyInput name="amount" placeholder="Rp 0" className={FIELD} required />
        <input name="notes" placeholder="Payment notes" className={FIELD} />

        <button type="submit" className="rounded-xl bg-gradient-to-br from-[#e8c878] via-[#d9b25c] to-[#c99a2e] px-4 py-2 text-sm font-bold text-[#1a2456] shadow-[0_2px_10px_-2px_rgba(217,178,92,0.45)] col-span-2 xl:col-span-1 xl:col-start-4">
          Save Payment
        </button>
      </form>

      {openInvoices.length === 0 ? (
        <p className="mt-4 rounded-xl bg-white/[0.04] p-4 text-sm text-slate-400">No open invoices available for payment.</p>
      ) : null}
    </section>
  );
}
