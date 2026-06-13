import type { Branch, Product } from "@/types/master-data";
import { createProductionRecord } from "@/app/production/actions";

type ProductionFormProps = {
  branches: Branch[];
  products: Product[];
};

export function ProductionForm({ branches, products }: ProductionFormProps) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#12151f] p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-base font-semibold">Input Produksi</h3>
        <p className="mt-1 text-sm text-slate-400">
          Input produksi, losses/susut, dan HPP dasar. Formula accounting tetap harus dikonfirmasi client.
        </p>
      </div>

      <form action={createProductionRecord} className="grid grid-cols-2 gap-2.5 md:grid-cols-2 xl:grid-cols-4">
        <input
          name="production_date"
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

        <select name="product_id" className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-2.5 py-2 text-sm text-slate-100 placeholder:text-slate-400" required>
          <option value="">Select product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.product_name}
            </option>
          ))}
        </select>

        <input
          name="batch_code"
          placeholder="Batch code"
          className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-2.5 py-2 text-sm text-slate-100 placeholder:text-slate-400"
        />

        <input
          name="quantity_produced"
          type="number"
          min="0"
          step="0.01"
          placeholder="Quantity produced"
          className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-2.5 py-2 text-sm text-slate-100 placeholder:text-slate-400"
          required
        />

        <input
          name="unit"
          placeholder="Unit"
          className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-2.5 py-2 text-sm text-slate-100 placeholder:text-slate-400"
          required
        />

        <input
          name="losses_quantity"
          type="number"
          min="0"
          step="0.01"
          placeholder="Losses / susut"
          className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-2.5 py-2 text-sm text-slate-100 placeholder:text-slate-400"
        />

        <input
          name="hpp_base_cost"
          type="number"
          min="0"
          step="0.01"
          placeholder="HPP base cost"
          className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-2.5 py-2 text-sm text-slate-100 placeholder:text-slate-400"
        />

        <input
          name="notes"
          placeholder="Notes"
          className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-2.5 py-2 text-sm text-slate-100 placeholder:text-slate-400 col-span-2 xl:col-span-3"
        />

        <button
          type="submit"
          className="rounded-xl bg-gradient-to-br from-[#e8c878] via-[#d9b25c] to-[#c99a2e] px-4 py-2 text-sm font-bold text-[#1a2456] shadow-[0_2px_10px_-2px_rgba(217,178,92,0.45)] col-span-2"
        >
          Save Production
        </button>
      </form>

      {products.length === 0 ? (
        <p className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
          Add products in Master Data before serious production input.
        </p>
      ) : null}
    </section>
  );
}
