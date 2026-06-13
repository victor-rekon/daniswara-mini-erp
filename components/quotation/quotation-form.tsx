import { createQuotation } from "@/app/quotation/actions";
import type { Branch, Customer, Product } from "@/types/master-data";

type QuotationFormProps = {
  branches: Branch[];
  customers: Customer[];
  products: Product[];
};

export function QuotationForm({ branches, customers, products }: QuotationFormProps) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#12151f] p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-base font-semibold">Create Quotation</h3>
        <p className="mt-1 text-sm text-slate-400">
          Simple quotation with one item line for prototype. Multi-item editor can be added after core flow is stable.
        </p>
      </div>

      <form action={createQuotation} className="grid grid-cols-2 gap-2.5 md:grid-cols-2 xl:grid-cols-4">
        <input
          name="quotation_number"
          placeholder="Quotation number"
          className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-2.5 py-2 text-sm text-slate-100 placeholder:text-slate-400"
          required
        />

        <input
          name="quotation_date"
          type="date"
          className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-2.5 py-2 text-sm text-slate-100 placeholder:text-slate-400"
          required
        />

        <select name="branch_id" className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-2.5 py-2 text-sm text-slate-100 placeholder:text-slate-400">
          <option value="">No branch</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.branch_name}
            </option>
          ))}
        </select>

        <select name="customer_id" className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-2.5 py-2 text-sm text-slate-100 placeholder:text-slate-400" required>
          <option value="">Select customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.customer_name}
            </option>
          ))}
        </select>

        <select name="product_id" className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-2.5 py-2 text-sm text-slate-100 placeholder:text-slate-400" required>
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
          className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-2.5 py-2 text-sm text-slate-100 placeholder:text-slate-400"
          required
        />

        <input
          name="selling_price"
          type="number"
          min="0"
          step="0.01"
          placeholder="Selling price"
          className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-2.5 py-2 text-sm text-slate-100 placeholder:text-slate-400"
          required
        />

        <select name="status" className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-2.5 py-2 text-sm text-slate-100 placeholder:text-slate-400" defaultValue="draft">
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>

        <input
          name="item_notes"
          placeholder="Item notes"
          className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-2.5 py-2 text-sm text-slate-100 placeholder:text-slate-400 col-span-2 xl:col-span-2"
        />

        <input
          name="notes"
          placeholder="Quotation notes"
          className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-2.5 py-2 text-sm text-slate-100 placeholder:text-slate-400"
        />

        <button
          type="submit"
          className="rounded-xl bg-gradient-to-br from-[#e8c878] via-[#d9b25c] to-[#c99a2e] px-4 py-2 text-sm font-bold text-[#1a2456] shadow-[0_2px_10px_-2px_rgba(217,178,92,0.45)] col-span-2"
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
