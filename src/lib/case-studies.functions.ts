import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { mapCaseStudy, type CaseStudy, type CaseStudyRow } from "@/lib/case-studies.shared";

export const listCaseStudies = createServerFn({ method: "GET" }).handler(async (): Promise<CaseStudy[]> => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("case_studies")
    .select("*")
    .eq("status", "published")
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: false })
    .order("published_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data ?? []) as unknown as CaseStudyRow[]).map(mapCaseStudy);
});

export const getCaseStudyBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => z.object({ slug: z.string().min(1).max(120) }).parse(input))
  .handler(async ({ data }): Promise<CaseStudy | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("case_studies")
      .select("*")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row ? mapCaseStudy(row as unknown as CaseStudyRow) : null;
  });

export const listFeaturedCaseStudies = createServerFn({ method: "GET" }).handler(
  async (): Promise<CaseStudy[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("case_studies")
      .select("*")
      .eq("status", "published")
      .eq("featured", true)
      .order("sort_order", { ascending: false })
      .order("published_at", { ascending: false })
      .limit(6);
    if (error) throw new Error(error.message);
    return ((data ?? []) as unknown as CaseStudyRow[]).map(mapCaseStudy);
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

export const listAllCaseStudies = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<CaseStudy[]> => {
    await assertEditor(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("case_studies")
      .select("*")
      .order("sort_order", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return ((data ?? []) as unknown as CaseStudyRow[]).map(mapCaseStudy);
  });

const statSchema = z.object({ k: z.string().min(1).max(40), v: z.string().min(1).max(40) });

const caseStudyInputSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers, dashes only"),
  title: z.string().min(1).max(200),
  client: z.string().max(120).default(""),
  tag: z.string().max(80).default(""),
  industry: z.string().max(80).default(""),
  summary: z.string().max(800).default(""),
  cover_image: z.string().max(800).default(""),
  channels: z.array(z.string().min(1).max(60)).max(20).default([]),
  hero_stats: z.array(statSchema).max(8).default([]),
  content: z.string().max(40000).default(""),
  challenge: z.string().max(8000).default(""),
  approach: z.string().max(8000).default(""),
  results: z.string().max(8000).default(""),
  testimonial_quote: z.string().max(1000).default(""),
  testimonial_author: z.string().max(120).default(""),
  testimonial_role: z.string().max(120).default(""),
  duration: z.string().max(80).default(""),
  status: z.enum(["draft", "published"]).default("draft"),
  featured: z.boolean().default(false),
  sort_order: z.number().int().min(0).max(9999).default(0),
  meta_title: z.string().max(200).default(""),
  meta_description: z.string().max(400).default(""),
  og_image: z.string().max(800).default(""),
});

export type CaseStudyInput = z.infer<typeof caseStudyInputSchema>;

export const upsertCaseStudy = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => caseStudyInputSchema.parse(d))
  .handler(async ({ data, context }): Promise<CaseStudy> => {
    await assertEditor(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = {
      slug: data.slug,
      title: data.title,
      client: data.client,
      tag: data.tag,
      industry: data.industry,
      summary: data.summary,
      cover_image: data.cover_image,
      channels: data.channels,
      hero_stats: data.hero_stats,
      content: data.content,
      challenge: data.challenge,
      approach: data.approach,
      results: data.results,
      testimonial_quote: data.testimonial_quote,
      testimonial_author: data.testimonial_author,
      testimonial_role: data.testimonial_role,
      duration: data.duration,
      status: data.status,
      featured: data.featured,
      sort_order: data.sort_order,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      og_image: data.og_image,
      published_at: data.status === "published" ? new Date().toISOString() : null,
    };
    if (data.id) {
      const { data: row, error } = await supabaseAdmin
        .from("case_studies")
        .update(payload)
        .eq("id", data.id)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return mapCaseStudy(row as unknown as CaseStudyRow);
    } else {
      const { data: row, error } = await supabaseAdmin
        .from("case_studies")
        .insert(payload)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return mapCaseStudy(row as unknown as CaseStudyRow);
    }
  });

export const deleteCaseStudy = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertEditor(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("case_studies").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });