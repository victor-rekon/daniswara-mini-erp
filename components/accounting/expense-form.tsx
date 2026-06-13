import { createExpense } from "@/app/accounting/actions";
import type { Branch, ChartOfAccount } from "@/types/master-data";

type ExpenseFormProps = {
  branches: Branch[];
  accounts: ChartOfAccount[];
};

export function ExpenseForm({ branches, accounts }: ExpenseFormProps) {
  const expenseAccounts = accounts.filter((account) => account.account_type === "expense");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-base font-semibold">Expense Input</h3>
        <p className="mt-1 text-sm text-slate-500">Manual operating expense input. Not vendor outstanding or purchase approval.</p>
      </div>

      <form action={createExpense} className="grid grid-cols-2 gap-2.5 md:grid-cols-2 xl:grid-cols-4">
        <input name="expense_date" type="date" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm" required />

        <select name="branch_id" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm">
          <option value="">No branch</option>
          {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.branch_name}</option>)}
        </select>

        <select name="account_id" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm" required>
          <option value="">Select expense account</option>
          {expenseAccounts.map((account) => (
            <option key={account.id} value={account.id}>{account.account_code} — {account.account_name}</option>
          ))}
        </select>

        <input name="amount" type="number" min="0.01" step="0.01" placeholder="Amount" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm" required />
        <input name="description" placeholder="Description" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm col-span-2 xl:col-span-2" required />
        <input name="notes" placeholder="Notes" className="rounded-xl border border-slate-200 px-2.5 py-2 text-sm" />

        <button type="submit" className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white col-span-2">Save Expense</button>
      </form>
    </section>
  );
}
