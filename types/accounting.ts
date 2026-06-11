export type ExpenseRecord = {
  id: string;
  expense_date: string;
  branch_id: string | null;
  account_id: string;
  description: string;
  amount: number;
  notes: string | null;
  created_at: string;
};

export type JournalEntry = {
  id: string;
  journal_date: string;
  reference_number: string | null;
  description: string | null;
  source_module: "invoice" | "payment" | "production" | "expense" | "manual" | null;
  created_at: string;
};

export type JournalLine = {
  id: string;
  journal_entry_id: string;
  account_id: string;
  debit_amount: number;
  credit_amount: number;
  notes: string | null;
  created_at: string;
};

export type ExpenseView = ExpenseRecord & {
  branch_name: string;
  account_code: string;
  account_name: string;
};

export type JournalView = JournalEntry & {
  debit_total: number;
  credit_total: number;
  is_balanced: boolean;
  line_summary: string;
};

export type ProfitLossSummary = {
  revenue: number;
  cogs: number;
  gross_profit: number;
  operating_expense: number;
  net_profit: number;
};
