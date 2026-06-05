import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Plus, Trash2, Save, Eye, EyeOff } from "lucide-react";
import {
  listAllFaqs,
  upsertFaq,
  deleteFaq,
  type FaqItem,
} from "@/lib/cms.functions";

export const Route = createFileRoute("/_authenticated/admin/faqs")({
  component: AdminFaqsPage,
});

type Draft = {
  id?: string;
  question: string;
  answer: string;
  category: string;
  sort_order: number;
  status: "draft" | "published";
};

const EMPTY: Draft = {
  question: "",
  answer: "",
  category: "General",
  sort_order: 0,
  status: "published",
};

function AdminFaqsPage() {
  const fetchList = useServerFn(listAllFaqs);
  const qc = useQueryClient();
  const { data: faqs, isLoading } = useQuery({
    queryKey: ["admin", "faqs"],
    queryFn: () => fetchList(),
  });

  const save = useMutation({
    mutationFn: useServerFn(upsertFaq),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin", "faqs"] });
      qc.invalidateQueries({ queryKey: ["faqs", "published"] });
      setEditing(null);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: useServerFn(deleteFaq),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["admin", "faqs"] });
      qc.invalidateQueries({ queryKey: ["faqs", "published"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const [editing, setEditing] = useState<Draft | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <Link to="/admin" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3 w-3" /> Back to admin
            </Link>
            <h1 className="mt-1 font-display text-xl">FAQs</h1>
          </div>
          <button
            onClick={() => setEditing({ ...EMPTY, sort_order: (faqs?.length ?? 0) * 10 + 10 })}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> New FAQ
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 space-y-3">
        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
        {(faqs ?? []).length === 0 && !isLoading && (
          <p className="text-sm text-muted-foreground">No FAQs yet. Click "New FAQ" to add one.</p>
        )}
        {(faqs ?? []).map((f: FaqItem) => (
          <div
            key={f.id}
            className="rounded-md border border-border bg-card p-4 flex items-start justify-between gap-3"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{f.category}</span>
                {f.status === "draft" && (
                  <span className="text-[10px] uppercase rounded bg-muted px-1.5 py-0.5">Draft</span>
                )}
                <span className="text-[10px] text-muted-foreground">Order {f.sort_order}</span>
              </div>
              <div className="font-medium text-foreground truncate">{f.question}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setEditing({ ...f })}
                className="rounded-md border border-border px-3 py-1.5 text-xs hover:bg-muted"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (confirm("Delete this FAQ?")) del.mutate({ data: { id: f.id } });
                }}
                className="rounded-md border border-border px-2 py-1.5 text-xs hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-6">
          <div className="bg-card border border-border w-full sm:max-w-2xl sm:rounded-lg max-h-[92vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border px-5 py-3 flex items-center justify-between">
              <h2 className="font-display text-lg">{editing.id ? "Edit FAQ" : "New FAQ"}</h2>
              <button onClick={() => setEditing(null)} className="text-muted-foreground hover:text-foreground text-sm">Close</button>
            </div>
            <div className="p-5 space-y-4">
              <label className="block">
                <span className="block text-xs font-medium text-muted-foreground mb-1">Question</span>
                <input
                  value={editing.question}
                  onChange={(e) => setEditing({ ...editing, question: e.target.value })}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="block text-xs font-medium text-muted-foreground mb-1">Answer (Markdown)</span>
                <textarea
                  value={editing.answer}
                  onChange={(e) => setEditing({ ...editing, answer: e.target.value })}
                  rows={8}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="block text-xs font-medium text-muted-foreground mb-1">Category</span>
                  <input
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="block text-xs font-medium text-muted-foreground mb-1">Sort order</span>
                  <input
                    type="number"
                    value={editing.sort_order}
                    onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) || 0 })}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={() =>
                  setEditing({
                    ...editing,
                    status: editing.status === "published" ? "draft" : "published",
                  })
                }
                className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"
              >
                {editing.status === "published" ? (
                  <><Eye className="h-4 w-4" /> Published</>
                ) : (
                  <><EyeOff className="h-4 w-4" /> Draft</>
                )}
              </button>
            </div>
            <div className="sticky bottom-0 bg-card border-t border-border px-5 py-3 flex justify-end gap-2">
              <button onClick={() => setEditing(null)} className="rounded-md border border-border px-3 py-2 text-sm hover:bg-muted">Cancel</button>
              <button
                onClick={() => save.mutate({ data: { ...editing } })}
                disabled={save.isPending || !editing.question.trim() || !editing.answer.trim()}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-50"
              >
                <Save className="h-4 w-4" /> {save.isPending ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}