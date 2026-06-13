import { createManualJournal } from "@/app/accounting/actions";
import type { ChartOfAccount } from "@/types/master-data";

type ManualJournalFormProps = {
  accounts: ChartOfAccount[];
};

export function ManualJournalForm({ accounts }: ManualJournalFormProps) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#12151f] p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-base font-semibold">Manual Journal</h3>
        <p className="mt-1 text-sm text-slate-400">
          Simple two-line journal only. Not full GL, trial balance, closing, or audit accounting.
        </p>
      </div>

      <form action={createManualJournal} className="grid grid-cols-2 gap-2.5 md:grid-cols-2 xl:grid-cols-4">
        <input name="journal_date" type="date" className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-2.5 py-2 text-sm text-slate-100 placeholder:text-slate-400" required />
        <input name="reference_number" placeholder="Reference number" className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-2.5 py-2 text-sm text-slate-100 placeholder:text-slate-400" />
        <input name="description" placeholder="Description" className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-2.5 py-2 text-sm text-slate-100 placeholder:text-slate-400 col-span-2 xl:col-span-2" />

        <select name="debit_account_id" className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-2.5 py-2 text-sm text-slate-100 placeholder:text-slate-400" required>
          <option value="">Debit account</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>{account.account_code} — {account.account_name}</option>
          ))}
        </select>

        <select name="credit_account_id" className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-2.5 py-2 text-sm text-slate-100 placeholder:text-slate-400" required>
          <option value="">Credit account</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>{account.account_code} — {account.account_name}</option>
          ))}
        </select>

        <input name="amount" type="number" min="0.01" step="0.01" placeholder="Amount" className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-2.5 py-2 text-sm text-slate-100 placeholder:text-slate-400" required />
        <input name="notes" placeholder="Notes" className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-2.5 py-2 text-sm text-slate-100 placeholder:text-slate-400" />

        <button type="submit" className="rounded-xl bg-gradient-to-br from-[#e8c878] via-[#d9b25c] to-[#c99a2e] px-4 py-2 text-sm font-bold text-[#1a2456] shadow-[0_2px_10px_-2px_rgba(217,178,92,0.45)] col-span-2 xl:col-span-1 xl:col-start-4">Save Journal</button>
      </form>
    </section>
  );
}
