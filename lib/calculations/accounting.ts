import type {
  AccountingReports,
  ExpenseRecord,
  ExpenseView,
  JournalEntry,
  JournalLine,
  JournalView,
  LedgerAccountSummary,
  ProfitLossSummary,
} from "@/types/accounting";
import type { InvoicePaymentView, PaymentRecord } from "@/types/invoice-payment";
import type { Branch, ChartOfAccount } from "@/types/master-data";
import type { ProductionRecordView } from "@/types/production";

type AccountLookup = Record<string, ChartOfAccount>;
type BranchLookup = Record<string, Branch>;

function safeNumber(value: unknown): number {
  const numberValue = Number(value ?? 0);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function roundTwo(value: number): number {
  return Math.round(value * 100) / 100;
}

function normalBalance(accountType: string) {
  return accountType === "asset" || accountType === "expense" || accountType === "cost_of_goods_sold" ? "debit" : "credit";
}

export function enrichExpenses(expenses: ExpenseRecord[], accounts: AccountLookup, branches: BranchLookup): ExpenseView[] {
  return expenses.map((expense) => {
    const account = accounts[expense.account_id];
    return {
      ...expense,
      amount: safeNumber(expense.amount),
      branch_name: expense.branch_id ? branches[expense.branch_id]?.branch_name ?? "Unknown branch" : "No branch",
      account_code: account?.account_code ?? "-",
      account_name: account?.account_name ?? "Unknown account",
    };
  });
}

export function enrichJournals(entries: JournalEntry[], lines: JournalLine[], accounts: AccountLookup): JournalView[] {
  return entries.map((entry) => {
    const entryLines = lines.filter((line) => line.journal_entry_id === entry.id);
    const debitTotal = entryLines.reduce((sum, line) => sum + safeNumber(line.debit_amount), 0);
    const creditTotal = entryLines.reduce((sum, line) => sum + safeNumber(line.credit_amount), 0);
    const lineSummary = entryLines
      .map((line) => {
        const account = accounts[line.account_id];
        const amount = safeNumber(line.debit_amount) > 0 ? safeNumber(line.debit_amount) : safeNumber(line.credit_amount);
        const side = safeNumber(line.debit_amount) > 0 ? "Dr" : "Cr";
        return `${side} ${account?.account_code ?? "-"} ${account?.account_name ?? "Unknown"}: ${amount}`;
      })
      .join(" | ");

    return {
      ...entry,
      debit_total: roundTwo(debitTotal),
      credit_total: roundTwo(creditTotal),
      is_balanced: roundTwo(debitTotal) === roundTwo(creditTotal),
      line_summary: lineSummary || "No lines",
    };
  });
}

export function summarizeProfitLoss(
  invoices: InvoicePaymentView[],
  productionRecords: ProductionRecordView[],
  expenses: ExpenseView[]
): ProfitLossSummary {
  const revenue = invoices.reduce((sum, invoice) => sum + safeNumber(invoice.invoice_value), 0);
  const cogs = productionRecords.reduce((sum, record) => sum + safeNumber(record.hpp_base_cost), 0);
  const operatingExpense = expenses.reduce((sum, expense) => sum + safeNumber(expense.amount), 0);
  const grossProfit = revenue - cogs;

  return {
    revenue: roundTwo(revenue),
    cogs: roundTwo(cogs),
    gross_profit: roundTwo(grossProfit),
    operating_expense: roundTwo(operatingExpense),
    net_profit: roundTwo(grossProfit - operatingExpense),
  };
}

export function buildAccountingReports({
  accounts,
  journalLines,
  profitLoss,
  payments,
  expenses,
}: {
  accounts: ChartOfAccount[];
  journalLines: JournalLine[];
  profitLoss: ProfitLossSummary;
  payments: PaymentRecord[];
  expenses: ExpenseView[];
}): AccountingReports {
  const ledger = accounts.map<LedgerAccountSummary>((account) => {
    const lines = journalLines.filter((line) => line.account_id === account.id);
    const debitTotal = lines.reduce((sum, line) => sum + safeNumber(line.debit_amount), 0);
    const creditTotal = lines.reduce((sum, line) => sum + safeNumber(line.credit_amount), 0);
    const debitBalance = Math.max(debitTotal - creditTotal, 0);
    const creditBalance = Math.max(creditTotal - debitTotal, 0);

    return {
      account_id: account.id,
      account_code: account.account_code,
      account_name: account.account_name,
      account_type: account.account_type,
      debit_total: roundTwo(debitTotal),
      credit_total: roundTwo(creditTotal),
      net_balance: roundTwo(debitTotal - creditTotal),
      debit_balance: roundTwo(debitBalance),
      credit_balance: roundTwo(creditBalance),
      line_count: lines.length,
    };
  }).sort((a, b) => a.account_code.localeCompare(b.account_code));

  const totalDebit = ledger.reduce((sum, account) => sum + account.debit_total, 0);
  const totalCredit = ledger.reduce((sum, account) => sum + account.credit_total, 0);

  const balanceFor = (type: string) => ledger
    .filter((account) => account.account_type === type)
    .reduce((sum, account) => {
      const normal = normalBalance(account.account_type);
      return sum + (normal === "debit" ? account.debit_balance - account.credit_balance : account.credit_balance - account.debit_balance);
    }, 0);

  const assets = balanceFor("asset");
  const liabilities = balanceFor("liability");
  const equity = balanceFor("equity");
  const retainedEarnings = profitLoss.net_profit;
  const totalLiabilityEquity = liabilities + equity + retainedEarnings;

  const cashIn = payments.reduce((sum, payment) => sum + safeNumber(payment.amount), 0);
  const cashOut = expenses.reduce((sum, expense) => sum + safeNumber(expense.amount), 0);

  return {
    ledger,
    trial_balance: {
      accounts: ledger,
      total_debit: roundTwo(totalDebit),
      total_credit: roundTwo(totalCredit),
      variance: roundTwo(totalDebit - totalCredit),
      is_balanced: roundTwo(totalDebit) === roundTwo(totalCredit),
    },
    balance_sheet: {
      assets: roundTwo(assets),
      liabilities: roundTwo(liabilities),
      equity: roundTwo(equity),
      retained_earnings: roundTwo(retainedEarnings),
      total_liability_equity: roundTwo(totalLiabilityEquity),
      variance: roundTwo(assets - totalLiabilityEquity),
    },
    cash_flow: {
      cash_in: roundTwo(cashIn),
      cash_out: roundTwo(cashOut),
      net_cash_flow: roundTwo(cashIn - cashOut),
    },
  };
}
