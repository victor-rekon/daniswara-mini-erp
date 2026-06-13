"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import type {
  MonthlySalesPoint,
  PaymentStatusSlice,
  ProductDeliveredBar,
} from "@/lib/calculations/dashboard-charts-data";

type DashboardChartsProps = {
  monthlySales: MonthlySalesPoint[];
  paymentStatus: PaymentStatusSlice[];
  productDelivered: ProductDeliveredBar[];
};

const PANEL =
  "rounded-2xl border border-white/[0.08] bg-[#12151f] p-4 shadow-card md:p-5";
const TITLE =
  "text-[11px] font-bold uppercase tracking-[0.14em] text-[#e2e8f0]";
const GOLD = "text-[#e8c878]";

function fmtShort(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} M`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} jt`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)} rb`;
  return String(n);
}

function fmtRupiah(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n);
}

type TooltipEntry = { name?: string; value?: number; color?: string };
function DarkTooltip({
  active,
  payload,
  label,
  currency,
}: {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
  currency?: boolean;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-white/10 bg-[#0a0c12]/95 px-3 py-2 shadow-lg backdrop-blur-sm">
      {label !== undefined && (
        <p className="mb-0.5 text-[11px] font-semibold text-slate-300">{label}</p>
      )}
      {payload.map((entry, i) => (
        <p key={i} className="text-xs font-bold text-[#e8c878]">
          {entry.name ? `${entry.name}: ` : ""}
          {currency ? fmtRupiah(Number(entry.value)) : entry.value}
        </p>
      ))}
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex h-[200px] items-center justify-center text-xs text-slate-500">
      {text}
    </div>
  );
}

export function DashboardCharts({
  monthlySales,
  paymentStatus,
  productDelivered,
}: DashboardChartsProps) {
  const hasSales = monthlySales.some((m) => m.value > 0);
  const hasPayment = paymentStatus.length > 0;
  const hasDelivered = productDelivered.length > 0;

  return (
    <div className="grid gap-3 md:gap-4 xl:grid-cols-3">
      {/* 1. Sales per month */}
      <section className={`${PANEL} xl:col-span-2`}>
        <h3 className={TITLE}>
          Sales per <span className={GOLD}>Month</span>
        </h3>
        <p className="mb-3 mt-0.5 text-[10px] text-slate-500">
          Total nilai penjualan 6 bulan terakhir.
        </p>
        {hasSales ? (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={monthlySales} margin={{ top: 6, right: 10, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="salesLine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#c99a2e" />
                  <stop offset="50%" stopColor="#e8c878" />
                  <stop offset="100%" stopColor="#d9b25c" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={fmtShort}
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={48}
              />
              <Tooltip content={<DarkTooltip currency />} cursor={{ stroke: "rgba(217,178,92,0.25)" }} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="url(#salesLine)"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "#e8c878", strokeWidth: 0 }}
                activeDot={{ r: 5, fill: "#e8c878" }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState text="Belum ada data penjualan." />
        )}
      </section>

      {/* 2. Payment status */}
      <section className={PANEL}>
        <h3 className={TITLE}>
          Payment <span className={GOLD}>Status</span>
        </h3>
        <p className="mb-3 mt-0.5 text-[10px] text-slate-500">
          Distribusi status pembayaran invoice.
        </p>
        {hasPayment ? (
          <div className="flex items-center gap-3">
            <ResponsiveContainer width="55%" height={180}>
              <PieChart>
                <Pie
                  data={paymentStatus}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={72}
                  paddingAngle={2}
                  stroke="none"
                >
                  {paymentStatus.map((slice) => (
                    <Cell key={slice.name} fill={slice.color} />
                  ))}
                </Pie>
                <Tooltip content={<DarkTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5">
              {paymentStatus.map((slice) => (
                <div key={slice.name} className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-sm"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="flex-1 text-[11px] text-slate-300">{slice.name}</span>
                  <span className="text-[11px] font-bold tabular-nums text-slate-100">
                    {slice.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState text="Belum ada data invoice." />
        )}
      </section>

      {/* 3. Product delivered */}
      <section className={`${PANEL} xl:col-span-3`}>
        <h3 className={TITLE}>
          Product <span className={GOLD}>Delivered</span>
        </h3>
        <p className="mb-3 mt-0.5 text-[10px] text-slate-500">
          Total kuantitas terkirim per produk (top 6).
        </p>
        {hasDelivered ? (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={productDelivered} margin={{ top: 6, right: 10, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3d5cc4" />
                  <stop offset="100%" stopColor="#2f4a9e" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="product"
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                axisLine={{ stroke: "rgba(255,255,255,0.08)" }}
                tickLine={false}
                interval={0}
              />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip content={<DarkTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
              <Bar dataKey="delivered" fill="url(#barFill)" radius={[6, 6, 0, 0]} maxBarSize={56} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <EmptyState text="Belum ada data pengiriman." />
        )}
      </section>
    </div>
  );
}
