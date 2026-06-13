"use client";

import { useState } from "react";

type SmokeResult = {
  status: "PASS" | "FAIL";
  name: string;
  detail?: string;
};

type SmokeResponse = {
  ok: boolean;
  runId: string;
  summary: {
    pass: number;
    fail: number;
    cleanup: string;
  };
  results: SmokeResult[];
};

export default function SystemTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SmokeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runSmokeTest() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/internal/smoke-test", {
        method: "POST",
        headers: { "content-type": "application/json" },
      });
      const payload = (await response.json()) as SmokeResponse;
      setResult(payload);

      if (!response.ok) {
        setError("Smoke test finished with failures. See details below.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Smoke test request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-transparent px-4 py-6 text-slate-100 md:px-8">
      <section className="mx-auto grid max-w-4xl gap-4">
        <div className="rounded-2xl border border-white/[0.08] bg-[#12151f] p-5 shadow-card">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e8c878]">Internal QA</p>
          <h1 className="mt-1 text-xl font-bold text-[#e2e8f0]">System Smoke Test</h1>
          <p className="mt-2 text-sm leading-relaxed text-[#94a3b8]">
            Runs a temporary full-flow test: master data, production, quotation, sales, delivery, invoice, payment, expense, activity log, and export endpoints. Test data is deleted after the run.
          </p>
          <button
            type="button"
            onClick={runSmokeTest}
            disabled={loading}
            className="mt-4 rounded-xl bg-gradient-to-br from-[#e8c878] via-[#d9b25c] to-[#c99a2e] px-4 py-2.5 text-sm font-bold text-[#1a2456] shadow-[0_2px_10px_-2px_rgba(217,178,92,0.45)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Running Smoke Test..." : "Run Smoke Test"}
          </button>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 shadow-card">
            {error}
          </div>
        ) : null}

        {result ? (
          <section className="rounded-2xl border border-white/[0.08] bg-[#12151f] p-5 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#94a3b8]">Result</p>
                <h2 className={`mt-1 text-lg font-bold ${result.ok ? "text-emerald-300" : "text-red-300"}`}>
                  {result.ok ? "PASS" : "FAIL"}
                </h2>
              </div>
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs text-[#94a3b8]">
                {result.runId}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded-xl bg-white/[0.04] p-3">
                <p className="text-xs text-[#94a3b8]">Pass</p>
                <p className="text-lg font-bold text-emerald-300">{result.summary.pass}</p>
              </div>
              <div className="rounded-xl bg-white/[0.04] p-3">
                <p className="text-xs text-[#94a3b8]">Fail</p>
                <p className="text-lg font-bold text-red-300">{result.summary.fail}</p>
              </div>
              <div className="rounded-xl bg-white/[0.04] p-3">
                <p className="text-xs text-[#94a3b8]">Cleanup</p>
                <p className="text-lg font-bold text-[#e2e8f0]">{result.summary.cleanup}</p>
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              {result.results.map((item, index) => (
                <div key={`${item.name}-${index}`} className="rounded-xl border border-white/[0.08] bg-[#161a26] p-3 text-sm">
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-[#e2e8f0]">{item.name}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.status === "PASS" ? "bg-emerald-500/10 text-emerald-300" : "bg-red-500/10 text-red-300"}`}>
                      {item.status}
                    </span>
                  </div>
                  {item.detail ? <p className="mt-1 break-words text-xs text-[#94a3b8]">{item.detail}</p> : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}
