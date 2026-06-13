import type { JournalView } from "@/types/accounting";

type JournalTableProps = {
  journals: JournalView[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function JournalTable({ journals }: JournalTableProps) {
  if (journals.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h3 className="text-base font-semibold">Manual Journals</h3>
        <p className="mt-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No manual journals yet.</p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <h3 className="text-base font-semibold">Manual Journals</h3>
        <p className="mt-1 text-sm text-slate-500">Simple two-line journal validation. Not full general ledger.</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full min-w-[787px] text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-3 py-2 font-medium">Date</th>
              <th className="px-3 py-2 font-medium">Reference</th>
              <th className="px-3 py-2 font-medium">Description</th>
              <th className="px-3 py-2 font-medium">Lines</th>
              <th className="px-3 py-2 font-medium">Debit</th>
              <th className="px-3 py-2 font-medium">Credit</th>
              <th className="px-3 py-2 font-medium">Balanced</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {journals.map((journal) => (
              <tr key={journal.id}>
                <td className="px-3 py-2 text-slate-700">{journal.journal_date}</td>
                <td className="px-3 py-2 text-slate-700">{journal.reference_number ?? "-"}</td>
                <td className="px-3 py-2 text-slate-700">{journal.description ?? "-"}</td>
                <td className="px-3 py-2 text-slate-700">{journal.line_summary}</td>
                <td className="px-3 py-2 text-slate-700">{formatCurrency(journal.debit_total)}</td>
                <td className="px-3 py-2 text-slate-700">{formatCurrency(journal.credit_total)}</td>
                <td className="px-3 py-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${journal.is_balanced ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                    {journal.is_balanced ? "balanced" : "not balanced"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
