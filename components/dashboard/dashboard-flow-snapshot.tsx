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
    { label: "Sales / Surat Jalan", count: salesCount },
    { label: "Invoice", count: invoiceCount },
    { label: "Payment", count: paymentCount },
  ];

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-lg font-semibold">Business Flow Snapshot</h3>
        <p className="mt-1 text-sm text-slate-500">Operational record count across the Phase 1 flow.</p>
      </div>
      <div className="grid gap-3 md:grid-cols-5">
        {steps.map((step, index) => (
          <div key={step.label} className="rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Step {index + 1}</p>
            <p className="mt-2 font-semibold text-slate-800">{step.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">{step.count}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
