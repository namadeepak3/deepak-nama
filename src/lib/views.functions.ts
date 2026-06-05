import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const viewInputSchema = z.object({
  target_type: z.enum(["blog", "service"]),
  target_id: z.string().uuid(),
});

export const recordView = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => viewInputSchema.parse(input))
  .handler(async ({ data }): Promise<{ ok: true }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const table = data.target_type === "blog" ? "blog_posts" : "services";

    const { data: row, error: readErr } = await supabaseAdmin
      .from(table)
      .select("view_count")
      .eq("id", data.target_id)
      .maybeSingle();
    if (readErr) throw new Error(readErr.message);
    if (!row) return { ok: true };

    const next = (row.view_count ?? 0) + 1;
    const { error: updErr } = await supabaseAdmin
      .from(table)
      .update({ view_count: next })
      .eq("id", data.target_id);
    if (updErr) throw new Error(updErr.message);

    return { ok: true };
  });