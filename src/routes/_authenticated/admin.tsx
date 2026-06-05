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
import { useIdleLogout } from "@/hooks/use-idle-logout";
import {
  listAllPosts,
  upsertPost,
  deletePost,
  type BlogPostInput,
} from "@/lib/blog.functions";
import {
  listUsersWithRoles,
  setUserRole,
  removeUserRole,
  listRoleAuditLog,
  resendVerificationEmail,
  inviteUser,
  type AdminUserRow,
  type AppRole,
  type RoleAuditEntry,
} from "@/lib/admin-users.functions";
import {
  listLeads,
  updateLead,
  deleteLead,
  listLeadAudit,
  listAssignees,
  LEAD_STATUSES,
  type LeadRow,
  type LeadStatus,
  type LeadAuditEntry,
  type AssigneeOption,
} from "@/lib/leads.functions";
import type { BlogPost } from "@/lib/blog.shared";
import {
  listCategories,
  upsertCategory,
  deleteCategory,
  type BlogCategoryInput,
} from "@/lib/categories.functions";
import type { BlogCategory } from "@/lib/categories.shared";
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
  Tags,
  Eye,
  EyeOff,
  Upload,
  ImageIcon,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Code,
  Image as ImagePlus,
  Users as UsersIcon,
  Search as SearchIcon,
  AlertTriangle,
  History,
  Download,
  MailCheck,
  Inbox,
  ArrowUpDown,
  CheckSquare,
  Square as SquareIcon,
} from "lucide-react";
import { Globe } from "lucide-react";
import { ExternalLink, Eye as EyeCount } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

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
  useIdleLogout(10 * 60 * 1000);
  const list = useServerFn(listServices);
  const caps = useServerFn(getMyCapabilities);
  const analytics = useServerFn(getServiceAnalytics);
  const save = useServerFn(upsertService);
  const del = useServerFn(deleteService);
  const reorder = useServerFn(reorderServices);

  const capsQuery = useQuery({ queryKey: ["capabilities"], queryFn: () => caps() });
  const canManage = !!capsQuery.data?.canManageServices;
  const canAnalytics = !!capsQuery.data?.canViewAnalytics;

  type Tab = "services" | "analytics" | "blog" | "categories" | "users" | "audits" | "inquiries";
  const defaultTab: Tab = canManage ? "services" : canAnalytics ? "analytics" : "services";
  const [tab, setTab] = useState<Tab>(defaultTab);
  useEffect(() => {
    if (!capsQuery.data) return;
    if (tab === "services" && !canManage && canAnalytics) setTab("analytics");
    if (tab === "analytics" && !canAnalytics && canManage) setTab("services");
    if (tab === "blog" && !canManage && canAnalytics) setTab("analytics");
    if (tab === "categories" && !canManage && canAnalytics) setTab("analytics");
    if (tab === "users" && !(capsQuery.data?.roles ?? []).includes("admin")) setTab(canManage ? "services" : "analytics");
    if ((tab === "inquiries" || tab === "audits") && !(capsQuery.data?.roles ?? []).includes("admin")) setTab(canManage ? "services" : "analytics");
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
        {canManage && (
          <TabButton active={tab === "categories"} onClick={() => setTab("categories")} icon={Tags}>
            Categories
          </TabButton>
        )}
        {canAnalytics && (
          <TabButton active={tab === "analytics"} onClick={() => setTab("analytics")} icon={BarChart3}>
            Analytics
          </TabButton>
        )}
        {(capsQuery.data?.roles ?? []).includes("admin") && (
          <TabButton active={tab === "users"} onClick={() => setTab("users")} icon={UsersIcon}>
            Users
          </TabButton>
        )}
        {(capsQuery.data?.roles ?? []).includes("admin") && (
          <TabButton active={tab === "audits"} onClick={() => setTab("audits")} icon={Globe}>
            Website Audit
          </TabButton>
        )}
        {(capsQuery.data?.roles ?? []).includes("admin") && (
          <TabButton active={tab === "inquiries"} onClick={() => setTab("inquiries")} icon={Inbox}>
            Inquiries
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
              <span
                title="Views"
                className="hidden sm:inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] tabular-nums text-muted-foreground"
              >
                <EyeCount className="h-3 w-3" /> {(s.viewCount ?? 0).toLocaleString()}
              </span>
              <a
                href={`/services/${s.slug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary"
                title="Open live page in new tab"
              >
                <ExternalLink className="h-3 w-3" /> View
              </a>
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

      {tab === "categories" && canManage && (
        <CategoriesPanel />
      )}

      {tab === "users" && (capsQuery.data?.roles ?? []).includes("admin") && (
        <UsersPanel />
      )}

      {tab === "inquiries" && (capsQuery.data?.roles ?? []).includes("admin") && (
        <InquiriesPanel kind="inquiry" />
      )}

      {tab === "audits" && (capsQuery.data?.roles ?? []).includes("admin") && (
        <InquiriesPanel kind="audit" />
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

const REQUIRED_BANNER_W = 1200;
const REQUIRED_BANNER_H = 628;

function BannerUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warn, setWarn] = useState<string | null>(null);

  async function readImageSize(file: File): Promise<{ w: number; h: number }> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const out = { w: img.naturalWidth, h: img.naturalHeight };
        URL.revokeObjectURL(url);
        resolve(out);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Could not read image"));
      };
      img.src = url;
    });
  }

  async function handleFile(file: File) {
    setError(null);
    setWarn(null);
    if (!file.type.startsWith("image/")) {
      setError("File must be an image");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB");
      return;
    }
    try {
      const { w, h } = await readImageSize(file);
      if (w !== REQUIRED_BANNER_W || h !== REQUIRED_BANNER_H) {
        const ratio = w / h;
        const targetRatio = REQUIRED_BANNER_W / REQUIRED_BANNER_H;
        if (Math.abs(ratio - targetRatio) > 0.05) {
          setError(
            `Recommended size is ${REQUIRED_BANNER_W}×${REQUIRED_BANNER_H}. Your image is ${w}×${h} — aspect ratio doesn't match.`,
          );
          return;
        }
        setWarn(`Uploaded ${w}×${h} (recommended ${REQUIRED_BANNER_W}×${REQUIRED_BANNER_H}).`);
      }

      setUploading(true);
      const ext = file.name.split(".").pop() || "jpg";
      const path = `banners/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("blog-images")
        .upload(path, file, { cacheControl: "31536000", upsert: false, contentType: file.type });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("blog-images").getPublicUrl(path);
      onChange(pub.publicUrl);
      toast.success("Banner uploaded");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Banner image <span className="text-foreground/60">(recommended {REQUIRED_BANNER_W}×{REQUIRED_BANNER_H})</span>
        </span>
        {value && (
          <button type="button" onClick={() => onChange("")} className="text-xs text-destructive hover:underline">
            Remove
          </button>
        )}
      </div>
      <div className="mt-2 rounded-lg border border-dashed border-border bg-background/40 p-4">
        {value ? (
          <div className="space-y-3">
            <div className="aspect-[1200/628] w-full overflow-hidden rounded-md bg-muted">
              <img src={value} alt="" className="h-full w-full object-cover" />
            </div>
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className={inp}
              placeholder="https://…"
            />
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center gap-2 py-8 cursor-pointer text-center">
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
            <span className="text-sm text-foreground">
              {uploading ? "Uploading…" : "Click to upload a banner"}
            </span>
            <span className="text-xs text-muted-foreground">
              PNG, JPG, or WebP · {REQUIRED_BANNER_W}×{REQUIRED_BANNER_H} · up to 5 MB
            </span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = "";
              }}
            />
          </label>
        )}

        <div className="mt-3 flex items-center justify-between gap-3">
          <label className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-xs cursor-pointer hover:border-primary">
            <Upload className="h-3 w-3" />
            {value ? "Replace image" : "Choose file"}
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
                e.target.value = "";
              }}
            />
          </label>
          {uploading && <span className="text-xs text-muted-foreground">Uploading…</span>}
        </div>

        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
        {warn && !error && <p className="mt-2 text-xs text-yellow-500">{warn}</p>}
      </div>
    </div>
  );
}

function ContentEditor({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const [ref, setRef] = useState<HTMLTextAreaElement | null>(null);

  function wrap(before: string, after = before, placeholder = "text") {
    if (!ref) return;
    const start = ref.selectionStart;
    const end = ref.selectionEnd;
    const sel = value.slice(start, end) || placeholder;
    const next = value.slice(0, start) + before + sel + after + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      ref.focus();
      ref.selectionStart = start + before.length;
      ref.selectionEnd = start + before.length + sel.length;
    });
  }

  function prefixLines(prefix: string) {
    if (!ref) return;
    const start = ref.selectionStart;
    const end = ref.selectionEnd;
    const before = value.slice(0, start);
    const sel = value.slice(start, end) || "text";
    const after = value.slice(end);
    const transformed = sel.split("\n").map((l) => `${prefix}${l}`).join("\n");
    onChange(before + transformed + after);
    requestAnimationFrame(() => ref.focus());
  }

  async function insertImage() {
    const url = window.prompt("Image URL (or leave blank to upload)");
    if (url === null) return;
    let finalUrl = url.trim();
    if (!finalUrl) {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async () => {
        const f = input.files?.[0];
        if (!f) return;
        const ext = f.name.split(".").pop() || "jpg";
        const path = `content/${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage
          .from("blog-images")
          .upload(path, f, { contentType: f.type, cacheControl: "31536000" });
        if (error) {
          toast.error(error.message);
          return;
        }
        const { data: pub } = supabase.storage.from("blog-images").getPublicUrl(path);
        const alt = window.prompt("Alt text", "") ?? "";
        const md = `\n\n![${alt}](${pub.publicUrl})\n\n`;
        onChange(value + md);
        toast.success("Image inserted");
      };
      input.click();
      return;
    }
    const alt = window.prompt("Alt text", "") ?? "";
    wrap(`![${alt}](${finalUrl})`, "", "");
  }

  function insertLink() {
    const url = window.prompt("Link URL", "https://");
    if (!url) return;
    wrap("[", `](${url})`, "link text");
  }

  const toolBtn =
    "inline-flex items-center justify-center h-7 w-7 rounded border border-border text-muted-foreground hover:text-foreground hover:border-primary";

  return (
    <Field label="Content (Markdown)">
      <div className="rounded-md border border-border bg-background">
        <div className="flex flex-wrap items-center gap-1 border-b border-border p-2">
          <button type="button" onClick={() => prefixLines("# ")} className={toolBtn} title="Heading 1">
            <span className="text-[10px] font-bold">H1</span>
          </button>
          <button type="button" onClick={() => prefixLines("## ")} className={toolBtn} title="Heading 2">
            <Heading2 className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={() => prefixLines("### ")} className={toolBtn} title="Heading 3">
            <Heading3 className="h-3.5 w-3.5" />
          </button>
          <span className="mx-1 h-5 w-px bg-border" />
          <button type="button" onClick={() => wrap("**")} className={toolBtn} title="Bold">
            <Bold className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={() => wrap("_")} className={toolBtn} title="Italic">
            <Italic className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={() => wrap("`")} className={toolBtn} title="Inline code">
            <Code className="h-3.5 w-3.5" />
          </button>
          <span className="mx-1 h-5 w-px bg-border" />
          <button type="button" onClick={() => prefixLines("- ")} className={toolBtn} title="Bulleted list">
            <List className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={() => prefixLines("1. ")} className={toolBtn} title="Numbered list">
            <ListOrdered className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={() => prefixLines("> ")} className={toolBtn} title="Quote">
            <Quote className="h-3.5 w-3.5" />
          </button>
          <span className="mx-1 h-5 w-px bg-border" />
          <button type="button" onClick={insertLink} className={toolBtn} title="Insert link">
            <LinkIcon className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={insertImage} className={toolBtn} title="Insert image">
            <ImagePlus className="h-3.5 w-3.5" />
          </button>
          <span className="mx-1 h-5 w-px bg-border" />
          <button
            type="button"
            onClick={() => onChange(value + "\n\n---\n\n")}
            className="text-[10px] text-muted-foreground hover:text-foreground px-2"
            title="Horizontal rule"
          >
            HR
          </button>
          <span className="ml-auto text-[10px] tabular-nums text-muted-foreground">
            {value.length.toLocaleString()} chars · ~{Math.max(1, Math.round(value.split(/\s+/).filter(Boolean).length / 200))} min read
          </span>
        </div>
        <textarea
          ref={setRef}
          rows={18}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-3 py-2 text-sm font-mono focus:outline-none"
          placeholder="Write your post in Markdown…"
        />
      </div>
    </Field>
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
    category: "",
    category_id: null,
    meta_title: "",
    meta_description: "",
    canonical_url: "",
    og_title: "",
    og_description: "",
    og_image: "",
    twitter_title: "",
    twitter_description: "",
    twitter_image: "",
    faqs: [],
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
    category: p.category,
    category_id: p.categoryId,
    meta_title: p.metaTitle,
    meta_description: p.metaDescription,
    canonical_url: p.canonicalUrl,
    og_title: p.ogTitle,
    og_description: p.ogDescription,
    og_image: p.ogImage,
    twitter_title: p.twitterTitle,
    twitter_description: p.twitterDescription,
    twitter_image: p.twitterImage,
    faqs: p.faqs ?? [],
  };
}

function BlogPanel({ onEdit }: { onEdit: (p: BlogPostInput) => void }) {
  const qc = useQueryClient();
  const list = useServerFn(listAllPosts);
  const del = useServerFn(deletePost);
  const save = useServerFn(upsertPost);
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

  const publishMutation = useMutation({
    mutationFn: (input: BlogPostInput) => save({ data: input }),
    onSuccess: (_, vars) => {
      toast.success(vars.status === "published" ? "Published" : "Unpublished");
      qc.invalidateQueries({ queryKey: ["blog", "all"] });
      qc.invalidateQueries({ queryKey: ["blog", "published"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed"),
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
              {p.category ? ` · ${p.category}` : ""}
              {p.publishedAt ? ` · ${new Date(p.publishedAt).toLocaleDateString()}` : ""}
            </p>
          </div>
          <span
            title="Views"
            className="hidden sm:inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-[11px] tabular-nums text-muted-foreground"
          >
            <EyeCount className="h-3 w-3" /> {p.viewCount.toLocaleString()}
          </span>
          {p.status === "published" && (
            <a
              href={`/blog/${p.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary"
              title="Open live page in new tab"
            >
              <ExternalLink className="h-3 w-3" /> View
            </a>
          )}
          <button
            onClick={() => {
              const next: BlogPostInput = {
                ...postToInput(p),
                status: p.status === "published" ? "draft" : "published",
              };
              publishMutation.mutate(next);
            }}
            disabled={publishMutation.isPending}
            className={`inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs ${
              p.status === "published"
                ? "border border-border hover:border-primary"
                : "bg-primary text-primary-foreground hover:bg-accent"
            } disabled:opacity-50`}
          >
            {p.status === "published" ? (
              <><EyeOff className="h-3 w-3" /> Unpublish</>
            ) : (
              <><Eye className="h-3 w-3" /> Publish</>
            )}
          </button>
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
          <CategorySelect
            value={v.category_id}
            onChange={(id, name) => {
              patch("category_id", id);
              patch("category", name);
            }}
          />
        </div>

        <BannerUpload
          value={v.cover_image}
          onChange={(url) => patch("cover_image", url)}
        />

        <Field label="Excerpt (shown in cards)">
          <textarea rows={2} value={v.excerpt} onChange={(e) => patch("excerpt", e.target.value)} className={inp} />
        </Field>

        <ContentEditor value={v.content} onChange={(val) => patch("content", val)} />

        <SeoPreview v={v} />

        <KeyedListEditor
          label="FAQs (shown on the post page with FAQ schema)"
          items={v.faqs}
          keys={["q", "a"]}
          onChange={(arr) => patch("faqs", arr as BlogPostInput["faqs"])}
        />

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
            <CharField label="OG title" value={v.og_title} onChange={(val) => patch("og_title", val)} maxLen={60} warnMin={40} warnMax={60} />
            <Field label="OG image URL">
              <input value={v.og_image} onChange={(e) => patch("og_image", e.target.value)} className={inp} placeholder="Defaults to cover image" />
            </Field>
          </div>
          <CharField label="OG description" value={v.og_description} onChange={(val) => patch("og_description", val)} maxLen={200} warnMin={100} warnMax={200} textarea rows={2} />

          <div className="grid md:grid-cols-2 gap-3">
            <CharField label="Twitter title" value={v.twitter_title} onChange={(val) => patch("twitter_title", val)} maxLen={70} warnMin={50} warnMax={70} />
            <Field label="Twitter image URL">
              <input value={v.twitter_image} onChange={(e) => patch("twitter_image", e.target.value)} className={inp} placeholder="Defaults to OG / cover image" />
            </Field>
          </div>
          <CharField label="Twitter description" value={v.twitter_description} onChange={(val) => patch("twitter_description", val)} maxLen={200} warnMin={100} warnMax={200} textarea rows={2} />
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

function CategorySelect({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (id: string | null, name: string) => void;
}) {
  const list = useServerFn(listCategories);
  const cats = useQuery({ queryKey: ["blog-categories"], queryFn: () => list() });
  const items = cats.data ?? [];

  return (
    <Field label="Category">
      <select
        value={value ?? ""}
        onChange={(e) => {
          const id = e.target.value || null;
          const match = items.find((c) => c.id === id);
          onChange(id, match?.name ?? "");
        }}
        className={inp}
      >
        <option value="">— None —</option>
        {items.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      {items.length === 0 && (
        <p className="mt-1 text-[11px] text-muted-foreground">
          No categories yet — open the Categories tab to create one.
        </p>
      )}
    </Field>
  );
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function emptyCategory(nextOrder: number): BlogCategoryInput {
  return { name: "", slug: "", description: "", sort_order: nextOrder };
}

function categoryToInput(c: BlogCategory): BlogCategoryInput {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    sort_order: c.sortOrder,
  };
}

function CategoriesPanel() {
  const qc = useQueryClient();
  const list = useServerFn(listCategories);
  const save = useServerFn(upsertCategory);
  const del = useServerFn(deleteCategory);
  const cats = useQuery({ queryKey: ["blog-categories"], queryFn: () => list() });

  const [editing, setEditing] = useState<BlogCategoryInput | null>(null);

  const saveMutation = useMutation({
    mutationFn: (input: BlogCategoryInput) => save({ data: input }),
    onSuccess: () => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["blog-categories"] });
      setEditing(null);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => del({ data: { id } }),
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["blog-categories"] });
      qc.invalidateQueries({ queryKey: ["blog", "all"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  const items = cats.data ?? [];

  return (
    <div className="mt-8 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Manage blog categories. Deleting one keeps the posts but clears their category.
        </p>
        <button
          onClick={() => setEditing(emptyCategory(items.length))}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-accent"
        >
          <Plus className="h-4 w-4" /> New category
        </button>
      </div>

      {cats.isLoading && (
        <p className="text-center text-sm text-muted-foreground py-10">Loading…</p>
      )}
      {!cats.isLoading && items.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-10">
          No categories yet. Click "New category".
        </p>
      )}

      {items.map((c) => (
        <div key={c.id} className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/30 grid place-items-center">
            <Tags className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">{c.name}</p>
            <p className="text-xs text-muted-foreground truncate">
              /{c.slug}
              {c.description ? ` · ${c.description}` : ""}
            </p>
          </div>
          <button
            onClick={() => setEditing(categoryToInput(c))}
            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary"
          >
            <Pencil className="h-3 w-3" /> Rename
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete "${c.name}"? Posts using it will lose this category.`))
                deleteMutation.mutate(c.id);
            }}
            className="inline-flex items-center gap-1 rounded-md border border-destructive/40 text-destructive px-3 py-1.5 text-xs hover:bg-destructive/10"
          >
            <Trash2 className="h-3 w-3" /> Delete
          </button>
        </div>
      ))}

      {editing && (
        <CategoryEditor
          initial={editing}
          onCancel={() => setEditing(null)}
          onSubmit={(v) => saveMutation.mutate(v)}
          saving={saveMutation.isPending}
        />
      )}
    </div>
  );
}

function CategoryEditor({
  initial,
  onCancel,
  onSubmit,
  saving,
}: {
  initial: BlogCategoryInput;
  onCancel: () => void;
  onSubmit: (v: BlogCategoryInput) => void;
  saving: boolean;
}) {
  const [v, setV] = useState<BlogCategoryInput>(initial);
  useEffect(() => setV(initial), [initial]);
  const slugTouched = !!initial.id;

  function patch<K extends keyof BlogCategoryInput>(k: K, val: BlogCategoryInput[K]) {
    setV((p) => ({ ...p, [k]: val }));
  }

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur grid place-items-center p-4 overflow-y-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(v);
        }}
        className="w-full max-w-lg my-8 rounded-2xl border border-border bg-card p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-display font-semibold">
            {v.id ? "Edit category" : "New category"}
          </h2>
          <button type="button" onClick={onCancel} className="h-8 w-8 rounded-md border border-border grid place-items-center">
            <X className="h-4 w-4" />
          </button>
        </div>

        <Field label="Name">
          <input
            required
            value={v.name}
            onChange={(e) => {
              const name = e.target.value;
              patch("name", name);
              if (!slugTouched) patch("slug", slugify(name));
            }}
            className={inp}
            placeholder="Performance Marketing"
          />
        </Field>

        <Field label="Slug (URL)">
          <input
            required
            value={v.slug}
            onChange={(e) => patch("slug", e.target.value)}
            className={inp}
            placeholder="performance-marketing"
          />
        </Field>

        <Field label="Description (optional)">
          <textarea
            rows={3}
            value={v.description}
            onChange={(e) => patch("description", e.target.value)}
            className={inp}
            placeholder="Short summary shown on category pages."
          />
        </Field>

        <Field label="Sort order">
          <input
            type="number"
            min={0}
            value={v.sort_order}
            onChange={(e) => patch("sort_order", Number(e.target.value) || 0)}
            className={inp}
          />
        </Field>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onCancel} className="rounded-md border border-border px-4 py-2 text-sm">
            Cancel
          </button>
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

const ROLE_OPTIONS: AppRole[] = ["admin", "editor", "user"];

function UsersPanel() {
  const qc = useQueryClient();
  const listFn = useServerFn(listUsersWithRoles);
  const setFn = useServerFn(setUserRole);
  const removeFn = useServerFn(removeUserRole);
  const auditFn = useServerFn(listRoleAuditLog);
  const resendFn = useServerFn(resendVerificationEmail);
  const inviteFn = useServerFn(inviteUser);

  const usersQuery = useQuery({ queryKey: ["admin-users"], queryFn: () => listFn() });

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | AppRole | "none">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "verified" | "unverified">("all");
  const [showAudit, setShowAudit] = useState(false);

  // Audit log filter state
  const [auditAction, setAuditAction] = useState<"all" | "assigned" | "removed">("all");
  const [auditRole, setAuditRole] = useState<"all" | AppRole>("all");
  const [auditSearch, setAuditSearch] = useState("");
  const [auditFrom, setAuditFrom] = useState("");
  const [auditTo, setAuditTo] = useState("");

  const auditParams = useMemo(
    () => ({
      action: auditAction,
      role: auditRole,
      search: auditSearch.trim() || undefined,
      from: auditFrom ? new Date(auditFrom).toISOString() : undefined,
      to: auditTo ? new Date(`${auditTo}T23:59:59`).toISOString() : undefined,
      limit: 500,
    }),
    [auditAction, auditRole, auditSearch, auditFrom, auditTo],
  );
  const auditQuery = useQuery({
    queryKey: ["role-audit-log", auditParams],
    queryFn: () => auditFn({ data: auditParams }),
    enabled: showAudit,
  });

  const addMutation = useMutation({
    mutationFn: (v: { userId: string; role: AppRole }) => setFn({ data: v }),
    onSuccess: () => {
      toast.success("Role assigned");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      qc.invalidateQueries({ queryKey: ["role-audit-log"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const removeMutation = useMutation({
    mutationFn: (v: { userId: string; role: AppRole }) => removeFn({ data: v }),
    onSuccess: () => {
      toast.success("Role removed");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      qc.invalidateQueries({ queryKey: ["role-audit-log"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const resendMutation = useMutation({
    mutationFn: (userId: string) => resendFn({ data: { userId } }),
    onSuccess: (r) => toast.success(`Verification email queued to ${r.email}`),
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to send"),
  });

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<AppRole>("user");
  const inviteMutation = useMutation({
    mutationFn: (v: { email: string; role: AppRole }) => inviteFn({ data: v }),
    onSuccess: () => {
      toast.success("Invitation sent");
      setInviteEmail("");
      qc.invalidateQueries({ queryKey: ["admin-users"] });
      qc.invalidateQueries({ queryKey: ["role-audit-log"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed to invite"),
  });

  if (usersQuery.isLoading) {
    return <p className="mt-10 text-center text-sm text-muted-foreground">Loading users…</p>;
  }
  if (usersQuery.error) {
    return <p className="mt-10 text-center text-sm text-destructive">{(usersQuery.error as Error).message}</p>;
  }
  const users = usersQuery.data ?? [];
  const adminCount = users.filter((u) => u.roles.includes("admin")).length;

  const filtered = users.filter((u) => {
    const q = search.trim().toLowerCase();
    if (q && !u.email.toLowerCase().includes(q)) return false;
    if (roleFilter === "none") {
      if (u.roles.length > 0) return false;
    } else if (roleFilter !== "all") {
      if (!u.roles.includes(roleFilter)) return false;
    }
    if (statusFilter === "verified" && !u.emailConfirmedAt) return false;
    if (statusFilter === "unverified" && u.emailConfirmedAt) return false;
    return true;
  });

  return (
    <div className="mt-8 space-y-4">
      <div className="rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
        Assign roles to control admin panel access. <strong className="text-foreground">admin</strong> = full access including user management.{" "}
        <strong className="text-foreground">editor</strong> = manage services, blog and categories.{" "}
        <strong className="text-foreground">user</strong> = no admin access.
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          const email = inviteEmail.trim();
          if (!email) return;
          inviteMutation.mutate({ email, role: inviteRole });
        }}
        className="rounded-xl border border-border bg-card p-4 flex flex-col md:flex-row gap-2 md:items-center"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">Add a user</p>
          <p className="text-xs text-muted-foreground">Send an invite email and optionally assign a role.</p>
        </div>
        <input
          type="email"
          required
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
          placeholder="teammate@brand.com"
          className="rounded-md border border-border bg-background px-3 py-2 text-sm md:w-64"
        />
        <select
          value={inviteRole}
          onChange={(e) => setInviteRole(e.target.value as AppRole)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="user">User</option>
          <option value="editor">Editor</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          disabled={inviteMutation.isPending}
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
        >
          {inviteMutation.isPending ? "Inviting…" : "Invite & assign"}
        </button>
      </form>

      {adminCount <= 1 && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-700 dark:text-amber-300 flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <div>
            <strong className="font-medium">Only one admin remaining.</strong> Removing the last admin role is blocked. Assign admin to another user first if you need to change it.
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email…"
            className="w-full rounded-md border border-border bg-background pl-9 pr-3 py-2 text-sm"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="all">All roles</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="user">User</option>
          <option value="none">No role</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm"
        >
          <option value="all">Any status</option>
          <option value="verified">Verified</option>
          <option value="unverified">Unverified</option>
        </select>
        <button
          type="button"
          onClick={() => setShowAudit((s) => !s)}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs hover:border-primary"
        >
          <History className="h-3.5 w-3.5" /> {showAudit ? "Hide" : "Show"} audit log
        </button>
      </div>

      <p className="text-xs text-muted-foreground">
        {filtered.length} of {users.length} users
      </p>

      <div className="space-y-3">
        {filtered.map((u: AdminUserRow) => (
          <UserRow
            key={u.id}
            user={u}
            isLastAdmin={u.roles.includes("admin") && adminCount <= 1}
            onAdd={(role) => addMutation.mutate({ userId: u.id, role })}
            onRemove={(role) => removeMutation.mutate({ userId: u.id, role })}
            onResendVerification={() => resendMutation.mutate(u.id)}
            resending={resendMutation.isPending && resendMutation.variables === u.id}
            pending={addMutation.isPending || removeMutation.isPending}
          />
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-10">No users match these filters.</p>
        )}
      </div>

      {showAudit && (
        <AuditLogPanel
          loading={auditQuery.isLoading}
          entries={auditQuery.data ?? []}
          action={auditAction}
          onActionChange={setAuditAction}
          role={auditRole}
          onRoleChange={setAuditRole}
          search={auditSearch}
          onSearchChange={setAuditSearch}
          from={auditFrom}
          onFromChange={setAuditFrom}
          to={auditTo}
          onToChange={setAuditTo}
        />
      )}
    </div>
  );
}

function UserRow({
  user,
  isLastAdmin,
  onAdd,
  onRemove,
  onResendVerification,
  resending,
  pending,
}: {
  user: AdminUserRow;
  isLastAdmin: boolean;
  onAdd: (role: AppRole) => void;
  onRemove: (role: AppRole) => void;
  onResendVerification: () => void;
  resending: boolean;
  pending: boolean;
}) {
  const [pick, setPick] = useState<AppRole>("editor");
  const available = ROLE_OPTIONS.filter((r) => !user.roles.includes(r));
  const verified = !!user.emailConfirmedAt;

  return (
    <div className="rounded-xl border border-border bg-card p-4 flex flex-col md:flex-row md:items-center gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-medium text-foreground truncate">{user.email}</p>
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${
              verified
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                : "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-300"
            }`}
          >
            {verified ? "Verified" : "Unverified"}
          </span>
          <button
            type="button"
            disabled={resending}
            onClick={onResendVerification}
            title={verified ? "Send a magic sign-in link" : "Resend verification email"}
            className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-0.5 text-[10px] text-muted-foreground hover:text-foreground hover:border-primary disabled:opacity-50"
          >
            <MailCheck className="h-3 w-3" />
            {resending ? "Sending…" : verified ? "Send magic link" : "Resend verification"}
          </button>
        </div>
        <p className="text-xs text-muted-foreground truncate">
          Joined {new Date(user.createdAt).toLocaleDateString()}
          {user.lastSignInAt ? ` · last seen ${new Date(user.lastSignInAt).toLocaleDateString()}` : ""}
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {user.roles.length === 0 && (
          <span className="text-xs text-muted-foreground italic">No roles</span>
        )}
        {user.roles.map((r) => {
          const blocked = r === "admin" && isLastAdmin;
          return (
            <span
              key={r}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] ${
                r === "admin"
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-secondary text-foreground"
              }`}
            >
              {r}
              <button
                type="button"
                disabled={pending || blocked}
                title={blocked ? "Cannot remove the last admin" : `Remove ${r} role`}
                onClick={() => {
                  if (blocked) {
                    toast.error("Cannot remove the last admin — assign admin to another user first.");
                    return;
                  }
                  if (confirm(`Remove "${r}" role from ${user.email}?`)) onRemove(r);
                }}
                className="hover:text-destructive disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label={`Remove ${r} role`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          );
        })}
      </div>
      {available.length > 0 && (
        <div className="flex gap-2">
          <select
            value={available.includes(pick) ? pick : available[0]}
            onChange={(e) => setPick(e.target.value as AppRole)}
            className="rounded-md border border-border bg-background px-2 py-1.5 text-xs"
          >
            {available.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          <button
            type="button"
            disabled={pending}
            onClick={() => onAdd(available.includes(pick) ? pick : available[0])}
            className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-accent disabled:opacity-50"
          >
            <Plus className="h-3 w-3" /> Assign
          </button>
        </div>
      )}
    </div>
  );
}

function AuditLogPanel({
  loading,
  entries,
  action,
  onActionChange,
  role,
  onRoleChange,
  search,
  onSearchChange,
  from,
  onFromChange,
  to,
  onToChange,
}: {
  loading: boolean;
  entries: RoleAuditEntry[];
  action: "all" | "assigned" | "removed";
  onActionChange: (v: "all" | "assigned" | "removed") => void;
  role: "all" | AppRole;
  onRoleChange: (v: "all" | AppRole) => void;
  search: string;
  onSearchChange: (v: string) => void;
  from: string;
  onFromChange: (v: string) => void;
  to: string;
  onToChange: (v: string) => void;
}) {
  function escapeCsv(v: string) {
    if (v == null) return "";
    const s = String(v).replace(/"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  }
  function downloadCsv() {
    const header = ["timestamp", "actor_email", "action", "role", "target_email"];
    const rows = entries.map((e) =>
      [e.createdAt, e.actorEmail, e.action, e.role, e.targetEmail].map(escapeCsv).join(","),
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    const a = document.createElement("a");
    a.href = url;
    a.download = `role-audit-log-${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <History className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-medium text-foreground">Role change audit log</h3>
        <span className="text-xs text-muted-foreground">({entries.length} events)</span>
        <button
          type="button"
          onClick={downloadCsv}
          disabled={entries.length === 0}
          className="ml-auto inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-[11px] hover:border-primary disabled:opacity-40"
        >
          <Download className="h-3 w-3" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-3">
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Email…"
          className="col-span-2 md:col-span-1 rounded-md border border-border bg-background px-2 py-1.5 text-xs"
        />
        <select
          value={action}
          onChange={(e) => onActionChange(e.target.value as typeof action)}
          className="rounded-md border border-border bg-background px-2 py-1.5 text-xs"
        >
          <option value="all">All actions</option>
          <option value="assigned">Assigned</option>
          <option value="removed">Removed</option>
        </select>
        <select
          value={role}
          onChange={(e) => onRoleChange(e.target.value as typeof role)}
          className="rounded-md border border-border bg-background px-2 py-1.5 text-xs"
        >
          <option value="all">All roles</option>
          <option value="admin">Admin</option>
          <option value="editor">Editor</option>
          <option value="user">User</option>
        </select>
        <input
          type="date"
          value={from}
          onChange={(e) => onFromChange(e.target.value)}
          className="rounded-md border border-border bg-background px-2 py-1.5 text-xs"
          aria-label="From date"
        />
        <input
          type="date"
          value={to}
          onChange={(e) => onToChange(e.target.value)}
          className="rounded-md border border-border bg-background px-2 py-1.5 text-xs"
          aria-label="To date"
        />
      </div>

      {loading && <p className="text-xs text-muted-foreground">Loading…</p>}
      {!loading && entries.length === 0 && (
        <p className="text-xs text-muted-foreground italic">No role changes recorded yet.</p>
      )}
      {!loading && entries.length > 0 && (
        <ul className="space-y-1.5 text-xs">
          {entries.map((e) => (
            <li key={e.id} className="flex flex-wrap items-center gap-2 py-1.5 border-b border-border/60 last:border-0">
              <span className="text-muted-foreground tabular-nums">
                {new Date(e.createdAt).toLocaleString()}
              </span>
              <span className="text-foreground font-medium">{e.actorEmail}</span>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                  e.action === "assigned"
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                    : "border-destructive/30 bg-destructive/10 text-destructive"
                }`}
              >
                {e.action}
              </span>
              <span className="rounded-full border border-primary/40 bg-primary/10 text-primary px-2 py-0.5 text-[10px] uppercase tracking-wider">
                {e.role}
              </span>
              <span className="text-muted-foreground">
                {e.action === "assigned" ? "to" : "from"}
              </span>
              <span className="text-foreground">{e.targetEmail}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const LEAD_STATUS_STYLES: Record<LeadStatus, string> = {
  new: "border-primary/40 bg-primary/10 text-primary",
  contacted: "border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-300",
  qualified: "border-violet-500/30 bg-violet-500/10 text-violet-600 dark:text-violet-300",
  won: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
  lost: "border-muted-foreground/30 bg-muted text-muted-foreground",
  spam: "border-destructive/30 bg-destructive/10 text-destructive",
};

function InquiriesPanel({ kind }: { kind: "audit" | "inquiry" }) {
  const qc = useQueryClient();
  const listFn = useServerFn(listLeads);
  const updateFn = useServerFn(updateLead);
  const deleteFn = useServerFn(deleteLead);
  const assigneesFn = useServerFn(listAssignees);
  const leadsQuery = useQuery({ queryKey: ["admin-leads"], queryFn: () => listFn() });
  const assigneesQuery = useQuery({ queryKey: ["admin-assignees"], queryFn: () => assigneesFn() });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | LeadStatus>("all");
  const [assignedFilter, setAssignedFilter] = useState<"all" | "unassigned" | "me" | string>("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [editRequested, setEditRequested] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  type SortKey = "createdAt" | "name" | "email" | "status" | "assignedEmail";
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [meUserId, setMeUserId] = useState<string | null>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setMeUserId(data.user?.id ?? null));
  }, []);

  const updateMutation = useMutation({
    mutationFn: (v: { id: string; status?: LeadStatus; adminNotes?: string; assignedTo?: string | null; name?: string; email?: string; phone?: string; website?: string; company?: string; message?: string }) =>
      updateFn({ data: v }),
    onSuccess: () => {
      toast.success("Inquiry updated");
      qc.invalidateQueries({ queryKey: ["admin-leads"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success("Inquiry deleted");
      qc.invalidateQueries({ queryKey: ["admin-leads"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const allLeads = leadsQuery.data ?? [];
  const leads = allLeads.filter((l) => (l.kind ?? "inquiry") === kind);
  const assignees = assigneesQuery.data ?? [];
  const filtered = leads.filter((l) => {
    const q = search.trim().toLowerCase();
    if (
      q &&
      !`${l.name} ${l.email} ${l.phone} ${l.website} ${l.company} ${l.service} ${l.message} ${l.ipAddress} ${l.pageUrl} ${l.utmSource} ${l.utmCampaign} ${l.assignedEmail}`
        .toLowerCase()
        .includes(q)
    )
      return false;
    if (statusFilter !== "all" && l.status !== statusFilter) return false;
    if (assignedFilter === "unassigned" && l.assignedTo) return false;
    if (assignedFilter === "me" && l.assignedTo !== meUserId) return false;
    if (
      assignedFilter !== "all" &&
      assignedFilter !== "unassigned" &&
      assignedFilter !== "me" &&
      l.assignedTo !== assignedFilter
    )
      return false;
    if (from && new Date(l.createdAt) < new Date(from)) return false;
    if (to && new Date(l.createdAt) > new Date(`${to}T23:59:59`)) return false;
    return true;
  });
  const sorted = [...filtered].sort((a, b) => {
    const av = (a as any)[sortKey] ?? "";
    const bv = (b as any)[sortKey] ?? "";
    if (sortKey === "createdAt") {
      const diff = new Date(av).getTime() - new Date(bv).getTime();
      return sortDir === "asc" ? diff : -diff;
    }
    const cmp = String(av).localeCompare(String(bv));
    return sortDir === "asc" ? cmp : -cmp;
  });

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const allVisibleSelected = sorted.length > 0 && sorted.every((l) => selected.has(l.id));
  const toggleSelectAll = () => {
    setSelected((prev) => {
      if (allVisibleSelected) {
        const next = new Set(prev);
        sorted.forEach((l) => next.delete(l.id));
        return next;
      }
      const next = new Set(prev);
      sorted.forEach((l) => next.add(l.id));
      return next;
    });
  };
  const clearSelection = () => setSelected(new Set());

  const bulkUpdate = async (patch: { status?: LeadStatus; assignedTo?: string | null }) => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    try {
      await Promise.all(ids.map((id) => updateFn({ data: { id, ...patch } })));
      toast.success(`Updated ${ids.length} lead${ids.length === 1 ? "" : "s"}`);
      qc.invalidateQueries({ queryKey: ["admin-leads"] });
      clearSelection();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Bulk update failed");
    }
  };

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(k); setSortDir(k === "createdAt" ? "desc" : "asc"); }
  };

  const openLead = sorted.find((l) => l.id === openId) ?? null;

  function exportCsv() {
    const esc = (v: string) => {
      const s = String(v ?? "").replace(/"/g, '""');
      return /[",\n]/.test(s) ? `"${s}"` : s;
    };
    const header = [
      "created_at", "name", "email", "service", "budget", "status", "assigned_to",
      "ip_address", "user_agent", "referrer", "page_url", "utm_source", "utm_medium", "utm_campaign",
      "message", "admin_notes",
    ];
    const rows = filtered.map((l) =>
      [
        l.createdAt, l.name, l.email, l.service, l.budget, l.status, l.assignedEmail,
        l.ipAddress, l.userAgent, l.referrer, l.pageUrl, l.utmSource, l.utmMedium, l.utmCampaign,
        l.message, l.adminNotes,
      ].map(esc).join(","),
    );
    const csv = [header.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    const a = document.createElement("a");
    a.href = url;
    a.download = `inquiries-${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  if (leadsQuery.isLoading) {
    return <p className="mt-10 text-center text-sm text-muted-foreground">Loading inquiries…</p>;
  }
  if (leadsQuery.error) {
    return <p className="mt-10 text-center text-sm text-destructive">{(leadsQuery.error as Error).message}</p>;
  }

  const counts: Record<LeadStatus | "all", number> = {
    all: leads.length,
    new: 0, contacted: 0, qualified: 0, won: 0, lost: 0, spam: 0,
  };
  leads.forEach((l) => { counts[l.status] = (counts[l.status] ?? 0) + 1; });

  return (
    <div className="mt-8 space-y-4">
      <div className="rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
        {kind === "audit"
          ? "Submissions from the homepage Website Audit popup. Name, website, phone, email and message plus visitor metadata. Assign, update status, edit, and view the full audit trail."
          : "General inquiries from the contact form. Name, email, phone, company, service, budget and message plus visitor metadata. Assign, update status, edit, and view the full audit trail."}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
        {(["all", ...LEAD_STATUSES] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s as typeof statusFilter)}
            className={`rounded-lg border px-2 py-2 text-[11px] uppercase tracking-wider transition-colors ${
              statusFilter === s
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {s} <span className="tabular-nums">({counts[s as keyof typeof counts] ?? 0})</span>
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, IP, UTM, assignee…"
            className="w-full rounded-md border border-border bg-background pl-9 pr-3 py-2 text-sm"
          />
        </div>
        <select
          value={assignedFilter}
          onChange={(e) => setAssignedFilter(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm"
          aria-label="Manage Assigned Leads"
          title="Manage Assigned Leads — filter by team member"
        >
          <option value="all">Manage Assigned Leads: All</option>
          <option value="me">Assigned to me</option>
          <option value="unassigned">Unassigned</option>
          {assignees.map((a) => (
            <option key={a.userId} value={a.userId}>Assigned to {a.email}</option>
          ))}
        </select>
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm"
          aria-label="From date"
        />
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-2 text-sm"
          aria-label="To date"
        />
        <button
          type="button"
          onClick={exportCsv}
          disabled={filtered.length === 0}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-xs hover:border-primary disabled:opacity-40"
        >
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs text-muted-foreground">
          {sorted.length} of {leads.length} {kind === "audit" ? "audits" : "inquiries"}
          {selected.size > 0 && <> · <span className="text-foreground font-medium">{selected.size} selected</span></>}
        </p>
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <span className="mr-1">Sort:</span>
          {([
            ["createdAt", "Date"],
            ["name", "Name"],
            ["email", "Email"],
            ["status", "Status"],
            ["assignedEmail", "Assignee"],
          ] as const).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => toggleSort(k)}
              className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 ${
                sortKey === k ? "border-primary text-primary bg-primary/10" : "border-border hover:border-primary"
              }`}
            >
              {label}
              {sortKey === k ? (sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />) : <ArrowUpDown className="h-3 w-3 opacity-60" />}
            </button>
          ))}
        </div>
      </div>

      {selected.size > 0 && (
        <div className="sticky top-2 z-10 rounded-xl border border-primary/40 bg-primary/5 backdrop-blur p-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-foreground">{selected.size} selected</span>
          <select
            defaultValue=""
            onChange={(e) => {
              const v = e.target.value as LeadStatus | "";
              if (v) bulkUpdate({ status: v });
              e.target.value = "";
            }}
            className="rounded-md border border-border bg-background px-2 py-1.5 text-xs"
            aria-label="Bulk status update"
          >
            <option value="">Update status…</option>
            {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            defaultValue=""
            onChange={(e) => {
              const v = e.target.value;
              if (v === "__none__") bulkUpdate({ assignedTo: null });
              else if (v) bulkUpdate({ assignedTo: v });
              e.target.value = "";
            }}
            className="rounded-md border border-border bg-background px-2 py-1.5 text-xs"
            aria-label="Bulk assign"
          >
            <option value="">Assign to…</option>
            <option value="__none__">Unassign</option>
            {assignees.map((a) => <option key={a.userId} value={a.userId}>{a.email}</option>)}
          </select>
          <button
            type="button"
            onClick={() => {
              const first = sorted.find((l) => selected.has(l.id));
              if (first) { setOpenId(first.id); setEditRequested(false); }
            }}
            className="inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1.5 text-xs hover:border-primary"
          >
            <Eye className="h-3 w-3" /> View first
          </button>
          <button
            type="button"
            onClick={clearSelection}
            className="ml-auto inline-flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1.5 text-xs hover:border-primary"
          >
            <X className="h-3 w-3" /> Clear
          </button>
        </div>
      )}

      <div className="flex items-center gap-2 px-1 text-[11px] text-muted-foreground">
        <button
          type="button"
          onClick={toggleSelectAll}
          className="inline-flex items-center gap-1 hover:text-foreground"
          aria-label="Select all visible"
        >
          {allVisibleSelected ? <CheckSquare className="h-4 w-4 text-primary" /> : <SquareIcon className="h-4 w-4" />}
          Select all visible
        </button>
      </div>

      <div className="space-y-3">
        {sorted.map((l) => (
          <InquiryRow
            key={l.id}
            lead={l}
            assignees={assignees}
            selected={selected.has(l.id)}
            onSelectToggle={() => toggleSelect(l.id)}
            onView={() => { setOpenId(l.id); setEditRequested(false); }}
            onEdit={() => { setOpenId(l.id); setEditRequested(true); }}
            onUpdate={(patch) => updateMutation.mutate({ id: l.id, ...patch })}
            onDelete={() => {
              if (confirm(`Delete from ${l.email}? This cannot be undone.`)) deleteMutation.mutate(l.id);
            }}
            pending={updateMutation.isPending || deleteMutation.isPending}
          />
        ))}
        {sorted.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-10">No leads match these filters.</p>
        )}
      </div>

      <LeadDrawer
        lead={openLead}
        assignees={assignees}
        startInEdit={editRequested}
        onClose={() => { setOpenId(null); setEditRequested(false); }}
        onUpdate={(patch) => openLead && updateMutation.mutate({ id: openLead.id, ...patch })}
        onDelete={() => {
          if (openLead && confirm(`Delete from ${openLead.email}? This cannot be undone.`)) {
            deleteMutation.mutate(openLead.id);
            setOpenId(null);
          }
        }}
        pending={updateMutation.isPending || deleteMutation.isPending}
      />
    </div>
  );
}

function InquiryRow({
  lead,
  assignees,
  selected,
  onSelectToggle,
  onView,
  onEdit,
  onUpdate,
  onDelete,
  pending,
}: {
  lead: LeadRow;
  assignees: AssigneeOption[];
  selected: boolean;
  onSelectToggle: () => void;
  onView: () => void;
  onEdit: () => void;
  onUpdate: (patch: { status?: LeadStatus; adminNotes?: string; assignedTo?: string | null; name?: string; email?: string; phone?: string; website?: string; company?: string; message?: string }) => void;
  onDelete: () => void;
  pending: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="p-4 flex flex-col md:flex-row md:items-center gap-3">
        <button
          type="button"
          onClick={onSelectToggle}
          className="self-start md:self-center inline-flex h-6 w-6 items-center justify-center rounded-md border border-border hover:border-primary"
          aria-label={selected ? "Unselect lead" : "Select lead"}
        >
          {selected ? <CheckSquare className="h-4 w-4 text-primary" /> : <SquareIcon className="h-4 w-4 text-muted-foreground" />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-medium text-foreground truncate">{lead.name || "(no name)"}</p>
            <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${LEAD_STATUS_STYLES[lead.status]}`}>
              {lead.status}
            </span>
            {lead.assignedEmail ? (
              <span className="inline-flex rounded-full border border-primary/40 text-primary px-2 py-0.5 text-[10px]">
                → {lead.assignedEmail}
              </span>
            ) : (
              <span className="inline-flex rounded-full border border-border text-muted-foreground px-2 py-0.5 text-[10px]">
                unassigned
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">
            <a href={`mailto:${lead.email}`} className="hover:text-foreground">{lead.email}</a>
            {lead.phone && <> · {lead.phone}</>}
            {lead.website && <> · {lead.website}</>}
            {lead.service && <> · {lead.service}</>}
            {lead.budget && <> · {lead.budget}</>}
            <> · {new Date(lead.createdAt).toLocaleDateString()}</>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <label className="sr-only" htmlFor={`assign-${lead.id}`}>Assign Lead</label>
          <select
            id={`assign-${lead.id}`}
            value={lead.assignedTo ?? ""}
            disabled={pending}
            onChange={(e) => onUpdate({ assignedTo: e.target.value ? e.target.value : null })}
            className="rounded-md border border-border bg-background px-2 py-1.5 text-xs max-w-[180px]"
            aria-label="Assign Lead"
            title="Assign Lead"
          >
            <option value="">Assign Lead…</option>
            {assignees.map((a) => (
              <option key={a.userId} value={a.userId}>{a.email}</option>
            ))}
          </select>
          <label className="sr-only" htmlFor={`status-${lead.id}`}>Status Update</label>
          <select
            id={`status-${lead.id}`}
            value={lead.status}
            disabled={pending}
            onChange={(e) => onUpdate({ status: e.target.value as LeadStatus })}
            className="rounded-md border border-border bg-background px-2 py-1.5 text-xs"
            aria-label="Status Update"
            title="Status Update"
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={onView}
            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary"
          >
            <Eye className="h-3 w-3" /> View Lead
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary"
          >
            <Pencil className="h-3 w-3" /> Edit Lead
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center gap-1 rounded-md border border-destructive/40 text-destructive px-3 py-1.5 text-xs hover:bg-destructive/10"
          >
            <Trash2 className="h-3 w-3" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function MetaRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-md border border-border bg-card px-2 py-1.5">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-0.5 break-all text-foreground ${mono ? "font-mono text-[11px]" : "text-xs"}`}>
        {value || "—"}
      </p>
    </div>
  );
}

function LeadDrawer({
  lead,
  assignees,
  startInEdit,
  onClose,
  onUpdate,
  onDelete,
  pending,
}: {
  lead: LeadRow | null;
  assignees: AssigneeOption[];
  startInEdit: boolean;
  onClose: () => void;
  onUpdate: (patch: { status?: LeadStatus; adminNotes?: string; assignedTo?: string | null; name?: string; email?: string; phone?: string; website?: string; company?: string; message?: string }) => void;
  onDelete: () => void;
  pending: boolean;
}) {
  const open = !!lead;
  const auditFn = useServerFn(listLeadAudit);
  const auditQuery = useQuery({
    queryKey: ["lead-audit", lead?.id, lead?.updatedAt],
    queryFn: () => auditFn({ data: { leadId: lead!.id } }),
    enabled: open,
  });

  const [editMode, setEditMode] = useState(false);
  const [notes, setNotes] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", website: "", company: "", message: "" });

  useEffect(() => {
    if (!lead) return;
    setEditMode(startInEdit);
    setNotes(lead.adminNotes);
    setForm({
      name: lead.name, email: lead.email, phone: lead.phone,
      website: lead.website, company: lead.company, message: lead.message,
    });
  }, [lead?.id, lead?.updatedAt, startInEdit]);

  return (
    <Sheet open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <SheetContent side="right" className="w-full sm:max-w-xl overflow-y-auto">
        {lead && (
          <>
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2 flex-wrap">
                <span>{lead.name || "(no name)"}</span>
                <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-wider ${LEAD_STATUS_STYLES[lead.status]}`}>
                  {lead.status}
                </span>
              </SheetTitle>
              <SheetDescription>
                <a href={`mailto:${lead.email}`} className="hover:text-foreground">{lead.email}</a>
                {" · "}{new Date(lead.createdAt).toLocaleString()}
              </SheetDescription>
            </SheetHeader>

            <div className="mt-4 flex flex-wrap gap-2">
              <select
                value={lead.assignedTo ?? ""}
                disabled={pending}
                onChange={(e) => onUpdate({ assignedTo: e.target.value ? e.target.value : null })}
                className="rounded-md border border-border bg-background px-2 py-1.5 text-xs"
                aria-label="Assign Lead"
              >
                <option value="">Unassigned</option>
                {assignees.map((a) => <option key={a.userId} value={a.userId}>{a.email}</option>)}
              </select>
              <select
                value={lead.status}
                disabled={pending}
                onChange={(e) => onUpdate({ status: e.target.value as LeadStatus })}
                className="rounded-md border border-border bg-background px-2 py-1.5 text-xs"
                aria-label="Status Update"
              >
                {LEAD_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button
                type="button"
                onClick={() => setEditMode((v) => !v)}
                className="inline-flex items-center gap-1 rounded-md border border-border px-3 py-1.5 text-xs hover:border-primary"
              >
                <Pencil className="h-3 w-3" /> {editMode ? "Cancel edit" : "Edit Lead"}
              </button>
              <button
                type="button"
                onClick={onDelete}
                className="inline-flex items-center gap-1 rounded-md border border-destructive/40 text-destructive px-3 py-1.5 text-xs hover:bg-destructive/10"
              >
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            </div>

            <div className="mt-5 grid sm:grid-cols-2 gap-2 text-xs">
              <MetaRow label="Phone" value={lead.phone} />
              <MetaRow label="Website" value={lead.website} />
              <MetaRow label="Company" value={lead.company} />
              <MetaRow label="Service" value={lead.service} />
              <MetaRow label="Budget" value={lead.budget} />
              <MetaRow label="Assigned to" value={lead.assignedEmail || "Unassigned"} />
            </div>

            <div className="mt-3 grid sm:grid-cols-2 gap-2 text-xs">
              <MetaRow label="IP address" value={lead.ipAddress} />
              <MetaRow label="User agent" value={lead.userAgent} mono />
              <MetaRow label="Page URL" value={lead.pageUrl} mono />
              <MetaRow label="Referrer" value={lead.referrer} mono />
              <MetaRow label="UTM source" value={lead.utmSource} />
              <MetaRow label="UTM medium" value={lead.utmMedium} />
              <MetaRow label="UTM campaign" value={lead.utmCampaign} />
            </div>

            <div className="mt-4">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Message</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">{lead.message || "(empty)"}</p>
            </div>

            {editMode && (
              <div className="mt-4 rounded-md border border-border bg-card/50 p-3 space-y-2">
                <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Edit submission</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {(["name","email","phone","website","company"] as const).map((f) => (
                    <input
                      key={f}
                      value={(form as any)[f]}
                      onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                      placeholder={f}
                      className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                    />
                  ))}
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Message"
                    className="sm:col-span-2 rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => { onUpdate(form); setEditMode(false); }}
                    className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-accent disabled:opacity-50"
                  >
                    <Save className="h-3 w-3" /> Save changes
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Admin notes</p>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Internal notes…"
                className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  disabled={pending || notes === lead.adminNotes}
                  onClick={() => onUpdate({ adminNotes: notes })}
                  className="inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-accent disabled:opacity-50"
                >
                  <Save className="h-3 w-3" /> Save notes
                </button>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <History className="h-3 w-3" /> Activity & history
              </p>
              <div className="mt-2 rounded-md border border-border bg-card divide-y divide-border">
                {auditQuery.isLoading && (
                  <p className="px-3 py-2 text-xs text-muted-foreground">Loading…</p>
                )}
                {!auditQuery.isLoading && (auditQuery.data?.length ?? 0) === 0 && (
                  <p className="px-3 py-2 text-xs text-muted-foreground">No changes yet.</p>
                )}
                {(auditQuery.data ?? []).map((e: LeadAuditEntry) => (
                  <div key={e.id} className="px-3 py-2 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-foreground">{e.action.replace(/_/g, " ")}</span>
                      <span className="text-muted-foreground tabular-nums">
                        {new Date(e.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-muted-foreground">
                      by {e.actorEmail || "(unknown)"}
                      {e.field && (
                        <>
                          {" · "}
                          <span className="text-foreground">{e.oldValue || "—"}</span>
                          {" → "}
                          <span className="text-foreground">{e.newValue || "—"}</span>
                        </>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-4 text-[11px] text-muted-foreground">
              Created {new Date(lead.createdAt).toLocaleString()} · Updated {new Date(lead.updatedAt).toLocaleString()}
            </p>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
