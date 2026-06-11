import type { InvoicePaymentView } from "@/types/invoice-payment";

type InvoicePaymentTableProps = {
  invoices: InvoicePaymentView[];
};

const statusClassName: Record<InvoicePaymentView["payment_status"], string> = {
  belum_ditagih: "bg-slate-100 text-slate-700",
  sudah_ditagih: "bg-blue-50 text-blue-700",
  sebagian_dibayar: "bg-amber-50 text-amber-700",
  lunas: "bg-emerald-50 text-emerald-700",
  overdue: "bg-rose-50 text-rose-700",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function InvoicePaymentTable({ invoices }: InvoicePaymentTableProps) {
  if (invoices.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold">Invoice & Customer Outstanding</h3>
        <p className="mt-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No invoices yet.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-lg font-semibold">Invoice & Customer Outstanding</h3>
        <p className="mt-1 text-sm text-slate-500">Invoice status, payment received, and outstanding customer balance.</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[1160px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Invoice</th>
              <th className="px-4 py-3 font-medium">Invoice Date</th>
              <th className="px-4 py-3 font-medium">Due Date</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Branch</th>
              <th className="px-4 py-3 font-medium">Surat Jalan</th>
              <th className="px-4 py-3 font-medium">SO</th>
              <th className="px-4 py-3 font-medium">Customer PO</th>
              <th className="px-4 py-3 font-medium">Invoice Value</th>
              <th className="px-4 py-3 font-medium">Paid</th>
              <th className="px-4 py-3 font-medium">Outstanding</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="px-4 py-3 font-semibold text-slate-800">{invoice.invoice_number}</td>
                <td className="px-4 py-3 text-slate-700">{invoice.invoice_date}</td>
                <td className="px-4 py-3 text-slate-700">{invoice.due_date ?? "-"}</td>
                <td className="px-4 py-3 text-slate-700">{invoice.customer_name}</td>
                <td className="px-4 py-3 text-slate-700">{invoice.branch_name}</td>
                <td className="px-4 py-3 text-slate-700">{invoice.surat_jalan_number}</td>
                <td className="px-4 py-3 text-slate-700">{invoice.so_number ?? "-"}</td>
                <td className="px-4 py-3 text-slate-700">{invoice.customer_po_number ?? "-"}</td>
                <td className="px-4 py-3 text-slate-700">{formatCurrency(invoice.invoice_value)}</td>
                <td className="px-4 py-3 text-slate-700">{formatCurrency(invoice.actual_payment_received)}</td>
                <td className="px-4 py-3 font-semibold text-slate-800">{formatCurrency(invoice.actual_outstanding_amount)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassName[invoice.payment_status]}`}>
                    {invoice.payment_status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-700">{invoice.notes ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
