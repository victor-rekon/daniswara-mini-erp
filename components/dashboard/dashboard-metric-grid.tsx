import type { DashboardMetric } from "@/types/dashboard";

type MetricVariant = "default" | "success" | "warning" | "danger" | "info";

function getVariant(label: string): MetricVariant {
  const l = label.toLowerCase();
  if (l.includes("net profit") || l.includes("payment received")) return "success";
  if (l.includes("outstanding") || l.includes("overdue invoice")) return "danger";
  if (l.includes("losses")) return "warning";
  if (l.includes("quotation value") || l.includes("invoice value") || l.includes("sales via")) return "info";
  return "default";
}

const stripeClass: Record<MetricVariant, string> = {
  default:  "bg-slate-300",
  success:  "bg-emerald-500",
  warning:  "bg-amber-400",
  danger:   "bg-red-500",
  info:     "bg-indigo-500",
};

const valueClass: Record<MetricVariant, string> = {
  default:  "text-slate-900",
  success:  "text-emerald-600",
  warning:  "text-amber-600",
  danger:   "text-red-600",
  info:     "text-indigo-700",
};

type DashboardMetricGridProps = {
  metrics: DashboardMetric[];
};

export function DashboardMetricGrid({ metrics }: DashboardMetricGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const variant = getVariant(metric.label);
        return (
          <div
            key={metric.label}
            className="relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className={`absolute inset-y-0 left-0 w-1.5 ${stripeClass[variant]}`} />
            <div className="py-4 pl-5 pr-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {metric.label}
              </p>
              <p className={`mt-2 text-xl font-black tabular-nums leading-tight ${valueClass[variant]}`}>
                {metric.value}
              </p>
              <p className="mt-1 text-[10px] leading-snug text-slate-400">
                {metric.helper}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
