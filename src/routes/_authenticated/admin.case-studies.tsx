import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Plus, Pencil, Trash2, Save, X, Star, FileText, ExternalLink } from "lucide-react";
import {
  listAllCaseStudies,
  upsertCaseStudy,
  deleteCaseStudy,
  type CaseStudyInput,
} from "@/lib/case-studies.functions";
import type { CaseStudy } from "@/lib/case-studies.shared";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

export const Route = createFileRoute("/_authenticated/admin/case-studies")({
  head: () => ({
    meta: [
      { title: "Admin — Case Studies" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminCaseStudiesPage,
});

function emptyInput(): CaseStudyInput {
  return {
    slug: "",
    title: "",
    client: "",
    tag: "",
    industry: "",
    summary: "",
    cover_image: "",
    channels: [],
    hero_stats: [],
    content: "",
    challenge: "",
    approach: "",
    results: "",
    testimonial_quote: "",
    testimonial_author: "",
    testimonial_role: "",
    duration: "",
    status: "draft",
    featured: false,
    sort_order: 0,
    meta_title: "",
    meta_description: "",
    og_image: "",
  };
}

function toInput(c: CaseStudy): CaseStudyInput {
  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    client: c.client,
    tag: c.tag,
    industry: c.industry,
    summary: c.summary,
    cover_image: c.coverImage,
    channels: c.channels,
    hero_stats: c.heroStats,
    content: c.content,
    challenge: c.challenge,
    approach: c.approach,
    results: c.results,
    testimonial_quote: c.testimonialQuote,
    testimonial_author: c.testimonialAuthor,
    testimonial_role: c.testimonialRole,
    duration: c.duration,
    status: (c.status === "published" ? "published" : "draft") as "draft" | "published",
    featured: c.featured,
    sort_order: 0,
    meta_title: c.metaTitle,
    meta_description: c.metaDescription,
    og_image: c.ogImage,
  };
}

function AdminCaseStudiesPage() {
  const qc = useQueryClient();
  const list = useServerFn(listAllCaseStudies);
  const save = useServerFn(upsertCaseStudy);
  const del = useServerFn(deleteCaseStudy);

  const listQ = useQuery({ queryKey: ["case_studies_admin"], queryFn: () => list() });
  const [editing, setEditing] = useState<CaseStudyInput | null>(null);

  const saveMut = useMutation({
    mutationFn: (input: CaseStudyInput) => save({ data: input }),
    onSuccess: () => {
      toast.success("Case study saved");
      qc.invalidateQueries({ queryKey: ["case_studies_admin"] });
      setEditing(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const delMut = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["case_studies_admin"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <Link to="/admin" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3 w-3" /> Back to admin
            </Link>
            <h1 className="mt-1 font-display text-xl inline-flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Case studies
            </h1>
          </div>
          <button
            onClick={() => setEditing(emptyInput())}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> New case study
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 space-y-3">
        {listQ.isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {listQ.error && <p className="text-sm text-destructive">{(listQ.error as Error).message}</p>}
        {(listQ.data ?? []).map((c) => (
          <div key={c.id} className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium truncate">{c.title || "(untitled)"}</p>
                <span className={`text-[10px] uppercase tracking-widest rounded px-1.5 py-0.5 ${c.status === "published" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                  {c.status}
                </span>
                {c.featured && (
                  <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest rounded px-1.5 py-0.5 bg-amber-200 text-ink">
                    <Star className="h-2.5 w-2.5" /> featured
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">/{c.slug} · {c.client || "—"} · {c.industry || "—"}</p>
            </div>
            {c.status === "published" && (
              <a
                href={`/case-studies/${c.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary"
              >
                <ExternalLink className="h-3 w-3" /> View
              </a>
            )}
            <button
              onClick={() => setEditing(toInput(c))}
              className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary"
            >
              <Pencil className="h-3 w-3" /> Edit
            </button>
            <button
              onClick={() => { if (confirm(`Delete "${c.title}"?`)) delMut.mutate(c.id); }}
              className="inline-flex items-center gap-1 rounded-md border border-destructive/40 text-destructive px-3 py-1.5 text-xs hover:bg-destructive/10"
            >
              <Trash2 className="h-3 w-3" /> Delete
            </button>
          </div>
        ))}
        {listQ.data && listQ.data.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-10">No case studies yet. Click "New case study".</p>
        )}
      </div>

      {editing && (
        <CaseStudyEditor
          initial={editing}
          onCancel={() => setEditing(null)}
          onSave={(v) => saveMut.mutate(v)}
          saving={saveMut.isPending}
        />
      )}
    </div>
  );
}

function CaseStudyEditor({
  initial,
  onCancel,
  onSave,
  saving,
}: {
  initial: CaseStudyInput;
  onCancel: () => void;
  onSave: (v: CaseStudyInput) => void;
  saving: boolean;
}) {
  const [v, setV] = useState<CaseStudyInput>(initial);
  const [channelsText, setChannelsText] = useState(v.channels.join(", "));
  const [statsText, setStatsText] = useState(
    v.hero_stats.map((s) => `${s.k}|${s.v}`).join("\n"),
  );

  function commit() {
    const channels = channelsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 20);
    const hero_stats = statsText
      .split("\n")
      .map((line) => {
        const [k, val] = line.split("|");
        return { k: (k ?? "").trim(), v: (val ?? "").trim() };
      })
      .filter((s) => s.k && s.v)
      .slice(0, 8);
    onSave({ ...v, channels, hero_stats });
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur overflow-y-auto">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">{initial.id ? "Edit case study" : "New case study"}</h2>
          <button onClick={onCancel} className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-sm">
            <X className="h-4 w-4" /> Close
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Title" value={v.title} onChange={(t) => setV({ ...v, title: t })} required />
          <Field label="Slug" value={v.slug} onChange={(t) => setV({ ...v, slug: t })} required placeholder="acme-growth" />
          <Field label="Client" value={v.client} onChange={(t) => setV({ ...v, client: t })} />
          <Field label="Industry" value={v.industry} onChange={(t) => setV({ ...v, industry: t })} />
          <Field label="Tag" value={v.tag} onChange={(t) => setV({ ...v, tag: t })} placeholder="SEO • Performance" />
          <Field label="Duration" value={v.duration} onChange={(t) => setV({ ...v, duration: t })} placeholder="6 months" />
          <Field label="Sort order (higher = first)" value={String(v.sort_order)} onChange={(t) => setV({ ...v, sort_order: Number(t) || 0 })} />
        </div>

        <ImageUploadField
          label="Cover image (shown on case study cards and detail hero)"
          value={v.cover_image}
          folder="case-studies"
          onChange={(url) => setV({ ...v, cover_image: url })}
        />

        <TextArea label="Summary (1-2 lines for cards)" value={v.summary} onChange={(t) => setV({ ...v, summary: t })} rows={2} maxLength={800} />

        <Field
          label="Channels (comma separated)"
          value={channelsText}
          onChange={setChannelsText}
          placeholder="SEO, Paid Search, Email"
        />

        <label className="block">
          <span className="block text-xs font-medium text-muted-foreground mb-1">Hero stats (one per line, format: label|value)</span>
          <textarea
            value={statsText}
            onChange={(e) => setStatsText(e.target.value)}
            rows={5}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
            placeholder={"Organic traffic|+312%\nROAS|4.2x"}
          />
        </label>

        <TextArea label="Challenge" value={v.challenge} onChange={(t) => setV({ ...v, challenge: t })} rows={4} maxLength={8000} />
        <TextArea label="Approach" value={v.approach} onChange={(t) => setV({ ...v, approach: t })} rows={4} maxLength={8000} />
        <TextArea label="Results" value={v.results} onChange={(t) => setV({ ...v, results: t })} rows={4} maxLength={8000} />
        <TextArea label="Full content (markdown OK)" value={v.content} onChange={(t) => setV({ ...v, content: t })} rows={8} maxLength={40000} />

        <div className="rounded-md border border-border p-4 space-y-3">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Testimonial</p>
          <TextArea label="Quote" value={v.testimonial_quote} onChange={(t) => setV({ ...v, testimonial_quote: t })} rows={3} maxLength={1000} />
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Author" value={v.testimonial_author} onChange={(t) => setV({ ...v, testimonial_author: t })} />
            <Field label="Author role" value={v.testimonial_role} onChange={(t) => setV({ ...v, testimonial_role: t })} />
          </div>
        </div>

        <div className="rounded-md border border-border p-4 space-y-3">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">SEO</p>
          <Field label="Meta title" value={v.meta_title} onChange={(t) => setV({ ...v, meta_title: t })} />
          <TextArea label="Meta description" value={v.meta_description} onChange={(t) => setV({ ...v, meta_description: t })} rows={2} maxLength={400} />
          <ImageUploadField
            label="OG / social share image"
            value={v.og_image}
            folder="case-studies"
            onChange={(url) => setV({ ...v, og_image: url })}
            hint="Used by Facebook, LinkedIn, Twitter when the case study link is shared."
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={v.featured} onChange={(e) => setV({ ...v, featured: e.target.checked })} />
            Featured on home page
          </label>
          <label className="inline-flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Status</span>
            <select
              value={v.status}
              onChange={(e) => setV({ ...v, status: e.target.value as "draft" | "published" })}
              className="rounded-md border border-border bg-background px-2 py-1 text-sm"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
          <div className="ml-auto flex gap-2">
            <button onClick={onCancel} className="rounded-md border border-border px-4 py-2 text-sm">Cancel</button>
            <button
              onClick={commit}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, required,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-muted-foreground mb-1">{label}{required && <span className="text-destructive"> *</span>}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
      />
    </label>
  );
}

function TextArea({
  label, value, onChange, rows, maxLength,
}: { label: string; value: string; onChange: (v: string) => void; rows: number; maxLength?: number }) {
  return (
    <label className="block">
      <span className="block text-xs font-medium text-muted-foreground mb-1">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        maxLength={maxLength}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
      />
    </label>
  );
}