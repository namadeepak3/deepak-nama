import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type PdfTemplateSettings = {
  companyName: string;
  tagline: string;
  footerText: string;
  contactLine: string;
  logoUrl: string;
  colorPrimary: string;
  colorAccent: string;
  colorText: string;
  colorMuted: string;
  showSummary: boolean;
  showScore: boolean;
  showFindings: boolean;
  showNextActions: boolean;
  showIntro: boolean;
  showOutro: boolean;
  introText: string;
  outroText: string;
};

const DEFAULTS: PdfTemplateSettings = {
  companyName: "Website Audit",
  tagline: "AI-powered preliminary audit",
  footerText:
    "This is a preliminary AI-generated preview. A senior strategist will deliver the full audit within one business day.",
  contactLine: "",
  logoUrl: "",
  colorPrimary: "#2563eb",
  colorAccent: "#0ea5e9",
  colorText: "#1f2937",
  colorMuted: "#6b7280",
  showSummary: true,
  showScore: true,
  showFindings: true,
  showNextActions: true,
  showIntro: false,
  showOutro: false,
  introText: "",
  outroText: "",
};

function mapRow(r: any): PdfTemplateSettings {
  return {
    companyName: r.company_name ?? DEFAULTS.companyName,
    tagline: r.tagline ?? DEFAULTS.tagline,
    footerText: r.footer_text ?? DEFAULTS.footerText,
    contactLine: r.contact_line ?? "",
    logoUrl: r.logo_url ?? "",
    colorPrimary: r.color_primary ?? DEFAULTS.colorPrimary,
    colorAccent: r.color_accent ?? DEFAULTS.colorAccent,
    colorText: r.color_text ?? DEFAULTS.colorText,
    colorMuted: r.color_muted ?? DEFAULTS.colorMuted,
    showSummary: r.show_summary ?? true,
    showScore: r.show_score ?? true,
    showFindings: r.show_findings ?? true,
    showNextActions: r.show_next_actions ?? true,
    showIntro: r.show_intro ?? false,
    showOutro: r.show_outro ?? false,
    introText: r.intro_text ?? "",
    outroText: r.outro_text ?? "",
  };
}

export const getPdfTemplate = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PdfTemplateSettings> => {
    const { data, error } = await context.supabase
      .from("pdf_template_settings")
      .select("*")
      .eq("id", "default")
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? mapRow(data) : DEFAULTS;
  });

const colorSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/, "Must be a hex color like #1a2b3c");

export const savePdfTemplate = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: Partial<PdfTemplateSettings>) =>
    z
      .object({
        companyName: z.string().trim().max(120).optional(),
        tagline: z.string().trim().max(200).optional(),
        footerText: z.string().trim().max(600).optional(),
        contactLine: z.string().trim().max(200).optional(),
        logoUrl: z.string().max(500_000).optional(), // allows data URL up to ~500KB
        colorPrimary: colorSchema.optional(),
        colorAccent: colorSchema.optional(),
        colorText: colorSchema.optional(),
        colorMuted: colorSchema.optional(),
        showSummary: z.boolean().optional(),
        showScore: z.boolean().optional(),
        showFindings: z.boolean().optional(),
        showNextActions: z.boolean().optional(),
        showIntro: z.boolean().optional(),
        showOutro: z.boolean().optional(),
        introText: z.string().trim().max(2000).optional(),
        outroText: z.string().trim().max(2000).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Require admin
    const { data: roleRow } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) throw new Error("Forbidden: admin role required");

    const patch: Record<string, unknown> = { id: "default" };
    if (data.companyName !== undefined) patch.company_name = data.companyName;
    if (data.tagline !== undefined) patch.tagline = data.tagline;
    if (data.footerText !== undefined) patch.footer_text = data.footerText;
    if (data.contactLine !== undefined) patch.contact_line = data.contactLine;
    if (data.logoUrl !== undefined) patch.logo_url = data.logoUrl;
    if (data.colorPrimary !== undefined) patch.color_primary = data.colorPrimary;
    if (data.colorAccent !== undefined) patch.color_accent = data.colorAccent;
    if (data.colorText !== undefined) patch.color_text = data.colorText;
    if (data.colorMuted !== undefined) patch.color_muted = data.colorMuted;
    if (data.showSummary !== undefined) patch.show_summary = data.showSummary;
    if (data.showScore !== undefined) patch.show_score = data.showScore;
    if (data.showFindings !== undefined) patch.show_findings = data.showFindings;
    if (data.showNextActions !== undefined) patch.show_next_actions = data.showNextActions;
    if (data.showIntro !== undefined) patch.show_intro = data.showIntro;
    if (data.showOutro !== undefined) patch.show_outro = data.showOutro;
    if (data.introText !== undefined) patch.intro_text = data.introText;
    if (data.outroText !== undefined) patch.outro_text = data.outroText;

    const { error } = await (supabaseAdmin as any)
      .from("pdf_template_settings")
      .upsert(patch);
    if (error) throw new Error(error.message);
    return { ok: true };
  });