import type { DashboardMetric } from "@/types/dashboard";

type DashboardMetricGridProps = {
  metrics: DashboardMetric[];
};

export function DashboardMetricGrid({ metrics }: DashboardMetricGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">{metric.label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-950">{metric.value}</p>
          <p className="mt-2 text-xs text-slate-400">{metric.helper}</p>
        </div>
      ))}
    </div>
  );
}
