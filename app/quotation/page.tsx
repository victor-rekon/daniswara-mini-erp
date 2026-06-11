import { AppShell } from "@/components/layout/app-shell";
import { QuotationForm } from "@/components/quotation/quotation-form";
import { QuotationSummaryCards } from "@/components/quotation/quotation-summary-cards";
import { QuotationTable } from "@/components/quotation/quotation-table";
import { enrichQuotations, summarizeQuotations } from "@/lib/calculations/quotation";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { Branch, Customer, Product } from "@/types/master-data";
import type { Quotation, QuotationItem } from "@/types/quotation";

export default async function QuotationPage() {
  const supabase = createSupabaseAdmin();

  const [branchesResult, customersResult, productsResult, quotationsResult, itemsResult] = await Promise.all([
    supabase.from("branches").select("id, branch_name, location, created_at").order("created_at", { ascending: false }),
    supabase
      .from("customers")
      .select("id, customer_name, contact, branch_id, notes, created_at")
      .order("created_at", { ascending: false }),
    supabase.from("products").select("id, product_name, unit, created_at").order("created_at", { ascending: false }),
    supabase
      .from("quotations")
      .select("id, quotation_number, quotation_date, branch_id, customer_id, status, notes, created_at")
      .order("quotation_date", { ascending: false })
      .limit(100),
    supabase
      .from("quotation_items")
      .select("id, quotation_id, product_id, quantity, selling_price, line_total, notes, created_at"),
  ]);

  const branches = (branchesResult.data ?? []) as Branch[];
  const customers = (customersResult.data ?? []) as Customer[];
  const products = (productsResult.data ?? []) as Product[];
  const quotations = (quotationsResult.data ?? []) as Quotation[];
  const quotationItems = (itemsResult.data ?? []) as QuotationItem[];

  const branchLookup = Object.fromEntries(branches.map((branch) => [branch.id, branch]));
  const customerLookup = Object.fromEntries(customers.map((customer) => [customer.id, customer]));
  const productLookup = Object.fromEntries(products.map((product) => [product.id, product]));

  const enrichedQuotations = enrichQuotations(
    quotations,
    quotationItems,
    customerLookup,
    branchLookup,
    productLookup
  );
  const summary = summarizeQuotations(enrichedQuotations);

  return (
    <AppShell
      title="Quotation"
      description="Simple quotation tracking. No approval, versioning, e-signature, or complex PDF template in Phase 1."
    >
      <div className="grid gap-6">
        <QuotationSummaryCards summary={summary} />
        <QuotationForm branches={branches} customers={customers} products={products} />
        <QuotationTable quotations={enrichedQuotations} />
      </div>
    </AppShell>
  );
}
