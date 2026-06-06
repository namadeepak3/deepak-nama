import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type HomeSection = {
  id: string;
  key: string;
  enabled: boolean;
  sort_order: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta_label: string;
  cta_href: string;
};

export const listHomeSections = createServerFn({ method: "GET" }).handler(
  async (): Promise<HomeSection[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("home_sections")
      .select("id,key,enabled,sort_order,eyebrow,title,subtitle,cta_label,cta_href")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as HomeSection[];
  },
);

async function assertEditor(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  const roles = (data ?? []).map((r) => r.role as string);
  if (!roles.includes("admin") && !roles.includes("editor")) {
    throw new Error("Forbidden: admin or editor required");
  }
}

const updateInput = z.object({
  id: z.string().uuid(),
  enabled: z.boolean(),
  sort_order: z.number().int().min(0).max(999),
  eyebrow: z.string().max(200).default(""),
  title: z.string().max(300).default(""),
  subtitle: z.string().max(600).default(""),
  cta_label: z.string().max(60).default(""),
  cta_href: z.string().max(500).default(""),
});

export const updateHomeSection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: z.infer<typeof updateInput>) => updateInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertEditor(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("home_sections")
      .update({
        enabled: data.enabled,
        sort_order: data.sort_order,
        eyebrow: data.eyebrow,
        title: data.title,
        subtitle: data.subtitle,
        cta_label: data.cta_label,
        cta_href: data.cta_href,
      })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const reorderInput = z.object({
  order: z
    .array(z.object({ id: z.string().uuid(), sort_order: z.number().int().min(0).max(999) }))
    .max(100),
});

export const reorderHomeSections = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: z.infer<typeof reorderInput>) => reorderInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertEditor(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    for (const item of data.order) {
      const { error } = await supabaseAdmin
        .from("home_sections")
        .update({ sort_order: item.sort_order })
        .eq("id", item.id);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

const toggleInput = z.object({ id: z.string().uuid(), enabled: z.boolean() });
export const toggleHomeSection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: z.infer<typeof toggleInput>) => toggleInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertEditor(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("home_sections")
      .update({ enabled: data.enabled })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });