import { AppShell } from "@/components/layout/app-shell";
import { MasterDataSection } from "@/components/master-data/master-data-section";
import { MasterDataTable } from "@/components/master-data/master-data-table";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { Branch, ChartOfAccount, Customer, Product } from "@/types/master-data";
import {
  createBranch,
  createChartOfAccount,
  createCustomer,
  createProduct,
} from "./actions";

export const revalidate = 30;

export default async function MasterDataPage() {
  const supabase = createSupabaseAdmin();

  const [branchesResult, productsResult, customersResult, accountsResult] = await Promise.all([
    supabase.from("branches").select("id, branch_name, location, created_at").order("created_at", { ascending: false }),
    supabase.from("products").select("id, product_name, unit, created_at").order("created_at", { ascending: false }),
    supabase
      .from("customers")
      .select("id, customer_name, contact, branch_id, notes, created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("chart_of_accounts")
      .select("id, account_code, account_name, account_type, created_at")
      .order("account_code", { ascending: true }),
  ]);

  const branches = (branchesResult.data ?? []) as Branch[];
  const products = (productsResult.data ?? []) as Product[];
  const customers = (customersResult.data ?? []) as Customer[];
  const accounts = (accountsResult.data ?? []) as ChartOfAccount[];

  return (
    <AppShell
      title="Master Data"
      description="Shared data used across production, sales, delivery, invoice, and accounting modules. Build this first."
    >
      <div className="grid gap-6">
        <MasterDataSection
          title="Branches"
          description="Simple branch list only. No complex multi-branch accounting in Phase 1."
        >
          <form action={createBranch} className="mb-5 grid gap-3 md:grid-cols-3">
            <input name="branch_name" placeholder="Branch name" className="rounded-xl border border-slate-200 px-3 py-2" required />
            <input name="location" placeholder="Location" className="rounded-xl border border-slate-200 px-3 py-2" />
            <button className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white" type="submit">
              Add Branch
            </button>
          </form>
          <MasterDataTable<Branch>
            columns={[
              { key: "branch_name", label: "Branch" },
              { key: "location", label: "Location" },
            ]}
            rows={branches}
            emptyText="No branches yet."
          />
        </MasterDataSection>

        <MasterDataSection title="Products" description="Product master used by production, quotation, sales, and delivery.">
          <form action={createProduct} className="mb-5 grid gap-3 md:grid-cols-3">
            <input name="product_name" placeholder="Product name" className="rounded-xl border border-slate-200 px-3 py-2" required />
            <input name="unit" placeholder="Unit" className="rounded-xl border border-slate-200 px-3 py-2" required />
            <button className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white" type="submit">
              Add Product
            </button>
          </form>
          <MasterDataTable<Product>
            columns={[
              { key: "product_name", label: "Product" },
              { key: "unit", label: "Unit" },
            ]}
            rows={products}
            emptyText="No products yet."
          />
        </MasterDataSection>

        <MasterDataSection title="Customers" description="Customer master used by quotations, customer PO/SO, delivery, and invoice.">
          <form action={createCustomer} className="mb-5 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
            <input name="customer_name" placeholder="Customer name" className="rounded-xl border border-slate-200 px-3 py-2" required />
            <input name="contact" placeholder="Contact" className="rounded-xl border border-slate-200 px-3 py-2" />
            <select name="branch_id" className="rounded-xl border border-slate-200 px-3 py-2">
              <option value="">No branch</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.branch_name}
                </option>
              ))}
            </select>
            <input name="notes" placeholder="Notes" className="rounded-xl border border-slate-200 px-3 py-2" />
            <button className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white" type="submit">
              Add Customer
            </button>
          </form>
          <MasterDataTable<Customer>
            columns={[
              { key: "customer_name", label: "Customer" },
              { key: "contact", label: "Contact" },
              { key: "notes", label: "Notes" },
            ]}
            rows={customers}
            emptyText="No customers yet."
          />
        </MasterDataSection>

        <MasterDataSection
          title="Chart of Accounts"
          description="Required for accounting light: manual journal and simple management P&L."
        >
          <form action={createChartOfAccount} className="mb-5 grid gap-3 md:grid-cols-4">
            <input name="account_code" placeholder="Code" className="rounded-xl border border-slate-200 px-3 py-2" required />
            <input name="account_name" placeholder="Account name" className="rounded-xl border border-slate-200 px-3 py-2" required />
            <select name="account_type" className="rounded-xl border border-slate-200 px-3 py-2" required>
              <option value="asset">Asset</option>
              <option value="liability">Liability</option>
              <option value="equity">Equity</option>
              <option value="revenue">Revenue</option>
              <option value="cost_of_goods_sold">Cost of Goods Sold</option>
              <option value="expense">Expense</option>
            </select>
            <button className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white" type="submit">
              Add Account
            </button>
          </form>
          <MasterDataTable<ChartOfAccount>
            columns={[
              { key: "account_code", label: "Code" },
              { key: "account_name", label: "Account" },
              { key: "account_type", label: "Type" },
            ]}
            rows={accounts}
            emptyText="No accounts yet."
          />
        </MasterDataSection>
      </div>
    </AppShell>
  );
}
