import type { DashboardMetric } from "@/types/dashboard";

type MetricVariant = "neutral" | "profit" | "warning" | "loss" | "info";

function getVariant(label: string): MetricVariant {
  const l = label.toLowerCase();
  if (l.includes("net profit") || l.includes("payment received")) return "profit";
  if (l.includes("outstanding") || l.includes("overdue invoice")) return "loss";
  if (l.includes("losses")) return "warning";
  if (l.includes("quotation value") || l.includes("invoice value") || l.includes("sales via")) return "info";
  return "neutral";
}

/* Skill: Financial Dashboard colors — #22C55E profit, #EF4444 loss, #F59E0B warning, #3B82F6 info */
const stripe: Record<MetricVariant, string> = {
  neutral: "bg-slate-300",
  profit:  "bg-[#22c55e]",
  warning: "bg-[#f59e0b]",
  loss:    "bg-[#ef4444]",
  info:    "bg-[#3b82f6]",
};

const valColor: Record<MetricVariant, string> = {
  neutral: "text-slate-900",
  profit:  "text-[#15803d]",
  warning: "text-[#b45309]",
  loss:    "text-[#dc2626]",
  info:    "text-[#1e40af]",
};

type DashboardMetricGridProps = {
  metrics: DashboardMetric[];
};

export function DashboardMetricGrid({ metrics }: DashboardMetricGridProps) {
  return (
    /* Skill: 2-col mobile, 4-col desktop, 8px gap (data-dense) */
    <div className="grid grid-cols-2 gap-2 md:grid-cols-2 xl:grid-cols-4 md:gap-3">
      {metrics.map((metric) => {
        const v = getVariant(metric.label);
        return (
          <div
            key={metric.label}
            className="relative cursor-pointer overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/[0.06] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-black/10"
          >
            {/* Skill: left stripe financial color coding */}
            <div className={`absolute inset-y-0 left-0 w-1.5 ${stripe[v]}`} />
            {/* Skill: compact 12px card padding */}
            <div className="py-3.5 pl-5 pr-3.5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                {metric.label}
              </p>
              <p className={`mt-1.5 text-lg font-bold tabular-nums leading-tight ${valColor[v]}`}>
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
