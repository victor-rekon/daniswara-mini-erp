import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { canAccessPath, roleAccessRulesForQa } from "@/lib/access/roles";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type QaStatus = "PASS" | "WARN" | "FAIL";

type SuiteResult = {
  suite_name: string;
  status: QaStatus;
  issue_type?: string;
  message: string;
  details?: Record<string, unknown>;
};

const REQUIRED_TABLES = [
  "branches",
  "customers",
  "products",
  "production_records",
  "sales_records",
  "delivery_records",
  "invoices",
  "payments",
  "activity_logs",
  "qa_test_runs",
  "qa_test_results",
  "accepted_exceptions",
];

function statusRank(status: QaStatus) {
  if (status === "FAIL") return 3;
  if (status === "WARN") return 2;
  return 1;
}

function combineStatus(results: SuiteResult[]): QaStatus {
  return results.reduce<QaStatus>((current, result) => {
    return statusRank(result.status) > statusRank(current) ? result.status : current;
  }, "PASS");
}

function getRecommendation(score: number, criticalFailCount: number, acceptedExceptionCount: number) {
  if (criticalFailCount > 0 && acceptedExceptionCount < criticalFailCount) return "Not Ready";
  if (score >= 90) return "Ready for Production";
  if (score >= 75) return "Ready for UAT / Client Demo with Minor Warnings";
  if (score >= 60) return "Internal Testing Only";
  return "Not Ready";
}

function getScore(results: SuiteResult[], acceptedExceptionCount: number) {
  let score = 100;
  for (const result of results) {
    if (result.status === "FAIL") score -= 15;
    if (result.status === "WARN") score -= 5;
  }
  score += Math.min(acceptedExceptionCount * 5, 10);
  return Math.max(0, Math.min(100, score));
}

async function tableReachable(supabase: ReturnType<typeof createSupabaseAdmin>, table: string) {
  const { error, count } = await supabase.from(table).select("*", { count: "exact", head: true });
  return { ok: !error, error: error?.message, count: count ?? 0 };
}

async function runValidation(request: Request) {
  const startedAt = Date.now();
  const supabase = createSupabaseAdmin();
  const origin = new URL(request.url).origin;
  const results: SuiteResult[] = [];

  const envChecks = {
    NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    APP_ACCESS_PASSWORD: Boolean(process.env.APP_ACCESS_PASSWORD),
  };

  results.push({
    suite_name: "Smoke Test",
    status: envChecks.NEXT_PUBLIC_SUPABASE_URL && envChecks.SUPABASE_SERVICE_ROLE_KEY ? "PASS" : "FAIL",
    issue_type: "environment",
    message: envChecks.NEXT_PUBLIC_SUPABASE_URL && envChecks.SUPABASE_SERVICE_ROLE_KEY
      ? "Core environment variables are available."
      : "Missing required Supabase environment variables.",
    details: envChecks,
  });

  const cookie = request.headers.get("cookie") ?? "";
  const dashboardResponse = await fetch(`${origin}/dashboard`, {
    headers: cookie ? { cookie } : undefined,
    cache: "no-store",
  }).catch((error) => error as Error);

  results.push({
    suite_name: "Authentication Route Test",
    status: dashboardResponse instanceof Response && dashboardResponse.status < 500 ? "PASS" : "FAIL",
    issue_type: "auth",
    message: dashboardResponse instanceof Response
      ? `Dashboard route responded with HTTP ${dashboardResponse.status}.`
      : `Dashboard route failed: ${dashboardResponse.message}`,
    details: { route: "/dashboard" },
  });

  const tableResults = await Promise.all(REQUIRED_TABLES.map(async (table) => ({ table, ...(await tableReachable(supabase, table)) })));
  const missingTables = tableResults.filter((item) => !item.ok);
  results.push({
    suite_name: "Database Integrity Test",
    status: missingTables.length === 0 ? "PASS" : "FAIL",
    issue_type: "database",
    message: missingTables.length === 0
      ? "Required operational and QA tables are reachable."
      : `${missingTables.length} required table(s) are not reachable.`,
    details: { tables: tableResults },
  });

  const [salesCount, deliveryCount, invoiceCount, paymentCount, productionCount, activityCount] = await Promise.all([
    tableReachable(supabase, "sales_records"),
    tableReachable(supabase, "delivery_records"),
    tableReachable(supabase, "invoices"),
    tableReachable(supabase, "payments"),
    tableReachable(supabase, "production_records"),
    tableReachable(supabase, "activity_logs"),
  ]);

  const hasWorkflowData = salesCount.count > 0 && deliveryCount.count > 0 && invoiceCount.count > 0 && paymentCount.count > 0;
  results.push({
    suite_name: "Integration Test",
    status: hasWorkflowData ? "PASS" : "WARN",
    issue_type: "integration",
    message: hasWorkflowData
      ? "Sales, delivery, invoice, and payment data exist for relational validation."
      : "One or more workflow tables have no records yet; integration can only be partially validated.",
    details: { salesCount, deliveryCount, invoiceCount, paymentCount },
  });

  results.push({
    suite_name: "Workflow Test",
    status: productionCount.count > 0 && hasWorkflowData && activityCount.count > 0 ? "PASS" : "WARN",
    issue_type: "workflow",
    message: productionCount.count > 0 && hasWorkflowData && activityCount.count > 0
      ? "Core workflow data is present from production through payment and activity log."
      : "Full workflow test is limited because some workflow records are still missing.",
    details: { productionCount, salesCount, deliveryCount, invoiceCount, paymentCount, activityCount },
  });

  const [{ data: negativeProduction }, { data: negativeSales }, { data: negativePayments }, { data: duplicateInvoices }] = await Promise.all([
    supabase.from("production_records").select("id").or("quantity_produced.lt.0,losses_quantity.lt.0").limit(5),
    supabase.from("sales_records").select("id").or("quantity.lt.0,selling_price.lt.0,total_sales.lt.0").limit(5),
    supabase.from("payments").select("id").lt("amount", 0).limit(5),
    supabase.from("invoices").select("invoice_number").limit(500),
  ]);

  const invoiceNumbers = (duplicateInvoices ?? []).map((item) => item.invoice_number).filter(Boolean);
  const duplicateInvoiceNumbers = invoiceNumbers.filter((value, index) => invoiceNumbers.indexOf(value) !== index);
  const dataIssues = [
    ...(negativeProduction?.length ? ["negative production values"] : []),
    ...(negativeSales?.length ? ["negative sales values"] : []),
    ...(negativePayments?.length ? ["negative payment values"] : []),
    ...(duplicateInvoiceNumbers.length ? ["duplicate invoice numbers"] : []),
  ];

  results.push({
    suite_name: "Data Quality Test",
    status: dataIssues.length === 0 ? "PASS" : "FAIL",
    issue_type: "data_quality",
    message: dataIssues.length === 0 ? "No obvious negative values or duplicate invoice numbers found." : `Data quality issues found: ${dataIssues.join(", ")}.`,
    details: {
      negativeProductionCount: negativeProduction?.length ?? 0,
      negativeSalesCount: negativeSales?.length ?? 0,
      negativePaymentCount: negativePayments?.length ?? 0,
      duplicateInvoiceNumbers: [...new Set(duplicateInvoiceNumbers)],
    },
  });

  const roleChecks = [
    { role: "owner", path: "/dashboard", expected: true },
    { role: "admin", path: "/master-data", expected: true },
    { role: "finance", path: "/invoice-payment", expected: true },
    { role: "finance", path: "/dashboard", expected: false },
    { role: "staff", path: "/production", expected: true },
    { role: "staff", path: "/dashboard", expected: false },
    { role: "staff", path: "/qa-center", expected: false },
  ].map((check) => ({ ...check, actual: canAccessPath(check.role, check.path) }));
  const failedRoleChecks = roleChecks.filter((check) => check.actual !== check.expected);

  results.push({
    suite_name: "Permission & Security Test",
    status: envChecks.APP_ACCESS_PASSWORD && failedRoleChecks.length === 0 ? "PASS" : "FAIL",
    issue_type: "security",
    message: envChecks.APP_ACCESS_PASSWORD && failedRoleChecks.length === 0
      ? "Basic access password and role-based page permissions are configured."
      : "Permission/security validation failed. Check app access password and role access rules.",
    details: {
      appAccessPasswordConfigured: envChecks.APP_ACCESS_PASSWORD,
      roleBasedAccess: "implemented_minimum_mvp",
      roleRules: roleAccessRulesForQa(),
      roleChecks,
      failedRoleChecks,
    },
  });

  const pagePaths = ["/dashboard", "/production", "/sales-delivery", "/invoice-payment", "/reports", "/qa-center"];
  const pageChecks = await Promise.all(pagePaths.map(async (path) => {
    const response = await fetch(`${origin}${path}`, {
      headers: cookie ? { cookie } : undefined,
      cache: "no-store",
    }).catch((error) => error as Error);

    return {
      path,
      ok: response instanceof Response && response.status < 500,
      status: response instanceof Response ? response.status : "request_failed",
    };
  }));

  const brokenPages = pageChecks.filter((page) => !page.ok);
  results.push({
    suite_name: "UI Consistency Test",
    status: brokenPages.length === 0 ? "PASS" : "FAIL",
    issue_type: "ui",
    message: brokenPages.length === 0 ? "Main pages respond without server error." : `${brokenPages.length} main page(s) returned server errors.`,
    details: { pages: pageChecks },
  });

  const elapsedMs = Date.now() - startedAt;
  results.push({
    suite_name: "Performance Test",
    status: elapsedMs <= 5000 ? "PASS" : elapsedMs <= 9000 ? "WARN" : "FAIL",
    issue_type: "performance",
    message: `Validation completed in ${elapsedMs} ms.`,
    details: { elapsedMs },
  });

  results.push({
    suite_name: "Regression Test",
    status: combineStatus(results) === "FAIL" ? "FAIL" : "PASS",
    issue_type: "regression",
    message: combineStatus(results) === "FAIL"
      ? "One or more core validation suites failed after recent changes."
      : "No critical regression detected in current validation run.",
  });

  const { data: activeExceptions } = await supabase
    .from("accepted_exceptions")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const failCount = results.filter((item) => item.status === "FAIL").length;
  const warnCount = results.filter((item) => item.status === "WARN").length;
  const acceptedExceptionCount = activeExceptions?.length ?? 0;
  const score = getScore(results, acceptedExceptionCount);
  const recommendation = getRecommendation(score, failCount, acceptedExceptionCount);
  const overallStatus: QaStatus = failCount > 0 ? "FAIL" : warnCount > 0 ? "WARN" : "PASS";

  const reportSummary = `${recommendation}. Score ${score}/100. ${failCount} critical fail(s), ${warnCount} warning(s), ${acceptedExceptionCount} accepted exception(s).`;

  const { data: run, error: runError } = await supabase
    .from("qa_test_runs")
    .insert({
      project_name: "Daniswara Mini ERP",
      environment: process.env.VERCEL_ENV ?? "production",
      readiness_score: score,
      recommendation,
      status: overallStatus,
      critical_count: failCount,
      warning_count: warnCount,
      accepted_exception_count: acceptedExceptionCount,
      report_summary: reportSummary,
      created_by: "QA Center",
    })
    .select("id")
    .single();

  if (runError) throw new Error(`Could not save QA test run: ${runError.message}`);

  const resultRows = results.map((result) => ({
    run_id: run.id,
    suite_name: result.suite_name,
    status: result.status,
    issue_type: result.issue_type ?? null,
    message: result.message,
    details: result.details ?? {},
  }));

  const { error: resultError } = await supabase.from("qa_test_results").insert(resultRows);
  if (resultError) throw new Error(`Could not save QA test results: ${resultError.message}`);

  return {
    runId: run.id,
    generatedAt: new Date().toISOString(),
    projectName: "Daniswara Mini ERP",
    environment: process.env.VERCEL_ENV ?? "production",
    readinessScore: score,
    recommendation,
    overallStatus,
    criticalCount: failCount,
    warningCount: warnCount,
    acceptedExceptions: activeExceptions ?? [],
    reportSummary,
    results,
  };
}

export async function POST(request: Request) {
  try {
    const payload = await runValidation(request);
    return Response.json(payload, { status: 200 });
  } catch (error) {
    return Response.json({
      runId: null,
      generatedAt: new Date().toISOString(),
      projectName: "Daniswara Mini ERP",
      environment: process.env.VERCEL_ENV ?? "production",
      readinessScore: 0,
      recommendation: "Not Ready",
      overallStatus: "FAIL",
      criticalCount: 1,
      warningCount: 0,
      acceptedExceptions: [],
      reportSummary: error instanceof Error ? error.message : "QA Center validation failed.",
      results: [{
        suite_name: "QA Center Runtime",
        status: "FAIL",
        issue_type: "runtime",
        message: error instanceof Error ? error.message : "QA Center validation failed.",
      }],
    }, { status: 500 });
  }
}
