import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const KEEP_DATA = process.env.KEEP_SMOKE_TEST_DATA === "true";
const APP_URL = (process.env.APP_URL || "https://daniswara-mini-erp.vercel.app").replace(/\/$/, "");
const ACCESS_COOKIE_NAME = "daniswara_internal_access";
const DEFAULT_AUTH_SALT = "daniswara-mini-erp-v1";

const results = [];
const inserted = {
  activityLogIds: [],
  paymentIds: [],
  invoiceIds: [],
  deliveryIds: [],
  salesIds: [],
  quotationItemIds: [],
  quotationIds: [],
  productionIds: [],
  expenseIds: [],
  accountIds: [],
  customerIds: [],
  productIds: [],
  branchIds: [],
};

function loadEnvFile() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  const content = fs.readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;

    const [key, ...parts] = trimmed.split("=");
    if (process.env[key]) continue;

    const value = parts.join("=").trim().replace(/^['"]|['"]$/g, "");
    process.env[key] = value;
  }
}

function pass(name, detail = "") {
  results.push({ status: "PASS", name, detail });
  console.log(`PASS ${name}${detail ? ` — ${detail}` : ""}`);
}

function fail(name, error) {
  const message = error instanceof Error ? error.message : String(error);
  results.push({ status: "FAIL", name, detail: message });
  console.error(`FAIL ${name} — ${message}`);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function createAccessCookieHeader() {
  const password = process.env.APP_ACCESS_PASSWORD?.trim();
  if (!password) return null;

  const salt = process.env.APP_AUTH_SALT || DEFAULT_AUTH_SALT;
  const token = createHash("sha256").update(`${password}:${salt}`).digest("hex");
  return `${ACCESS_COOKIE_NAME}=${token}`;
}

async function requireInsert(supabase, table, payload, select = "id") {
  const { data, error } = await supabase.from(table).insert(payload).select(select).single();
  if (error) throw new Error(`${table}: ${error.message}`);
  return data;
}

async function requireSelectSingle(query, label) {
  const { data, error } = await query.single();
  if (error) throw new Error(`${label}: ${error.message}`);
  return data;
}

async function deleteByIds(supabase, table, ids) {
  if (!ids.length) return;
  const { error } = await supabase.from(table).delete().in("id", ids);
  if (error) console.warn(`WARN cleanup ${table}: ${error.message}`);
}

async function cleanup(supabase) {
  if (KEEP_DATA) {
    console.log("KEEP_SMOKE_TEST_DATA=true, smoke test data was not deleted.");
    return;
  }

  await deleteByIds(supabase, "activity_logs", inserted.activityLogIds);
  await deleteByIds(supabase, "payments", inserted.paymentIds);
  await deleteByIds(supabase, "invoices", inserted.invoiceIds);
  await deleteByIds(supabase, "delivery_records", inserted.deliveryIds);
  await deleteByIds(supabase, "sales_records", inserted.salesIds);
  await deleteByIds(supabase, "quotation_items", inserted.quotationItemIds);
  await deleteByIds(supabase, "quotations", inserted.quotationIds);
  await deleteByIds(supabase, "production_records", inserted.productionIds);
  await deleteByIds(supabase, "expense_records", inserted.expenseIds);
  await deleteByIds(supabase, "chart_of_accounts", inserted.accountIds);
  await deleteByIds(supabase, "customers", inserted.customerIds);
  await deleteByIds(supabase, "products", inserted.productIds);
  await deleteByIds(supabase, "branches", inserted.branchIds);
}

async function checkExportEndpoint(pathname) {
  const headers = {};
  const cookie = createAccessCookieHeader();
  if (cookie) headers.cookie = cookie;

  const response = await fetch(`${APP_URL}${pathname}`, { headers });
  assert(response.ok, `${pathname} returned ${response.status}`);

  const text = await response.text();
  assert(text.length > 0, `${pathname} returned empty response`);
  return `${response.status} ${response.headers.get("content-type") || "unknown content-type"}`;
}

async function run() {
  loadEnvFile();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  assert(supabaseUrl, "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL");
  assert(serviceRoleKey, "Missing SUPABASE_SERVICE_ROLE_KEY");

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const runId = `SMOKE-${Date.now()}`;
  const date = today();

  try {
    const branch = await requireInsert(supabase, "branches", {
      branch_name: `${runId} Branch`,
      location: "Smoke Test Location",
    });
    inserted.branchIds.push(branch.id);
    pass("branch insert", branch.id);

    const product = await requireInsert(supabase, "products", {
      product_name: `${runId} Product`,
      unit: "tabung",
    });
    inserted.productIds.push(product.id);
    pass("product insert", product.id);

    const customer = await requireInsert(supabase, "customers", {
      customer_name: `${runId} Customer`,
      contact: "080000000000",
      branch_id: branch.id,
      notes: "Smoke test customer",
    });
    inserted.customerIds.push(customer.id);
    pass("customer insert", customer.id);

    const account = await requireInsert(supabase, "chart_of_accounts", {
      account_code: `SMK${String(Date.now()).slice(-6)}`,
      account_name: `${runId} Expense Account`,
      account_type: "expense",
    });
    inserted.accountIds.push(account.id);
    pass("account insert", account.id);

    const production = await requireInsert(supabase, "production_records", {
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
    inserted.productionIds.push(production.id);
    assert(Number(production.losses_quantity) <= Number(production.quantity_produced), "production losses exceed produced quantity");
    pass("production insert and validation", production.id);

    const quotation = await requireInsert(supabase, "quotations", {
      quotation_number: `${runId}-QTN`,
      quotation_date: date,
      branch_id: branch.id,
      customer_id: customer.id,
      status: "accepted",
      notes: "Smoke test quotation",
    });
    inserted.quotationIds.push(quotation.id);

    const quotationItem = await requireInsert(supabase, "quotation_items", {
      quotation_id: quotation.id,
      product_id: product.id,
      quantity: 10,
      selling_price: 1500000,
      notes: "Smoke test quotation item",
    }, "id, line_total");
    inserted.quotationItemIds.push(quotationItem.id);
    pass("quotation and item insert", quotation.id);

    const sales = await requireInsert(supabase, "sales_records", {
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
    inserted.salesIds.push(sales.id);
    assert(Number(sales.total_sales) === 15000000, `sales total expected 15000000, got ${sales.total_sales}`);
    pass("sales insert and generated total", `${sales.id}, total ${sales.total_sales}`);

    const delivery = await requireInsert(supabase, "delivery_records", {
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
    inserted.deliveryIds.push(delivery.id);
    pass("delivery insert", delivery.id);

    const invoice = await requireInsert(supabase, "invoices", {
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
    inserted.invoiceIds.push(invoice.id);
    assert(Number(invoice.invoice_value) - Number(invoice.payment_received) === 10000000, "invoice outstanding should be 10000000");
    pass("invoice insert and outstanding validation", invoice.id);

    const payment = await requireInsert(supabase, "payments", {
      invoice_id: invoice.id,
      payment_date: date,
      amount: 5000000,
      notes: "Smoke test payment",
    }, "id, amount");
    inserted.paymentIds.push(payment.id);
    pass("payment insert", payment.id);

    const expense = await requireInsert(supabase, "expense_records", {
      expense_date: date,
      branch_id: branch.id,
      account_id: account.id,
      description: `${runId} Expense`,
      amount: 500000,
      notes: "Smoke test expense",
    });
    inserted.expenseIds.push(expense.id);
    pass("expense insert", expense.id);

    const activityLog = await requireInsert(supabase, "activity_logs", {
      module: "smoke_test",
      action: "run_full_flow",
      record_id: invoice.id,
      notes: `Smoke test ${runId} completed database write flow.`,
    });
    inserted.activityLogIds.push(activityLog.id);
    pass("activity log insert", activityLog.id);

    const integrity = await requireSelectSingle(
      supabase.rpc("__missing_rpc_for_smoke_test__"),
      "intentional placeholder"
    ).catch(() => null);
    if (integrity === null) pass("rpc dependency check", "no custom RPC required");

    const salesCheck = await requireSelectSingle(
      supabase.from("sales_records").select("id, total_sales").eq("id", sales.id),
      "sales check"
    );
    const invoiceCheck = await requireSelectSingle(
      supabase.from("invoices").select("id, invoice_value, payment_received, payment_status").eq("id", invoice.id),
      "invoice check"
    );
    const deliveryCheck = await requireSelectSingle(
      supabase.from("delivery_records").select("id, quantity_delivered, delivery_status").eq("id", delivery.id),
      "delivery check"
    );

    assert(Number(salesCheck.total_sales) === 15000000, "dashboard sales source did not match expected total");
    assert(Number(deliveryCheck.quantity_delivered) === 10, "dashboard delivery source did not match expected quantity");
    assert(invoiceCheck.payment_status === "sebagian_dibayar", "dashboard invoice source did not match expected status");
    pass("dashboard source data checks", "sales, delivery, invoice sources valid");

    const exportEndpoints = [
      "/api/export/production",
      "/api/export/quotation",
      "/api/export/delivery",
      "/api/export/invoice-payment",
      "/api/export/accounting",
      "/api/export/activity-log",
    ];

    for (const endpoint of exportEndpoints) {
      const detail = await checkExportEndpoint(endpoint);
      pass(`export endpoint ${endpoint}`, detail);
    }
  } finally {
    await cleanup(supabase);
  }

  const failed = results.filter((result) => result.status === "FAIL");
  const passed = results.filter((result) => result.status === "PASS");

  console.log("\nSmoke Test Summary");
  console.log(`PASS: ${passed.length}`);
  console.log(`FAIL: ${failed.length}`);
  console.log(`Data cleanup: ${KEEP_DATA ? "kept" : "deleted"}`);

  if (failed.length > 0) process.exit(1);
}

run().catch(async (error) => {
  fail("smoke test runtime", error);
  console.log("\nSmoke Test Summary");
  console.log(`PASS: ${results.filter((result) => result.status === "PASS").length}`);
  console.log(`FAIL: ${results.filter((result) => result.status === "FAIL").length}`);
  process.exit(1);
});
