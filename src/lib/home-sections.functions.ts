import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import {
  mergeHomeSections,
  type HomeSectionContent,
  type HomeSectionRecord as HomeSection,
} from "@/lib/home-sections.shared";

export type { HomeSection, HomeSectionContent };

export const listHomeSections = createServerFn({ method: "GET" }).handler(
  async (): Promise<HomeSection[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("home_sections")
      .select("id,key,enabled,sort_order,eyebrow,title,subtitle,cta_label,cta_href,image_url,content")
      .order("sort_order", { ascending: true });
    if (error) throw new Error(error.message);
    return mergeHomeSections((data ?? []).map((r: any) => ({
      ...r,
      image_url: r.image_url ?? "",
      content: (r.content ?? {}) as HomeSectionContent,
    })) as HomeSection[]);
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
  image_url: z.string().max(1000).default(""),
  content: z.record(z.string(), z.any()).default({}),
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
        image_url: data.image_url,
        content: data.content as never,
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

const createInput = z.object({
  title: z.string().min(1).max(300),
  eyebrow: z.string().max(200).default(""),
  subtitle: z.string().max(600).default(""),
});

export const createHomeSection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: z.infer<typeof createInput>) => createInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertEditor(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .slice(0, 40) || "section";
    const key = `custom_${slug}_${Math.random().toString(36).slice(2, 7)}`;
    const { data: maxRow } = await supabaseAdmin
      .from("home_sections")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextOrder = ((maxRow?.sort_order as number | undefined) ?? -1) + 1;
    const { data: inserted, error } = await supabaseAdmin
      .from("home_sections")
      .insert({
        key,
        enabled: true,
        sort_order: nextOrder,
        eyebrow: data.eyebrow,
        title: data.title,
        subtitle: data.subtitle,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: inserted!.id as string, key };
  });

const deleteInput = z.object({ id: z.string().uuid() });
export const deleteHomeSection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: z.infer<typeof deleteInput>) => deleteInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertEditor(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error: readErr } = await supabaseAdmin
      .from("home_sections")
      .select("key")
      .eq("id", data.id)
      .single();
    if (readErr) throw new Error(readErr.message);
    if (!row || !String(row.key).startsWith("custom_")) {
      throw new Error("Only custom sections can be deleted.");
    }
    const { error } = await supabaseAdmin.from("home_sections").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });