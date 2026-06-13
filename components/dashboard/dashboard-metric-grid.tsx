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

/* Accent dot per variant — a small, precise signal instead of a loud stripe */
const dot: Record<V, string> = {
  navy:  "bg-[#3d5cc4]",
  gold:  "bg-[#e8c878]",
  green: "bg-[#34d399]",
  red:   "bg-[#f87171]",
  amber: "bg-[#fbbf24]",
};

const valColor: Record<V, string> = {
  navy:  "text-[#f1f4fa]",
  gold:  "text-[#e8c878]",
  green: "text-[#34d399]",
  red:   "text-[#f87171]",
  amber: "text-[#fbbf24]",
};

const glow: Record<V, string> = {
  navy:  "from-[#2f4a9e]/[0.06]",
  gold:  "from-[#d9b25c]/[0.08]",
  green: "from-[#34d399]/[0.06]",
  red:   "from-[#f87171]/[0.06]",
  amber: "from-[#d97706]/[0.06]",
};

type DashboardMetricGridProps = {
  metrics: DashboardMetric[];
};

export function DashboardMetricGrid({ metrics }: DashboardMetricGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5 md:grid-cols-2 md:gap-3.5 xl:grid-cols-4">
      {metrics.map((metric) => {
        const v = getVariant(metric.label);
        return (
          <div
            key={metric.label}
            className="group relative min-w-0 cursor-pointer overflow-hidden rounded-2xl border border-white/[0.07] surface shadow-card transition-[transform,box-shadow,border-color] duration-300 ease-out hover:-translate-y-1 hover:border-white/[0.12] hover:shadow-card-hover active:scale-[0.985]"
          >
            <div
              className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${glow[v]} to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
            />
            <div className="relative min-w-0 px-4 pb-4 pt-4 md:px-5 md:pb-5 md:pt-[18px]">
              <div className="flex items-center gap-2">
                <span className={`h-1.5 w-1.5 rounded-full ${dot[v]}`} />
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-[#8a93a8]">
                  {metric.label}
                </p>
              </div>
              <p className={`mt-2.5 whitespace-normal break-words text-lg font-semibold tabular-nums leading-tight [overflow-wrap:anywhere] md:text-xl xl:text-[26px] ${valColor[v]}`}>
                {metric.value}
              </p>
              <p className="mt-2 hidden text-[11px] leading-snug text-[#5d6577] md:block">
                {metric.helper}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
