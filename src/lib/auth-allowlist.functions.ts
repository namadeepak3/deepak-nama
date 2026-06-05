import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Public server fn used as a pre-check by the sign-in form.
//
// SECURITY: This endpoint MUST NOT leak whether a given email belongs to an
// admin/editor. Previously it returned { allowed: true/false } based on
// user_roles membership, which allowed unauthenticated visitors to enumerate
// admin email addresses. It now always returns { allowed: true } so the
// response is uniform, and the actual authorization happens server-side after
// sign-in via the role checks in every admin server function (assertAdmin)
// and the _authenticated route guard. Supabase Auth itself rejects unknown
// emails for password sign-in; for OTP, sign-up is disabled in Auth settings.
export const checkEmailAllowed = createServerFn({ method: "POST" })
  .inputValidator((input: { email: string }) =>
    z.object({ email: z.string().trim().email().max(255) }).parse(input),
  )
  .handler(async (): Promise<{ allowed: boolean }> => {
    return { allowed: true };
  });