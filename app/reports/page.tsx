import { AppShell } from "@/components/layout/app-shell";

const reports = [
  ["Production report", "/api/export/production"],
  ["Quotation report", "/api/export/quotation"],
  ["Delivery report", "/api/export/delivery"],
  ["Invoice/payment report", "/api/export/invoice-payment"],
  ["Accounting report", "/api/export/accounting"],
  ["Activity log", "/api/export/activity-log"],
] as const;

export default function ReportsPage() {
  return (
    <AppShell title="Reports" description="Simple operational reports and CSV exports.">
      <div className="grid gap-3 md:gap-4">
        <section className="rounded-2xl border border-white/[0.08] bg-[#12151f] p-5 shadow-card">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e8c878]">Export Center</p>
          <h3 className="mt-1 text-base font-bold text-[#e2e8f0]">Reports Module</h3>
          <p className="mt-1 text-xs leading-relaxed text-[#94a3b8]">Click one report below to export the latest CSV.</p>
        </section>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {reports.map(([title, href]) => (
            <a key={href} href={href} className="rounded-2xl border border-white/[0.08] bg-[#12151f] p-4 shadow-card transition hover:border-[#d9b25c]/40 hover:bg-[#161a26]">
              <p className="text-sm font-bold text-[#e2e8f0]">{title}</p>
              <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#d9b25c]">Export CSV</p>
            </a>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
