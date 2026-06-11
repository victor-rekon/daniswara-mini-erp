export type Quotation = {
  id: string;
  quotation_number: string;
  quotation_date: string;
  branch_id: string | null;
  customer_id: string;
  status: "draft" | "sent" | "accepted" | "rejected";
  notes: string | null;
  created_at: string;
};

export type QuotationItem = {
  id: string;
  quotation_id: string;
  product_id: string;
  quantity: number;
  selling_price: number;
  line_total: number;
  notes: string | null;
  created_at: string;
};

export type QuotationView = Quotation & {
  customer_name: string;
  branch_name: string;
  item_count: number;
  total_quantity: number;
  quotation_total: number;
  product_summary: string;
};

export type QuotationSummary = {
  total_quotations: number;
  draft_count: number;
  sent_count: number;
  accepted_count: number;
  rejected_count: number;
  total_value: number;
  accepted_value: number;
};
