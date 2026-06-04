import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { mapRow, type Service, type ServiceRow } from "@/lib/services.shared";

const tierSchema = z.object({
  name: z.string().min(1).max(80),
  price: z.string().min(1).max(40),
  cadence: z.string().max(40).default(""),
  blurb: z.string().max(400).default(""),
  features: z.array(z.string().min(1).max(200)).max(20).default([]),
  highlighted: z.boolean().optional(),
});

const stepSchema = z.object({
  step: z.string().min(1).max(80),
  detail: z.string().max(400),
});

const faqSchema = z.object({
  q: z.string().min(1).max(200),
  a: z.string().min(1).max(1000),
});

const serviceInputSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(80).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, dashes"),
  title: z.string().min(1).max(160),
  tag: z.string().max(80).default(""),
  icon: z.string().min(1).max(40),
  short_desc: z.string().max(400).default(""),
  intro: z.string().max(4000).default(""),
  ai_angle: z.string().max(4000).default(""),
  deliverables: z.array(z.string().min(1).max(400)).max(20).default([]),
  process: z.array(stepSchema).max(12).default([]),
  faqs: z.array(faqSchema).max(20).default([]),
  tiers: z.array(tierSchema).max(6).default([]),
  sort_order: z.number().int().min(0).max(9999).default(0),
});

export type ServiceInput = z.infer<typeof serviceInputSchema>;

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

export const listServices = createServerFn({ method: "GET" }).handler(async (): Promise<Service[]> => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return ((data ?? []) as ServiceRow[]).map(mapRow);
});

export const getServiceBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => z.object({ slug: z.string().min(1).max(80) }).parse(input))
  .handler(async ({ data }): Promise<Service | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("services")
      .select("*")
      .eq("slug", data.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row ? mapRow(row as ServiceRow) : null;
  });

export const checkIsAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ isAdmin: boolean }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    return { isAdmin: !!data };
  });

export const upsertService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => serviceInputSchema.parse(input))
  .handler(async ({ data, context }): Promise<Service> => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = {
      slug: data.slug,
      title: data.title,
      tag: data.tag,
      icon: data.icon,
      short_desc: data.short_desc,
      intro: data.intro,
      ai_angle: data.ai_angle,
      deliverables: data.deliverables,
      process: data.process,
      faqs: data.faqs,
      tiers: data.tiers,
      sort_order: data.sort_order,
    };
    if (data.id) {
      const { data: row, error } = await supabaseAdmin
        .from("services")
        .update(payload)
        .eq("id", data.id)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return mapRow(row as ServiceRow);
    } else {
      const { data: row, error } = await supabaseAdmin
        .from("services")
        .insert(payload)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return mapRow(row as ServiceRow);
    }
  });

export const deleteService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("services").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const reorderServices = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { order: { id: string; sort_order: number }[] }) =>
    z.object({
      order: z
        .array(z.object({ id: z.string().uuid(), sort_order: z.number().int().min(0).max(9999) }))
        .max(200),
    }).parse(input),
  )
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    for (const item of data.order) {
      const { error } = await supabaseAdmin
        .from("services")
        .update({ sort_order: item.sort_order })
        .eq("id", item.id);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });