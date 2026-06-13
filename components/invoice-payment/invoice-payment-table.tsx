import type { InvoicePaymentView } from "@/types/invoice-payment";

type InvoicePaymentTableProps = {
  invoices: InvoicePaymentView[];
};

const statusClassName: Record<InvoicePaymentView["payment_status"], string> = {
  belum_ditagih: "bg-white/[0.04] text-slate-200",
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
      <section className="rounded-2xl border border-white/[0.08] bg-[#12151f] p-4 shadow-sm">
        <h3 className="text-base font-semibold">Invoice & Customer Outstanding</h3>
        <p className="mt-3 rounded-xl bg-white/[0.04] p-4 text-sm text-slate-400">No invoices yet.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#12151f] p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-base font-semibold">Invoice & Customer Outstanding</h3>
        <p className="mt-1 text-sm text-slate-400">Invoice status, payment received, and outstanding customer balance.</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
        <table className="w-full min-w-[951px] text-left text-sm">
          <thead className="bg-white/[0.04] text-slate-400">
            <tr>
              <th className="px-3 py-2 font-medium">Invoice</th>
              <th className="px-3 py-2 font-medium">Invoice Date</th>
              <th className="px-3 py-2 font-medium">Due Date</th>
              <th className="px-3 py-2 font-medium">Customer</th>
              <th className="px-3 py-2 font-medium">Branch</th>
              <th className="px-3 py-2 font-medium">Surat Jalan</th>
              <th className="px-3 py-2 font-medium">SO</th>
              <th className="px-3 py-2 font-medium">Customer PO</th>
              <th className="px-3 py-2 font-medium">Invoice Value</th>
              <th className="px-3 py-2 font-medium">Paid</th>
              <th className="px-3 py-2 font-medium">Outstanding</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {invoices.map((invoice) => (
              <tr key={invoice.id}>
                <td className="px-3 py-2 font-semibold text-slate-100">{invoice.invoice_number}</td>
                <td className="px-3 py-2 text-slate-200">{invoice.invoice_date}</td>
                <td className="px-3 py-2 text-slate-200">{invoice.due_date ?? "-"}</td>
                <td className="px-3 py-2 text-slate-200">{invoice.customer_name}</td>
                <td className="px-3 py-2 text-slate-200">{invoice.branch_name}</td>
                <td className="px-3 py-2 text-slate-200">{invoice.surat_jalan_number}</td>
                <td className="px-3 py-2 text-slate-200">{invoice.so_number ?? "-"}</td>
                <td className="px-3 py-2 text-slate-200">{invoice.customer_po_number ?? "-"}</td>
                <td className="px-3 py-2 text-slate-200">{formatCurrency(invoice.invoice_value)}</td>
                <td className="px-3 py-2 text-slate-200">{formatCurrency(invoice.actual_payment_received)}</td>
                <td className="px-3 py-2 font-semibold text-slate-100">{formatCurrency(invoice.actual_outstanding_amount)}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassName[invoice.payment_status]}`}>
                    {invoice.payment_status}
                  </span>
                </td>
                <td className="px-3 py-2 text-slate-200">{invoice.notes ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
