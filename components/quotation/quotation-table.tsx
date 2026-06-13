import type { QuotationView } from "@/types/quotation";

type QuotationTableProps = {
  quotations: QuotationView[];
};

const statusClassName: Record<QuotationView["status"], string> = {
  draft: "bg-slate-100 text-slate-700",
  sent: "bg-blue-50 text-blue-700",
  accepted: "bg-emerald-50 text-emerald-700",
  rejected: "bg-rose-50 text-rose-700",
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

export function QuotationTable({ quotations }: QuotationTableProps) {
  if (quotations.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-base font-semibold">Quotation List</h3>
        <p className="mt-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">
          No quotations yet.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-base font-semibold">Quotation List</h3>
        <p className="mt-1 text-sm text-slate-500">
          Simple quotation tracker. No approval, versioning, e-signature, or PDF engine in this module yet.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[885px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-3 py-2 font-medium">Number</th>
              <th className="px-3 py-2 font-medium">Date</th>
              <th className="px-3 py-2 font-medium">Customer</th>
              <th className="px-3 py-2 font-medium">Branch</th>
              <th className="px-3 py-2 font-medium">Product Summary</th>
              <th className="px-3 py-2 font-medium">Items</th>
              <th className="px-3 py-2 font-medium">Qty</th>
              <th className="px-3 py-2 font-medium">Total</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {quotations.map((quotation) => (
              <tr key={quotation.id}>
                <td className="px-3 py-2 font-semibold text-slate-800">{quotation.quotation_number}</td>
                <td className="px-3 py-2 text-slate-700">{quotation.quotation_date}</td>
                <td className="px-3 py-2 text-slate-700">{quotation.customer_name}</td>
                <td className="px-3 py-2 text-slate-700">{quotation.branch_name}</td>
                <td className="px-3 py-2 text-slate-700">{quotation.product_summary}</td>
                <td className="px-3 py-2 text-slate-700">{quotation.item_count}</td>
                <td className="px-3 py-2 text-slate-700">{formatNumber(quotation.total_quantity)}</td>
                <td className="px-3 py-2 text-slate-700">{formatCurrency(quotation.quotation_total)}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassName[quotation.status]}`}>
                    {quotation.status}
                  </span>
                </td>
                <td className="px-3 py-2 text-slate-700">{quotation.notes ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
