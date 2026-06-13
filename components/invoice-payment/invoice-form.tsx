import { CurrencyInput } from "@/components/forms/currency-input";
import { createInvoice } from "@/app/invoice-payment/actions";
import type { Branch, Customer } from "@/types/master-data";
import type { DeliveryRecord } from "@/types/sales-delivery";

type InvoiceFormProps = {
  branches: Branch[];
  customers: Customer[];
  deliveries: DeliveryRecord[];
};

const FIELD = "rounded-xl border border-white/[0.08] bg-white/[0.04] px-2.5 py-2 text-sm text-slate-100 placeholder:text-slate-400";
const LABEL = "mb-1 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#94a3b8]";

export function InvoiceForm({ branches, customers, deliveries }: InvoiceFormProps) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#12151f] p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-base font-semibold">Create Invoice</h3>
        <p className="mt-1 text-sm text-slate-400">Invoice date is the billing date. Due date is optional for overdue tracking.</p>
      </div>

      <form action={createInvoice} className="grid grid-cols-2 gap-2.5 md:grid-cols-2 xl:grid-cols-4">
        <input name="invoice_number" placeholder="Invoice number" className={FIELD} required />
        <label>
          <span className={LABEL}>Invoice date</span>
          <input name="invoice_date" type="date" defaultValue={today} className={FIELD} required />
        </label>
        <label>
          <span className={LABEL}>Due date</span>
          <input name="due_date" type="date" className={FIELD} />
        </label>

        <select name="branch_id" className={FIELD}>
          <option value="">No branch</option>
          {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.branch_name}</option>)}
        </select>

        <select name="customer_id" className={FIELD} required>
          <option value="">Select customer</option>
          {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.customer_name}</option>)}
        </select>

        <select name="delivery_record_id" className={FIELD}>
          <option value="">No surat jalan link</option>
          {deliveries.map((delivery) => <option key={delivery.id} value={delivery.id}>{delivery.surat_jalan_number}</option>)}
        </select>

        <CurrencyInput name="invoice_value" placeholder="Rp 0" className={FIELD} required />

        <select name="payment_status" className={FIELD} defaultValue="sudah_ditagih">
          <option value="belum_ditagih">Belum ditagih</option>
          <option value="sudah_ditagih">Sudah ditagih</option>
          <option value="sebagian_dibayar">Sebagian dibayar</option>
          <option value="lunas">Lunas</option>
          <option value="overdue">Overdue</option>
        </select>

        <input name="notes" placeholder="Notes" className={`${FIELD} col-span-2 xl:col-span-3`} />
        <button type="submit" className="rounded-xl bg-gradient-to-br from-[#e8c878] via-[#d9b25c] to-[#c99a2e] px-4 py-2 text-sm font-bold text-[#1a2456] shadow-[0_2px_10px_-2px_rgba(217,178,92,0.45)] col-span-2">Save Invoice</button>
      </form>
    </section>
  );
}
