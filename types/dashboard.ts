export type DashboardMetric = {
  label: string;
  value: string;
  helper: string;
};

export type DashboardSummary = {
  total_produced: number;
  losses_percentage: number;
  hpp_base_cost: number;
  quotation_value: number;
  sales_value: number;
  invoice_value: number;
  payment_received: number;
  outstanding: number;
  operating_expense: number;
  net_profit: number;
  pending_delivery_count: number;
  overdue_invoice_count: number;
};
