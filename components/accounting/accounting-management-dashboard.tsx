import type { ExpenseView, JournalView, ProfitLossSummary } from "@/types/accounting";
import type { InvoicePaymentView, PaymentRecord } from "@/types/invoice-payment";

function fmtCur(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function safeNumber(value: unknown) {
  const numberValue = Number(value ?? 0);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function agingBucket(invoice: InvoicePaymentView) {
  const outstanding = safeNumber(invoice.actual_outstanding_amount ?? invoice.outstanding_amount);
  if (outstanding <= 0) return "Lunas";
  if (!invoice.due_date) return "Belum ada jatuh tempo";

  const due = new Date(invoice.due_date);
  const today = new Date();
  due.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  const daysOverdue = Math.floor((today.getTime() - due.getTime()) / 86400000);

  if (daysOverdue <= 0) return "Belum jatuh tempo";
  if (daysOverdue <= 30) return "Overdue 1-30 hari";
  if (daysOverdue <= 60) return "Overdue 31-60 hari";
  return "Overdue >60 hari";
}

export function AccountingManagementDashboard({
  invoices,
  payments,
  expenses,
  journals,
  summary,
}: {
  invoices: InvoicePaymentView[];
  payments: PaymentRecord[];
  expenses: ExpenseView[];
  journals: JournalView[];
  summary: ProfitLossSummary;
}) {
  const totalInvoice = invoices.reduce((sum, invoice) => sum + safeNumber(invoice.invoice_value), 0);
  const totalOutstanding = invoices.reduce((sum, invoice) => sum + safeNumber(invoice.actual_outstanding_amount ?? invoice.outstanding_amount), 0);
  const totalCashReceived = payments.reduce((sum, payment) => sum + safeNumber(payment.amount), 0);
  const unbalancedJournalCount = journals.filter((journal) => !journal.is_balanced).length;

  const agingRows = ["Belum jatuh tempo", "Overdue 1-30 hari", "Overdue 31-60 hari", "Overdue >60 hari", "Belum ada jatuh tempo", "Lunas"].map((bucket) => {
    const bucketInvoices = invoices.filter((invoice) => agingBucket(invoice) === bucket);
    return {
      bucket,
      count: bucketInvoices.length,
      amount: bucketInvoices.reduce((sum, invoice) => sum + safeNumber(invoice.actual_outstanding_amount ?? invoice.outstanding_amount), 0),
    };
  });

  const expenseMap = new Map<string, number>();
  for (const expense of expenses) {
    const label = expense.account_name || "Uncategorized";
    expenseMap.set(label, (expenseMap.get(label) ?? 0) + safeNumber(expense.amount));
  }
  const expenseBreakdown = Array.from(expenseMap.entries())
    .map(([label, amount]) => ({ label, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 6);

  const kpis = [
    { label: "Total Invoice", value: fmtCur(totalInvoice), hint: `${invoices.length} invoice`, tone: "text-[#e8c878]" },
    { label: "Cash Received", value: fmtCur(totalCashReceived), hint: `${payments.length} payment`, tone: "text-emerald-300" },
    { label: "Outstanding AR", value: fmtCur(totalOutstanding), hint: "Belum diterima", tone: totalOutstanding > 0 ? "text-[#fbbf24]" : "text-emerald-300" },
    { label: "Net Profit Est.", value: fmtCur(summary.net_profit), hint: "Management estimate", tone: summary.net_profit >= 0 ? "text-emerald-300" : "text-red-300" },
    { label: "Journal Check", value: `${unbalancedJournalCount}`, hint: "Unbalanced entry", tone: unbalancedJournalCount === 0 ? "text-emerald-300" : "text-red-300" },
  ];

  return (
    <section className="rounded-2xl border border-white/[0.07] surface p-5 shadow-card md:p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#e8c878]">Accounting Control</p>
          <h2 className="mt-1 text-lg font-bold text-[#e2e8f0]">Finance & Accounting Snapshot</h2>
          <p className="mt-1 max-w-3xl text-xs leading-relaxed text-[#94a3b8]">
            Ringkasan piutang, kas masuk, expense, journal balance, dan P&amp;L. Formula/accounting treatment harus divalidasi oleh pihak accounting sebelum dipakai sebagai laporan resmi.
          </p>
        </div>
        <span className="rounded-full border border-[#d9b25c]/25 bg-[#d9b25c]/[0.08] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#e8c878]">
          Accounting
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-5">
        {kpis.map((item) => (
          <div key={item.label} className="min-w-0 rounded-xl border border-white/[0.07] bg-white/[0.035] p-3.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#94a3b8]">{item.label}</p>
            <p className={`mt-1.5 break-words text-base font-bold leading-tight tabular-nums [overflow-wrap:anywhere] ${item.tone}`}>{item.value}</p>
            <p className="mt-1 text-[10px] text-[#64748b]">{item.hint}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/[0.07] bg-[#12151f]/70 p-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-[#e2e8f0]">AR Aging</h3>
          <div className="mt-3 grid gap-2">
            {agingRows.map((row) => (
              <div key={row.bucket} className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#e2e8f0]">{row.bucket}</p>
                  <p className="text-[10px] text-[#94a3b8]">{row.count} invoice</p>
                </div>
                <p className="shrink-0 text-right text-xs font-bold tabular-nums text-[#e8c878]">{fmtCur(row.amount)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.07] bg-[#12151f]/70 p-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-[#e2e8f0]">Expense Breakdown</h3>
          <div className="mt-3 grid gap-2">
            {expenseBreakdown.length ? expenseBreakdown.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2">
                <p className="min-w-0 truncate text-xs font-semibold text-[#e2e8f0]">{row.label}</p>
                <p className="shrink-0 text-right text-xs font-bold tabular-nums text-[#fbbf24]">{fmtCur(row.amount)}</p>
              </div>
            )) : (
              <p className="rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-xs text-[#94a3b8]">No expense data yet.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
