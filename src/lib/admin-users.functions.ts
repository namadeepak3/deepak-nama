import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const APP_ROLES = ["admin", "editor", "user"] as const;
export type AppRole = (typeof APP_ROLES)[number];

export type AdminUserRow = {
  id: string;
  email: string;
  createdAt: string;
  lastSignInAt: string | null;
  emailConfirmedAt: string | null;
  roles: AppRole[];
};

export type RoleAuditEntry = {
  id: string;
  actorEmail: string;
  targetEmail: string;
  role: AppRole;
  action: "assigned" | "removed";
  createdAt: string;
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

async function getEmailFor(userId: string): Promise<string> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data } = await supabaseAdmin.auth.admin.getUserById(userId);
  return data.user?.email ?? "";
}

export const listUsersWithRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminUserRow[]> => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 200,
    });
    if (usersError) throw new Error(usersError.message);
    const { data: roleRows, error: rolesError } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, role");
    if (rolesError) throw new Error(rolesError.message);
    const roleMap = new Map<string, AppRole[]>();
    (roleRows ?? []).forEach((r) => {
      const arr = roleMap.get(r.user_id) ?? [];
      arr.push(r.role as AppRole);
      roleMap.set(r.user_id, arr);
    });
    return usersData.users
      .map((u) => ({
        id: u.id,
        email: u.email ?? "(no email)",
        createdAt: u.created_at,
        lastSignInAt: u.last_sign_in_at ?? null,
        emailConfirmedAt: u.email_confirmed_at ?? null,
        roles: roleMap.get(u.id) ?? [],
      }))
      .sort((a, b) => a.email.localeCompare(b.email));
  });

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string; role: AppRole }) =>
    z.object({ userId: z.string().uuid(), role: z.enum(APP_ROLES) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: data.userId, role: data.role }, { onConflict: "user_id,role" });
    if (error) throw new Error(error.message);
    const [actorEmail, targetEmail] = await Promise.all([
      getActorEmail(context.userId),
      getEmailFor(data.userId),
    ]);
    await supabaseAdmin.from("role_audit_log").insert({
      actor_user_id: context.userId,
      actor_email: actorEmail,
      target_user_id: data.userId,
      target_email: targetEmail,
      role: data.role,
      action: "assigned",
    });
    return { ok: true };
  });

export const removeUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string; role: AppRole }) =>
    z.object({ userId: z.string().uuid(), role: z.enum(APP_ROLES) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.role === "admin") {
      const { count, error: countErr } = await supabaseAdmin
        .from("user_roles")
        .select("*", { count: "exact", head: true })
        .eq("role", "admin");
      if (countErr) throw new Error(countErr.message);
      if ((count ?? 0) <= 1) {
        throw new Error("Cannot remove the last admin — assign admin to another user first.");
      }
    }
    const { error } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", data.userId)
      .eq("role", data.role);
    if (error) throw new Error(error.message);
    const [actorEmail, targetEmail] = await Promise.all([
      getActorEmail(context.userId),
      getEmailFor(data.userId),
    ]);
    await supabaseAdmin.from("role_audit_log").insert({
      actor_user_id: context.userId,
      actor_email: actorEmail,
      target_user_id: data.userId,
      target_email: targetEmail,
      role: data.role,
      action: "removed",
    });
    return { ok: true };
  });

export const listRoleAuditLog = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input?: {
    action?: "all" | "assigned" | "removed";
    role?: "all" | AppRole;
    search?: string;
    from?: string;
    to?: string;
    limit?: number;
  }) =>
    z
      .object({
        action: z.enum(["all", "assigned", "removed"]).optional(),
        role: z.enum(["all", ...APP_ROLES] as [string, ...string[]]).optional(),
        search: z.string().max(200).optional(),
        from: z.string().optional(),
        to: z.string().optional(),
        limit: z.number().int().min(1).max(1000).optional(),
      })
      .parse(input ?? {}),
  )
  .handler(async ({ data, context }): Promise<RoleAuditEntry[]> => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let q = supabaseAdmin
      .from("role_audit_log")
      .select("id, actor_email, target_email, role, action, created_at")
      .order("created_at", { ascending: false })
      .limit(data.limit ?? 200);
    if (data.action && data.action !== "all") q = q.eq("action", data.action);
    if (data.role && data.role !== "all") q = q.eq("role", data.role as AppRole);
    if (data.from) q = q.gte("created_at", data.from);
    if (data.to) q = q.lte("created_at", data.to);
    if (data.search) {
      const s = `%${data.search}%`;
      q = q.or(`actor_email.ilike.${s},target_email.ilike.${s}`);
    }
    const { data: rows, error } = await q;
    if (error) throw new Error(error.message);
    return (rows ?? []).map((r) => ({
      id: r.id as string,
      actorEmail: (r.actor_email as string) || "(unknown)",
      targetEmail: (r.target_email as string) || "(unknown)",
      role: r.role as AppRole,
      action: r.action as "assigned" | "removed",
      createdAt: r.created_at as string,
    }));
  });

export const resendVerificationEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userId: string }) =>
    z.object({ userId: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: u, error: getErr } = await supabaseAdmin.auth.admin.getUserById(data.userId);
    if (getErr) throw new Error(getErr.message);
    const email = u.user?.email;
    if (!email) throw new Error("User has no email on file");
    // Use magiclink for both confirmed and unconfirmed — clicking it confirms
    // the email and signs the user in, which is the desired "resend verification" UX.
    const { error } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email,
    });
    if (error) throw new Error(error.message);
    return { ok: true, email };
  });