import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, ShieldCheck, ShieldAlert, RefreshCw, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { getSecurityReport, runRlsChecks } from "@/lib/security-checks.functions";
import type { FixStatus } from "@/lib/security-report";

export const Route = createFileRoute("/_authenticated/admin/security")({
  head: () => ({
    meta: [
      { title: "Security — Admin" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SecurityPage,
});

const STATUS_STYLES: Record<FixStatus, string> = {
  fixed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  mitigated: "bg-amber-100 text-amber-800 border-amber-200",
  accepted: "bg-slate-100 text-slate-700 border-slate-200",
  open: "bg-red-100 text-red-800 border-red-200",
};

const LEVEL_STYLES: Record<string, string> = {
  error: "bg-red-50 text-red-700 border-red-200",
  warn: "bg-amber-50 text-amber-700 border-amber-200",
  info: "bg-sky-50 text-sky-700 border-sky-200",
};

function SecurityPage() {
  const fetchReport = useServerFn(getSecurityReport);
  const fetchRls = useServerFn(runRlsChecks);

  const report = useQuery({
    queryKey: ["security-report"],
    queryFn: () => fetchReport(),
  });

  const [rlsKey, setRlsKey] = useState(0);
  const rls = useQuery({
    queryKey: ["rls-checks", rlsKey],
    queryFn: () => fetchRls(),
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Link to="/admin" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-slate-900">
              <ArrowLeft className="h-4 w-4" /> Back to admin
            </Link>
          </div>
          <h1 className="flex items-center gap-2 text-lg font-semibold">
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
            Security
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-6 py-8">
        <section className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">Latest security scan</h2>
              <p className="text-sm text-slate-500">
                {report.data
                  ? `Scanned ${new Date(report.data.scannedAt).toLocaleString()}`
                  : "Loading…"}
              </p>
            </div>
          </div>
          {report.isError && (
            <p className="text-sm text-red-600">Could not load report: {(report.error as Error).message}</p>
          )}
          <div className="space-y-3">
            {(report.data?.findings ?? []).map((f) => (
              <article key={f.id} className="rounded-md border p-4">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className={`rounded-sm border px-2 py-0.5 text-xs uppercase tracking-wide ${LEVEL_STYLES[f.level] ?? ""}`}>
                    {f.level}
                  </span>
                  <span className={`rounded-sm border px-2 py-0.5 text-xs uppercase tracking-wide ${STATUS_STYLES[f.status]}`}>
                    {f.status}
                  </span>
                  <span className="text-xs text-slate-400">{f.scanner}</span>
                </div>
                <h3 className="text-sm font-semibold text-slate-900">{f.name}</h3>
                <p className="mt-1 text-sm text-slate-700">{f.description}</p>
                <p className="mt-2 text-sm">
                  <span className="font-medium text-emerald-700">Fix:</span>{" "}
                  <span className="text-slate-700">{f.fix}</span>
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold">RLS policy verification</h2>
              <p className="text-sm text-slate-500">
                Verifies that <code>leads</code>, <code>lead_audit_log</code>,{" "}
                <code>role_audit_log</code>, <code>pdf_template_settings</code> and{" "}
                <code>user_roles</code> are still locked down.
              </p>
            </div>
            <button
              onClick={() => setRlsKey((k) => k + 1)}
              disabled={rls.isFetching}
              className="inline-flex items-center gap-2 rounded-md border bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${rls.isFetching ? "animate-spin" : ""}`} />
              Run checks
            </button>
          </div>

          {rls.data && (
            <div className={`mb-3 flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${rls.data.pass ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`}>
              {rls.data.pass ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
              <span className="font-medium">
                {rls.data.pass ? "All RLS checks pass" : "RLS checks FAILED — review immediately"}
              </span>
              <span className="text-xs text-slate-500">
                ran {new Date(rls.data.ranAt).toLocaleString()}
              </span>
            </div>
          )}

          {rls.isError && (
            <p className="text-sm text-red-600">Check failed: {(rls.error as Error).message}</p>
          )}

          <ul className="divide-y rounded-md border">
            {(rls.data?.checks ?? []).map((c, i) => (
              <li key={i} className="flex items-start gap-3 px-4 py-3">
                {c.pass ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <code className="text-sm font-semibold text-slate-900">{c.table}</code>
                    <span className="text-xs text-slate-500">{c.expectation}</span>
                  </div>
                  <p className="text-sm text-slate-700">{c.details}</p>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-4 flex items-start gap-2 text-xs text-slate-500">
            <Info className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
            CI / deploy hook: <code>GET /api/public/health/rls?token=&lt;CRON_SECRET&gt;</code>{" "}
            returns HTTP 200 when all checks pass and 500 otherwise — wire it into your deploy
            pipeline or a pg_cron job to get automated regressions alerts.
          </p>
        </section>
      </main>
    </div>
  );
}