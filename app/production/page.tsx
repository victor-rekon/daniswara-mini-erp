import { ModuleCommandBar } from "@/components/commands/module-command-bar";
import { AppShell } from "@/components/layout/app-shell";
import { CollapsibleRecords } from "@/components/mobile/collapsible-records";
import { ProductionForm } from "@/components/production/production-form";
import { ProductionRecordsTable } from "@/components/production/production-records-table";
import { ProductionSummaryCards } from "@/components/production/production-summary-cards";
import { FormFeedback } from "@/components/ui/form-feedback";
import { enrichProductionRecords, summarizeProduction } from "@/lib/calculations/production";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { Branch, Product } from "@/types/master-data";
import type { ProductionRecord } from "@/types/production";

export const dynamic = "force-dynamic";

type PageProps = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export default async function ProductionPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const supabase = createSupabaseAdmin();

  const [branchesResult, productsResult, productionResult] = await Promise.all([
    supabase.from("branches").select("id, branch_name, location, created_at").order("created_at", { ascending: false }),
    supabase.from("products").select("id, product_name, unit, created_at").order("created_at", { ascending: false }),
    supabase
      .from("production_records")
      .select("id, production_date, branch_id, product_id, batch_code, quantity_produced, unit, losses_quantity, hpp_base_cost, notes, created_at")
      .order("production_date", { ascending: false })
      .limit(100),
  ]);

  const branches = (branchesResult.data ?? []) as Branch[];
  const products = (productsResult.data ?? []) as Product[];
  const productionRecords = (productionResult.data ?? []) as ProductionRecord[];

  const productLookup = Object.fromEntries(products.map((product) => [product.id, product]));
  const branchLookup = Object.fromEntries(branches.map((branch) => [branch.id, branch]));
  const enrichedRecords = enrichProductionRecords(productionRecords, productLookup, branchLookup);
  const summary = summarizeProduction(enrichedRecords);

  return (
    <AppShell title="Production / HPP" description="Production input, losses/susut, and basic HPP management report. Not full costing/accounting.">
      <div className="grid gap-3 md:gap-4">
        <FormFeedback success={params?.success} error={params?.error} />
        <ModuleCommandBar inputLabel="Input Production" exportHref="/api/export/production" />
        <ProductionSummaryCards summary={summary} />
        <div className="grid min-w-0 gap-3 md:gap-4 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
          <section id="input-data" className="scroll-mt-24">
            <ProductionForm branches={branches} products={products} />
          </section>
          <CollapsibleRecords title="Production Records" count={enrichedRecords.length}>
            <ProductionRecordsTable records={enrichedRecords} />
          </CollapsibleRecords>
        </div>
      </div>
    </AppShell>
  );
}
