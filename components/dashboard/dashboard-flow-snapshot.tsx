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
    <section className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#12151f] p-4 shadow-card md:p-5">
      <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#e2e8f0]">
        Business <span className="text-[#e8c878]">Flow</span>
      </h3>
      <div className="flex items-stretch gap-1.5">
        {steps.map((step, i) => (
          <div key={step.label} className="flex flex-1 items-stretch">
            <div className="flex-1 cursor-pointer rounded-xl border border-[rgba(255,255,255,0.08)] bg-gradient-to-b from-white to-[#161a26] px-1 py-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#d9b25c]/40 hover:from-[#fdf9ef] hover:to-[#fcf3de] hover:shadow-card active:scale-[0.97] active:translate-y-0">
              <div className="mx-auto mb-1.5 flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-[#2f4a9e] to-[#1a2456] text-[10px] font-extrabold text-[#d9b25c] shadow-[0_2px_4px_-1px_rgba(26,36,86,0.4)]">
                {i + 1}
              </div>
              <p className="text-[9px] font-semibold text-[#94a3b8]">{step.label}</p>
              <p className="mt-0.5 text-base font-bold tabular-nums text-[#e2e8f0]">{step.count}</p>
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
