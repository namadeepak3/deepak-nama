import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, ArrowUp, ArrowDown, Eye, EyeOff, Save, Layout } from "lucide-react";
import {
  listHomeSections,
  updateHomeSection,
  reorderHomeSections,
  toggleHomeSection,
  type HomeSection,
} from "@/lib/home-sections.functions";

export const Route = createFileRoute("/_authenticated/admin/home")({
  head: () => ({
    meta: [
      { title: "Admin — Home page" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminHomePage,
});

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  channels: "AI-powered channels we run",
  ai_stack: "Your growth engine, always on",
  services: "Digital marketing services",
  platforms: "Marketing Platforms",
  whatsapp: "Instant lead routing (WhatsApp/SMS)",
  process: "Our AI agentic process",
  about: "About the agency",
  industries: "Industries we serve",
  tech_stack: "Our AI + Marketing Stack",
  workflow: "End-to-end AI workflow",
  results: "Results / Outcomes",
  case_studies: "Case studies",
  insights: "Insights / Blog",
  testimonials: "Testimonials",
  final_cta: "Final CTA",
};

function labelFor(key: string) {
  return SECTION_LABELS[key] ?? key;
}

function AdminHomePage() {
  const qc = useQueryClient();
  const list = useServerFn(listHomeSections);
  const update = useServerFn(updateHomeSection);
  const reorder = useServerFn(reorderHomeSections);
  const toggle = useServerFn(toggleHomeSection);

  const sectionsQ = useQuery({ queryKey: ["home_sections"], queryFn: () => list() });
  const [selected, setSelected] = useState<string | null>(null);
  const [draft, setDraft] = useState<HomeSection | null>(null);

  useEffect(() => {
    if (!sectionsQ.data || selected) return;
    setSelected(sectionsQ.data[0]?.id ?? null);
  }, [sectionsQ.data, selected]);

  useEffect(() => {
    if (!sectionsQ.data || !selected) return;
    const row = sectionsQ.data.find((s) => s.id === selected);
    if (row) setDraft(row);
  }, [sectionsQ.data, selected]);

  const saveMut = useMutation({
    mutationFn: (input: HomeSection) =>
      update({
        data: {
          id: input.id,
          enabled: input.enabled,
          sort_order: input.sort_order,
          eyebrow: input.eyebrow,
          title: input.title,
          subtitle: input.subtitle,
          cta_label: input.cta_label,
          cta_href: input.cta_href,
        },
      }),
    onSuccess: () => {
      toast.success("Section saved");
      qc.invalidateQueries({ queryKey: ["home_sections"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggleMut = useMutation({
    mutationFn: (v: { id: string; enabled: boolean }) => toggle({ data: v }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["home_sections"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  const reorderMut = useMutation({
    mutationFn: (order: { id: string; sort_order: number }[]) => reorder({ data: { order } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["home_sections"] }),
    onError: (e: Error) => toast.error(e.message),
  });

  function move(index: number, dir: -1 | 1) {
    const arr = [...(sectionsQ.data ?? [])];
    const target = index + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    const order = arr.map((s, i) => ({ id: s.id, sort_order: i }));
    qc.setQueryData(["home_sections"], arr.map((s, i) => ({ ...s, sort_order: i })));
    reorderMut.mutate(order);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4">
          <Link to="/admin" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> Back to admin
          </Link>
          <h1 className="mt-1 font-display text-xl inline-flex items-center gap-2">
            <Layout className="h-5 w-5 text-primary" /> Home page sections
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Show/hide, reorder, and edit the header text of each section on the home page.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 grid md:grid-cols-[320px_1fr] gap-6">
        <div className="space-y-2">
          {sectionsQ.isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
          {(sectionsQ.data ?? []).map((s, i) => {
            const active = s.id === selected;
            return (
              <div
                key={s.id}
                className={`rounded-md border ${active ? "border-primary" : "border-border"} bg-card p-2 flex items-center gap-2`}
              >
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="h-5 w-5 rounded border border-border grid place-items-center disabled:opacity-30"
                    aria-label="Move up"
                  >
                    <ArrowUp className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => move(i, 1)}
                    disabled={i === (sectionsQ.data?.length ?? 0) - 1}
                    className="h-5 w-5 rounded border border-border grid place-items-center disabled:opacity-30"
                    aria-label="Move down"
                  >
                    <ArrowDown className="h-3 w-3" />
                  </button>
                </div>
                <button
                  onClick={() => setSelected(s.id)}
                  className="flex-1 min-w-0 text-left"
                >
                  <p className="text-sm font-medium truncate">{labelFor(s.key)}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{s.key}</p>
                </button>
                <button
                  onClick={() => toggleMut.mutate({ id: s.id, enabled: !s.enabled })}
                  className={`h-7 w-7 rounded grid place-items-center border ${s.enabled ? "border-primary text-primary" : "border-border text-muted-foreground"}`}
                  aria-label={s.enabled ? "Hide" : "Show"}
                  title={s.enabled ? "Visible" : "Hidden"}
                >
                  {s.enabled ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                </button>
              </div>
            );
          })}
        </div>

        <div className="rounded-md border border-border bg-card p-5">
          {!draft ? (
            <p className="text-sm text-muted-foreground">Pick a section to edit.</p>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">{draft.key}</p>
                <h2 className="text-lg font-display">{labelFor(draft.key)}</h2>
              </div>

              <button
                type="button"
                onClick={() => setDraft({ ...draft, enabled: !draft.enabled })}
                className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"
              >
                {draft.enabled ? (<><Eye className="h-4 w-4" /> Visible</>) : (<><EyeOff className="h-4 w-4" /> Hidden</>)}
              </button>

              <label className="block">
                <span className="block text-xs font-medium text-muted-foreground mb-1">Eyebrow (small label above the title)</span>
                <input
                  value={draft.eyebrow}
                  onChange={(e) => setDraft({ ...draft, eyebrow: e.target.value })}
                  maxLength={200}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
              </label>

              <label className="block">
                <span className="block text-xs font-medium text-muted-foreground mb-1">Title</span>
                <input
                  value={draft.title}
                  onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                  maxLength={300}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
              </label>

              <label className="block">
                <span className="block text-xs font-medium text-muted-foreground mb-1">Subtitle / description</span>
                <textarea
                  value={draft.subtitle}
                  onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
                  rows={3}
                  maxLength={600}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
              </label>

              <div className="grid sm:grid-cols-2 gap-3">
                <label className="block">
                  <span className="block text-xs font-medium text-muted-foreground mb-1">CTA label</span>
                  <input
                    value={draft.cta_label}
                    onChange={(e) => setDraft({ ...draft, cta_label: e.target.value })}
                    maxLength={60}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="block text-xs font-medium text-muted-foreground mb-1">CTA link</span>
                  <input
                    value={draft.cta_href}
                    onChange={(e) => setDraft({ ...draft, cta_href: e.target.value })}
                    maxLength={500}
                    placeholder="/services or https://…"
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                </label>
              </div>

              <p className="text-[11px] text-muted-foreground">
                Note: not every section on the home page uses every field. Some richly designed sections only react to the visibility toggle and order — title/eyebrow edits apply where a clear section header exists.
              </p>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => saveMut.mutate(draft)}
                  disabled={saveMut.isPending}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" /> {saveMut.isPending ? "Saving…" : "Save changes"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}