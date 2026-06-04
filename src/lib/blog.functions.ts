import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { mapPost, type BlogPost, type BlogPostRow } from "@/lib/blog.shared";

const postInputSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z.string().min(1).max(120).regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, dashes"),
  title: z.string().min(1).max(200),
  excerpt: z.string().max(400).default(""),
  cover_image: z.string().max(1000).default(""),
  content: z.string().max(60000).default(""),
  tags: z.array(z.string().min(1).max(40)).max(15).default([]),
  status: z.enum(["draft", "published"]).default("draft"),
  author_name: z.string().max(80).default(""),
  reading_minutes: z.number().int().min(1).max(120).default(5),
  meta_title: z.string().max(200).default(""),
  meta_description: z.string().max(400).default(""),
  canonical_url: z.string().max(1000).default(""),
  og_title: z.string().max(200).default(""),
  og_description: z.string().max(400).default(""),
  og_image: z.string().max(1000).default(""),
  twitter_title: z.string().max(200).default(""),
  twitter_description: z.string().max(400).default(""),
  twitter_image: z.string().max(1000).default(""),
});

export type BlogPostInput = z.infer<typeof postInputSchema>;

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

export const listPublishedPosts = createServerFn({ method: "GET" }).handler(async (): Promise<BlogPost[]> => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw new Error(error.message);
  return ((data ?? []) as BlogPostRow[]).map(mapPost);
});

export const getPostBySlug = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => z.object({ slug: z.string().min(1).max(120) }).parse(input))
  .handler(async ({ data }): Promise<BlogPost | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*")
      .eq("slug", data.slug)
      .eq("status", "published")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return row ? mapPost(row as BlogPostRow) : null;
  });

export const listAllPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<BlogPost[]> => {
    await assertCanEdit(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("blog_posts")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return ((data ?? []) as BlogPostRow[]).map(mapPost);
  });

export const upsertPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => postInputSchema.parse(input))
  .handler(async ({ data, context }): Promise<BlogPost> => {
    await assertCanEdit(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = {
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      cover_image: data.cover_image,
      content: data.content,
      tags: data.tags,
      status: data.status,
      author_name: data.author_name,
      reading_minutes: data.reading_minutes,
      published_at:
        data.status === "published" ? new Date().toISOString() : null,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      canonical_url: data.canonical_url,
      og_title: data.og_title,
      og_description: data.og_description,
      og_image: data.og_image,
      twitter_title: data.twitter_title,
      twitter_description: data.twitter_description,
      twitter_image: data.twitter_image,
    };
    if (data.id) {
      const { data: existing } = await supabaseAdmin
        .from("blog_posts")
        .select("published_at, status")
        .eq("id", data.id)
        .maybeSingle();
      const keepPublishedAt =
        data.status === "published" && existing?.status === "published" && existing?.published_at
          ? existing.published_at
          : payload.published_at;
      const { data: row, error } = await supabaseAdmin
        .from("blog_posts")
        .update({ ...payload, published_at: keepPublishedAt })
        .eq("id", data.id)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return mapPost(row as BlogPostRow);
    }
    const { data: row, error } = await supabaseAdmin
      .from("blog_posts")
      .insert(payload)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return mapPost(row as BlogPostRow);
  });

export const deletePost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    await assertCanEdit(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("blog_posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });