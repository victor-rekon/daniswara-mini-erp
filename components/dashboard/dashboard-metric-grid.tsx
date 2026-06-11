import type { DashboardMetric } from "@/types/dashboard";

type MetricVariant = "default" | "success" | "warning" | "danger" | "info";

function getVariant(label: string): MetricVariant {
  const l = label.toLowerCase();
  if (l.includes("net profit") || l.includes("payment received"))
    return "success";
  if (l.includes("outstanding") || l.includes("overdue invoice"))
    return "danger";
  if (l.includes("losses")) return "warning";
  if (
    l.includes("quotation value") ||
    l.includes("invoice value") ||
    l.includes("sales via")
  )
    return "info";
  return "default";
}

const stripeClass: Record<MetricVariant, string> = {
  default: "bg-slate-300",
  success: "bg-emerald-500",
  warning: "bg-amber-400",
  danger: "bg-red-500",
  info: "bg-indigo-500",
};

const valueClass: Record<MetricVariant, string> = {
  default: "text-slate-900",
  success: "text-emerald-700",
  warning: "text-amber-700",
  danger: "text-red-700",
  info: "text-slate-900",
};

type DashboardMetricGridProps = {
  metrics: DashboardMetric[];
};

export function DashboardMetricGrid({ metrics }: DashboardMetricGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const variant = getVariant(metric.label);
        return (
          <div
            key={metric.label}
            className="relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div
              className={`absolute inset-y-0 left-0 w-1 ${stripeClass[variant]}`}
            />
            <div className="py-5 pl-5 pr-5">
              <p className="text-xs font-medium text-slate-500">
                {metric.label}
              </p>
              <p
                className={`mt-2 text-2xl font-bold tabular-nums ${valueClass[variant]}`}
              >
                {metric.value}
              </p>
              <p className="mt-1.5 text-xs text-slate-400">{metric.helper}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
