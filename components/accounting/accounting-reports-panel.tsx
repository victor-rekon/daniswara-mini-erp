import type { AccountingReports } from "@/types/accounting";

function fmtCur(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function statusClass(ok: boolean) {
  return ok
    ? "border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-300"
    : "border-red-400/25 bg-red-400/[0.08] text-red-300";
}

export function AccountingReportsPanel({ reports }: { reports: AccountingReports }) {
  const balanceSheetOk = Math.abs(reports.balance_sheet.variance) < 1;

  const reportCards = [
    {
      title: "Trial Balance",
      primary: reports.trial_balance.is_balanced ? "Balanced" : "Not Balanced",
      secondary: `Variance ${fmtCur(reports.trial_balance.variance)}`,
      ok: reports.trial_balance.is_balanced,
    },
    {
      title: "Balance Sheet",
      primary: balanceSheetOk ? "Balanced" : "Review Needed",
      secondary: `Variance ${fmtCur(reports.balance_sheet.variance)}`,
      ok: balanceSheetOk,
    },
    {
      title: "Cash Flow",
      primary: fmtCur(reports.cash_flow.net_cash_flow),
      secondary: `In ${fmtCur(reports.cash_flow.cash_in)} / Out ${fmtCur(reports.cash_flow.cash_out)}`,
      ok: reports.cash_flow.net_cash_flow >= 0,
    },
  ];

  return (
    <section className="rounded-2xl border border-white/[0.07] surface p-5 shadow-card md:p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#e8c878]">Accounting Reports</p>
          <h2 className="mt-1 text-lg font-bold text-[#e2e8f0]">Ledger, Trial Balance, Balance Sheet & Cash Flow</h2>
          <p className="mt-1 max-w-3xl text-xs leading-relaxed text-[#94a3b8]">
            Report dihitung dari journal lines, invoice, payment, expense, dan P&amp;L. Akun dan klasifikasi tetap harus divalidasi oleh tim accounting client.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-2.5 md:grid-cols-3">
        {reportCards.map((card) => (
          <div key={card.title} className="rounded-xl border border-white/[0.07] bg-white/[0.035] p-3.5">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#94a3b8]">{card.title}</p>
            <p className="mt-1.5 break-words text-base font-bold leading-tight text-[#e2e8f0]">{card.primary}</p>
            <p className="mt-1 text-[10px] text-[#64748b]">{card.secondary}</p>
            <span className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusClass(card.ok)}`}>
              {card.ok ? "OK" : "Needs Review"}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <div className="rounded-xl border border-white/[0.07] bg-[#12151f]/70 p-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-[#e2e8f0]">Balance Sheet Snapshot</h3>
          <div className="mt-3 grid gap-2">
            {[
              ["Assets", reports.balance_sheet.assets],
              ["Liabilities", reports.balance_sheet.liabilities],
              ["Equity", reports.balance_sheet.equity],
              ["Retained Earnings Est.", reports.balance_sheet.retained_earnings],
              ["Liability + Equity", reports.balance_sheet.total_liability_equity],
            ].map(([label, value]) => (
              <div key={String(label)} className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2">
                <p className="text-xs font-semibold text-[#e2e8f0]">{String(label)}</p>
                <p className="text-right text-xs font-bold tabular-nums text-[#e8c878]">{fmtCur(Number(value))}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.07] bg-[#12151f]/70 p-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-[#e2e8f0]">Trial Balance Summary</h3>
          <div className="mt-3 grid gap-2">
            <div className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2">
              <p className="text-xs font-semibold text-[#e2e8f0]">Total Debit</p>
              <p className="text-right text-xs font-bold tabular-nums text-emerald-300">{fmtCur(reports.trial_balance.total_debit)}</p>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2">
              <p className="text-xs font-semibold text-[#e2e8f0]">Total Credit</p>
              <p className="text-right text-xs font-bold tabular-nums text-[#fbbf24]">{fmtCur(reports.trial_balance.total_credit)}</p>
            </div>
            <div className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2">
              <p className="text-xs font-semibold text-[#e2e8f0]">Variance</p>
              <p className="text-right text-xs font-bold tabular-nums text-[#e8c878]">{fmtCur(reports.trial_balance.variance)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-xl border border-white/[0.07]">
        <table className="min-w-full divide-y divide-white/[0.07] text-sm">
          <thead className="bg-white/[0.03] text-left text-[10px] uppercase tracking-[0.14em] text-[#94a3b8]">
            <tr>
              <th className="px-4 py-3">Account</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3 text-right">Debit</th>
              <th className="px-4 py-3 text-right">Credit</th>
              <th className="px-4 py-3 text-right">Balance</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {reports.ledger.map((account) => (
              <tr key={account.account_id} className="text-[#e2e8f0]">
                <td className="px-4 py-3">
                  <p className="font-semibold">{account.account_code} — {account.account_name}</p>
                  <p className="text-[10px] text-[#64748b]">{account.line_count} journal line(s)</p>
                </td>
                <td className="px-4 py-3 text-[#94a3b8]">{account.account_type}</td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums text-emerald-300">{fmtCur(account.debit_total)}</td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums text-[#fbbf24]">{fmtCur(account.credit_total)}</td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums text-[#e8c878]">{fmtCur(account.net_balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
