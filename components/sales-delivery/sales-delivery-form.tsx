import { createSalesDelivery } from "@/app/sales-delivery/actions";
import type { Branch, Customer, Product } from "@/types/master-data";
import type { QuotationView } from "@/types/quotation";

type SalesDeliveryFormProps = {
  branches: Branch[];
  customers: Customer[];
  products: Product[];
  quotations: QuotationView[];
};

export function SalesDeliveryForm({ branches, customers, products, quotations }: SalesDeliveryFormProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-base font-semibold">Create Customer PO / SO + Surat Jalan</h3>
        <p className="mt-1 text-sm text-slate-500">
          This creates a sales record and delivery record together. Sales reporting follows surat jalan / delivery.
        </p>
      </div>

      <form action={createSalesDelivery} className="grid grid-cols-2 gap-2.5 md:grid-cols-2 xl:grid-cols-4">
        <input name="sales_date" type="date" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm" required />
        <input name="delivery_date" type="date" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm" required />

        <select name="branch_id" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm">
          <option value="">No branch</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.branch_name}
            </option>
          ))}
        </select>

        <select name="customer_id" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm" required>
          <option value="">Select customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.customer_name}
            </option>
          ))}
        </select>

        <select name="quotation_id" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm">
          <option value="">No quotation link</option>
          {quotations.map((quotation) => (
            <option key={quotation.id} value={quotation.id}>
              {quotation.quotation_number} — {quotation.customer_name}
            </option>
          ))}
        </select>

        <input name="so_number" placeholder="SO number" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm" />
        <input name="customer_po_number" placeholder="Customer PO number" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm" />
        <input
          name="surat_jalan_number"
          placeholder="Surat jalan number"
          className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm"
          required
        />

        <select name="product_id" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm" required>
          <option value="">Select product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.product_name}
            </option>
          ))}
        </select>

        <input
          name="quantity"
          type="number"
          min="0.01"
          step="0.01"
          placeholder="Ordered qty"
          className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm"
          required
        />

        <input
          name="quantity_delivered"
          type="number"
          min="0"
          step="0.01"
          placeholder="Delivered qty"
          className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm"
        />

        <input
          name="selling_price"
          type="number"
          min="0"
          step="0.01"
          placeholder="Selling price"
          className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm"
          required
        />

        <input name="receiver" placeholder="Receiver" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm" />
        <input name="notes" placeholder="Notes" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm col-span-2 xl:col-span-2" />

        <button type="submit" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white col-span-2">
          Save Sales & Delivery
        </button>
      </form>

      {customers.length === 0 || products.length === 0 ? (
        <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
          Add customers and products in Master Data before serious sales/delivery input.
        </p>
      ) : null}
    </section>
  );
}
