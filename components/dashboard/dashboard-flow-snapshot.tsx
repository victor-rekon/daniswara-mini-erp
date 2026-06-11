type DashboardFlowSnapshotProps = {
  productionCount: number;
  quotationCount: number;
  salesCount: number;
  invoiceCount: number;
  paymentCount: number;
};

export function DashboardFlowSnapshot({
  productionCount,
  quotationCount,
  salesCount,
  invoiceCount,
  paymentCount,
}: DashboardFlowSnapshotProps) {
  const steps = [
    { label: "Production", count: productionCount },
    { label: "Quotation", count: quotationCount },
    { label: "Sales / SJ", count: salesCount },
    { label: "Invoice", count: invoiceCount },
    { label: "Payment", count: paymentCount },
  ];

  return (
    <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/5 md:p-6">
      <div className="mb-4">
        <h3 className="text-sm font-black uppercase tracking-wide text-slate-800">
          Business Flow
        </h3>
        <p className="mt-0.5 text-xs text-slate-400">
          Operational record count across the Phase 1 flow.
        </p>
      </div>
      <div className="flex items-stretch gap-1">
        {steps.map((step, index) => (
          <div key={step.label} className="flex flex-1 items-stretch">
            <div className="flex-1 rounded-lg bg-slate-50 p-3 ring-1 ring-slate-200 transition-all duration-200 hover:bg-indigo-50/60 hover:ring-indigo-200">
              <div className="mb-2 flex h-5 w-5 items-center justify-center rounded-md bg-indigo-600 text-[10px] font-black text-white">
                {index + 1}
              </div>
              <p className="text-[10px] font-semibold text-slate-500">{step.label}</p>
              <p className="mt-1 text-2xl font-black tabular-nums text-slate-900">{step.count}</p>
            </div>
            {index < steps.length - 1 && (
              <div className="flex shrink-0 items-center px-0.5">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" className="text-slate-300">
                  <path d="M4.5 2.5l3 3.5-3 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
