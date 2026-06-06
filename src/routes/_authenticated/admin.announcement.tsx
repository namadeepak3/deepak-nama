import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Save, Eye, EyeOff, Megaphone } from "lucide-react";
import { getAnnouncement, updateAnnouncement, type Announcement } from "@/lib/announcement.functions";

export const Route = createFileRoute("/_authenticated/admin/announcement")({
  head: () => ({
    meta: [
      { title: "Admin — Announcement Bar" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminAnnouncementPage,
});

function AdminAnnouncementPage() {
  const fetchOne = useServerFn(getAnnouncement);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["announcement"],
    queryFn: () => fetchOne(),
  });

  const [draft, setDraft] = useState<Announcement | null>(null);
  useEffect(() => {
    if (data) setDraft(data);
  }, [data]);

  const save = useMutation({
    mutationFn: useServerFn(updateAnnouncement),
    onSuccess: () => {
      toast.success("Announcement updated");
      qc.invalidateQueries({ queryKey: ["announcement"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-4">
          <Link to="/admin" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> Back to admin
          </Link>
          <h1 className="mt-1 font-display text-xl inline-flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" /> Announcement Bar
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            The top bar shown on every public page. Toggle it off to hide it site-wide.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6 space-y-6">
        {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}

        {draft && (
          <>
            {/* Live preview */}
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Preview</p>
              <div className="rounded-md overflow-hidden border border-border">
                {draft.enabled ? (
                  <div className="bg-ink text-white text-xs">
                    <div className="px-6 h-10 flex items-center justify-center gap-2 text-center">
                      <span className="h-2 w-2 rounded-full bg-primary inline-block animate-pulse" />
                      <span className="font-medium">{draft.message || "Your announcement…"}</span>
                      {draft.cta_label && (
                        <span className="text-primary font-semibold">{draft.cta_label} →</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-muted text-muted-foreground text-xs px-6 h-10 flex items-center justify-center">
                    Announcement bar is hidden
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-md border border-border bg-card p-5 space-y-4">
              <button
                type="button"
                onClick={() => setDraft({ ...draft, enabled: !draft.enabled })}
                className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm hover:bg-muted"
              >
                {draft.enabled ? (
                  <><Eye className="h-4 w-4" /> Visible on site</>
                ) : (
                  <><EyeOff className="h-4 w-4" /> Hidden</>
                )}
              </button>

              <label className="block">
                <span className="block text-xs font-medium text-muted-foreground mb-1">Message</span>
                <textarea
                  value={draft.message}
                  onChange={(e) => setDraft({ ...draft, message: e.target.value })}
                  rows={3}
                  maxLength={300}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                />
                <span className="mt-1 block text-[10px] text-muted-foreground">{draft.message.length}/300</span>
              </label>

              <div className="grid sm:grid-cols-2 gap-3">
                <label className="block">
                  <span className="block text-xs font-medium text-muted-foreground mb-1">CTA label</span>
                  <input
                    value={draft.cta_label}
                    onChange={(e) => setDraft({ ...draft, cta_label: e.target.value })}
                    maxLength={60}
                    placeholder="Explore plan"
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

              <div className="flex justify-end pt-2">
                <button
                  onClick={() =>
                    save.mutate({
                      data: {
                        id: draft.id,
                        enabled: draft.enabled,
                        message: draft.message,
                        cta_label: draft.cta_label,
                        cta_href: draft.cta_href,
                      },
                    })
                  }
                  disabled={save.isPending}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" /> {save.isPending ? "Saving…" : "Save changes"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}