import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const LEAD_STATUSES = ["new", "contacted", "qualified", "won", "lost", "spam"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export type LeadRow = {
  id: string;
  name: string;
  email: string;
  service: string;
  budget: string;
  message: string;
  status: LeadStatus;
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
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

export const createLead = createServerFn({ method: "POST" })
  .inputValidator((input: {
    name: string;
    email: string;
    service: string;
    budget: string;
    message: string;
  }) =>
    z
      .object({
        name: z.string().trim().min(2).max(100),
        email: z.string().trim().email().max(255),
        service: z.string().min(1).max(100),
        budget: z.string().min(1).max(100),
        message: z.string().trim().min(10).max(2000),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("leads").insert(data);
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
      .select("id, name, email, service, budget, message, status, admin_notes, created_at, updated_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw new Error(error.message);
    return (data ?? []).map((r) => ({
      id: r.id as string,
      name: (r.name as string) ?? "",
      email: (r.email as string) ?? "",
      service: (r.service as string) ?? "",
      budget: (r.budget as string) ?? "",
      message: (r.message as string) ?? "",
      status: ((r.status as string) || "new") as LeadStatus,
      adminNotes: (r.admin_notes as string) ?? "",
      createdAt: r.created_at as string,
      updatedAt: (r.updated_at as string) ?? (r.created_at as string),
    }));
  });

export const updateLead = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; status?: LeadStatus; adminNotes?: string }) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum(LEAD_STATUSES).optional(),
        adminNotes: z.string().max(2000).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const patch: { status?: string; admin_notes?: string } = {};
    if (data.status !== undefined) patch.status = data.status;
    if (data.adminNotes !== undefined) patch.admin_notes = data.adminNotes;
    if (Object.keys(patch).length === 0) return { ok: true };
    const { error } = await (supabaseAdmin.from("leads") as any).update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
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