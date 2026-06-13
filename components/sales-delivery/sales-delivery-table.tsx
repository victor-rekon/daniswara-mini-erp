import type { SalesDeliveryView } from "@/types/sales-delivery";

type SalesDeliveryTableProps = {
  records: SalesDeliveryView[];
};

const deliveryStatusClassName: Record<SalesDeliveryView["delivery_status"], string> = {
  not_created: "bg-white/[0.04] text-slate-200",
  pending: "bg-amber-50 text-amber-700",
  partially_delivered: "bg-blue-50 text-blue-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled_issue: "bg-rose-50 text-rose-700",
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

export function SalesDeliveryTable({ records }: SalesDeliveryTableProps) {
  if (records.length === 0) {
    return (
      <section className="rounded-2xl border border-white/[0.08] bg-[#12151f] p-4 shadow-sm">
        <h3 className="text-base font-semibold">Sales & Delivery Tracker</h3>
        <p className="mt-3 rounded-xl bg-white/[0.04] p-4 text-sm text-slate-400">
          No sales or delivery records yet.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#12151f] p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-base font-semibold">Sales & Delivery Tracker</h3>
        <p className="mt-1 text-sm text-slate-400">
          Tracks customer PO/SO against surat jalan and delivery quantity. Vendor purchase order is not included here.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
        <table className="w-full min-w-[983px] text-left text-sm">
          <thead className="bg-white/[0.04] text-slate-400">
            <tr>
              <th className="px-3 py-2 font-medium">Sales Date</th>
              <th className="px-3 py-2 font-medium">Delivery Date</th>
              <th className="px-3 py-2 font-medium">Customer</th>
              <th className="px-3 py-2 font-medium">Branch</th>
              <th className="px-3 py-2 font-medium">SO</th>
              <th className="px-3 py-2 font-medium">Customer PO</th>
              <th className="px-3 py-2 font-medium">Surat Jalan</th>
              <th className="px-3 py-2 font-medium">Product</th>
              <th className="px-3 py-2 font-medium">Ordered</th>
              <th className="px-3 py-2 font-medium">Delivered</th>
              <th className="px-3 py-2 font-medium">Pending</th>
              <th className="px-3 py-2 font-medium">Sales Value</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Receiver</th>
              <th className="px-3 py-2 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {records.map((record) => (
              <tr key={record.id}>
                <td className="px-3 py-2 text-slate-200">{record.sales_date}</td>
                <td className="px-3 py-2 text-slate-200">{record.delivery_date ?? "-"}</td>
                <td className="px-3 py-2 text-slate-200">{record.customer_name}</td>
                <td className="px-3 py-2 text-slate-200">{record.branch_name}</td>
                <td className="px-3 py-2 text-slate-200">{record.so_number ?? "-"}</td>
                <td className="px-3 py-2 text-slate-200">{record.customer_po_number ?? "-"}</td>
                <td className="px-3 py-2 font-semibold text-slate-100">{record.surat_jalan_number ?? "-"}</td>
                <td className="px-3 py-2 text-slate-200">{record.product_name}</td>
                <td className="px-3 py-2 text-slate-200">
                  {formatNumber(record.quantity)} {record.unit}
                </td>
                <td className="px-3 py-2 text-slate-200">{formatNumber(record.quantity_delivered)}</td>
                <td className="px-3 py-2 text-slate-200">{formatNumber(record.quantity_pending)}</td>
                <td className="px-3 py-2 text-slate-200">{formatCurrency(record.total_sales)}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${deliveryStatusClassName[record.delivery_status]}`}>
                    {record.delivery_status}
                  </span>
                </td>
                <td className="px-3 py-2 text-slate-200">{record.receiver ?? "-"}</td>
                <td className="px-3 py-2 text-slate-200">{record.notes ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
