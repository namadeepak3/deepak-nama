import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeft, Save, FileText, Eye, EyeOff } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  listLegalPagesAdmin,
  upsertLegalPage,
  type LegalPage,
} from "@/lib/cms.functions";

export const Route = createFileRoute("/_authenticated/admin/legal")({
  component: AdminLegalPage,
});

const DEFAULTS: { slug: string; title: string }[] = [
  { slug: "privacy-policy", title: "Privacy Policy" },
  { slug: "refund-policy", title: "Refund Policy" },
  { slug: "terms", title: "Terms & Conditions" },
];

function AdminLegalPage() {
  const fetchList = useServerFn(listLegalPagesAdmin);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "legal-pages"],
    queryFn: () => fetchList(),
  });

  const save = useMutation({
    mutationFn: useServerFn(upsertLegalPage),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin", "legal-pages"] });
      qc.invalidateQueries({ queryKey: ["legal-page"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const [active, setActive] = useState<string>("privacy-policy");
  const [draft, setDraft] = useState<{
    title: string;
    content: string;
    status: "draft" | "published";
  }>({ title: "", content: "", status: "published" });
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    const row = (data ?? []).find((p) => p.slug === active);
    const fallback = DEFAULTS.find((d) => d.slug === active);
    setDraft({
      title: row?.title ?? fallback?.title ?? "",
      content: row?.content ?? "",
      status: (row?.status as "draft" | "published") ?? "published",
    });
  }, [active, data]);

  const pageList: { slug: string; title: string; row?: LegalPage }[] = DEFAULTS.map((d) => ({
    ...d,
    row: (data ?? []).find((p) => p.slug === d.slug),
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <Link to="/admin" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3 w-3" /> Back to admin
            </Link>
            <h1 className="mt-1 font-display text-xl">Legal pages</h1>
          </div>
          <button
            onClick={() =>
              save.mutate({
                slug: active,
                title: draft.title,
                content: draft.content,
                status: draft.status,
              })
            }
            disabled={save.isPending}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {save.isPending ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 grid gap-6 md:grid-cols-[220px,1fr]">
        <aside className="space-y-1">
          {pageList.map((p) => (
            <button
              key={p.slug}
              onClick={() => setActive(p.slug)}
              className={`w-full inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm text-left transition-colors ${
                active === p.slug
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <FileText className="h-4 w-4 shrink-0" />
              <span className="flex-1 truncate">{p.title}</span>
              {p.row?.status === "draft" && <span className="text-[10px] uppercase">Draft</span>}
            </button>
          ))}
        </aside>

        <section className="space-y-4">
          {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
          <div className="grid gap-2 sm:grid-cols-[1fr,auto] sm:items-end">
            <label className="block">
              <span className="block text-xs font-medium text-muted-foreground mb-1">Page title</span>
              <input
                value={draft.title}
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setDraft({
                    ...draft,
                    status: draft.status === "published" ? "draft" : "published",
                  })
                }
                className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"
              >
                {draft.status === "published" ? (
                  <>
                    <Eye className="h-4 w-4" /> Published
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4" /> Draft
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className="rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"
              >
                {preview ? "Edit" : "Preview"}
              </button>
            </div>
          </div>

          {preview ? (
            <div className="rounded-md border border-border bg-card p-5 prose prose-sm sm:prose-base max-w-none prose-headings:text-foreground prose-a:text-primary">
              <h2>{draft.title}</h2>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{draft.content}</ReactMarkdown>
            </div>
          ) : (
            <textarea
              value={draft.content}
              onChange={(e) => setDraft({ ...draft, content: e.target.value })}
              rows={24}
              placeholder="Write in Markdown. Use ## for headings, **bold**, _italic_, [links](url), etc."
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono leading-6"
            />
          )}

          <p className="text-xs text-muted-foreground">
            Tip: Markdown is supported. Toggle <strong>Preview</strong> to see the rendered page.
          </p>
        </section>
      </div>
    </div>
  );
}