import { AppShell } from "@/components/layout/app-shell";
import { DashboardAttentionPanel } from "@/components/dashboard/dashboard-attention-panel";
import { DashboardFlowSnapshot } from "@/components/dashboard/dashboard-flow-snapshot";
import { DashboardMetricGrid } from "@/components/dashboard/dashboard-metric-grid";
import { enrichExpenses, summarizeProfitLoss } from "@/lib/calculations/accounting";
import { buildDashboardMetrics, buildDashboardSummary } from "@/lib/calculations/dashboard";
import { enrichInvoices, summarizeInvoices } from "@/lib/calculations/invoice-payment";
import { enrichProductionRecords, summarizeProduction } from "@/lib/calculations/production";
import { enrichQuotations, summarizeQuotations } from "@/lib/calculations/quotation";
import { enrichSalesDeliveryRecords, summarizeSalesDelivery } from "@/lib/calculations/sales-delivery";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { ExpenseRecord } from "@/types/accounting";
import type { InvoiceRecord, PaymentRecord } from "@/types/invoice-payment";
import type { Branch, ChartOfAccount, Customer, Product } from "@/types/master-data";
import type { ProductionRecord } from "@/types/production";
import type { Quotation, QuotationItem } from "@/types/quotation";
import type { DeliveryRecord, SalesRecord } from "@/types/sales-delivery";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createSupabaseAdmin();

  const branchesResult = await supabase.from("branches").select("*");
  const customersResult = await supabase.from("customers").select("*");
  const productsResult = await supabase.from("products").select("*");
  const accountsResult = await supabase.from("chart_of_accounts").select("*");
  const productionResult = await supabase.from("production_records").select("*");
  const quotationsResult = await supabase.from("quotations").select("*");
  const quotationItemsResult = await supabase.from("quotation_items").select("*");
  const salesResult = await supabase.from("sales_records").select("*");
  const deliveriesResult = await supabase.from("delivery_records").select("*");
  const invoicesResult = await supabase.from("invoices").select("*");
  const paymentsResult = await supabase.from("payments").select("*");
  const expensesResult = await supabase.from("expense_records").select("*");

  const branches = (branchesResult.data ?? []) as Branch[];
  const customers = (customersResult.data ?? []) as Customer[];
  const products = (productsResult.data ?? []) as Product[];
  const accounts = (accountsResult.data ?? []) as ChartOfAccount[];
  const production = (productionResult.data ?? []) as ProductionRecord[];
  const quotations = (quotationsResult.data ?? []) as Quotation[];
  const quotationItems = (quotationItemsResult.data ?? []) as QuotationItem[];
  const sales = (salesResult.data ?? []) as SalesRecord[];
  const deliveries = (deliveriesResult.data ?? []) as DeliveryRecord[];
  const invoices = (invoicesResult.data ?? []) as InvoiceRecord[];
  const payments = (paymentsResult.data ?? []) as PaymentRecord[];
  const expenses = (expensesResult.data ?? []) as ExpenseRecord[];

  const branchLookup = Object.fromEntries(branches.map((branch) => [branch.id, branch]));
  const customerLookup = Object.fromEntries(customers.map((customer) => [customer.id, customer]));
  const productLookup = Object.fromEntries(products.map((product) => [product.id, product]));
  const accountLookup = Object.fromEntries(accounts.map((account) => [account.id, account]));
  const deliveryLookup = Object.fromEntries(deliveries.map((delivery) => [delivery.id, delivery]));

  const productionViews = enrichProductionRecords(production, productLookup, branchLookup);
  const productionSummary = summarizeProduction(productionViews);

  const quotationViews = enrichQuotations(quotations, quotationItems, customerLookup, branchLookup, productLookup);
  const quotationSummary = summarizeQuotations(quotationViews);

  const salesViews = enrichSalesDeliveryRecords(sales, deliveries, customerLookup, branchLookup, productLookup);
  const salesSummary = summarizeSalesDelivery(salesViews);

  const invoiceViews = enrichInvoices(invoices, payments, customerLookup, branchLookup, deliveryLookup);
  const invoiceSummary = summarizeInvoices(invoiceViews);

  const expenseViews = enrichExpenses(expenses, accountLookup, branchLookup);
  const profitLoss = summarizeProfitLoss(invoiceViews, productionViews, expenseViews);

  const summary = buildDashboardSummary({
    total_produced: productionSummary.total_produced,
    losses_percentage: productionSummary.losses_percentage,
    hpp_base_cost: productionSummary.total_hpp_base_cost,
    quotation_value: quotationSummary.total_value,
    sales_value: salesSummary.total_sales_value,
    invoice_value: invoiceSummary.total_invoice_value,
    payment_received: invoiceSummary.total_payment_received,
    outstanding: invoiceSummary.total_outstanding,
    operating_expense: profitLoss.operating_expense,
    net_profit: profitLoss.net_profit,
    pending_delivery_count: salesSummary.pending_delivery_count,
    overdue_invoice_count: invoiceSummary.overdue_count,
  });

  const metrics = buildDashboardMetrics(summary);

  return (
    <AppShell title="Owner Dashboard" description="High-level operational summary. Every number is traceable to source module data.">
      <div className="grid gap-6">
        <DashboardMetricGrid metrics={metrics} />
        <DashboardAttentionPanel summary={summary} />
        <DashboardFlowSnapshot
          productionCount={production.length}
          quotationCount={quotations.length}
          salesCount={sales.length}
          invoiceCount={invoices.length}
          paymentCount={payments.length}
        />
      </div>
    </AppShell>
  );
}
