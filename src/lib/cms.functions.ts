import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type LegalPage = {
  slug: string;
  title: string;
  content: string;
  status: "draft" | "published";
  updated_at: string;
};

export type FaqItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  status: "draft" | "published";
  updated_at: string;
};

async function assertCanEdit(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  const roles = (data ?? []).map((r) => r.role as string);
  if (!roles.includes("admin") && !roles.includes("editor")) {
    throw new Error("Forbidden: editor or admin role required");
  }
}

/* ============ Legal pages ============ */

export const getLegalPage = createServerFn({ method: "GET" })
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(60) }).parse(d))
  .handler(async ({ data }): Promise<LegalPage | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("legal_pages")
      .select("slug,title,content,status,updated_at")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (row as LegalPage | null) ?? null;
  });

export const listLegalPagesAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<LegalPage[]> => {
    await assertCanEdit(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("legal_pages")
      .select("slug,title,content,status,updated_at")
      .order("slug");
    if (error) throw new Error(error.message);
    return (data ?? []) as LegalPage[];
  });

const legalInput = z.object({
  slug: z.string().min(1).max(60).regex(/^[a-z0-9-]+$/),
  title: z.string().min(1).max(200),
  content: z.string().max(60000).default(""),
  status: z.enum(["draft", "published"]).default("published"),
});

export const upsertLegalPage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: z.infer<typeof legalInput>) => legalInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertCanEdit(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("legal_pages")
      .upsert(data, { onConflict: "slug" });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteLegalPage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { slug: string }) => z.object({ slug: z.string().min(1).max(60) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertCanEdit(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("legal_pages").delete().eq("slug", data.slug);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/* ============ FAQs ============ */

export const listPublishedFaqs = createServerFn({ method: "GET" }).handler(async (): Promise<FaqItem[]> => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("faq_items")
    .select("id,question,answer,category,sort_order,status,updated_at")
    .eq("status", "published")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []) as FaqItem[];
});

export const listAllFaqs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<FaqItem[]> => {
    await assertCanEdit(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("faq_items")
      .select("id,question,answer,category,sort_order,status,updated_at")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []) as FaqItem[];
  });

const faqInput = z.object({
  id: z.string().uuid().optional(),
  question: z.string().min(1).max(300),
  answer: z.string().min(1).max(8000),
  category: z.string().max(60).default("General"),
  sort_order: z.number().int().min(0).max(10000).default(0),
  status: z.enum(["draft", "published"]).default("published"),
});

export const upsertFaq = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: z.infer<typeof faqInput>) => faqInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertCanEdit(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.id) {
      const { error } = await supabaseAdmin.from("faq_items").update(data).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { id: _omit, ...insertable } = data;
      void _omit;
      const { error } = await supabaseAdmin.from("faq_items").insert(insertable);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const deleteFaq = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { id: string }) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    await assertCanEdit(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("faq_items").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });