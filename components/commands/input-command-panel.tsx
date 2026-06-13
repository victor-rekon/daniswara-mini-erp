import Link from "next/link";

const inputCommands = [
  {
    title: "Master Data",
    description: "Branch, product, customer, and account setup.",
    href: "/master-data#input-data",
    cta: "Input Master Data",
  },
  {
    title: "Production / HPP",
    description: "Daily production, losses, and HPP base cost.",
    href: "/production#input-data",
    cta: "Input Production",
  },
  {
    title: "Quotation",
    description: "Customer quotation and item value.",
    href: "/quotation#input-data",
    cta: "Input Quotation",
  },
  {
    title: "Sales & Delivery",
    description: "Customer PO, SO, and surat jalan.",
    href: "/sales-delivery#input-data",
    cta: "Input Sales / SJ",
  },
  {
    title: "Invoice & Payment",
    description: "Invoice, payment received, and outstanding.",
    href: "/invoice-payment#input-data",
    cta: "Input Invoice / Payment",
  },
  {
    title: "Accounting Light",
    description: "Expense and manual journal input.",
    href: "/accounting#input-data",
    cta: "Input Accounting",
  },
];

export function InputCommandPanel() {
  return (
    <section className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#12151f] p-4 shadow-card md:p-5">
      <div className="mb-3 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e8c878]">Input Command</p>
          <h3 className="text-base font-bold tracking-tight text-[#e2e8f0]">Where Staff Enters Data</h3>
        </div>
        <p className="text-xs text-[#94a3b8]">Dashboard is output only. Use these commands to input operational data.</p>
      </div>

      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
        {inputCommands.map((command) => (
          <Link
            key={command.href}
            href={command.href}
            className="group rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#161a26] p-3 transition-colors duration-150 hover:border-[#d9b25c]/60 hover:bg-[#d9b25c]/[0.08] active:scale-[0.98]"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#e2e8f0]">{command.title}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-[#94a3b8]">{command.description}</p>
              </div>
              <span className="shrink-0 rounded-full bg-[#1a2456] px-2.5 py-1 text-[10px] font-bold text-[#d9b25c] transition-colors group-hover:bg-[#e2e8f0]">
                Input
              </span>
            </div>
            <p className="mt-3 text-xs font-bold text-[#e8c878]">{command.cta} →</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
