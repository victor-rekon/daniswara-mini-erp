import { createManualJournal } from "@/app/accounting/actions";
import type { ChartOfAccount } from "@/types/master-data";

type ManualJournalFormProps = {
  accounts: ChartOfAccount[];
};

export function ManualJournalForm({ accounts }: ManualJournalFormProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-base font-semibold">Manual Journal</h3>
        <p className="mt-1 text-sm text-slate-500">
          Simple two-line journal only. Not full GL, trial balance, closing, or audit accounting.
        </p>
      </div>

      <form action={createManualJournal} className="grid grid-cols-2 gap-2.5 md:grid-cols-2 xl:grid-cols-4">
        <input name="journal_date" type="date" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm" required />
        <input name="reference_number" placeholder="Reference number" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm" />
        <input name="description" placeholder="Description" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm col-span-2 xl:col-span-2" />

        <select name="debit_account_id" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm" required>
          <option value="">Debit account</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>{account.account_code} — {account.account_name}</option>
          ))}
        </select>

        <select name="credit_account_id" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm" required>
          <option value="">Credit account</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>{account.account_code} — {account.account_name}</option>
          ))}
        </select>

        <input name="amount" type="number" min="0.01" step="0.01" placeholder="Amount" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm" required />
        <input name="notes" placeholder="Notes" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm" />

        <button type="submit" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white col-span-2 xl:col-span-1 xl:col-start-4">Save Journal</button>
      </form>
    </section>
  );
}
