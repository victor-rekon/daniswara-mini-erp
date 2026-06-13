import { createSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type TestResult = {
  status: "PASS" | "FAIL";
  name: string;
  detail?: string;
};

type InsertedIds = {
  activity_logs: string[];
  payments: string[];
  invoices: string[];
  delivery_records: string[];
  sales_records: string[];
  quotation_items: string[];
  quotations: string[];
  production_records: string[];
  expense_records: string[];
  chart_of_accounts: string[];
  customers: string[];
  products: string[];
  branches: string[];
};

const CLEANUP_ORDER: Array<keyof InsertedIds> = [
  "activity_logs",
  "payments",
  "invoices",
  "delivery_records",
  "sales_records",
  "quotation_items",
  "quotations",
  "production_records",
  "expense_records",
  "chart_of_accounts",
  "customers",
  "products",
  "branches",
];

function today() {
  return new Date().toISOString().slice(0, 10);
}

function addResult(results: TestResult[], status: TestResult["status"], name: string, detail?: string) {
  results.push({ status, name, detail });
}

function assertOk(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

async function insertOne<T extends { id: string }>(supabase: ReturnType<typeof createSupabaseAdmin>, table: string, payload: Record<string, unknown>, select = "id") {
  const { data, error } = await supabase.from(table).insert(payload).select(select).single();
  if (error) throw new Error(`${table}: ${error.message}`);
  return data as unknown as T;
}

async function cleanup(supabase: ReturnType<typeof createSupabaseAdmin>, inserted: InsertedIds) {
  const warnings: string[] = [];

  for (const table of CLEANUP_ORDER) {
    const ids = inserted[table];
    if (!ids.length) continue;

    const { error } = await supabase.from(table).delete().in("id", ids);
    if (error) warnings.push(`${table}: ${error.message}`);
  }

  return warnings;
}

async function checkExport(request: Request, pathname: string) {
  const url = new URL(request.url);
  const cookie = request.headers.get("cookie") ?? "";
  const response = await fetch(`${url.origin}${pathname}`, {
    headers: cookie ? { cookie } : undefined,
    cache: "no-store",
  });

  if (!response.ok) throw new Error(`${pathname} returned ${response.status}`);

  const text = await response.text();
  if (!text.length) throw new Error(`${pathname} returned empty response`);

  return `${response.status}`;
}

export async function POST(request: Request) {
  const supabase = createSupabaseAdmin();
  const results: TestResult[] = [];
  const inserted: InsertedIds = {
    activity_logs: [],
    payments: [],
    invoices: [],
    delivery_records: [],
    sales_records: [],
    quotation_items: [],
    quotations: [],
    production_records: [],
    expense_records: [],
    chart_of_accounts: [],
    customers: [],
    products: [],
    branches: [],
  };

  const runId = `SMOKE-${Date.now()}`;
  const date = today();

  try {
    const branch = await insertOne(supabase, "branches", {
      branch_name: `${runId} Branch`,
      location: "Smoke Test",
    });
    inserted.branches.push(branch.id);
    addResult(results, "PASS", "Branch insert", branch.id);

    const product = await insertOne(supabase, "products", {
      product_name: `${runId} Product`,
      unit: "tabung",
    });
    inserted.products.push(product.id);
    addResult(results, "PASS", "Product insert", product.id);

    const customer = await insertOne(supabase, "customers", {
      customer_name: `${runId} Customer`,
      contact: "080000000000",
      branch_id: branch.id,
      notes: "Smoke test customer",
    });
    inserted.customers.push(customer.id);
    addResult(results, "PASS", "Customer insert", customer.id);

    const account = await insertOne(supabase, "chart_of_accounts", {
      account_code: `SMK${String(Date.now()).slice(-6)}`,
      account_name: `${runId} Expense Account`,
      account_type: "expense",
    });
    inserted.chart_of_accounts.push(account.id);
    addResult(results, "PASS", "Account insert", account.id);

    const production = await insertOne<{ id: string; quantity_produced: number; losses_quantity: number }>(supabase, "production_records", {
      production_date: date,
      branch_id: branch.id,
      product_id: product.id,
      batch_code: `${runId}-BATCH`,
      quantity_produced: 100,
      unit: "tabung",
      losses_quantity: 2,
      hpp_base_cost: 10000000,
      notes: "Smoke test production",
    }, "id, quantity_produced, losses_quantity");
    inserted.production_records.push(production.id);
    assertOk(Number(production.losses_quantity) <= Number(production.quantity_produced), "Production losses exceed produced quantity");
    addResult(results, "PASS", "Production insert and validation", production.id);

    const quotation = await insertOne(supabase, "quotations", {
      quotation_number: `${runId}-QTN`,
      quotation_date: date,
      branch_id: branch.id,
      customer_id: customer.id,
      status: "accepted",
      notes: "Smoke test quotation",
    });
    inserted.quotations.push(quotation.id);

    const quotationItem = await insertOne(supabase, "quotation_items", {
      quotation_id: quotation.id,
      product_id: product.id,
      quantity: 10,
      selling_price: 1500000,
      notes: "Smoke test quotation item",
    });
    inserted.quotation_items.push(quotationItem.id);
    addResult(results, "PASS", "Quotation and item insert", quotation.id);

    const sales = await insertOne<{ id: string; total_sales: number }>(supabase, "sales_records", {
      sales_date: date,
      branch_id: branch.id,
      customer_id: customer.id,
      quotation_id: quotation.id,
      so_number: `${runId}-SO`,
      customer_po_number: `${runId}-PO`,
      surat_jalan_number: `${runId}-SJ`,
      product_id: product.id,
      quantity: 10,
      selling_price: 1500000,
      sales_status: "delivered",
      notes: "Smoke test sales",
    }, "id, total_sales");
    inserted.sales_records.push(sales.id);
    assertOk(Number(sales.total_sales) === 15000000, `Sales total expected 15000000, got ${sales.total_sales}`);
    addResult(results, "PASS", "Sales insert and total", String(sales.total_sales));

    const delivery = await insertOne(supabase, "delivery_records", {
      branch_id: branch.id,
      sales_record_id: sales.id,
      so_number: `${runId}-SO`,
      customer_po_number: `${runId}-PO`,
      surat_jalan_number: `${runId}-SJ`,
      delivery_date: date,
      customer_id: customer.id,
      product_id: product.id,
      quantity_delivered: 10,
      quantity_pending: 0,
      delivery_status: "delivered",
      receiver: "Smoke Receiver",
      notes: "Smoke test delivery",
    });
    inserted.delivery_records.push(delivery.id);
    addResult(results, "PASS", "Delivery insert", delivery.id);

    const invoice = await insertOne<{ id: string; invoice_value: number; payment_received: number; payment_status: string }>(supabase, "invoices", {
      invoice_number: `${runId}-INV`,
      invoice_date: date,
      branch_id: branch.id,
      customer_id: customer.id,
      delivery_record_id: delivery.id,
      invoice_value: 15000000,
      payment_received: 5000000,
      due_date: date,
      payment_status: "sebagian_dibayar",
      notes: "Smoke test invoice",
    }, "id, invoice_value, payment_received, payment_status");
    inserted.invoices.push(invoice.id);
    assertOk(Number(invoice.invoice_value) - Number(invoice.payment_received) === 10000000, "Invoice outstanding should be 10000000");
    addResult(results, "PASS", "Invoice insert and outstanding", invoice.id);

    const payment = await insertOne(supabase, "payments", {
      invoice_id: invoice.id,
      payment_date: date,
      amount: 5000000,
      notes: "Smoke test payment",
    });
    inserted.payments.push(payment.id);
    addResult(results, "PASS", "Payment insert", payment.id);

    const expense = await insertOne(supabase, "expense_records", {
      expense_date: date,
      branch_id: branch.id,
      account_id: account.id,
      description: `${runId} Expense`,
      amount: 500000,
      notes: "Smoke test expense",
    });
    inserted.expense_records.push(expense.id);
    addResult(results, "PASS", "Expense insert", expense.id);

    const activityLog = await insertOne(supabase, "activity_logs", {
      module: "smoke_test",
      action: "run_full_flow",
      record_id: invoice.id,
      notes: `Smoke test ${runId} completed database write flow.`,
    });
    inserted.activity_logs.push(activityLog.id);
    addResult(results, "PASS", "Activity log insert", activityLog.id);

    for (const endpoint of [
      "/api/export/production",
      "/api/export/quotation",
      "/api/export/delivery",
      "/api/export/invoice-payment",
      "/api/export/accounting",
      "/api/export/activity-log",
    ]) {
      const detail = await checkExport(request, endpoint);
      addResult(results, "PASS", `Export ${endpoint}`, detail);
    }
  } catch (error) {
    addResult(results, "FAIL", "Smoke test runtime", error instanceof Error ? error.message : String(error));
  }

  const cleanupWarnings = await cleanup(supabase, inserted);
  for (const warning of cleanupWarnings) addResult(results, "FAIL", "Cleanup warning", warning);

  const passCount = results.filter((result) => result.status === "PASS").length;
  const failCount = results.filter((result) => result.status === "FAIL").length;

  return Response.json({
    ok: failCount === 0,
    runId,
    summary: { pass: passCount, fail: failCount, cleanup: cleanupWarnings.length === 0 ? "cleaned" : "warnings" },
    results,
  }, { status: failCount === 0 ? 200 : 500 });
}
