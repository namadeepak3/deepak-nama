import jsPDF from "jspdf";
import type { AuditPreview } from "@/lib/audit-preview.functions";
import type { PdfTemplateSettings } from "@/lib/pdf-template.functions";
import type { LeadRow } from "@/lib/leads.functions";

function hexToRgb(hex: string): [number, number, number] {
  const m = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!m) return [30, 30, 30];
  const v = parseInt(m[1], 16);
  return [(v >> 16) & 0xff, (v >> 8) & 0xff, v & 0xff];
}

const SEVERITY: Record<string, string> = {
  high: "#dc2626",
  medium: "#d97706",
  low: "#2563eb",
};

export function buildAuditPdf(
  lead: Pick<LeadRow, "name" | "email" | "website" | "message">,
  preview: AuditPreview,
  s: PdfTemplateSettings,
): jsPDF {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  let y = margin;

  const primary = hexToRgb(s.colorPrimary);
  const accent = hexToRgb(s.colorAccent);
  const text = hexToRgb(s.colorText);
  const muted = hexToRgb(s.colorMuted);

  const writeLine = (
    txt: string,
    opts: { size?: number; bold?: boolean; color?: [number, number, number]; gap?: number } = {},
  ) => {
    const { size = 11, bold = false, color = text, gap = 4 } = opts;
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(txt, pageW - margin * 2) as string[];
    for (const line of lines) {
      if (y > pageH - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += size + gap;
    }
  };

  // Header band
  doc.setFillColor(primary[0], primary[1], primary[2]);
  doc.rect(0, 0, pageW, 6, "F");

  // Logo (data URL) — fit into 80x40 box
  if (s.logoUrl && s.logoUrl.startsWith("data:image/")) {
    try {
      const fmt = s.logoUrl.includes("image/png") ? "PNG" : "JPEG";
      doc.addImage(s.logoUrl, fmt, margin, y, 80, 40, undefined, "FAST");
      y += 50;
    } catch {
      /* ignore bad logo */
    }
  }

  writeLine(s.companyName, { size: 20, bold: true, color: primary, gap: 4 });
  if (s.tagline) writeLine(s.tagline, { size: 11, color: muted, gap: 12 });

  writeLine(lead.website || "(no website)", { size: 13, bold: true, gap: 4 });
  writeLine(
    `Generated ${new Date().toLocaleString()} · Prepared for ${lead.name || lead.email}`,
    { size: 9, color: muted, gap: 14 },
  );

  if (s.showIntro && s.introText) {
    writeLine(s.introText, { size: 11, gap: 14 });
  }

  if (s.showScore) {
    writeLine(`Overall score: ${preview.score}/100`, {
      size: 14,
      bold: true,
      color: accent,
      gap: 6,
    });
    // Score bar
    const barW = pageW - margin * 2;
    const fillW = Math.max(2, Math.min(barW, (barW * preview.score) / 100));
    doc.setFillColor(230, 230, 230);
    doc.rect(margin, y, barW, 6, "F");
    doc.setFillColor(accent[0], accent[1], accent[2]);
    doc.rect(margin, y, fillW, 6, "F");
    y += 16;
  }

  if (s.showSummary) {
    writeLine("Summary", { size: 13, bold: true, color: primary, gap: 4 });
    writeLine(preview.summary, { size: 11, gap: 14 });
  }

  if (s.showFindings && preview.findings.length) {
    writeLine("Key findings", { size: 14, bold: true, color: primary, gap: 6 });
    preview.findings.forEach((f) => {
      const sevColor = hexToRgb(SEVERITY[f.severity] ?? s.colorMuted);
      writeLine(`• [${f.severity.toUpperCase()}] ${f.area}`, {
        size: 11,
        bold: true,
        color: sevColor,
        gap: 2,
      });
      writeLine(`   ${f.finding}`, { size: 11, gap: 6 });
    });
    y += 4;
  }

  if (s.showNextActions && preview.nextActions.length) {
    writeLine("Recommended next actions", { size: 14, bold: true, color: primary, gap: 6 });
    preview.nextActions.forEach((a, i) => {
      writeLine(`${i + 1}. ${a}`, { size: 11, gap: 4 });
    });
  }

  if (s.showOutro && s.outroText) {
    y += 8;
    writeLine(s.outroText, { size: 11, gap: 6 });
  }

  y += 12;
  if (s.contactLine) writeLine(s.contactLine, { size: 10, color: accent, gap: 4 });
  if (s.footerText) writeLine(s.footerText, { size: 9, color: muted, gap: 4 });

  return doc;
}

export function pdfFilename(lead: Pick<LeadRow, "website" | "email">): string {
  const safe = (lead.website || lead.email || "audit")
    .replace(/[^a-z0-9]+/gi, "-")
    .toLowerCase()
    .replace(/^-+|-+$/g, "");
  return `audit-${safe || "lead"}-${new Date().toISOString().slice(0, 10)}.pdf`;
}