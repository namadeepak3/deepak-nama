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
  checkIsAdmin,
  type ServiceInput,
} from "@/lib/services.functions";
import { ICON_OPTIONS, iconFor, type Service } from "@/lib/services.shared";
import { supabase } from "@/integrations/supabase/client";
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
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Service Catalog" },
      { name: "robots", content: "noindex" },
    ],
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
  const check = useServerFn(checkIsAdmin);
  const save = useServerFn(upsertService);
  const del = useServerFn(deleteService);
  const reorder = useServerFn(reorderServices);

  const adminCheck = useQuery({ queryKey: ["isAdmin"], queryFn: () => check() });
  const services = useQuery({ queryKey: ["services"], queryFn: () => list(), enabled: !!adminCheck.data?.isAdmin });

  const [editing, setEditing] = useState<ServiceInput | null>(null);

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

  if (adminCheck.isLoading) {
    return <p className="px-6 py-20 text-center text-muted-foreground">Checking permissions…</p>;
  }

  if (!adminCheck.data?.isAdmin) {
    return (
      <section className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="text-2xl font-display font-semibold">Access denied</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account doesn't have admin permissions. The first user to sign up becomes the admin.
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
          <h1 className="mt-2 text-3xl font-display font-semibold">Service catalog</h1>
          <p className="mt-1 text-sm text-muted-foreground">Create, edit, reorder and delete services. Changes go live instantly.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setEditing(emptyService(services.data?.length ?? 0))}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-accent"
          >
            <Plus className="h-4 w-4" /> New service
          </button>
          <button onClick={handleSignOut} className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>

      <div className="mt-10 space-y-3">
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

      {editing && (
        <ServiceEditor
          initial={editing}
          onCancel={() => setEditing(null)}
          onSubmit={(v) => saveMutation.mutate(v)}
          saving={saveMutation.isPending}
        />
      )}
    </section>
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