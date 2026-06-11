export type Branch = {
  id: string;
  branch_name: string;
  location: string | null;
  created_at: string;
};

export type Product = {
  id: string;
  product_name: string;
  unit: string;
  created_at: string;
};

export type Customer = {
  id: string;
  customer_name: string;
  contact: string | null;
  branch_id: string | null;
  notes: string | null;
  created_at: string;
};

export type ChartOfAccount = {
  id: string;
  account_code: string;
  account_name: string;
  account_type:
    | "asset"
    | "liability"
    | "equity"
    | "revenue"
    | "cost_of_goods_sold"
    | "expense";
  created_at: string;
};
