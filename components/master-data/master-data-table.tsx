type Column<T> = {
  key: keyof T;
  label: string;
};

type MasterDataTableProps<T extends { id?: string }> = {
  columns: Column<T>[];
  rows: T[];
  emptyText: string;
};

function displayValue(value: unknown) {
  return value === null || value === undefined || value === "" ? "-" : String(value);
}

export function MasterDataTable<T extends { id?: string }>({ columns, rows, emptyText }: MasterDataTableProps<T>) {
  if (rows.length === 0) {
    return <p className="rounded-xl bg-white/[0.04] p-4 text-sm text-slate-400">{emptyText}</p>;
  }

  return (
    <div className="min-w-0 max-w-full overflow-hidden rounded-xl border border-white/[0.08]">
      <div className="grid gap-2 p-3 md:hidden">
        {rows.map((row, index) => (
          <div key={row.id ?? String(index)} className="rounded-xl border border-white/[0.08] bg-[#161a26] p-3">
            {columns.map((column) => (
              <div key={String(column.key)} className="grid grid-cols-[90px_minmax(0,1fr)] gap-2 py-1 text-xs">
                <span className="text-[#94a3b8]">{column.label}</span>
                <span className="min-w-0 break-words text-[#e2e8f0]">{displayValue(row[column.key])}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[524px] text-left text-sm">
          <thead className="bg-white/[0.04] text-slate-400">
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className="px-3 py-2 font-medium">{column.label}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.06]">
            {rows.map((row, index) => (
              <tr key={row.id ?? String(index)}>
                {columns.map((column) => (
                  <td key={String(column.key)} className="px-3 py-2 text-slate-200">{displayValue(row[column.key])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
