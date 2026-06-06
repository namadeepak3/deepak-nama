import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Upload a single image (base64 data URL) into the `site-images` bucket.
// Returns the public-facing URL served via /api/public/site-images/<key>.
const uploadInput = z.object({
  filename: z.string().min(1).max(200).regex(/^[a-zA-Z0-9._-]+$/, "Invalid filename"),
  contentType: z.string().min(3).max(100),
  dataBase64: z.string().min(10).max(8_000_000), // ~6MB raw image after b64
  folder: z.string().max(60).regex(/^[a-z0-9-]*$/).default(""),
});

async function assertEditor(userId: string) {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (error) throw new Error(error.message);
  const roles = (data ?? []).map((r) => r.role as string);
  if (!roles.includes("admin") && !roles.includes("editor")) {
    throw new Error("Forbidden: admin or editor required");
  }
}

export const uploadSiteImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: z.infer<typeof uploadInput>) => uploadInput.parse(d))
  .handler(async ({ data, context }) => {
    await assertEditor(context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const buf = Buffer.from(data.dataBase64, "base64");
    const key = `${data.folder ? `${data.folder}/` : ""}${Date.now()}-${data.filename}`;
    const { error } = await supabaseAdmin.storage
      .from("site-images")
      .upload(key, buf, { contentType: data.contentType, upsert: false });
    if (error) throw new Error(error.message);
    return { url: `/api/public/site-images/${key}`, key };
  });