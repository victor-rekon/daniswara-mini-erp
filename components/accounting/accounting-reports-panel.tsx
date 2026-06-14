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

function CompactRow({ label, value, tone = "text-[#e8c878]" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="grid min-w-0 grid-cols-1 gap-1 rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 sm:grid-cols-[1fr_auto] sm:items-center">
      <p className="min-w-0 break-words text-xs font-semibold text-[#e2e8f0]">{label}</p>
      <p className={`min-w-0 break-words text-left text-xs font-bold tabular-nums [overflow-wrap:anywhere] sm:text-right ${tone}`}>{value}</p>
    </div>
  );
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
    <section className="max-w-full overflow-hidden rounded-2xl border border-white/[0.07] surface p-3.5 shadow-card md:p-6">
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#e8c878] md:text-[11px]">Accounting Reports</p>
        <h2 className="mt-1 max-w-full break-words text-base font-bold leading-tight text-[#e2e8f0] md:text-lg">
          Ledger, Trial Balance, Balance Sheet & Cash Flow
        </h2>
        <p className="mt-1 max-w-full break-words text-[11px] leading-relaxed text-[#94a3b8] md:text-xs">
          Report dihitung dari journal, invoice, payment, expense, dan P&amp;L. Akun dan klasifikasi divalidasi oleh accounting client.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2.5 md:grid-cols-3">
        {reportCards.map((card) => (
          <div key={card.title} className="min-w-0 rounded-xl border border-white/[0.07] bg-white/[0.035] p-3.5">
            <p className="break-words text-[10px] font-bold uppercase tracking-[0.12em] text-[#94a3b8]">{card.title}</p>
            <p className="mt-1.5 break-words text-base font-bold leading-tight text-[#e2e8f0] [overflow-wrap:anywhere]">{card.primary}</p>
            <p className="mt-1 break-words text-[10px] leading-relaxed text-[#64748b] [overflow-wrap:anywhere]">{card.secondary}</p>
            <span className={`mt-3 inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusClass(card.ok)}`}>
              {card.ok ? "OK" : "Needs Review"}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
        <div className="min-w-0 rounded-xl border border-white/[0.07] bg-[#12151f]/70 p-3.5 md:p-4">
          <h3 className="break-words text-[11px] font-bold uppercase tracking-[0.14em] text-[#e2e8f0] md:text-xs">Balance Sheet Snapshot</h3>
          <div className="mt-3 grid gap-2">
            <CompactRow label="Assets" value={fmtCur(reports.balance_sheet.assets)} />
            <CompactRow label="Liabilities" value={fmtCur(reports.balance_sheet.liabilities)} />
            <CompactRow label="Equity" value={fmtCur(reports.balance_sheet.equity)} />
            <CompactRow label="Retained Earnings Est." value={fmtCur(reports.balance_sheet.retained_earnings)} />
            <CompactRow label="Liability + Equity" value={fmtCur(reports.balance_sheet.total_liability_equity)} />
          </div>
        </div>

        <div className="min-w-0 rounded-xl border border-white/[0.07] bg-[#12151f]/70 p-3.5 md:p-4">
          <h3 className="break-words text-[11px] font-bold uppercase tracking-[0.14em] text-[#e2e8f0] md:text-xs">Trial Balance Summary</h3>
          <div className="mt-3 grid gap-2">
            <CompactRow label="Total Debit" value={fmtCur(reports.trial_balance.total_debit)} tone="text-emerald-300" />
            <CompactRow label="Total Credit" value={fmtCur(reports.trial_balance.total_credit)} tone="text-[#fbbf24]" />
            <CompactRow label="Variance" value={fmtCur(reports.trial_balance.variance)} />
          </div>
        </div>
      </div>

      <div className="mt-4 md:hidden">
        <h3 className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-[#e2e8f0]">Ledger Accounts</h3>
        <div className="grid gap-2.5">
          {reports.ledger.map((account) => (
            <div key={account.account_id} className="min-w-0 rounded-xl border border-white/[0.07] bg-white/[0.035] p-3.5">
              <div className="min-w-0">
                <p className="break-words text-sm font-bold leading-tight text-[#e2e8f0]">{account.account_code} — {account.account_name}</p>
                <p className="mt-1 text-[10px] text-[#64748b]">{account.account_type} · {account.line_count} journal line(s)</p>
              </div>
              <div className="mt-3 grid grid-cols-1 gap-2">
                <CompactRow label="Debit" value={fmtCur(account.debit_total)} tone="text-emerald-300" />
                <CompactRow label="Credit" value={fmtCur(account.credit_total)} tone="text-[#fbbf24]" />
                <CompactRow label="Balance" value={fmtCur(account.net_balance)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 hidden overflow-x-auto rounded-xl border border-white/[0.07] md:block">
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
