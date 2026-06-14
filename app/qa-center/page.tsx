"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";

type QaStatus = "PASS" | "WARN" | "FAIL";

type QaResult = {
  suite_name: string;
  status: QaStatus;
  issue_type?: string;
  message: string;
  details?: Record<string, unknown>;
};

type QaPayload = {
  runId: string | null;
  generatedAt: string;
  projectName: string;
  environment: string;
  readinessScore: number;
  recommendation: string;
  overallStatus: QaStatus;
  criticalCount: number;
  warningCount: number;
  acceptedExceptions: Array<Record<string, unknown>>;
  reportSummary: string;
  results: QaResult[];
};

function statusClass(status: QaStatus) {
  if (status === "PASS") return "border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-300";
  if (status === "WARN") return "border-[#d9b25c]/25 bg-[#d9b25c]/[0.10] text-[#e8c878]";
  return "border-red-400/25 bg-red-400/[0.08] text-red-300";
}

function scoreClass(score: number) {
  if (score >= 90) return "text-emerald-300";
  if (score >= 75) return "text-[#e8c878]";
  if (score >= 60) return "text-orange-300";
  return "text-red-300";
}

export default function QaCenterPage() {
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState<QaPayload | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runValidation() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/internal/qa-center/run-validation", {
        method: "POST",
        headers: { "content-type": "application/json" },
      });
      const data = (await response.json()) as QaPayload;
      setPayload(data);
      if (!response.ok) setError(data.reportSummary || "QA validation failed.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "QA validation request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell title="QA Center" description="Developer system health check and readiness validation.">
      <div className="grid gap-4 md:gap-5">
        <section className="rounded-2xl border border-white/[0.07] surface p-5 shadow-card md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#e8c878]">Developer QA</p>
              <h1 className="mt-1 text-xl font-bold text-[#e2e8f0]">System Health Check</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#94a3b8]">
                Run automated validation before demo, UAT, or handover. This is an internal developer checkpoint, not a client feature promise.
              </p>
            </div>
            <button
              type="button"
              onClick={runValidation}
              disabled={loading}
              className="rounded-xl bg-gradient-to-br from-[#e8c878] via-[#d9b25c] to-[#c99a2e] px-5 py-3 text-sm font-bold text-[#1a2456] shadow-[0_2px_10px_-2px_rgba(217,178,92,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Running Validation..." : "Run Validation"}
            </button>
          </div>
        </section>

        {error ? (
          <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 shadow-card">
            {error}
          </div>
        ) : null}

        {payload ? (
          <>
            <section className="grid gap-3 md:grid-cols-4">
              <div className="rounded-2xl border border-white/[0.07] surface p-5 shadow-card">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#94a3b8]">Score</p>
                <p className={`mt-2 text-3xl font-bold ${scoreClass(payload.readinessScore)}`}>{payload.readinessScore}/100</p>
              </div>
              <div className="rounded-2xl border border-white/[0.07] surface p-5 shadow-card md:col-span-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#94a3b8]">Recommendation</p>
                <p className="mt-2 text-lg font-bold text-[#e2e8f0]">{payload.recommendation}</p>
                <p className="mt-1 text-xs text-[#94a3b8]">{payload.reportSummary}</p>
              </div>
              <div className={`rounded-2xl border p-5 shadow-card ${statusClass(payload.overallStatus)}`}>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] opacity-80">Overall</p>
                <p className="mt-2 text-2xl font-bold">{payload.overallStatus}</p>
              </div>
            </section>

            <section className="rounded-2xl border border-white/[0.07] surface p-5 shadow-card md:p-6">
              <div className="flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#94a3b8]">Latest Run</p>
                  <h2 className="mt-1 text-lg font-bold text-[#e2e8f0]">{payload.projectName}</h2>
                </div>
                <div className="text-xs text-[#94a3b8]">
                  <p>{new Date(payload.generatedAt).toLocaleString("id-ID")}</p>
                  <p>Environment: {payload.environment}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-2">
                {payload.results.map((result) => (
                  <div key={result.suite_name} className="rounded-xl border border-white/[0.07] bg-[#12151f] p-4">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-[#e2e8f0]">{result.suite_name}</p>
                        <p className="mt-1 text-xs leading-relaxed text-[#94a3b8]">{result.message}</p>
                      </div>
                      <span className={`w-fit rounded-full border px-2.5 py-1 text-[10px] font-bold ${statusClass(result.status)}`}>
                        {result.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.06] p-5 shadow-card">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-red-300">Critical Issues</p>
                <p className="mt-2 text-2xl font-bold text-red-200">{payload.criticalCount}</p>
              </div>
              <div className="rounded-2xl border border-[#d9b25c]/20 bg-[#d9b25c]/[0.07] p-5 shadow-card">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#e8c878]">Warnings</p>
                <p className="mt-2 text-2xl font-bold text-[#e8c878]">{payload.warningCount}</p>
              </div>
              <div className="rounded-2xl border border-white/[0.07] surface p-5 shadow-card">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#94a3b8]">Accepted Exceptions</p>
                <p className="mt-2 text-2xl font-bold text-[#e2e8f0]">{payload.acceptedExceptions.length}</p>
              </div>
            </section>
          </>
        ) : null}
      </div>
    </AppShell>
  );
}
