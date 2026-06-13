import { AppShell } from "@/components/layout/app-shell";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export const revalidate = 30;

type StatusItem = {
  label: string;
  status: "ready" | "warning" | "blocked";
  detail: string;
};

function StatusBadge({ status }: { status: StatusItem["status"] }) {
  const label = status === "ready" ? "Ready" : status === "warning" ? "Needs Check" : "Not Ready";
  const className =
    status === "ready"
      ? "bg-emerald-500/10 text-emerald-300 ring-emerald-500/20"
      : status === "warning"
        ? "bg-amber-500/10 text-amber-300 ring-amber-500/20"
        : "bg-red-500/10 text-red-300 ring-red-500/20";

  return <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ring-1 ${className}`}>{label}</span>;
}

function StatusCard({ item }: { item: StatusItem }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#12151f] p-4 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-[#e2e8f0]">{item.label}</p>
          <p className="mt-1 text-xs leading-relaxed text-[#94a3b8]">{item.detail}</p>
        </div>
        <StatusBadge status={item.status} />
      </div>
    </div>
  );
}

export default async function SystemStatusPage() {
  const supabase = createSupabaseAdmin();
  const accessGateEnabled = Boolean(process.env.APP_ACCESS_PASSWORD?.trim());

  const [
    branchesResult,
    productsResult,
    customersResult,
    productionResult,
    quotationsResult,
    salesResult,
    deliveriesResult,
    invoicesResult,
    paymentsResult,
    expensesResult,
    journalsResult,
  ] = await Promise.all([
    supabase.from("branches").select("id", { count: "exact", head: true }),
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("customers").select("id", { count: "exact", head: true }),
    supabase.from("production_records").select("id", { count: "exact", head: true }),
    supabase.from("quotations").select("id", { count: "exact", head: true }),
    supabase.from("sales_records").select("id", { count: "exact", head: true }),
    supabase.from("delivery_records").select("id", { count: "exact", head: true }),
    supabase.from("invoices").select("id", { count: "exact", head: true }),
    supabase.from("payments").select("id", { count: "exact", head: true }),
    supabase.from("expense_records").select("id", { count: "exact", head: true }),
    supabase.from("journal_entries").select("id", { count: "exact", head: true }),
  ]);

  const coreRows = {
    branches: branchesResult.count ?? 0,
    products: productsResult.count ?? 0,
    customers: customersResult.count ?? 0,
    production: productionResult.count ?? 0,
    quotations: quotationsResult.count ?? 0,
    sales: salesResult.count ?? 0,
    deliveries: deliveriesResult.count ?? 0,
    invoices: invoicesResult.count ?? 0,
    payments: paymentsResult.count ?? 0,
    expenses: expensesResult.count ?? 0,
    journals: journalsResult.count ?? 0,
  };

  const hasCoreDemoData = coreRows.branches > 0 && coreRows.products > 0 && coreRows.customers > 0;
  const hasOperationalFlow = coreRows.production > 0 && coreRows.sales > 0 && coreRows.deliveries > 0 && coreRows.invoices > 0;

  const items: StatusItem[] = [
    {
      label: "Claude UI Baseline",
      status: "ready",
      detail: "Current premium UI, dark theme, dashboard charts, and mobile fixes are preserved.",
    },
    {
      label: "Input Command Flow",
      status: "ready",
      detail: "Sidebar has Input Command and /input page routes users to module input areas.",
    },
    {
      label: "Core Phase 1 Modules",
      status: "ready",
      detail: "Master Data, Production, Quotation, Sales/Delivery, Invoice/Payment, Accounting Light, Reports, and Dashboard exist.",
    },
    {
      label: "Demo Data Coverage",
      status: hasCoreDemoData ? "ready" : "warning",
      detail: `Master data counts: ${coreRows.branches} branch, ${coreRows.products} product, ${coreRows.customers} customer.`,
    },
    {
      label: "Operational Flow Data",
      status: hasOperationalFlow ? "ready" : "warning",
      detail: `Records: ${coreRows.production} production, ${coreRows.sales} sales, ${coreRows.deliveries} delivery, ${coreRows.invoices} invoice, ${coreRows.payments} payment.`,
    },
    {
      label: "Access Gate",
      status: accessGateEnabled ? "ready" : "blocked",
      detail: accessGateEnabled
        ? "APP_ACCESS_PASSWORD is configured. App access gate should be active."
        : "APP_ACCESS_PASSWORD is not configured in Vercel yet. App is not protected by the password gate.",
    },
    {
      label: "RLS Database Security",
      status: "blocked",
      detail: "Supabase Row Level Security is still not fully implemented. Do not enter sensitive real client data yet.",
    },
    {
      label: "Role-Based Access",
      status: "warning",
      detail: "Role tables exist, but real role-based permission enforcement is not complete yet.",
    },
  ];

  return (
    <AppShell title="System Status" description="Internal readiness checklist before client demo or real-data usage.">
      <div className="grid gap-3 md:gap-4">
        <section className="rounded-2xl border border-[#d9b25c]/20 bg-[#d9b25c]/[0.08] p-4 shadow-card">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e8c878]">Operator Note</p>
          <h3 className="mt-1 text-base font-bold text-[#e2e8f0]">Demo-ready is not the same as real-data-ready.</h3>
          <p className="mt-1 text-xs leading-relaxed text-[#cbd5e1]">
            Use this page before showing the system to a client. Real sensitive finance or operational data should wait until access gate, role access, and RLS are complete.
          </p>
        </section>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <StatusCard key={item.label} item={item} />
          ))}
        </section>
      </div>
    </AppShell>
  );
}
