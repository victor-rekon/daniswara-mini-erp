export type InvoiceRecord = {
  id: string;
  branch_id: string | null;
  invoice_number: string;
  invoice_date: string;
  customer_id: string;
  delivery_record_id: string | null;
  invoice_value: number;
  due_date: string | null;
  payment_received: number;
  outstanding_amount: number;
  payment_status: "belum_ditagih" | "sudah_ditagih" | "sebagian_dibayar" | "lunas" | "overdue";
  notes: string | null;
  created_at: string;
};

export type PaymentRecord = {
  id: string;
  invoice_id: string;
  payment_date: string;
  amount: number;
  notes: string | null;
  created_at: string;
};

export type InvoicePaymentView = InvoiceRecord & {
  branch_name: string;
  customer_name: string;
  surat_jalan_number: string;
  so_number: string | null;
  customer_po_number: string | null;
  actual_payment_received: number;
  actual_outstanding_amount: number;
  days_until_due: number | null;
};

export type InvoicePaymentSummary = {
  invoice_count: number;
  total_invoice_value: number;
  total_payment_received: number;
  total_outstanding: number;
  unpaid_count: number;
  overdue_count: number;
  paid_count: number;
};
