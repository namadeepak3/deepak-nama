import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  listServices,
  upsertService,
  deleteService,
  reorderServices,
  getMyCapabilities,
  getServiceAnalytics,
  type ServiceInput,
} from "@/lib/services.functions";
import { ICON_OPTIONS, iconFor, type Service } from "@/lib/services.shared";
import { supabase } from "@/integrations/supabase/client";
import {
  listAllPosts,
  upsertPost,
  deletePost,
  type BlogPostInput,
} from "@/lib/blog.functions";
import type { BlogPost } from "@/lib/blog.shared";
import {
  Plus,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  LogOut,
  ArrowLeft,
  Save,
  X,
  Settings2,
  BarChart3,
  ShieldCheck,
  FileText,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Service Catalog" },
      { name: "robots", content: "noindex" },
    ],
    links: [{ rel: "canonical", href: "/admin" }],
  }),
  component: AdminPage,
});

function emptyService(nextOrder: number): ServiceInput {
  return {
    slug: "",
    title: "",
    tag: "",
    icon: "Sparkles",
    short_desc: "",
    intro: "",
    ai_angle: "",
    deliverables: [],
    process: [],
    faqs: [],
    tiers: [],
    sort_order: nextOrder,
  };
}

function AdminPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const list = useServerFn(listServices);
  const caps = useServerFn(getMyCapabilities);
  const analytics = useServerFn(getServiceAnalytics);
  const save = useServerFn(upsertService);
  const del = useServerFn(deleteService);
  const reorder = useServerFn(reorderServices);

  const capsQuery = useQuery({ queryKey: ["capabilities"], queryFn: () => caps() });
  const canManage = !!capsQuery.data?.canManageServices;
  const canAnalytics = !!capsQuery.data?.canViewAnalytics;

  type Tab = "services" | "analytics" | "blog";
  const defaultTab: Tab = canManage ? "services" : canAnalytics ? "analytics" : "services";
  const [tab, setTab] = useState<Tab>(defaultTab);
  useEffect(() => {
    if (!capsQuery.data) return;
    if (tab === "services" && !canManage && canAnalytics) setTab("analytics");
    if (tab === "analytics" && !canAnalytics && canManage) setTab("services");
    if (tab === "blog" && !canManage && canAnalytics) setTab("analytics");
  }, [capsQuery.data, canManage, canAnalytics, tab]);

  const services = useQuery({ queryKey: ["services"], queryFn: () => list(), enabled: canManage });
  const analyticsQuery = useQuery({
    queryKey: ["serviceAnalytics"],
    queryFn: () => analytics(),
    enabled: canAnalytics && tab === "analytics",
  });

  const [editing, setEditing] = useState<ServiceInput | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPostInput | null>(null);

  const saveMutation = useMutation({
    mutationFn: (input: ServiceInput) => save({ data: input }),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["services"] });
      setEditing(null);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["services"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  const reorderMutation = useMutation({
    mutationFn: (order: { id: string; sort_order: number }[]) => reorder({ data: { order } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["services"] }),
    onError: (e) => toast.error(e instanceof Error ? e.message : "Reorder failed"),
  });

  async function handleSignOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  function move(index: number, direction: -1 | 1) {
    const arr = services.data ?? [];
    const target = index + direction;
    if (target < 0 || target >= arr.length) return;
    const next = [...arr];
    [next[index], next[target]] = [next[target], next[index]];
    const order = next.map((s, i) => ({ id: s.id, sort_order: i }));
    qc.setQueryData(["services"], next.map((s, i) => ({ ...s, sortOrder: i })));
    reorderMutation.mutate(order);
  }

  if (capsQuery.isLoading) {
    return <p className="px-6 py-20 text-center text-muted-foreground">Checking permissions…</p>;
  }

  if (!canManage && !canAnalytics) {
    return (
      <section className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-2xl font-display font-semibold">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account doesn't have admin or editor permissions. The first user to sign up becomes the admin.
        </p>
        <button onClick={handleSignOut} className="mt-6 inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3 w-3" /> Back to site
          </Link>
          <h1 className="mt-2 text-3xl font-display font-semibold">Admin dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
            Signed in as{" "}
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2 py-0.5 text-xs">
              <ShieldCheck className="h-3 w-3 text-primary" />
              {(capsQuery.data?.roles ?? []).join(", ") || "no roles"}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          {canManage && tab === "services" && (
            <button
              onClick={() => setEditing(emptyService(services.data?.length ?? 0))}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-accent"
            >
              <Plus className="h-4 w-4" /> New service
            </button>
          )}
          {canManage && tab === "blog" && (
            <button
              onClick={() => setEditingPost(emptyPost())}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-accent"
            >
              <Plus className="h-4 w-4" /> New post
            </button>
          )}
          <button onClick={handleSignOut} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>

      <nav role="tablist" className="mt-8 inline-flex rounded-lg border border-border bg-card p-1 gap-1">
        {canManage && (
          <TabButton active={tab === "services"} onClick={() => setTab("services")} icon={Settings2}>
            Manage services
          </TabButton>
        )}
        {canManage && (
          <TabButton active={tab === "blog"} onClick={() => setTab("blog")} icon={FileText}>
            Blog
          </TabButton>
        )}
        {canAnalytics && (
          <TabButton active={tab === "analytics"} onClick={() => setTab("analytics")} icon={BarChart3}>
            Analytics
          </TabButton>
        )}
      </nav>

      {tab === "services" && canManage && (
      <div className="mt-8 space-y-3">
        {(services.data ?? []).map((s, i) => {
          const Icon = iconFor(s.icon);
          return (
            <div key={s.id} className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  className="h-6 w-6 rounded border border-border grid place-items-center disabled:opacity-30 hover:border-primary"
                  aria-label="Move up"
                >
                  <ArrowUp className="h-3 w-3" />
                </button>
                <button
                  onClick={() => move(i, 1)}
                  disabled={i === (services.data?.length ?? 0) - 1}
                  className="h-6 w-6 rounded border border-border grid place-items-center disabled:opacity-30 hover:border-primary"
                  aria-label="Move down"
                >
                  <ArrowDown className="h-3 w-3" />
                </button>
              </div>
              <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/30 grid place-items-center">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{s.title}</p>
                <p className="text-xs text-muted-foreground truncate">/{s.slug} · {s.tag}</p>
              </div>
              <button
                onClick={() => setEditing(serviceToInput(s))}
                className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary"
              >
                <Pencil className="h-3 w-3" /> Edit
              </button>
              <button
                onClick={() => {
                  if (confirm(`Delete "${s.title}"?`)) deleteMutation.mutate(s.id);
                }}
                className="inline-flex items-center gap-1 rounded-md border border-destructive/40 text-destructive px-3 py-1.5 text-xs hover:bg-destructive/10"
              >
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            </div>
          );
        })}
        {services.data && services.data.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-10">No services yet. Click "New service".</p>
        )}
      </div>
      )}

      {tab === "analytics" && canAnalytics && (
        <AnalyticsPanel
          loading={analyticsQuery.isLoading}
          data={analyticsQuery.data}
          error={analyticsQuery.error instanceof Error ? analyticsQuery.error.message : null}
        />
      )}

      {tab === "blog" && canManage && (
        <BlogPanel onEdit={(p) => setEditingPost(p)} />
      )}

      {editing && canManage && (
        <ServiceEditor
          initial={editing}
          onCancel={() => setEditing(null)}
          onSubmit={(v) => saveMutation.mutate(v)}
          saving={saveMutation.isPending}
        />
      )}

      {editingPost && canManage && (
        <BlogEditor
          initial={editingPost}
          onCancel={() => setEditingPost(null)}
          onSaved={() => setEditingPost(null)}
        />
      )}
    </section>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <button
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors ${
        active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  );
}

function AnalyticsPanel({
  loading,
  data,
  error,
}: {
  loading: boolean;
  data: import("@/lib/services.functions").ServiceAnalytics | undefined;
  error: string | null;
}) {
  if (loading) return <p className="mt-10 text-center text-sm text-muted-foreground">Loading analytics…</p>;
  if (error) return <p className="mt-10 text-center text-sm text-destructive">{error}</p>;
  if (!data) return null;
  return (
    <div className="mt-8 space-y-6">
      <div className="grid sm:grid-cols-3 gap-3">
        <Stat label="Total services" value={data.total} />
        <Stat label="Pricing tiers" value={data.totalTiers} />
        <Stat label="Tags in use" value={data.byTag.length} />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-medium text-foreground">Services by tag</h3>
          <ul className="mt-3 space-y-2">
            {data.byTag.length === 0 && <li className="text-xs text-muted-foreground">No data</li>}
            {data.byTag.map((t) => (
              <li key={t.tag} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground truncate">{t.tag}</span>
                <span className="tabular-nums text-foreground">{t.count}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-medium text-foreground">Recently updated</h3>
          <ul className="mt-3 space-y-2">
            {data.recentlyUpdated.length === 0 && <li className="text-xs text-muted-foreground">No data</li>}
            {data.recentlyUpdated.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-foreground truncate">{s.title}</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {new Date(s.updatedAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-display font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function serviceToInput(s: Service): ServiceInput {
  return {
    id: s.id,
    slug: s.slug,
    title: s.title,
    tag: s.tag,
    icon: s.icon,
    short_desc: s.shortDesc,
    intro: s.intro,
    ai_angle: s.aiAngle,
    deliverables: s.deliverables,
    process: s.process,
    faqs: s.faqs,
    tiers: s.tiers,
    sort_order: s.sortOrder,
  };
}

function ServiceEditor({
  initial,
  onCancel,
  onSubmit,
  saving,
}: {
  initial: ServiceInput;
  onCancel: () => void;
  onSubmit: (v: ServiceInput) => void;
  saving: boolean;
}) {
  const [v, setV] = useState<ServiceInput>(initial);
  useEffect(() => setV(initial), [initial]);

  function patch<K extends keyof ServiceInput>(key: K, val: ServiceInput[K]) {
    setV((p) => ({ ...p, [key]: val }));
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur grid place-items-center p-4 overflow-y-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(v);
        }}
        className="w-full max-w-3xl my-8 rounded-2xl border border-border bg-card p-6 space-y-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display font-semibold">{v.id ? "Edit service" : "New service"}</h2>
          <button type="button" onClick={onCancel} className="h-8 w-8 rounded-md border border-border grid place-items-center">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <Field label="Title">
            <input required value={v.title} onChange={(e) => patch("title", e.target.value)} className={inp} />
          </Field>
          <Field label="Slug (URL)">
            <input required value={v.slug} onChange={(e) => patch("slug", e.target.value)} className={inp} placeholder="lowercase-dashes" />
          </Field>
          <Field label="Tag / category">
            <input value={v.tag} onChange={(e) => patch("tag", e.target.value)} className={inp} />
          </Field>
          <Field label="Icon">
            <select value={v.icon} onChange={(e) => patch("icon", e.target.value)} className={inp}>
              {ICON_OPTIONS.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Short description (shown in cards)">
          <textarea rows={2} value={v.short_desc} onChange={(e) => patch("short_desc", e.target.value)} className={inp} />
        </Field>

        <Field label="Intro (long form)">
          <textarea rows={4} value={v.intro} onChange={(e) => patch("intro", e.target.value)} className={inp} />
        </Field>

        <Field label="AI angle">
          <textarea rows={3} value={v.ai_angle} onChange={(e) => patch("ai_angle", e.target.value)} className={inp} />
        </Field>

        <ListEditor
          label="Deliverables (one per line)"
          value={v.deliverables.join("\n")}
          onChange={(t) => patch("deliverables", splitLines(t))}
        />

        <KeyedListEditor
          label="Process steps"
          items={v.process}
          keys={["step", "detail"]}
          onChange={(arr) => patch("process", arr as ServiceInput["process"])}
        />

        <KeyedListEditor
          label="FAQs"
          items={v.faqs}
          keys={["q", "a"]}
          onChange={(arr) => patch("faqs", arr as ServiceInput["faqs"])}
        />

        <TierEditor tiers={v.tiers} onChange={(t) => patch("tiers", t)} />

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onCancel} className="rounded-md border border-border px-4 py-2 text-sm">Cancel</button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-accent disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

const inp = "w-full rounded-md border border-border bg-background px-3 py-2 text-sm";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function CharField({
  label,
  value,
  onChange,
  placeholder,
  maxLen,
  warnMin,
  warnMax,
  textarea: isTextarea,
  rows,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  maxLen: number;
  warnMin: number;
  warnMax: number;
  textarea?: boolean;
  rows?: number;
}) {
  const len = value.length;
  let status: "good" | "warn" | "bad" = "good";
  if (len === 0) status = "good";
  else if (len < warnMin || len > warnMax) status = "bad";
  else if (len < warnMin + 5 || len > warnMax - 5) status = "warn";

  const color = status === "bad" ? "text-destructive" : status === "warn" ? "text-yellow-500" : "text-green-500";

  return (
    <label className="block">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className={`text-[10px] tabular-nums ${color}`}>
          {len}/{maxLen}
        </span>
      </div>
      <div className="mt-1">
        {isTextarea ? (
          <textarea
            rows={rows ?? 2}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={inp}
            placeholder={placeholder}
          />
        ) : (
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={inp}
            placeholder={placeholder}
          />
        )}
      </div>
    </label>
  );
}

function splitLines(t: string) {
  return t.split("\n").map((s) => s.trim()).filter(Boolean);
}

function ListEditor({ label, value, onChange }: { label: string; value: string; onChange: (t: string) => void }) {
  return (
    <Field label={label}>
      <textarea rows={5} value={value} onChange={(e) => onChange(e.target.value)} className={inp} />
    </Field>
  );
}

function KeyedListEditor<T extends Record<string, string>>({
  label,
  items,
  keys,
  onChange,
}: {
  label: string;
  items: T[];
  keys: (keyof T & string)[];
  onChange: (items: T[]) => void;
}) {
  const add = () => onChange([...items, Object.fromEntries(keys.map((k) => [k, ""])) as T]);
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const patch = (i: number, k: keyof T & string, val: string) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, [k]: val } : it)));

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <button type="button" onClick={add} className="text-xs text-primary hover:text-accent">+ Add</button>
      </div>
      <div className="mt-2 space-y-2">
        {items.map((it, i) => (
          <div key={i} className="rounded-md border border-border bg-background p-3 space-y-2">
            {keys.map((k) => (
              <input
                key={k}
                value={it[k] ?? ""}
                placeholder={k}
                onChange={(e) => patch(i, k, e.target.value)}
                className={inp}
              />
            ))}
            <button type="button" onClick={() => remove(i)} className="text-xs text-destructive hover:underline">Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TierEditor({
  tiers,
  onChange,
}: {
  tiers: ServiceInput["tiers"];
  onChange: (t: ServiceInput["tiers"]) => void;
}) {
  const add = () =>
    onChange([
      ...tiers,
      { name: "", price: "", cadence: "", blurb: "", features: [], highlighted: false },
    ]);
  const remove = (i: number) => onChange(tiers.filter((_, idx) => idx !== i));
  const patch = (i: number, p: Partial<ServiceInput["tiers"][number]>) =>
    onChange(tiers.map((t, idx) => (idx === i ? { ...t, ...p } : t)));

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Pricing tiers</span>
        <button type="button" onClick={add} className="text-xs text-primary hover:text-accent">+ Add tier</button>
      </div>
      <div className="mt-2 space-y-3">
        {tiers.map((t, i) => (
          <div key={i} className="rounded-md border border-border bg-background p-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input className={inp} placeholder="Name" value={t.name} onChange={(e) => patch(i, { name: e.target.value })} />
              <input className={inp} placeholder="Price" value={t.price} onChange={(e) => patch(i, { price: e.target.value })} />
              <input className={inp} placeholder="Cadence (e.g. / month)" value={t.cadence ?? ""} onChange={(e) => patch(i, { cadence: e.target.value })} />
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <input type="checkbox" checked={!!t.highlighted} onChange={(e) => patch(i, { highlighted: e.target.checked })} />
                Highlighted
              </label>
            </div>
            <textarea rows={2} className={inp} placeholder="Blurb" value={t.blurb ?? ""} onChange={(e) => patch(i, { blurb: e.target.value })} />
            <textarea
              rows={4}
              className={inp}
              placeholder="Features (one per line)"
              value={(t.features ?? []).join("\n")}
              onChange={(e) => patch(i, { features: splitLines(e.target.value) })}
            />
            <button type="button" onClick={() => remove(i)} className="text-xs text-destructive hover:underline">Remove tier</button>
          </div>
        ))}
      </div>
    </div>
  );
}
function emptyPost(): BlogPostInput {
  return {
    slug: "",
    title: "",
    excerpt: "",
    cover_image: "",
    content: "",
    tags: [],
    status: "draft",
    author_name: "vrseoguru",
    reading_minutes: 5,
    meta_title: "",
    meta_description: "",
    canonical_url: "",
    og_title: "",
    og_description: "",
    og_image: "",
    twitter_title: "",
    twitter_description: "",
    twitter_image: "",
  };
}

const SITE_URL = "https://clever-reach-pro.lovable.app";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;

function resolveSeo(v: BlogPostInput) {
  const title = v.meta_title?.trim() || v.title || "Untitled post";
  const description =
    v.meta_description?.trim() ||
    v.excerpt?.trim() ||
    "Insights on AI-driven SEO, performance marketing and automation.";
  const ogTitle = v.og_title?.trim() || title;
  const ogDescription = v.og_description?.trim() || description;
  const ogImage = v.og_image?.trim() || v.cover_image?.trim() || DEFAULT_OG_IMAGE;
  const twTitle = v.twitter_title?.trim() || ogTitle;
  const twDescription = v.twitter_description?.trim() || ogDescription;
  const twImage = v.twitter_image?.trim() || ogImage;
  const canonical = v.canonical_url?.trim() || `${SITE_URL}/blog/${v.slug || "your-post"}`;
  return { title, description, ogTitle, ogDescription, ogImage, twTitle, twDescription, twImage, canonical };
}

function SeoPreview({ v }: { v: BlogPostInput }) {
  const s = resolveSeo(v);
  const displayUrl = s.canonical.replace(/^https?:\/\//, "");
  const titleLen = s.title.length;
  const descLen = s.description.length;
  const titleColor = titleLen > 60 ? "text-destructive" : titleLen > 50 ? "text-yellow-500" : "text-muted-foreground";
  const descColor = descLen > 160 ? "text-destructive" : descLen > 140 ? "text-yellow-500" : "text-muted-foreground";

  return (
    <div className="rounded-lg border border-border bg-background/40 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-display font-semibold">Live SEO preview</h3>
        <div className="flex gap-3 text-[11px]">
          <span className={titleColor}>Title {titleLen}/60</span>
          <span className={descColor}>Desc {descLen}/160</span>
        </div>
      </div>

      {/* Google SERP */}
      <div>
        <p className="mb-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">Google search result</p>
        <div className="rounded-md bg-white p-4 text-left">
          <p className="text-xs text-[#202124]">{displayUrl}</p>
          <p className="mt-1 text-[18px] leading-snug text-[#1a0dab] truncate">{s.title}</p>
          <p className="mt-1 text-[13px] leading-snug text-[#4d5156] line-clamp-2">{s.description}</p>
        </div>
      </div>

      {/* Facebook / Open Graph */}
      <div>
        <p className="mb-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">Facebook / Open Graph</p>
        <div className="overflow-hidden rounded-md border border-[#dadde1] bg-white">
          <div className="aspect-[1.91/1] bg-[#f0f2f5]">
            {s.ogImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={s.ogImage} alt="" className="h-full w-full object-cover" onError={(e) => ((e.currentTarget.style.display = "none"))} />
            ) : null}
          </div>
          <div className="px-3 py-2">
            <p className="text-[11px] uppercase text-[#606770]">{displayUrl.split("/")[0]}</p>
            <p className="mt-0.5 text-[15px] font-semibold text-[#1d2129] line-clamp-2">{s.ogTitle}</p>
            <p className="mt-0.5 text-[12px] text-[#606770] line-clamp-2">{s.ogDescription}</p>
          </div>
        </div>
      </div>

      {/* Twitter / X */}
      <div>
        <p className="mb-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">X / Twitter card</p>
        <div className="overflow-hidden rounded-2xl border border-[#cfd9de] bg-white">
          <div className="aspect-[1.91/1] bg-[#f7f9f9]">
            {s.twImage ? (
              <img src={s.twImage} alt="" className="h-full w-full object-cover" onError={(e) => ((e.currentTarget.style.display = "none"))} />
            ) : null}
          </div>
          <div className="px-3 py-2">
            <p className="text-[15px] font-semibold text-[#0f1419] line-clamp-1">{s.twTitle}</p>
            <p className="mt-0.5 text-[13px] text-[#536471] line-clamp-2">{s.twDescription}</p>
            <p className="mt-1 text-[12px] text-[#536471]">{displayUrl.split("/")[0]}</p>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground">
        Tip: OG image falls back to cover image, then to the site default.
      </p>
    </div>
  );
}

function postToInput(p: BlogPost): BlogPostInput {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    cover_image: p.coverImage,
    content: p.content,
    tags: p.tags,
    status: p.status,
    author_name: p.authorName,
    reading_minutes: p.readingMinutes,
    meta_title: p.metaTitle,
    meta_description: p.metaDescription,
    canonical_url: p.canonicalUrl,
    og_title: p.ogTitle,
    og_description: p.ogDescription,
    og_image: p.ogImage,
    twitter_title: p.twitterTitle,
    twitter_description: p.twitterDescription,
    twitter_image: p.twitterImage,
  };
}

function BlogPanel({ onEdit }: { onEdit: (p: BlogPostInput) => void }) {
  const qc = useQueryClient();
  const list = useServerFn(listAllPosts);
  const del = useServerFn(deletePost);
  const posts = useQuery({ queryKey: ["blog", "all"], queryFn: () => list() });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["blog", "all"] });
      qc.invalidateQueries({ queryKey: ["blog", "published"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  if (posts.isLoading) return <p className="mt-10 text-center text-sm text-muted-foreground">Loading posts…</p>;
  const items = posts.data ?? [];

  return (
    <div className="mt-8 space-y-3">
      {items.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-10">No blog posts yet. Click "New post".</p>
      )}
      {items.map((p) => (
        <div key={p.id} className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
          <div className="h-12 w-16 rounded-md overflow-hidden bg-muted shrink-0">
            {p.coverImage ? <img src={p.coverImage} alt="" className="h-full w-full object-cover" /> : null}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{p.title}</p>
            <p className="text-xs text-muted-foreground truncate">
              /{p.slug} ·{" "}
              <span className={p.status === "published" ? "text-primary" : "text-muted-foreground"}>
                {p.status}
              </span>
              {p.publishedAt ? ` · ${new Date(p.publishedAt).toLocaleDateString()}` : ""}
            </p>
          </div>
          <button
            onClick={() => onEdit(postToInput(p))}
            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary"
          >
            <Pencil className="h-3 w-3" /> Edit
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete "${p.title}"?`)) deleteMutation.mutate(p.id);
            }}
            className="inline-flex items-center gap-1 rounded-md border border-destructive/40 text-destructive px-3 py-1.5 text-xs hover:bg-destructive/10"
          >
            <Trash2 className="h-3 w-3" /> Delete
          </button>
        </div>
      ))}
    </div>
  );
}

function BlogEditor({
  initial,
  onCancel,
  onSaved,
}: {
  initial: BlogPostInput;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const qc = useQueryClient();
  const save = useServerFn(upsertPost);
  const [v, setV] = useState<BlogPostInput>(initial);
  useEffect(() => setV(initial), [initial]);

  const saveMutation = useMutation({
    mutationFn: (input: BlogPostInput) => save({ data: input }),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["blog", "all"] });
      qc.invalidateQueries({ queryKey: ["blog", "published"] });
      onSaved();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  function patch<K extends keyof BlogPostInput>(key: K, val: BlogPostInput[K]) {
    setV((p) => ({ ...p, [key]: val }));
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur grid place-items-center p-4 overflow-y-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          saveMutation.mutate(v);
        }}
        className="w-full max-w-3xl my-8 rounded-2xl border border-border bg-card p-6 space-y-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display font-semibold">{v.id ? "Edit post" : "New post"}</h2>
          <button type="button" onClick={onCancel} className="h-8 w-8 rounded-md border border-border grid place-items-center">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <Field label="Title">
            <input required value={v.title} onChange={(e) => patch("title", e.target.value)} className={inp} />
          </Field>
          <Field label="Slug (URL)">
            <input required value={v.slug} onChange={(e) => patch("slug", e.target.value)} className={inp} placeholder="my-post-slug" />
          </Field>
          <Field label="Author name">
            <input value={v.author_name} onChange={(e) => patch("author_name", e.target.value)} className={inp} />
          </Field>
          <Field label="Reading time (minutes)">
            <input
              type="number"
              min={1}
              max={120}
              value={v.reading_minutes}
              onChange={(e) => patch("reading_minutes", Number(e.target.value) || 1)}
              className={inp}
            />
          </Field>
          <Field label="Status">
            <select value={v.status} onChange={(e) => patch("status", e.target.value as BlogPostInput["status"])} className={inp}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </Field>
          <Field label="Tags (comma separated)">
            <input
              value={v.tags.join(", ")}
              onChange={(e) => patch("tags", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
              className={inp}
              placeholder="SEO, AI, Growth"
            />
          </Field>
        </div>

        <Field label="Cover image URL">
          <input value={v.cover_image} onChange={(e) => patch("cover_image", e.target.value)} className={inp} placeholder="https://…" />
        </Field>

        <Field label="Excerpt (shown in cards)">
          <textarea rows={2} value={v.excerpt} onChange={(e) => patch("excerpt", e.target.value)} className={inp} />
        </Field>

        <Field label="Content (Markdown supported)">
          <textarea rows={14} value={v.content} onChange={(e) => patch("content", e.target.value)} className={`${inp} font-mono text-xs`} />
        </Field>

        <SeoPreview v={v} />

        <div className="rounded-lg border border-border bg-background/40 p-4 space-y-4">
          <div>
            <h3 className="text-sm font-display font-semibold">SEO &amp; social</h3>
            <p className="text-xs text-muted-foreground">Override how this post appears in search results and on social shares. Leave blank to fall back to title / excerpt / cover image.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            <CharField label="Meta title" value={v.meta_title} onChange={(val) => patch("meta_title", val)} placeholder="Defaults to post title" maxLen={60} warnMin={50} warnMax={60} />
            <Field label="Canonical URL">
              <input value={v.canonical_url} onChange={(e) => patch("canonical_url", e.target.value)} className={inp} placeholder="https://example.com/blog/slug" />
            </Field>
          </div>
          <CharField label="Meta description" value={v.meta_description} onChange={(val) => patch("meta_description", val)} placeholder="Defaults to excerpt" maxLen={160} warnMin={150} warnMax={160} textarea rows={2} />

          <div className="grid md:grid-cols-2 gap-3">
            <Field label="OG title">
              <input value={v.og_title} onChange={(e) => patch("og_title", e.target.value)} className={inp} />
            </Field>
            <Field label="OG image URL">
              <input value={v.og_image} onChange={(e) => patch("og_image", e.target.value)} className={inp} placeholder="Defaults to cover image" />
            </Field>
          </div>
          <Field label="OG description">
            <textarea rows={2} value={v.og_description} onChange={(e) => patch("og_description", e.target.value)} className={inp} />
          </Field>

          <div className="grid md:grid-cols-2 gap-3">
            <Field label="Twitter title">
              <input value={v.twitter_title} onChange={(e) => patch("twitter_title", e.target.value)} className={inp} />
            </Field>
            <Field label="Twitter image URL">
              <input value={v.twitter_image} onChange={(e) => patch("twitter_image", e.target.value)} className={inp} placeholder="Defaults to OG / cover image" />
            </Field>
          </div>
          <Field label="Twitter description">
            <textarea rows={2} value={v.twitter_description} onChange={(e) => patch("twitter_description", e.target.value)} className={inp} />
          </Field>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onCancel} className="rounded-md border border-border px-4 py-2 text-sm">Cancel</button>
          <button
            type="submit"
            disabled={saveMutation.isPending}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-accent disabled:opacity-50"
          >
            <Save className="h-4 w-4" /> {saveMutation.isPending ? "Saving…" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
