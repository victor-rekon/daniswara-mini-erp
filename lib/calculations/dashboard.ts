import type { DashboardMetric, DashboardSummary } from "@/types/dashboard";

function roundTwo(value: number): number {
  return Math.round(value * 100) / 100;
}

export function buildDashboardSummary(input: DashboardSummary): DashboardSummary {
  return {
    total_produced: roundTwo(input.total_produced),
    losses_percentage: roundTwo(input.losses_percentage),
    hpp_base_cost: roundTwo(input.hpp_base_cost),
    quotation_value: roundTwo(input.quotation_value),
    sales_value: roundTwo(input.sales_value),
    invoice_value: roundTwo(input.invoice_value),
    payment_received: roundTwo(input.payment_received),
    outstanding: roundTwo(input.outstanding),
    operating_expense: roundTwo(input.operating_expense),
    net_profit: roundTwo(input.net_profit),
    pending_delivery_count: input.pending_delivery_count,
    overdue_invoice_count: input.overdue_invoice_count,
  };
}

export function formatDashboardCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDashboardNumber(value: number) {
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 2,
  }).format(value);
}

export function buildDashboardMetrics(summary: DashboardSummary): DashboardMetric[] {
  return [
    {
      label: "Total Produksi",
      value: formatDashboardNumber(summary.total_produced),
      helper: "Total quantity produced",
    },
    {
      label: "Losses %",
      value: `${formatDashboardNumber(summary.losses_percentage)}%`,
      helper: "Losses divided by production",
    },
    {
      label: "HPP Base Cost",
      value: formatDashboardCurrency(summary.hpp_base_cost),
      helper: "Basic production HPP cost",
    },
    {
      label: "Quotation Value",
      value: formatDashboardCurrency(summary.quotation_value),
      helper: "Total quotation value",
    },
    {
      label: "Sales via Surat Jalan",
      value: formatDashboardCurrency(summary.sales_value),
      helper: "Sales records tied to delivery flow",
    },
    {
      label: "Invoice Value",
      value: formatDashboardCurrency(summary.invoice_value),
      helper: "Total customer invoice value",
    },
    {
      label: "Payment Received",
      value: formatDashboardCurrency(summary.payment_received),
      helper: "Manual payments received",
    },
    {
      label: "Outstanding",
      value: formatDashboardCurrency(summary.outstanding),
      helper: "Customer receivables still open",
    },
    {
      label: "Operating Expense",
      value: formatDashboardCurrency(summary.operating_expense),
      helper: "Manual expense input",
    },
    {
      label: "Simple Net Profit",
      value: formatDashboardCurrency(summary.net_profit),
      helper: "Management P&L estimate",
    },
    {
      label: "Pending Delivery",
      value: String(summary.pending_delivery_count),
      helper: "Not fully delivered records",
    },
    {
      label: "Overdue Invoice",
      value: String(summary.overdue_invoice_count),
      helper: "Open invoices past due date",
    },
  ];
}
