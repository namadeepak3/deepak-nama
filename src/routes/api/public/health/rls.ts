import { createFileRoute } from "@tanstack/react-router";

// Public health endpoint for CI / deploy pipelines and pg_cron.
//
// Protected by a shared token (env CRON_SECRET). When the token matches and
// every RLS check in audit_rls_policies() passes, returns 200. Any failure
// returns 500 — wire your CI / "post-deploy verify" step to fail the build
// when this is non-200.
//
//   curl -fsS "https://<host>/api/public/health/rls?token=$CRON_SECRET"
export const Route = createFileRoute("/api/public/health/rls")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const expected = process.env.CRON_SECRET;
        const url = new URL(request.url);
        const got = url.searchParams.get("token") ?? request.headers.get("x-cron-secret");
        if (!expected) {
          return jsonResponse(503, { ok: false, error: "CRON_SECRET not configured" });
        }
        if (!got || got !== expected) {
          return jsonResponse(401, { ok: false, error: "Invalid token" });
        }
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          type Row = { table_name: string; expectation: string; pass: boolean; details: string };
          const rpc = supabaseAdmin.rpc as unknown as (
            fn: string,
          ) => Promise<{ data: Row[] | null; error: { message: string } | null }>;
          const { data, error } = await rpc("audit_rls_policies");
          if (error) return jsonResponse(500, { ok: false, error: error.message });
          const rows = data ?? [];
          const failed = rows.filter((r) => !r.pass);
          const ok = rows.length > 0 && failed.length === 0;
          return jsonResponse(ok ? 200 : 500, {
            ok,
            checked: rows.length,
            failed: failed.map((r) => ({ table: r.table_name, details: r.details })),
            ranAt: new Date().toISOString(),
          });
        } catch (e) {
          return jsonResponse(500, { ok: false, error: (e as Error).message });
        }
      },
    },
  },
});

function jsonResponse(status: number, body: unknown) {
  return new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
}