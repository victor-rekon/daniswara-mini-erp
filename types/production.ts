export type ProductionRecord = {
  id: string;
  production_date: string;
  branch_id: string | null;
  product_id: string;
  batch_code: string | null;
  quantity_produced: number;
  unit: string;
  losses_quantity: number;
  hpp_base_cost: number;
  notes: string | null;
  created_at: string;
};

export type ProductionRecordView = ProductionRecord & {
  product_name: string;
  branch_name: string;
  net_quantity: number;
  hpp_per_unit: number;
  losses_percentage: number;
};

export type ProductionSummary = {
  total_produced: number;
  total_losses: number;
  total_net_quantity: number;
  total_hpp_base_cost: number;
  average_hpp_per_unit: number;
  losses_percentage: number;
};
