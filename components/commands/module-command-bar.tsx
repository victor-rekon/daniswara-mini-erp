type ModuleCommandBarProps = {
  inputLabel: string;
  exportHref?: string;
};

export function ModuleCommandBar({ inputLabel, exportHref }: ModuleCommandBarProps) {
  return (
    <section className="rounded-2xl border border-white/[0.07] surface p-4 shadow-card md:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e8c878]">Module Command</p>
          <h3 className="text-sm font-bold tracking-tight text-[#e2e8f0]">Input and Export</h3>
          <p className="mt-0.5 text-xs text-[#94a3b8]">Use the input command for daily data entry. Export is for reports/backups.</p>
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
              className="rounded-full border border-[#d9b25c]/50 bg-[#d9b25c]/[0.08] px-4 py-2 text-xs font-bold text-[#e8c878] active:scale-[0.98]"
            >
              Export CSV
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
