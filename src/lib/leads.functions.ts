import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { getRequestHeader, getRequestIP } from "@tanstack/react-start/server";

export const LEAD_STATUSES = ["new", "contacted", "qualified", "won", "lost", "spam"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_KINDS = ["audit", "inquiry"] as const;
export type LeadKind = (typeof LEAD_KINDS)[number];

export type LeadRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  company: string;
  service: string;
  budget: string;
  message: string;
  status: LeadStatus;
  kind: LeadKind;
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
  ipAddress: string;
  userAgent: string;
  referrer: string;
  pageUrl: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  assignedTo: string | null;
  assignedEmail: string;
};

export type LeadAuditEntry = {
  id: string;
  leadId: string;
  actorEmail: string;
  action: string;
  field: string;
  oldValue: string;
  newValue: string;
  createdAt: string;
};

export type AssigneeOption = {
  userId: string;
  email: string;
};

async function assertAdmin(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error("Forbidden: admin role required");
}

async function getActorEmail(userId: string): Promise<string> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.auth.admin.getUserById(userId);
  return data.user?.email ?? "";
}

export const createLead = createServerFn({ method: "POST" })
  .inputValidator((input: {
    name: string;
    email: string;
    phone?: string;
    website?: string;
    company?: string;
    service: string;
    budget: string;
    message: string;
    kind?: LeadKind;
    pageUrl?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  }) =>
    z
      .object({
        name: z.string().trim().min(2).max(100),
        email: z.string().trim().email().max(255),
        phone: z.string().trim().max(40).optional(),
        website: z.string().trim().max(255).optional(),
        company: z.string().trim().max(150).optional(),
        service: z.string().max(100).optional().default(""),
        budget: z.string().max(100).optional().default(""),
        message: z.string().trim().min(10).max(2000),
        kind: z.enum(LEAD_KINDS).optional(),
        pageUrl: z.string().max(500).optional(),
        referrer: z.string().max(500).optional(),
        utmSource: z.string().max(120).optional(),
        utmMedium: z.string().max(120).optional(),
        utmCampaign: z.string().max(120).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let ip = "";
    let ua = "";
    try {
      ip = getRequestIP({ xForwardedFor: true }) ?? "";
      ua = getRequestHeader("user-agent") ?? "";
    } catch { /* not in request scope */ }
    const { error } = await supabaseAdmin.from("leads").insert({
      name: data.name,
      email: data.email,
      phone: data.phone ?? "",
      website: data.website ?? "",
      company: data.company ?? "",
      service: data.service ?? "",
      budget: data.budget ?? "",
      message: data.message,
      kind: data.kind ?? "inquiry",
      page_url: data.pageUrl ?? "",
      referrer: data.referrer ?? "",
      utm_source: data.utmSource ?? "",
      utm_medium: data.utmMedium ?? "",
      utm_campaign: data.utmCampaign ?? "",
      ip_address: ip,
      user_agent: ua,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listLeads = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<LeadRow[]> => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("leads")
      .select(
        "id, name, email, phone, website, company, service, budget, message, status, kind, admin_notes, created_at, updated_at, ip_address, user_agent, referrer, page_url, utm_source, utm_medium, utm_campaign, assigned_to, assigned_email",
      )
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => ({
      id: r.id as string,
      name: (r.name as string) ?? "",
      email: (r.email as string) ?? "",
      phone: ((r as any).phone as string) ?? "",
      website: ((r as any).website as string) ?? "",
      company: ((r as any).company as string) ?? "",
      service: (r.service as string) ?? "",
      budget: (r.budget as string) ?? "",
      message: (r.message as string) ?? "",
      status: ((r.status as string) || "new") as LeadStatus,
      kind: (((r as any).kind as string) || "inquiry") as LeadKind,
      adminNotes: (r.admin_notes as string) ?? "",
      createdAt: r.created_at as string,
      updatedAt: (r.updated_at as string) ?? (r.created_at as string),
      ipAddress: ((r as any).ip_address as string) ?? "",
      userAgent: ((r as any).user_agent as string) ?? "",
      referrer: ((r as any).referrer as string) ?? "",
      pageUrl: ((r as any).page_url as string) ?? "",
      utmSource: ((r as any).utm_source as string) ?? "",
      utmMedium: ((r as any).utm_medium as string) ?? "",
      utmCampaign: ((r as any).utm_campaign as string) ?? "",
      assignedTo: ((r as any).assigned_to as string | null) ?? null,
      assignedEmail: ((r as any).assigned_email as string) ?? "",
    }));
  });

export const updateLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; status?: LeadStatus; adminNotes?: string; assignedTo?: string | null; name?: string; email?: string; phone?: string; website?: string; company?: string; message?: string }) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(LEAD_STATUSES).optional(),
        adminNotes: z.string().max(2000).optional(),
        assignedTo: z.string().uuid().nullable().optional(),
        name: z.string().trim().max(100).optional(),
        email: z.string().trim().email().max(255).optional(),
        phone: z.string().trim().max(40).optional(),
        website: z.string().trim().max(255).optional(),
        company: z.string().trim().max(150).optional(),
        message: z.string().trim().max(2000).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Load current row to diff for audit
    const { data: current, error: getErr } = await supabaseAdmin
      .from("leads")
      .select("status, admin_notes, assigned_to, assigned_email, name, email, phone, website, company, message")
      .eq("id", data.id)
      .maybeSingle();
    if (getErr) throw new Error(getErr.message);
    if (!current) throw new Error("Inquiry not found");

    const patch: Record<string, unknown> = {};
    const audits: Array<{ action: string; field: string; old_value: string; new_value: string }> = [];

    if (data.status !== undefined && data.status !== current.status) {
      patch.status = data.status;
      audits.push({ action: "status_changed", field: "status", old_value: String(current.status ?? ""), new_value: data.status });
    }
    if (data.adminNotes !== undefined && data.adminNotes !== (current.admin_notes ?? "")) {
      patch.admin_notes = data.adminNotes;
      audits.push({ action: "notes_edited", field: "admin_notes", old_value: String(current.admin_notes ?? ""), new_value: data.adminNotes });
    }
    const editable = ["name", "email", "phone", "website", "company", "message"] as const;
    for (const f of editable) {
      const next = (data as any)[f];
      if (next !== undefined && next !== ((current as any)[f] ?? "")) {
        patch[f] = next;
        audits.push({ action: "field_edited", field: f, old_value: String((current as any)[f] ?? ""), new_value: String(next) });
      }
    }
    if (data.assignedTo !== undefined && (data.assignedTo ?? null) !== ((current as any).assigned_to ?? null)) {
      let assignedEmail = "";
      if (data.assignedTo) {
        const { data: u } = await supabaseAdmin.auth.admin.getUserById(data.assignedTo);
        assignedEmail = u.user?.email ?? "";
      }
      patch.assigned_to = data.assignedTo;
      patch.assigned_email = assignedEmail;
      audits.push({
        action: data.assignedTo ? "assigned" : "unassigned",
        field: "assigned_to",
        old_value: String((current as any).assigned_email ?? ""),
        new_value: assignedEmail,
      });
    }
    if (Object.keys(patch).length === 0) return { ok: true };
    const { error } = await (supabaseAdmin.from("leads") as any).update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    if (audits.length > 0) {
      const actorEmail = await getActorEmail(context.userId);
      await supabaseAdmin.from("lead_audit_log").insert(
        audits.map((a) => ({
          lead_id: data.id,
          actor_user_id: context.userId,
          actor_email: actorEmail,
          ...a,
        })),
      );
    }
    return { ok: true };
  });

export const deleteLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string }) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("leads").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listLeadAudit = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { leadId: string }) =>
    z.object({ leadId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }): Promise<LeadAuditEntry[]> => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("lead_audit_log")
      .select("id, lead_id, actor_email, action, field, old_value, new_value, created_at")
      .eq("lead_id", data.leadId)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return (rows ?? []).map((r: any) => ({
      id: r.id,
      leadId: r.lead_id,
      actorEmail: r.actor_email ?? "",
      action: r.action ?? "",
      field: r.field ?? "",
      oldValue: r.old_value ?? "",
      newValue: r.new_value ?? "",
      createdAt: r.created_at,
    }));
  });

export const listAssignees = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AssigneeOption[]> => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin
      .from("user_roles")
      .select("user_id")
      .eq("role", "admin");
    if (error) throw new Error(error.message);
    const ids = Array.from(new Set((rows ?? []).map((r) => r.user_id as string)));
    const { data: usersData } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const emailMap = new Map<string, string>();
    usersData.users.forEach((u) => emailMap.set(u.id, u.email ?? ""));
    return ids
      .map((id) => ({ userId: id, email: emailMap.get(id) ?? "" }))
      .sort((a, b) => a.email.localeCompare(b.email));
  });