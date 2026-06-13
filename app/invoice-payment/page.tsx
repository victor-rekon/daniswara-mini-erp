import { ModuleCommandBar } from "@/components/commands/module-command-bar";
import { InvoiceForm } from "@/components/invoice-payment/invoice-form";
import { InvoicePaymentSummaryCards } from "@/components/invoice-payment/invoice-payment-summary-cards";
import { InvoicePaymentTable } from "@/components/invoice-payment/invoice-payment-table";
import { PaymentForm } from "@/components/invoice-payment/payment-form";
import { AppShell } from "@/components/layout/app-shell";
import { CollapsibleRecords } from "@/components/mobile/collapsible-records";
import { FormFeedback } from "@/components/ui/form-feedback";
import { enrichInvoices, summarizeInvoices } from "@/lib/calculations/invoice-payment";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { InvoiceRecord, PaymentRecord } from "@/types/invoice-payment";
import type { Branch, Customer } from "@/types/master-data";
import type { DeliveryRecord } from "@/types/sales-delivery";

export const dynamic = "force-dynamic";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export default async function InvoicePaymentPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = createSupabaseAdmin();

  const [branchesResult, customersResult, deliveriesResult, invoicesResult, paymentsResult] = await Promise.all([
    supabase.from("branches").select("*").order("created_at", { ascending: false }),
    supabase.from("customers").select("*").order("created_at", { ascending: false }),
    supabase.from("delivery_records").select("*").order("delivery_date", { ascending: false }),
    supabase.from("invoices").select("*").order("invoice_date", { ascending: false }).limit(100),
    supabase.from("payments").select("*").order("payment_date", { ascending: false }),
  ]);

  const branches = (branchesResult.data ?? []) as Branch[];
  const customers = (customersResult.data ?? []) as Customer[];
  const deliveries = (deliveriesResult.data ?? []) as DeliveryRecord[];
  const invoices = (invoicesResult.data ?? []) as InvoiceRecord[];
  const payments = (paymentsResult.data ?? []) as PaymentRecord[];

  const branchLookup = Object.fromEntries(branches.map((branch) => [branch.id, branch]));
  const customerLookup = Object.fromEntries(customers.map((customer) => [customer.id, customer]));
  const deliveryLookup = Object.fromEntries(deliveries.map((delivery) => [delivery.id, delivery]));

  const enrichedInvoices = enrichInvoices(invoices, payments, customerLookup, branchLookup, deliveryLookup);
  const summary = summarizeInvoices(enrichedInvoices);

  return (
    <AppShell title="Invoice & Payment" description="Invoice, payment received, customer outstanding, and overdue tracking.">
      <div className="grid gap-3 md:gap-4">
        <FormFeedback success={params?.success} error={params?.error} />
        <ModuleCommandBar inputLabel="Input Invoice / Payment" exportHref="/api/export/invoice-payment" />
        <InvoicePaymentSummaryCards summary={summary} />
        <div className="grid min-w-0 gap-3 md:gap-4 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
          <section id="input-data" className="grid scroll-mt-24 gap-3 md:gap-4">
            <InvoiceForm branches={branches} customers={customers} deliveries={deliveries} />
            <PaymentForm invoices={enrichedInvoices} />
          </section>
          <CollapsibleRecords title="Invoice Records" count={enrichedInvoices.length}>
            <InvoicePaymentTable invoices={enrichedInvoices} />
          </CollapsibleRecords>
        </div>
      </div>
    </AppShell>
  );
}
