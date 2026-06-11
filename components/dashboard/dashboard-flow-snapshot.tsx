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
    <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/[0.06] md:p-5">
      <div className="mb-3">
        <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Business Flow
        </h3>
      </div>
      <div className="flex items-stretch gap-0">
        {steps.map((step, i) => (
          <div key={step.label} className="flex flex-1 items-stretch">
            <div className="flex-1 cursor-pointer rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200 transition-all duration-200 hover:bg-blue-50/70 hover:ring-[#3b82f6]/30">
              <div className="mb-2 flex h-5 w-5 items-center justify-center rounded-md bg-[#1e40af] text-[10px] font-bold text-white">
                {i + 1}
              </div>
              <p className="text-[10px] font-semibold text-slate-500">{step.label}</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-slate-900">{step.count}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="flex shrink-0 items-center px-1">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true" className="text-slate-300">
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
