import { createInvoice } from "@/app/invoice-payment/actions";
import type { Branch, Customer } from "@/types/master-data";
import type { DeliveryRecord } from "@/types/sales-delivery";

type InvoiceFormProps = {
  branches: Branch[];
  customers: Customer[];
  deliveries: DeliveryRecord[];
};

export function InvoiceForm({ branches, customers, deliveries }: InvoiceFormProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-base font-semibold">Create Invoice</h3>
        <p className="mt-1 text-sm text-slate-500">Create invoice linked to surat jalan / delivery.</p>
      </div>

      <form action={createInvoice} className="grid grid-cols-2 gap-2.5 md:grid-cols-2 xl:grid-cols-4">
        <input name="invoice_number" placeholder="Invoice number" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm" required />
        <input name="invoice_date" type="date" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm" required />
        <input name="due_date" type="date" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm" />

        <select name="branch_id" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm">
          <option value="">No branch</option>
          {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.branch_name}</option>)}
        </select>

        <select name="customer_id" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm" required>
          <option value="">Select customer</option>
          {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.customer_name}</option>)}
        </select>

        <select name="delivery_record_id" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm">
          <option value="">No surat jalan link</option>
          {deliveries.map((delivery) => <option key={delivery.id} value={delivery.id}>{delivery.surat_jalan_number}</option>)}
        </select>

        <input name="invoice_value" type="number" min="0.01" step="0.01" placeholder="Invoice value" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm" required />

        <select name="payment_status" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm" defaultValue="sudah_ditagih">
          <option value="belum_ditagih">Belum ditagih</option>
          <option value="sudah_ditagih">Sudah ditagih</option>
          <option value="sebagian_dibayar">Sebagian dibayar</option>
          <option value="lunas">Lunas</option>
          <option value="overdue">Overdue</option>
        </select>

        <input name="notes" placeholder="Notes" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm col-span-2 xl:col-span-3" />
        <button type="submit" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white col-span-2">Save Invoice</button>
      </form>
    </section>
  );
}
