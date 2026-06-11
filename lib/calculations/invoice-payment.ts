import type { DeliveryRecord } from "@/types/sales-delivery";
import type { InvoicePaymentSummary, InvoicePaymentView, InvoiceRecord, PaymentRecord } from "@/types/invoice-payment";

type CustomerLookup = Record<string, { customer_name: string }>;
type BranchLookup = Record<string, { branch_name: string }>;

type DeliveryLookup = Record<string, DeliveryRecord>;

function safeNumber(value: unknown): number {
  const numberValue = Number(value ?? 0);
  return Number.isFinite(numberValue) ? numberValue : 0;
}

function roundTwo(value: number): number {
  return Math.round(value * 100) / 100;
}

function getDaysUntilDue(dueDate: string | null): number | null {
  if (!dueDate) return null;
  const due = new Date(`${dueDate}T00:00:00`);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.ceil((due.getTime() - today.getTime()) / 86400000);
}

export function enrichInvoices(
  invoices: InvoiceRecord[],
  payments: PaymentRecord[],
  customers: CustomerLookup,
  branches: BranchLookup,
  deliveries: DeliveryLookup
): InvoicePaymentView[] {
  return invoices.map((invoice) => {
    const invoicePayments = payments.filter((payment) => payment.invoice_id === invoice.id);
    const actualPaymentReceived = invoicePayments.reduce((sum, payment) => sum + safeNumber(payment.amount), 0);
    const paymentReceived = Math.max(safeNumber(invoice.payment_received), actualPaymentReceived);
    const outstanding = Math.max(safeNumber(invoice.invoice_value) - paymentReceived, 0);
    const delivery = invoice.delivery_record_id ? deliveries[invoice.delivery_record_id] : undefined;

    return {
      ...invoice,
      invoice_value: safeNumber(invoice.invoice_value),
      payment_received: safeNumber(invoice.payment_received),
      outstanding_amount: safeNumber(invoice.outstanding_amount),
      branch_name: invoice.branch_id ? branches[invoice.branch_id]?.branch_name ?? "Unknown branch" : "No branch",
      customer_name: customers[invoice.customer_id]?.customer_name ?? "Unknown customer",
      surat_jalan_number: delivery?.surat_jalan_number ?? "-",
      so_number: delivery?.so_number ?? null,
      customer_po_number: delivery?.customer_po_number ?? null,
      actual_payment_received: roundTwo(paymentReceived),
      actual_outstanding_amount: roundTwo(outstanding),
      days_until_due: getDaysUntilDue(invoice.due_date),
    };
  });
}

export function summarizeInvoices(invoices: InvoicePaymentView[]): InvoicePaymentSummary {
  return {
    invoice_count: invoices.length,
    total_invoice_value: roundTwo(invoices.reduce((sum, invoice) => sum + invoice.invoice_value, 0)),
    total_payment_received: roundTwo(invoices.reduce((sum, invoice) => sum + invoice.actual_payment_received, 0)),
    total_outstanding: roundTwo(invoices.reduce((sum, invoice) => sum + invoice.actual_outstanding_amount, 0)),
    unpaid_count: invoices.filter((invoice) => invoice.actual_outstanding_amount > 0).length,
    overdue_count: invoices.filter((invoice) => invoice.days_until_due !== null && invoice.days_until_due < 0 && invoice.actual_outstanding_amount > 0).length,
    paid_count: invoices.filter((invoice) => invoice.actual_outstanding_amount <= 0).length,
  };
}
