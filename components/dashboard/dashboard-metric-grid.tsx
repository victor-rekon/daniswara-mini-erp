import type { DashboardMetric } from "@/types/dashboard";

type V = "navy" | "gold" | "green" | "red" | "amber";

function getVariant(label: string): V {
  const l = label.toLowerCase();
  if (l.includes("net profit") || l.includes("payment received")) return "green";
  if (l.includes("outstanding") || l.includes("overdue invoice")) return "red";
  if (l.includes("losses")) return "amber";
  if (l.includes("quotation value") || l.includes("invoice value") || l.includes("sales via")) return "gold";
  return "navy";
}

/* Brand palette: navy operational, gold revenue, green received, red risk */
const stripe: Record<V, string> = {
  navy:  "bg-[#2f4a9e]",
  gold:  "bg-gradient-to-r from-[#c99a2e] to-[#d9b25c]",
  green: "bg-[#15803d]",
  red:   "bg-[#b91c1c]",
  amber: "bg-[#d97706]",
};

const valColor: Record<V, string> = {
  navy:  "text-[#233575]",
  gold:  "text-[#b8860b]",
  green: "text-[#15803d]",
  red:   "text-[#b91c1c]",
  amber: "text-[#b45309]",
};

type DashboardMetricGridProps = {
  metrics: DashboardMetric[];
};

export function DashboardMetricGrid({ metrics }: DashboardMetricGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5 md:grid-cols-2 md:gap-3 xl:grid-cols-4">
      {metrics.map((metric) => {
        const v = getVariant(metric.label);
        return (
          <div
            key={metric.label}
            className="relative cursor-pointer overflow-hidden rounded-[14px] border border-[#e6e8ef] bg-white shadow-[0_1px_2px_rgba(26,36,86,0.04)] transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
          >
            <div className={`absolute inset-x-0 top-0 h-[2.5px] ${stripe[v]}`} />
            <div className="px-3.5 pb-3 pt-3.5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#7a829b]">
                {metric.label}
              </p>
              <p className={`mt-1.5 text-lg font-bold tabular-nums leading-tight tracking-tight ${valColor[v]}`}>
                {metric.value}
              </p>
              <p className="mt-1 text-[10px] leading-snug text-[#a4aabe]">
                {metric.helper}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
