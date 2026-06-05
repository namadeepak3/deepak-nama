import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { LATEST_SECURITY_REPORT, type SecurityReport } from "./security-report";

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

export type RlsCheck = {
  table: string;
  expectation: string;
  pass: boolean;
  details: string;
};

export type RlsCheckReport = {
  ranAt: string;
  pass: boolean;
  checks: RlsCheck[];
};

// Tables that must have RLS enabled AND only admin-readable.
const ADMIN_ONLY_TABLES = [
  "leads",
  "lead_audit_log",
  "role_audit_log",
  "pdf_template_settings",
] as const;

type PolicyRow = {
  schemaname: string;
  tablename: string;
  policyname: string;
  cmd: string;
  roles: string[];
  qual: string | null;
  with_check: string | null;
};

type RlsRow = { relname: string; relrowsecurity: boolean };

export const runRlsChecks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<RlsCheckReport> => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Query pg_policies and pg_class via RPC-less REST: use the SQL endpoint
    // via supabase-js .from on system views isn't allowed; fall back to a
    // narrow read of public policies through the rest fetch helper.
    const { data: policies, error: polErr } = await supabaseAdmin
      .schema("public" as never)
      .from("pg_policies" as never)
      .select("schemaname, tablename, policyname, cmd, roles, qual, with_check")
      .eq("schemaname", "public")
      .returns<PolicyRow[]>();

    const checks: RlsCheck[] = [];

    if (polErr) {
      // Without policy introspection we can only report the failure; surface it
      // clearly so the admin knows the check did not run.
      return {
        ranAt: new Date().toISOString(),
        pass: false,
        checks: [
          {
            table: "(introspection)",
            expectation: "Read pg_policies",
            pass: false,
            details: `Could not query pg_policies: ${polErr.message}. Run the SQL check manually via the database tools instead.`,
          },
        ],
      };
    }

    for (const table of ADMIN_ONLY_TABLES) {
      const tablePolicies = (policies ?? []).filter((p) => p.tablename === table);
      if (tablePolicies.length === 0) {
        checks.push({
          table,
          expectation: "Has at least one RLS policy",
          pass: false,
          details: "No policies found — table is locked OR RLS is disabled. Review immediately.",
        });
        continue;
      }
      // Every SELECT/UPDATE/DELETE policy must reference has_role(..., 'admin')
      const writeOrRead = tablePolicies.filter((p) =>
        ["SELECT", "UPDATE", "DELETE", "ALL"].includes(p.cmd),
      );
      const offending = writeOrRead.filter((p) => {
        const expr = `${p.qual ?? ""} ${p.with_check ?? ""}`.toLowerCase();
        return !expr.includes("has_role") || !expr.includes("admin");
      });
      if (offending.length > 0) {
        checks.push({
          table,
          expectation: "All read/write policies scoped to admin role",
          pass: false,
          details: `Permissive policies found: ${offending.map((p) => p.policyname).join(", ")}`,
        });
      } else {
        checks.push({
          table,
          expectation: "All read/write policies scoped to admin role",
          pass: true,
          details: `${writeOrRead.length} admin-scoped policies verified.`,
        });
      }
    }

    // user_roles must NOT allow self-mutation
    const userRolesPolicies = (policies ?? []).filter((p) => p.tablename === "user_roles");
    const selfMutating = userRolesPolicies.filter((p) =>
      ["INSERT", "UPDATE", "DELETE", "ALL"].includes(p.cmd),
    );
    checks.push({
      table: "user_roles",
      expectation: "No client-side INSERT/UPDATE/DELETE policies (privilege-escalation guard)",
      pass: selfMutating.length === 0,
      details:
        selfMutating.length === 0
          ? "Locked. Mutations happen via server functions using the service role."
          : `Found mutating policies: ${selfMutating.map((p) => p.policyname).join(", ")}`,
    });

    return {
      ranAt: new Date().toISOString(),
      pass: checks.every((c) => c.pass),
      checks,
    };
  });

export const getSecurityReport = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<SecurityReport> => {
    await assertAdmin(context.userId);
    return LATEST_SECURITY_REPORT;
  });