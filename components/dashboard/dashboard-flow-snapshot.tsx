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
    <section className="rounded-2xl border border-[#e6e8ef] bg-white p-4 shadow-[0_1px_3px_rgba(26,36,86,0.05)] md:p-5">
      <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#233575]">
        Business <span className="text-[#b8860b]">Flow</span>
      </h3>
      <div className="flex items-stretch gap-1.5">
        {steps.map((step, i) => (
          <div key={step.label} className="flex flex-1 items-stretch">
            <div className="flex-1 cursor-pointer rounded-xl border border-[#e6e8ef] bg-[#fafbfd] px-1 py-3 text-center transition-colors duration-150 hover:border-[#d9b25c]/50 hover:bg-[#fdf9ef] active:scale-[0.97]">
              <div className="mx-auto mb-1.5 flex h-5 w-5 items-center justify-center rounded-md bg-[#233575] text-[10px] font-extrabold text-[#d9b25c]">
                {i + 1}
              </div>
              <p className="text-[9px] font-semibold text-[#7a829b]">{step.label}</p>
              <p className="mt-0.5 text-base font-bold tabular-nums text-[#233575]">{step.count}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="flex shrink-0 items-center px-0.5">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true" className="text-[#c5cad9]">
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
