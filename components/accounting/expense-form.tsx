import { createExpense } from "@/app/accounting/actions";
import type { Branch, ChartOfAccount } from "@/types/master-data";

type ExpenseFormProps = {
  branches: Branch[];
  accounts: ChartOfAccount[];
};

const inputClass = "min-w-0 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2.5 text-sm text-slate-100 outline-none placeholder:text-slate-400 focus:border-[#d9b25c]";

export function ExpenseForm({ branches, accounts }: ExpenseFormProps) {
  const expenseAccounts = accounts.filter((account) => account.account_type === "expense");

  return (
    <section className="max-w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-[#12151f] p-3.5 shadow-sm md:p-4">
      <div className="mb-3 min-w-0">
        <h3 className="break-words text-base font-semibold text-[#e2e8f0]">Expense Input</h3>
        <p className="mt-1 break-words text-xs leading-relaxed text-slate-400 md:text-sm">Input operating expense untuk accounting report.</p>
      </div>

      <form action={createExpense} className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        <input name="expense_date" type="date" className={inputClass} required />

        <select name="branch_id" className={inputClass}>
          <option value="">No branch</option>
          {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.branch_name}</option>)}
        </select>

        <select name="account_id" className={`${inputClass} sm:col-span-2 xl:col-span-1`} required>
          <option value="">Select expense account</option>
          {expenseAccounts.map((account) => (
            <option key={account.id} value={account.id}>{account.account_code} — {account.account_name}</option>
          ))}
        </select>

        <input name="amount" type="number" min="0.01" step="0.01" placeholder="Amount" className={inputClass} required />
        <input name="description" placeholder="Description" className={`${inputClass} sm:col-span-2`} required />
        <input name="notes" placeholder="Notes" className={`${inputClass} sm:col-span-2 xl:col-span-2`} />

        <button type="submit" className="min-w-0 rounded-xl bg-gradient-to-br from-[#e8c878] via-[#d9b25c] to-[#c99a2e] px-4 py-2.5 text-sm font-bold text-[#1a2456] shadow-[0_2px_10px_-2px_rgba(217,178,92,0.45)] sm:col-span-2 xl:col-span-4">Save Expense</button>
      </form>
    </section>
  );
}
