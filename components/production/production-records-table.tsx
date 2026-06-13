import type { ProductionRecordView } from "@/types/production";

type ProductionRecordsTableProps = {
  records: ProductionRecordView[];
};

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 2,
  }).format(value);
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ProductionRecordsTable({ records }: ProductionRecordsTableProps) {
  if (records.length === 0) {
    return (
      <section className="rounded-2xl border border-white/[0.08] bg-[#12151f] p-4 shadow-sm">
        <h3 className="text-base font-semibold">Production Records</h3>
        <p className="mt-3 rounded-xl bg-white/[0.04] p-4 text-sm text-slate-400">
          No production records yet.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#12151f] p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-base font-semibold">Production Records</h3>
        <p className="mt-1 text-sm text-slate-400">
          Latest production records. HPP/unit uses: HPP base cost ÷ net quantity.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
        <table className="w-full min-w-[787px] text-left text-sm">
          <thead className="bg-white/[0.04] text-slate-400">
            <tr>
              <th className="px-3 py-2 font-medium">Date</th>
              <th className="px-3 py-2 font-medium">Branch</th>
              <th className="px-3 py-2 font-medium">Product</th>
              <th className="px-3 py-2 font-medium">Batch</th>
              <th className="px-3 py-2 font-medium">Produced</th>
              <th className="px-3 py-2 font-medium">Losses</th>
              <th className="px-3 py-2 font-medium">Net Qty</th>
              <th className="px-3 py-2 font-medium">Losses %</th>
              <th className="px-3 py-2 font-medium">HPP Base</th>
              <th className="px-3 py-2 font-medium">HPP / Unit</th>
              <th className="px-3 py-2 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {records.map((record) => (
              <tr key={record.id}>
                <td className="px-3 py-2 text-slate-200">{record.production_date}</td>
                <td className="px-3 py-2 text-slate-200">{record.branch_name}</td>
                <td className="px-3 py-2 text-slate-200">{record.product_name}</td>
                <td className="px-3 py-2 text-slate-200">{record.batch_code ?? "-"}</td>
                <td className="px-3 py-2 text-slate-200">
                  {formatNumber(record.quantity_produced)} {record.unit}
                </td>
                <td className="px-3 py-2 text-slate-200">{formatNumber(record.losses_quantity)}</td>
                <td className="px-3 py-2 text-slate-200">{formatNumber(record.net_quantity)}</td>
                <td className="px-3 py-2 text-slate-200">{formatNumber(record.losses_percentage)}%</td>
                <td className="px-3 py-2 text-slate-200">{formatCurrency(record.hpp_base_cost)}</td>
                <td className="px-3 py-2 text-slate-200">{formatCurrency(record.hpp_per_unit)}</td>
                <td className="px-3 py-2 text-slate-200">{record.notes ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
