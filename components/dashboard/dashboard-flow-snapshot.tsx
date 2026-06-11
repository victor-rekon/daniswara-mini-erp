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
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-slate-900">
          Business Flow Snapshot
        </h3>
        <p className="mt-0.5 text-sm text-slate-500">
          Operational record count across the Phase 1 flow.
        </p>
      </div>
      <div className="flex items-stretch gap-0">
        {steps.map((step, index) => (
          <div key={step.label} className="flex flex-1 items-stretch">
            <div className="flex-1 rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all duration-200 hover:border-indigo-200 hover:bg-indigo-50/50 hover:shadow-sm">
              <div className="mb-3 flex h-6 w-6 items-center justify-center rounded-md bg-indigo-600 text-xs font-bold text-white">
                {index + 1}
              </div>
              <p className="text-xs font-medium text-slate-500">{step.label}</p>
              <p className="mt-1.5 text-2xl font-bold tabular-nums text-slate-900">
                {step.count}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className="flex shrink-0 items-center px-1.5">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                  className="text-slate-300"
                >
                  <path
                    d="M5 3l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
