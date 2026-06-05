import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
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