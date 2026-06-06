import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { uploadSiteImage } from "@/lib/site-images.functions";

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  hint?: string;
};

export function ImageUploadField({ label, value, onChange, folder = "", hint }: Props) {
  const upload = useServerFn(uploadSiteImage);
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    const safeName = f.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 100);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setBusy(true);
        const dataUrl = reader.result as string;
        const dataBase64 = dataUrl.split(",")[1] ?? "";
        const res = await upload({
          data: {
            filename: safeName,
            contentType: f.type || "application/octet-stream",
            dataBase64,
            folder,
          },
        });
        onChange(res.url);
        toast.success("Image uploaded");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setBusy(false);
        if (fileRef.current) fileRef.current.value = "";
      }
    };
    reader.readAsDataURL(f);
  }

  return (
    <div className="block">
      <span className="block text-xs font-medium text-muted-foreground mb-1">{label}</span>
      <div className="rounded-md border border-border bg-background p-3 space-y-3">
        {value ? (
          <div className="relative">
            <img
              src={value}
              alt=""
              className="max-h-48 w-full rounded object-contain bg-muted"
            />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute top-1 right-1 h-7 w-7 rounded-full bg-background/90 border border-border grid place-items-center hover:bg-destructive hover:text-destructive-foreground"
              aria-label="Remove image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="grid place-items-center h-32 rounded bg-muted/40 border border-dashed border-border text-muted-foreground">
            <ImageIcon className="h-6 w-6" />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,image/avif"
            onChange={onPick}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            <Upload className="h-3.5 w-3.5" />
            {busy ? "Uploading…" : value ? "Replace image" : "Upload image"}
          </button>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="or paste an image URL"
            className="flex-1 min-w-[160px] rounded-md border border-border bg-background px-2 py-1.5 text-xs"
          />
        </div>
        {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}