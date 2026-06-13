import { DashboardAttentionPanel } from "@/components/dashboard/dashboard-attention-panel";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { DashboardFlowSnapshot } from "@/components/dashboard/dashboard-flow-snapshot";
import { DashboardMetricGrid } from "@/components/dashboard/dashboard-metric-grid";
import { AppShell } from "@/components/layout/app-shell";
import { enrichExpenses, summarizeProfitLoss } from "@/lib/calculations/accounting";
import { buildDashboardMetrics, buildDashboardSummary } from "@/lib/calculations/dashboard";
import { buildMonthlySales, buildPaymentStatus, buildProductDelivered } from "@/lib/calculations/dashboard-charts-data";
import { enrichInvoices, summarizeInvoices } from "@/lib/calculations/invoice-payment";
import { enrichProductionRecords, summarizeProduction } from "@/lib/calculations/production";
import { enrichQuotations, summarizeQuotations } from "@/lib/calculations/quotation";
import { enrichSalesDeliveryRecords, summarizeSalesDelivery } from "@/lib/calculations/sales-delivery";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { DashboardSummary } from "@/types/dashboard";
import type { ExpenseRecord } from "@/types/accounting";
import type { InvoiceRecord, PaymentRecord } from "@/types/invoice-payment";
import type { Branch, ChartOfAccount, Customer, Product } from "@/types/master-data";
import type { ProductionRecord } from "@/types/production";
import type { Quotation, QuotationItem } from "@/types/quotation";
import type { DeliveryRecord, SalesRecord } from "@/types/sales-delivery";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createSupabaseAdmin();

  const [branchesResult, customersResult, productsResult, accountsResult, productionResult, quotationsResult, quotationItemsResult, salesResult, deliveriesResult, invoicesResult, paymentsResult, expensesResult] = await Promise.all([
    supabase.from("branches").select("*"),
    supabase.from("customers").select("*"),
    supabase.from("products").select("*"),
    supabase.from("chart_of_accounts").select("*"),
    supabase.from("production_records").select("*"),
    supabase.from("quotations").select("*"),
    supabase.from("quotation_items").select("*"),
    supabase.from("sales_records").select("*"),
    supabase.from("delivery_records").select("*"),
    supabase.from("invoices").select("*"),
    supabase.from("payments").select("*"),
    supabase.from("expense_records").select("*"),
  ]);

  const branches = (branchesResult.data ?? []) as Branch[];
  const customers = (customersResult.data ?? []) as Customer[];
  const products = (productsResult.data ?? []) as Product[];
  const accounts = (accountsResult.data ?? []) as ChartOfAccount[];
  const productionRecords = (productionResult.data ?? []) as ProductionRecord[];
  const quotations = (quotationsResult.data ?? []) as Quotation[];
  const quotationItems = (quotationItemsResult.data ?? []) as QuotationItem[];
  const salesRecords = (salesResult.data ?? []) as SalesRecord[];
  const deliveryRecords = (deliveriesResult.data ?? []) as DeliveryRecord[];
  const invoices = (invoicesResult.data ?? []) as InvoiceRecord[];
  const payments = (paymentsResult.data ?? []) as PaymentRecord[];
  const expenses = (expensesResult.data ?? []) as ExpenseRecord[];

  const branchLookup = Object.fromEntries(branches.map((branch) => [branch.id, branch]));
  const customerLookup = Object.fromEntries(customers.map((customer) => [customer.id, customer]));
  const productLookup = Object.fromEntries(products.map((product) => [product.id, product]));
  const accountLookup = Object.fromEntries(accounts.map((account) => [account.id, account]));
  const deliveryLookup = Object.fromEntries(deliveryRecords.map((delivery) => [delivery.id, delivery]));

  const productionViews = enrichProductionRecords(productionRecords, productLookup, branchLookup);
  const quotationViews = enrichQuotations(quotations, quotationItems, customerLookup, branchLookup, productLookup);
  const salesDeliveryViews = enrichSalesDeliveryRecords(salesRecords, deliveryRecords, customerLookup, branchLookup, productLookup);
  const invoiceViews = enrichInvoices(invoices, payments, customerLookup, branchLookup, deliveryLookup);
  const expenseViews = enrichExpenses(expenses, accountLookup, branchLookup);

  const productionSummary = summarizeProduction(productionViews);
  const quotationSummary = summarizeQuotations(quotationViews);
  const salesDeliverySummary = summarizeSalesDelivery(salesDeliveryViews);
  const invoiceSummary = summarizeInvoices(invoiceViews);
  const profitLossSummary = summarizeProfitLoss(invoiceViews, productionViews, expenseViews);

  const summary: DashboardSummary = buildDashboardSummary({
    total_produced: productionSummary.total_produced,
    losses_percentage: productionSummary.losses_percentage,
    hpp_base_cost: productionSummary.total_hpp_base_cost,
    quotation_value: quotationSummary.total_value,
    sales_value: salesDeliverySummary.total_sales_value,
    invoice_value: invoiceSummary.total_invoice_value,
    payment_received: invoiceSummary.total_payment_received,
    outstanding: invoiceSummary.total_outstanding,
    operating_expense: profitLossSummary.operating_expense,
    net_profit: profitLossSummary.net_profit,
    pending_delivery_count: salesDeliverySummary.pending_delivery_count,
    overdue_invoice_count: invoiceSummary.overdue_count,
  });

  const metrics = buildDashboardMetrics(summary);
  const monthlySales = buildMonthlySales(salesDeliveryViews);
  const paymentStatus = buildPaymentStatus(invoiceViews);
  const productDelivered = buildProductDelivered(salesDeliveryViews);

  return (
    <AppShell title="Owner Dashboard" description="High-level operational summary. Every number is traceable to source module data.">
      <div className="grid gap-4 md:gap-5">
        <DashboardMetricGrid metrics={metrics} />
        <DashboardAttentionPanel summary={summary} />
        <DashboardCharts monthlySales={monthlySales} paymentStatus={paymentStatus} productDelivered={productDelivered} />
        <DashboardFlowSnapshot productionCount={productionViews.length} quotationCount={quotationViews.length} salesCount={salesDeliveryViews.length} invoiceCount={invoiceViews.length} paymentCount={payments.length} />
      </div>
    </AppShell>
  );
}
