import { ModuleCommandBar } from "@/components/commands/module-command-bar";
import { AppShell } from "@/components/layout/app-shell";
import { CollapsibleRecords } from "@/components/mobile/collapsible-records";
import { SalesDeliveryForm } from "@/components/sales-delivery/sales-delivery-form";
import { SalesDeliverySummaryCards } from "@/components/sales-delivery/sales-delivery-summary-cards";
import { SalesDeliveryTable } from "@/components/sales-delivery/sales-delivery-table";
import { FormFeedback } from "@/components/ui/form-feedback";
import { enrichQuotations } from "@/lib/calculations/quotation";
import { enrichSalesDeliveryRecords, summarizeSalesDelivery } from "@/lib/calculations/sales-delivery";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { Branch, Customer, Product } from "@/types/master-data";
import type { Quotation, QuotationItem } from "@/types/quotation";
import type { DeliveryRecord, SalesRecord } from "@/types/sales-delivery";

export const dynamic = "force-dynamic";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export default async function SalesDeliveryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = createSupabaseAdmin();

  const [branchesResult, customersResult, productsResult, quotationsResult, quotationItemsResult, salesResult, deliveriesResult] = await Promise.all([
    supabase.from("branches").select("*").order("created_at", { ascending: false }),
    supabase.from("customers").select("*").order("created_at", { ascending: false }),
    supabase.from("products").select("*").order("created_at", { ascending: false }),
    supabase.from("quotations").select("*").order("quotation_date", { ascending: false }),
    supabase.from("quotation_items").select("*"),
    supabase.from("sales_records").select("*").order("sales_date", { ascending: false }).limit(100),
    supabase.from("delivery_records").select("*"),
  ]);

  const branches = (branchesResult.data ?? []) as Branch[];
  const customers = (customersResult.data ?? []) as Customer[];
  const products = (productsResult.data ?? []) as Product[];
  const quotations = (quotationsResult.data ?? []) as Quotation[];
  const quotationItems = (quotationItemsResult.data ?? []) as QuotationItem[];
  const salesRecords = (salesResult.data ?? []) as SalesRecord[];
  const deliveryRecords = (deliveriesResult.data ?? []) as DeliveryRecord[];

  const branchLookup = Object.fromEntries(branches.map((branch) => [branch.id, branch]));
  const customerLookup = Object.fromEntries(customers.map((customer) => [customer.id, customer]));
  const productLookup = Object.fromEntries(products.map((product) => [product.id, product]));

  const enrichedQuotations = enrichQuotations(quotations, quotationItems, customerLookup, branchLookup, productLookup);
  const records = enrichSalesDeliveryRecords(salesRecords, deliveryRecords, customerLookup, branchLookup, productLookup);
  const summary = summarizeSalesDelivery(records);

  return (
    <AppShell title="Sales & Delivery" description="Customer PO/SO and surat jalan tracking. Sales report follows delivery records.">
      <div className="grid gap-3 md:gap-4">
        <FormFeedback success={params?.success} error={params?.error} />
        <ModuleCommandBar inputLabel="Input Sales / Surat Jalan" exportHref="/api/export/delivery" />
        <SalesDeliverySummaryCards summary={summary} />
        <div id="input-data" className="grid min-w-0 scroll-mt-24 gap-3 md:gap-4 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
          <SalesDeliveryForm branches={branches} customers={customers} products={products} quotations={enrichedQuotations} />
          <CollapsibleRecords title="Sales / Delivery Records" count={records.length}>
            <SalesDeliveryTable records={records} />
          </CollapsibleRecords>
        </div>
      </div>
    </AppShell>
  );
}
