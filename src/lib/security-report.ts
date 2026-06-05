// Snapshot of the most recent security scan and what we fixed for each finding.
// Keep this in sync with security--run_security_scan output. Server fns and
// the admin Security page both read from here so there is a single source of
// truth.

export type FixStatus = "fixed" | "mitigated" | "accepted" | "open";

export type SecurityFinding = {
  id: string;
  name: string;
  level: "error" | "warn" | "info";
  scanner: string;
  description: string;
  status: FixStatus;
  fix: string;
};

export type SecurityReport = {
  scannedAt: string;
  findings: SecurityFinding[];
};

export const LATEST_SECURITY_REPORT: SecurityReport = {
  scannedAt: "2026-06-05T10:18:51Z",
  findings: [
    {
      id: "SERVER_FN_USER_ENUMERATION",
      name: "Public server function enables admin email enumeration",
      level: "error",
      scanner: "tanstack",
      description:
        "checkEmailAllowed previously returned { allowed: true/false } based on whether the email belonged to a user with a role, letting anyone enumerate admin/editor email addresses.",
      status: "fixed",
      fix: "checkEmailAllowed now always returns { allowed: true }. Authorization is enforced server-side after sign-in via assertAdmin in every admin server function and the _authenticated route gate. Supabase Auth rejects unknown emails for password sign-in; OTP sign-up is disabled.",
    },
    {
      id: "EXPOSED_SENSITIVE_DATA",
      name: "Internal PDF template configuration readable by all authenticated users",
      level: "warn",
      scanner: "supabase_lov",
      description:
        "pdf_template_settings had a SELECT policy USING (true), exposing internal branding configuration, logo URLs, and footer text to any signed-in user.",
      status: "fixed",
      fix: "Dropped the permissive SELECT policy and added one scoped to has_role(auth.uid(), 'admin'), matching the existing admin-only management policy.",
    },
    {
      id: "SERVER_FN_MISSING_RATE_LIMIT",
      name: "Unauthenticated AI-generation endpoint has no rate limiting",
      level: "warn",
      scanner: "tanstack",
      description:
        "generateAuditPreview and createLead were public with no rate limiting, allowing quota exhaustion of the AI gateway and spam flooding the leads table.",
      status: "mitigated",
      fix: "Added per-IP in-memory rate limit (5 requests / 60s) to both endpoints via src/lib/rate-limit.ts. This is best-effort per Worker isolate; for hard guarantees, back the counter with KV/Redis or enable Cloudflare rate-limit rules on the RPC paths.",
    },
    {
      id: "SERVER_FN_INFO_DISCLOSURE",
      name: "Unauthenticated endpoint discloses admin account existence",
      level: "info",
      scanner: "tanstack",
      description:
        "adminExists let any visitor query whether an admin account had been provisioned, aiding takeover-race recon.",
      status: "fixed",
      fix: "adminExists is now gated by requireSupabaseAuth — only signed-in users can call it.",
    },
    {
      id: "SUPA_authenticated_security_definer_function_executable",
      name: "Signed-In Users Can Execute SECURITY DEFINER Function",
      level: "warn",
      scanner: "supabase",
      description:
        "has_role(uuid, app_role) and bootstrap_first_admin() are SECURITY DEFINER and callable by signed-in users.",
      status: "accepted",
      fix: "Intentional. has_role MUST be SECURITY DEFINER to avoid RLS recursion when checking roles inside policies (canonical Lovable pattern). It only reads user_roles and returns a boolean; no privilege escalation is possible. bootstrap_first_admin is an auth trigger function, not invokable from the Data API.",
    },
  ],
};