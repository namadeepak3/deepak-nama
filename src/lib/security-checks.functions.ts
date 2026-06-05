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
    type Row = { table_name: string; expectation: string; pass: boolean; details: string };
    const { data, error } = await (
      supabaseAdmin.rpc as unknown as (
        fn: string,
      ) => Promise<{ data: Row[] | null; error: { message: string } | null }>
    )("audit_rls_policies");
    if (error) {
      return {
        ranAt: new Date().toISOString(),
        pass: false,
        checks: [
          {
            table: "(introspection)",
            expectation: "Call audit_rls_policies()",
            pass: false,
            details: error.message,
          },
        ],
      };
    }
    const checks: RlsCheck[] = (data ?? []).map((r: Row) => ({
      table: r.table_name,
      expectation: r.expectation,
      pass: r.pass,
      details: r.details,
    }));
    return {
      ranAt: new Date().toISOString(),
      pass: checks.length > 0 && checks.every((c) => c.pass),
      checks,
    };
  });

export const getSecurityReport = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<SecurityReport> => {
    await assertAdmin(context.userId);
    return LATEST_SECURITY_REPORT;
  });