import { createFileRoute } from "@tanstack/react-router";

// Public file proxy for the private `site-images` bucket.
// URL shape: /api/public/site-images/<key>
// Uses the admin client (service role) to fetch the object and stream it back
// with a long cache header. Only files under the `site-images` bucket are served.
export const Route = createFileRoute("/api/public/site-images/$")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const key = (params as { _splat?: string })._splat ?? "";
        if (!key || key.includes("..")) {
          return new Response("Not found", { status: 404 });
        }
        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const { data, error } = await supabaseAdmin.storage.from("site-images").download(key);
          if (error || !data) return new Response("Not found", { status: 404 });
          const buf = await data.arrayBuffer();
          const type = (data as Blob).type || guessMime(key);
          return new Response(buf, {
            status: 200,
            headers: {
              "Content-Type": type,
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          });
        } catch {
          return new Response("Error", { status: 500 });
        }
      },
    },
  },
});

function guessMime(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "png") return "image/png";
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  if (ext === "svg") return "image/svg+xml";
  if (ext === "avif") return "image/avif";
  return "application/octet-stream";
}