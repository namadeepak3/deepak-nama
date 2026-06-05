import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Public server fn: returns whether an email is allowed to sign in.
// An email is allowed when an auth user with that address exists AND has at
// least one role row in user_roles. Used as a pre-check before sending an
// OTP / accepting a password so unknown emails can't trigger emails or
// account creation.
export const checkEmailAllowed = createServerFn({ method: "POST" })
  .inputValidator((input: { email: string }) =>
    z.object({ email: z.string().trim().email().max(255) }).parse(input),
  )
  .handler(async ({ data }): Promise<{ allowed: boolean }> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const target = data.email.toLowerCase();
    // Page through users (200 per page is the API max) to find a match.
    for (let page = 1; page <= 5; page++) {
      const { data: list, error } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage: 200,
      });
      if (error) return { allowed: false };
      const user = list.users.find((u) => (u.email ?? "").toLowerCase() === target);
      if (user) {
        const { count } = await supabaseAdmin
          .from("user_roles")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);
        return { allowed: (count ?? 0) > 0 };
      }
      if (list.users.length < 200) break;
    }
    return { allowed: false };
  });