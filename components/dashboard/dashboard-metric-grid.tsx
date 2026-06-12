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

/* Brand palette: navy operational, gold revenue, green received, red risk.
   Stripe now has a sheen gradient for depth. */
const stripe: Record<V, string> = {
  navy:  "bg-gradient-to-r from-[#2f4a9e] via-[#3d5cc4] to-[#2f4a9e]",
  gold:  "bg-gradient-to-r from-[#c99a2e] via-[#e8c878] to-[#d9b25c]",
  green: "bg-gradient-to-r from-[#15803d] via-[#22a350] to-[#15803d]",
  red:   "bg-gradient-to-r from-[#b91c1c] via-[#dc4646] to-[#b91c1c]",
  amber: "bg-gradient-to-r from-[#d97706] via-[#f0a035] to-[#d97706]",
};

const valColor: Record<V, string> = {
  navy:  "text-[#233575]",
  gold:  "text-[#b8860b]",
  green: "text-[#15803d]",
  red:   "text-[#b91c1c]",
  amber: "text-[#b45309]",
};

/* Faint corner glow per variant - reinforces meaning without shouting */
const glow: Record<V, string> = {
  navy:  "from-[#2f4a9e]/[0.05]",
  gold:  "from-[#d9b25c]/[0.07]",
  green: "from-[#15803d]/[0.05]",
  red:   "from-[#b91c1c]/[0.05]",
  amber: "from-[#d97706]/[0.05]",
};

type DashboardMetricGridProps = {
  metrics: DashboardMetric[];
};

export function DashboardMetricGrid({ metrics }: DashboardMetricGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5 md:grid-cols-2 md:gap-3 lg:grid-cols-4">
      {metrics.map((metric) => {
        const v = getVariant(metric.label);
        return (
          <div
            key={metric.label}
            className="group relative cursor-pointer overflow-hidden rounded-[14px] border border-[#e6e8ef] bg-white shadow-card transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-card-hover active:scale-[0.98]"
          >
            <div
              className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${glow[v]} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
            />
            <div className={`absolute inset-x-0 top-0 h-[3px] ${stripe[v]}`} />
            <div className="relative px-3.5 pb-3 pt-3.5">
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
