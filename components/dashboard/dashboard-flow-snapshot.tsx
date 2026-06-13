type DashboardFlowSnapshotProps = {
  productionCount: number;
  quotationCount: number;
  salesCount: number;
  invoiceCount: number;
  paymentCount: number;
};

export function DashboardFlowSnapshot({
  productionCount, quotationCount, salesCount, invoiceCount, paymentCount,
}: DashboardFlowSnapshotProps) {
  const steps = [
    { label: "Production", count: productionCount },
    { label: "Quotation",  count: quotationCount },
    { label: "Sales / SJ", count: salesCount },
    { label: "Invoice",    count: invoiceCount },
    { label: "Payment",    count: paymentCount },
  ];

  return (
    <section className="rounded-2xl border border-white/[0.07] surface p-5 shadow-card md:p-6">
      <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#d9e0ee]">
        Business <span className="text-[#e8c878]">Flow</span>
      </h3>
      <div className="flex items-stretch gap-1.5">
        {steps.map((step, i) => (
          <div key={step.label} className="flex flex-1 items-stretch">
            <div className="flex-1 cursor-pointer rounded-xl border border-white/[0.07] bg-white/[0.03] px-1 py-3.5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d9b25c]/30 hover:bg-[#d9b25c]/[0.06] active:scale-[0.97] active:translate-y-0">
              <div className="mx-auto mb-2 flex h-6 w-6 items-center justify-center rounded-lg border border-[#d9b25c]/20 bg-[#1a2456] text-[10px] font-bold text-[#e8c878]">
                {i + 1}
              </div>
              <p className="text-[9px] font-medium uppercase tracking-wider text-[#8a93a8]">{step.label}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums text-[#f1f4fa]">{step.count}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="flex shrink-0 items-center px-0.5">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true" className="text-[rgba(255,255,255,0.15)]">
                  <path d="M3.5 2l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
