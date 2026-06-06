import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type Announcement = {
  id: string;
  enabled: boolean;
  message: string;
  cta_label: string;
  cta_href: string;
};

export const getAnnouncement = createServerFn({ method: "GET" }).handler(
  async (): Promise<Announcement | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("announcement_bar")
      .select("id,enabled,message,cta_label,cta_href")
      .limit(1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (data as Announcement | null) ?? null;
  }
);

const updateInput = z.object({
  id: z.string().uuid(),
  enabled: z.boolean(),
  message: z.string().max(300).default(""),
  cta_label: z.string().max(60).default(""),
  cta_href: z.string().max(500).default(""),
});

export const updateAnnouncement = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: z.infer<typeof updateInput>) => updateInput.parse(d))
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: roles, error: rErr } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (rErr) throw new Error(rErr.message);
    const r = (roles ?? []).map((x) => x.role as string);
    if (!r.includes("admin") && !r.includes("editor")) {
      throw new Error("Forbidden: admin or editor required");
    }
    const { error } = await supabaseAdmin
      .from("announcement_bar")
      .update({
        enabled: data.enabled,
        message: data.message,
        cta_label: data.cta_label,
        cta_href: data.cta_href,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });