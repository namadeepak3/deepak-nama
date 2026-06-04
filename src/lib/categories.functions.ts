import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { mapCategory, type BlogCategory, type BlogCategoryRow } from "@/lib/categories.shared";

const categoryInputSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(60),
  slug: z
    .string()
    .trim()
    .min(1)
    .max(60)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, dashes"),
  description: z.string().max(280).default(""),
  sort_order: z.number().int().min(0).max(9999).default(0),
});

export type BlogCategoryInput = z.infer<typeof categoryInputSchema>;

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

export const listCategories = createServerFn({ method: "GET" }).handler(
  async (): Promise<BlogCategory[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("blog_categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
    if (error) throw new Error(error.message);
    return ((data ?? []) as BlogCategoryRow[]).map(mapCategory);
  },
);

export const upsertCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => categoryInputSchema.parse(input))
  .handler(async ({ data, context }): Promise<BlogCategory> => {
    await assertCanEdit(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const payload = {
      name: data.name,
      slug: data.slug,
      description: data.description,
      sort_order: data.sort_order,
    };
    if (data.id) {
      const { data: row, error } = await supabaseAdmin
        .from("blog_categories")
        .update(payload)
        .eq("id", data.id)
        .select("*")
        .single();
      if (error) throw new Error(error.message);
      return mapCategory(row as BlogCategoryRow);
    }
    const { data: row, error } = await supabaseAdmin
      .from("blog_categories")
      .insert(payload)
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return mapCategory(row as BlogCategoryRow);
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) =>
    z.object({ id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }): Promise<{ ok: true }> => {
    await assertCanEdit(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("blog_categories")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
