import { createQuotation } from "@/app/quotation/actions";
import type { Branch, Customer, Product } from "@/types/master-data";

type QuotationFormProps = {
  branches: Branch[];
  customers: Customer[];
  products: Product[];
};

export function QuotationForm({ branches, customers, products }: QuotationFormProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-base font-semibold">Create Quotation</h3>
        <p className="mt-1 text-sm text-slate-500">
          Simple quotation with one item line for prototype. Multi-item editor can be added after core flow is stable.
        </p>
      </div>

      <form action={createQuotation} className="grid grid-cols-2 gap-2.5 md:grid-cols-2 xl:grid-cols-4">
        <input
          name="quotation_number"
          placeholder="Quotation number"
          className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm"
          required
        />

        <input
          name="quotation_date"
          type="date"
          className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm"
          required
        />

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
          placeholder="Quantity"
          className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm"
          required
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

        <select name="status" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm" defaultValue="draft">
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>

        <input
          name="item_notes"
          placeholder="Item notes"
          className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm col-span-2 xl:col-span-2"
        />

        <input
          name="notes"
          placeholder="Quotation notes"
          className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm"
        />

        <button
          type="submit"
          className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white col-span-2"
        >
          Save Quotation
        </button>
      </form>

      {customers.length === 0 || products.length === 0 ? (
        <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
          Add customers and products in Master Data before serious quotation input.
        </p>
      ) : null}
    </section>
  );
}
