import { AppShell } from "@/components/layout/app-shell";
import { SalesDeliveryForm } from "@/components/sales-delivery/sales-delivery-form";
import { SalesDeliverySummaryCards } from "@/components/sales-delivery/sales-delivery-summary-cards";
import { SalesDeliveryTable } from "@/components/sales-delivery/sales-delivery-table";
import { enrichQuotations } from "@/lib/calculations/quotation";
import { enrichSalesDeliveryRecords, summarizeSalesDelivery } from "@/lib/calculations/sales-delivery";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { Branch, Customer, Product } from "@/types/master-data";
import type { Quotation, QuotationItem } from "@/types/quotation";
import type { DeliveryRecord, SalesRecord } from "@/types/sales-delivery";

export const revalidate = 30;

export default async function SalesDeliveryPage() {
  const supabase = createSupabaseAdmin();

  const [
    branchesResult,
    customersResult,
    productsResult,
    quotationsResult,
    quotationItemsResult,
    salesResult,
    deliveriesResult
  ] = await Promise.all([
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
        <SalesDeliverySummaryCards summary={summary} />
        <div className="grid gap-3 md:gap-4 xl:grid-cols-[420px_minmax(0,1fr)] xl:items-start">
          <SalesDeliveryForm branches={branches} customers={customers} products={products} quotations={enrichedQuotations} />
          <SalesDeliveryTable records={records} />
        </div>
      </div>
    </AppShell>
  );
}
