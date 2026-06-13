import { CurrencyInput } from "@/components/forms/currency-input";
import { createSalesDelivery } from "@/app/sales-delivery/actions";
import type { Branch, Customer, Product } from "@/types/master-data";
import type { QuotationView } from "@/types/quotation";

type SalesDeliveryFormProps = {
  branches: Branch[];
  customers: Customer[];
  products: Product[];
  quotations: QuotationView[];
};

const FIELD = "rounded-xl border border-white/[0.08] bg-white/[0.04] px-2.5 py-2 text-sm text-slate-100 placeholder:text-slate-400";
const LABEL = "mb-1 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#94a3b8]";

export function SalesDeliveryForm({ branches, customers, products, quotations }: SalesDeliveryFormProps) {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#12151f] p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-base font-semibold">Create Customer PO / SO + Surat Jalan</h3>
        <p className="mt-1 text-sm text-slate-400">
          This creates a sales record and delivery record together. Order date is for SO/PO. Delivery date is for surat jalan.
        </p>
      </div>

      <form action={createSalesDelivery} className="grid grid-cols-2 gap-2.5 md:grid-cols-2 xl:grid-cols-4">
        <label>
          <span className={LABEL}>Order date</span>
          <input name="sales_date" type="date" defaultValue={today} className={FIELD} required />
        </label>
        <label>
          <span className={LABEL}>Delivery date</span>
          <input name="delivery_date" type="date" defaultValue={today} className={FIELD} required />
        </label>

        <select name="branch_id" className={FIELD}>
          <option value="">No branch</option>
          {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.branch_name}</option>)}
        </select>

        <select name="customer_id" className={FIELD} required>
          <option value="">Select customer</option>
          {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.customer_name}</option>)}
        </select>

        <select name="quotation_id" className={FIELD}>
          <option value="">No quotation link</option>
          {quotations.map((quotation) => <option key={quotation.id} value={quotation.id}>{quotation.quotation_number} — {quotation.customer_name}</option>)}
        </select>

        <input name="so_number" placeholder="SO number" className={FIELD} />
        <input name="customer_po_number" placeholder="Customer PO number" className={FIELD} />
        <input name="surat_jalan_number" placeholder="Surat jalan number" className={FIELD} required />

        <select name="product_id" className={FIELD} required>
          <option value="">Select product</option>
          {products.map((product) => <option key={product.id} value={product.id}>{product.product_name}</option>)}
        </select>

        <input name="quantity" type="number" min="0.01" step="0.01" placeholder="Ordered qty" className={FIELD} required />
        <input name="quantity_delivered" type="number" min="0" step="0.01" placeholder="Delivered qty" className={FIELD} />
        <CurrencyInput name="selling_price" placeholder="Rp 0" className={FIELD} required />

        <input name="receiver" placeholder="Receiver" className={FIELD} />
        <input name="notes" placeholder="Notes" className={`${FIELD} col-span-2 xl:col-span-2`} />

        <button type="submit" className="rounded-xl bg-gradient-to-br from-[#e8c878] via-[#d9b25c] to-[#c99a2e] px-4 py-2 text-sm font-bold text-[#1a2456] shadow-[0_2px_10px_-2px_rgba(217,178,92,0.45)] col-span-2">
          Save Sales & Delivery
        </button>
      </form>

      {customers.length === 0 || products.length === 0 ? (
        <p className="mt-4 rounded-xl bg-amber-500/10 p-4 text-sm text-amber-200">
          Add customers and products in Master Data before serious sales/delivery input.
        </p>
      ) : null}
    </section>
  );
}
