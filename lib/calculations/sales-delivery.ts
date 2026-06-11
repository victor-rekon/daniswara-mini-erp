import type {
  DeliveryRecord,
  SalesDeliverySummary,
  SalesDeliveryView,
  SalesRecord,
} from "@/types/sales-delivery";

type CustomerLookup = Record<string, { customer_name: string }>;
type BranchLookup = Record<string, { branch_name: string }>;
type ProductLookup = Record<string, { product_name: string; unit: string }>;

function safeNumber(value: unknown): number {
  const numberValue = Number(value ?? 0);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function roundTwo(value: number): number {
  return Math.round(value * 100) / 100;
}

export function enrichSalesDeliveryRecords(
  salesRecords: SalesRecord[],
  deliveryRecords: DeliveryRecord[],
  customers: CustomerLookup,
  branches: BranchLookup,
  products: ProductLookup
): SalesDeliveryView[] {
  return salesRecords.map((record) => {
    const linkedDelivery = deliveryRecords.find((delivery) => delivery.sales_record_id === record.id);
    const quantity = safeNumber(record.quantity);
    const delivered = safeNumber(linkedDelivery?.quantity_delivered ?? 0);
    const pending = linkedDelivery ? safeNumber(linkedDelivery.quantity_pending) : quantity;

    return {
      ...record,
      quantity,
      selling_price: safeNumber(record.selling_price),
      total_sales: safeNumber(record.total_sales),
      customer_name: customers[record.customer_id]?.customer_name ?? "Unknown customer",
      branch_name: record.branch_id ? branches[record.branch_id]?.branch_name ?? "Unknown branch" : "No branch",
      product_name: products[record.product_id]?.product_name ?? "Unknown product",
      unit: products[record.product_id]?.unit ?? "unit",
      delivery_date: linkedDelivery?.delivery_date ?? null,
      quantity_delivered: roundTwo(delivered),
      quantity_pending: roundTwo(pending),
      delivery_status: linkedDelivery?.delivery_status ?? "not_created",
      receiver: linkedDelivery?.receiver ?? null,
    };
  });
}

export function summarizeSalesDelivery(records: SalesDeliveryView[]): SalesDeliverySummary {
  const totalQuantity = records.reduce((sum, record) => sum + safeNumber(record.quantity), 0);
  const totalDelivered = records.reduce((sum, record) => sum + safeNumber(record.quantity_delivered), 0);
  const totalPending = records.reduce((sum, record) => sum + safeNumber(record.quantity_pending), 0);
  const totalSalesValue = records.reduce((sum, record) => sum + safeNumber(record.total_sales), 0);

  return {
    total_sales_records: records.length,
    total_quantity: roundTwo(totalQuantity),
    total_delivered: roundTwo(totalDelivered),
    total_pending: roundTwo(totalPending),
    total_sales_value: roundTwo(totalSalesValue),
    pending_delivery_count: records.filter(
      (record) => record.delivery_status === "pending" || record.delivery_status === "partially_delivered"
    ).length,
    delivered_count: records.filter((record) => record.delivery_status === "delivered").length,
  };
}
