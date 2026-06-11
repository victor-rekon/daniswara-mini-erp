export type SalesRecord = {
  id: string;
  sales_date: string;
  branch_id: string | null;
  customer_id: string;
  quotation_id: string | null;
  so_number: string | null;
  customer_po_number: string | null;
  surat_jalan_number: string | null;
  product_id: string;
  quantity: number;
  selling_price: number;
  total_sales: number;
  sales_status: "open" | "partially_delivered" | "delivered" | "cancelled";
  notes: string | null;
  created_at: string;
};

export type DeliveryRecord = {
  id: string;
  branch_id: string | null;
  sales_record_id: string | null;
  so_number: string | null;
  customer_po_number: string | null;
  surat_jalan_number: string;
  delivery_date: string;
  customer_id: string;
  product_id: string;
  quantity_delivered: number;
  quantity_pending: number;
  delivery_status: "pending" | "partially_delivered" | "delivered" | "cancelled_issue";
  receiver: string | null;
  notes: string | null;
  created_at: string;
};

export type SalesDeliveryView = SalesRecord & {
  customer_name: string;
  branch_name: string;
  product_name: string;
  unit: string;
  delivery_date: string | null;
  quantity_delivered: number;
  quantity_pending: number;
  delivery_status: DeliveryRecord["delivery_status"] | "not_created";
  receiver: string | null;
};

export type SalesDeliverySummary = {
  total_sales_records: number;
  total_quantity: number;
  total_delivered: number;
  total_pending: number;
  total_sales_value: number;
  pending_delivery_count: number;
  delivered_count: number;
};
