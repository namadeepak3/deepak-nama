import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// SECURITY: This used to be a public endpoint that revealed whether the
// platform had any admin provisioned (info-disclosure aiding takeover-race
// recon). It is now auth-gated; only signed-in users can query it.
export const adminExists = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count, error } = await supabaseAdmin
      .from("user_roles")
      .select("*", { count: "exact", head: true })
      .eq("role", "admin");
    if (error) throw error;
    return { exists: (count ?? 0) > 0 };
  });