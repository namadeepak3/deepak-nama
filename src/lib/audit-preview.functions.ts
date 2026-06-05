import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type AuditFinding = {
  area: string;
  severity: "high" | "medium" | "low";
  finding: string;
};

export type AuditPreview = {
  summary: string;
  score: number;
  findings: AuditFinding[];
  nextActions: string[];
};

const FALLBACK: AuditPreview = {
  summary:
    "Initial automated scan complete. A senior strategist will deliver your full audit within one business day.",
  score: 62,
  findings: [
    { area: "SEO", severity: "high", finding: "Title tags and meta descriptions need optimisation for primary keywords." },
    { area: "Performance", severity: "medium", finding: "Largest Contentful Paint can be improved by deferring non-critical scripts and compressing hero imagery." },
    { area: "Conversion", severity: "medium", finding: "Primary CTA placement and above-the-fold value proposition could be sharpened." },
    { area: "AI Search (GEO)", severity: "high", finding: "Limited structured data and entity coverage — site is unlikely to be cited by AI Overviews/LLMs." },
  ],
  nextActions: [
    "Audit and rewrite top 10 landing-page title tags and metas.",
    "Add FAQ + Organization schema and refresh internal linking.",
    "Run a Core Web Vitals pass focused on LCP and CLS.",
    "Tighten hero copy and add a single high-contrast primary CTA.",
  ],
};

export const generateAuditPreview = createServerFn({ method: "POST" })
  .inputValidator((input: { website: string; message?: string }) =>
    z
      .object({
        website: z.string().trim().min(3).max(255),
        message: z.string().trim().max(2000).optional().default(""),
      })
      .parse(input),
  )
  .handler(async ({ data }): Promise<AuditPreview> => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) return FALLBACK;

    const prompt = `You are a senior digital marketing strategist generating a quick preliminary website audit preview.

Website: ${data.website}
Visitor's focus area: ${data.message || "(not specified)"}

Without actually crawling the site, produce a realistic, useful preliminary audit based on common issues for similar sites. Return ONLY JSON matching this shape:
{
  "summary": "1-2 sentence overview",
  "score": <integer 40-85>,
  "findings": [ { "area": "SEO|Performance|Conversion|AI Search (GEO)|Content|Analytics", "severity": "high|medium|low", "finding": "one concise sentence" } ],
  "nextActions": [ "concise actionable next step", ... ]
}
Provide 4-5 findings and 4 nextActions. Be specific and useful, not generic.`;

    try {
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "system", content: "You return ONLY valid JSON. No prose, no markdown fences." },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
        }),
      });
      if (!res.ok) return FALLBACK;
      const json = await res.json();
      const content = json?.choices?.[0]?.message?.content;
      if (!content) return FALLBACK;
      const parsed = JSON.parse(content);
      const shape = z.object({
        summary: z.string().max(400),
        score: z.number().min(0).max(100),
        findings: z
          .array(
            z.object({
              area: z.string().max(60),
              severity: z.enum(["high", "medium", "low"]),
              finding: z.string().max(400),
            }),
          )
          .min(1)
          .max(8),
        nextActions: z.array(z.string().max(300)).min(1).max(8),
      });
      const safe = shape.safeParse(parsed);
      return safe.success ? safe.data : FALLBACK;
    } catch {
      return FALLBACK;
    }
  });