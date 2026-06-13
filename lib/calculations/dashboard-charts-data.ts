import type { InvoiceRecord } from "@/types/invoice-payment";
import type { SalesRecord, DeliveryRecord } from "@/types/sales-delivery";
import type { Product } from "@/types/master-data";

export type MonthlySalesPoint = { month: string; value: number };
export type PaymentStatusSlice = { name: string; value: number; color: string };
export type ProductDeliveredBar = { product: string; delivered: number };

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

/* 1. Sales per month — last 6 months, summed total_sales by sales_date */
export function buildMonthlySales(sales: SalesRecord[]): MonthlySalesPoint[] {
  const now = new Date();
  const buckets: { key: string; label: string; value: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: MONTH_LABELS[d.getMonth()],
      value: 0,
    });
  }
  const index = new Map(buckets.map((b, i) => [b.key, i]));
  for (const s of sales) {
    if (!s.sales_date) continue;
    const d = new Date(s.sales_date);
    if (Number.isNaN(d.getTime())) continue;
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const idx = index.get(key);
    if (idx !== undefined) {
      buckets[idx].value += Number(s.total_sales) || 0;
    }
  }
  return buckets.map((b) => ({ month: b.label, value: b.value }));
}

/* 2. Payment status — count invoices grouped by payment_status */
export function buildPaymentStatus(invoices: InvoiceRecord[]): PaymentStatusSlice[] {
  const defs: { key: InvoiceRecord["payment_status"]; name: string; color: string }[] = [
    { key: "lunas",            name: "Lunas",          color: "#34d399" },
    { key: "sebagian_dibayar", name: "Sebagian",       color: "#e8c878" },
    { key: "sudah_ditagih",    name: "Ditagih",        color: "#3d5cc4" },
    { key: "belum_ditagih",    name: "Belum Ditagih",  color: "#64748b" },
    { key: "overdue",          name: "Overdue",        color: "#f87171" },
  ];
  const counts = new Map<string, number>();
  for (const inv of invoices) {
    counts.set(inv.payment_status, (counts.get(inv.payment_status) ?? 0) + 1);
  }
  return defs
    .map((d) => ({ name: d.name, value: counts.get(d.key) ?? 0, color: d.color }))
    .filter((s) => s.value > 0);
}

/* 3. Product delivered — sum quantity_delivered per product, top 6 */
export function buildProductDelivered(
  deliveries: DeliveryRecord[],
  productLookup: Record<string, Product>,
): ProductDeliveredBar[] {
  const totals = new Map<string, number>();
  for (const d of deliveries) {
    const qty = Number(d.quantity_delivered) || 0;
    if (qty <= 0) continue;
    totals.set(d.product_id, (totals.get(d.product_id) ?? 0) + qty);
  }
  return [...totals.entries()]
    .map(([productId, delivered]) => ({
      product: productLookup[productId]?.product_name ?? "Unknown",
      delivered,
    }))
    .sort((a, b) => b.delivered - a.delivered)
    .slice(0, 6);
}
