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
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold">Expense Records</h3>
        <p className="mt-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No expense records yet.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-lg font-semibold">Expense Records</h3>
        <p className="mt-1 text-sm text-slate-500">Manual operating expenses for simple management P&amp;L.</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Branch</th>
              <th className="px-4 py-3 font-medium">Account</th>
              <th className="px-4 py-3 font-medium">Description</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td className="px-4 py-3 text-slate-700">{expense.expense_date}</td>
                <td className="px-4 py-3 text-slate-700">{expense.branch_name}</td>
                <td className="px-4 py-3 text-slate-700">{expense.account_code} — {expense.account_name}</td>
                <td className="px-4 py-3 text-slate-700">{expense.description}</td>
                <td className="px-4 py-3 font-semibold text-slate-800">{formatCurrency(expense.amount)}</td>
                <td className="px-4 py-3 text-slate-700">{expense.notes ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
