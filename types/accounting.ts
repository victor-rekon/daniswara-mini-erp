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

export type LedgerAccountSummary = {
  account_id: string;
  account_code: string;
  account_name: string;
  account_type: string;
  debit_total: number;
  credit_total: number;
  net_balance: number;
  debit_balance: number;
  credit_balance: number;
  line_count: number;
};

export type TrialBalanceSummary = {
  accounts: LedgerAccountSummary[];
  total_debit: number;
  total_credit: number;
  variance: number;
  is_balanced: boolean;
};

export type BalanceSheetSummary = {
  assets: number;
  liabilities: number;
  equity: number;
  retained_earnings: number;
  total_liability_equity: number;
  variance: number;
};

export type CashFlowSummary = {
  cash_in: number;
  cash_out: number;
  net_cash_flow: number;
};

export type AccountingReports = {
  ledger: LedgerAccountSummary[];
  trial_balance: TrialBalanceSummary;
  balance_sheet: BalanceSheetSummary;
  cash_flow: CashFlowSummary;
};
