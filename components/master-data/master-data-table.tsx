type Column<T> = {
  key: keyof T;
  label: string;
};

type MasterDataTableProps<T extends Record<string, unknown>> = {
  columns: Column<T>[];
  rows: T[];
  emptyText: string;
};

export function MasterDataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  emptyText,
}: MasterDataTableProps<T>) {
  if (rows.length === 0) {
    return <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">{emptyText}</p>;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className="px-4 py-3 font-medium">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {rows.map((row, index) => (
            <tr key={String(row.id ?? index)}>
              {columns.map((column) => (
                <td key={String(column.key)} className="px-4 py-3 text-slate-700">
                  {String(row[column.key] ?? "-")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
