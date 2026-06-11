import { AppShell } from "@/components/layout/app-shell";
import { ExpenseForm } from "@/components/accounting/expense-form";
import { ExpenseTable } from "@/components/accounting/expense-table";
import { JournalTable } from "@/components/accounting/journal-table";
import { ManualJournalForm } from "@/components/accounting/manual-journal-form";
import { ProfitLossSummaryCards } from "@/components/accounting/profit-loss-summary-cards";
import { enrichExpenses, enrichJournals, summarizeProfitLoss } from "@/lib/calculations/accounting";
import { enrichInvoices } from "@/lib/calculations/invoice-payment";
import { enrichProductionRecords } from "@/lib/calculations/production";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { ExpenseRecord, JournalEntry, JournalLine } from "@/types/accounting";
import type { InvoiceRecord, PaymentRecord } from "@/types/invoice-payment";
import type { Branch, ChartOfAccount, Customer, Product } from "@/types/master-data";
import type { ProductionRecord } from "@/types/production";
import type { DeliveryRecord } from "@/types/sales-delivery";

export const dynamic = "force-dynamic";

export default async function AccountingPage() {
  const supabase = createSupabaseAdmin();

  const branchesResult = await supabase.from("branches").select("*").order("created_at", { ascending: false });
  const accountsResult = await supabase.from("chart_of_accounts").select("*").order("account_code", { ascending: true });
  const customersResult = await supabase.from("customers").select("*");
  const productsResult = await supabase.from("products").select("*");
  const expensesResult = await supabase.from("expense_records").select("*").order("expense_date", { ascending: false }).limit(100);
  const journalsResult = await supabase.from("journal_entries").select("*").order("journal_date", { ascending: false }).limit(100);
  const journalLinesResult = await supabase.from("journal_lines").select("*");
  const invoicesResult = await supabase.from("invoices").select("*").order("invoice_date", { ascending: false });
  const paymentsResult = await supabase.from("payments").select("*");
  const deliveriesResult = await supabase.from("delivery_records").select("*");
  const productionResult = await supabase.from("production_records").select("*").order("production_date", { ascending: false });

  const branches = (branchesResult.data ?? []) as Branch[];
  const accounts = (accountsResult.data ?? []) as ChartOfAccount[];
  const customers = (customersResult.data ?? []) as Customer[];
  const products = (productsResult.data ?? []) as Product[];
  const expenses = (expensesResult.data ?? []) as ExpenseRecord[];
  const journals = (journalsResult.data ?? []) as JournalEntry[];
  const journalLines = (journalLinesResult.data ?? []) as JournalLine[];
  const invoices = (invoicesResult.data ?? []) as InvoiceRecord[];
  const payments = (paymentsResult.data ?? []) as PaymentRecord[];
  const deliveries = (deliveriesResult.data ?? []) as DeliveryRecord[];
  const productionRecords = (productionResult.data ?? []) as ProductionRecord[];

  const branchLookup = Object.fromEntries(branches.map((branch) => [branch.id, branch]));
  const accountLookup = Object.fromEntries(accounts.map((account) => [account.id, account]));
  const customerLookup = Object.fromEntries(customers.map((customer) => [customer.id, customer]));
  const productLookup = Object.fromEntries(products.map((product) => [product.id, product]));
  const deliveryLookup = Object.fromEntries(deliveries.map((delivery) => [delivery.id, delivery]));

  const expenseViews = enrichExpenses(expenses, accountLookup, branchLookup);
  const journalViews = enrichJournals(journals, journalLines, accountLookup);
  const invoiceViews = enrichInvoices(invoices, payments, customerLookup, branchLookup, deliveryLookup);
  const productionViews = enrichProductionRecords(productionRecords, productLookup, branchLookup);
  const profitLoss = summarizeProfitLoss(invoiceViews, productionViews, expenseViews);

  return (
    <AppShell title="Accounting Light" description="Simple journal, expense input, and management P&L only. Not full accounting or tax system.">
      <div className="grid gap-6">
        <ProfitLossSummaryCards summary={profitLoss} />
        <ExpenseForm branches={branches} accounts={accounts} />
        <ManualJournalForm accounts={accounts} />
        <ExpenseTable expenses={expenseViews} />
        <JournalTable journals={journalViews} />
      </div>
    </AppShell>
  );
}
