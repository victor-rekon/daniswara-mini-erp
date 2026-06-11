import type { ChartOfAccount } from "@/types/master-data";
import type { ExpenseRecord, ExpenseView, JournalEntry, JournalLine, JournalView, ProfitLossSummary } from "@/types/accounting";
import type { Branch } from "@/types/master-data";
import type { InvoicePaymentView } from "@/types/invoice-payment";
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
