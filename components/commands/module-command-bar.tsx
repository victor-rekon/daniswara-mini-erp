type ModuleCommandBarProps = {
  inputLabel: string;
  exportHref?: string;
};

export function ModuleCommandBar({ inputLabel, exportHref }: ModuleCommandBarProps) {
  return (
    <section className="rounded-2xl border border-[#e6e8ef] bg-white p-3 shadow-[0_1px_3px_rgba(26,36,86,0.05)] md:p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#b8860b]">Module Command</p>
          <h3 className="text-sm font-bold tracking-tight text-[#233575]">Input and Export</h3>
          <p className="mt-0.5 text-xs text-[#7a829b]">Use the input command for daily data entry. Export is for reports/backups.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href="#input-data"
            className="rounded-full bg-gradient-to-br from-[#d9b25c] to-[#c99a2e] px-4 py-2 text-xs font-bold text-[#1a2456] shadow-sm active:scale-[0.98]"
          >
            {inputLabel}
          </a>
          {exportHref ? (
            <a
              href={exportHref}
              className="rounded-full border border-[#d9b25c]/50 bg-[#fdf9ef] px-4 py-2 text-xs font-bold text-[#b8860b] active:scale-[0.98]"
            >
              Export CSV
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
