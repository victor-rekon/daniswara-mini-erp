type Column<T> = {
  key: keyof T;
  label: string;
};

type MasterDataTableProps<T extends { id?: string }> = {
  columns: Column<T>[];
  rows: T[];
  emptyText: string;
};

export function MasterDataTable<T extends { id?: string }>({
  columns,
  rows,
  emptyText,
}: MasterDataTableProps<T>) {
  if (rows.length === 0) {
    return <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">{emptyText}</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full min-w-[524px] text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)} className="px-3 py-2 font-medium">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {rows.map((row, index) => (
            <tr key={row.id ?? String(index)}>
              {columns.map((column) => {
                const value = row[column.key];
                return (
                  <td key={String(column.key)} className="px-3 py-2 text-slate-700">
                    {value === null || value === undefined || value === "" ? "-" : String(value)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
