import type { ExpenseView } from "@/types/accounting";

type ExpenseTableProps = {
  expenses: ExpenseView[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ExpenseTable({ expenses }: ExpenseTableProps) {
  if (expenses.length === 0) {
    return (
      <section className="rounded-2xl border border-white/[0.08] bg-[#12151f] p-4 shadow-sm">
        <h3 className="text-base font-semibold">Expense Records</h3>
        <p className="mt-3 rounded-xl bg-white/[0.04] p-4 text-sm text-slate-400">No expense records yet.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#12151f] p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-base font-semibold">Expense Records</h3>
        <p className="mt-1 text-sm text-slate-400">Manual operating expenses for simple management P&amp;L.</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-white/[0.08]">
        <table className="w-full min-w-[705px] text-left text-sm">
          <thead className="bg-white/[0.04] text-slate-400">
            <tr>
              <th className="px-3 py-2 font-medium">Date</th>
              <th className="px-3 py-2 font-medium">Branch</th>
              <th className="px-3 py-2 font-medium">Account</th>
              <th className="px-3 py-2 font-medium">Description</th>
              <th className="px-3 py-2 font-medium">Amount</th>
              <th className="px-3 py-2 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td className="px-3 py-2 text-slate-200">{expense.expense_date}</td>
                <td className="px-3 py-2 text-slate-200">{expense.branch_name}</td>
                <td className="px-3 py-2 text-slate-200">{expense.account_code} — {expense.account_name}</td>
                <td className="px-3 py-2 text-slate-200">{expense.description}</td>
                <td className="px-3 py-2 font-semibold text-slate-100">{formatCurrency(expense.amount)}</td>
                <td className="px-3 py-2 text-slate-200">{expense.notes ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
