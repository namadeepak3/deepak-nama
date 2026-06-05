import { useRef } from "react";
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  Image as ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  rows?: number;
};

export function MarkdownEditor({
  value,
  onChange,
  label = "Content (Markdown)",
  placeholder = "Write in Markdown…",
  rows = 18,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  function withSelection(cb: (start: number, end: number, current: string) => string) {
    const el = textareaRef.current;
    if (!el) {
      onChange(cb(0, 0, value));
      return;
    }
    const start = el.selectionStart ?? 0;
    const end = el.selectionEnd ?? 0;
    onChange(cb(start, end, value));
    requestAnimationFrame(() => {
      el.focus();
    });
  }

  function wrap(before: string, after = before, fallback = "text") {
    withSelection((start, end, current) => {
      const selected = current.slice(start, end) || fallback;
      return current.slice(0, start) + before + selected + after + current.slice(end);
    });
  }

  function prefixLines(prefix: string) {
    withSelection((start, end, current) => {
      const selected = current.slice(start, end);
      const block = selected || "";
      const next = block
        .split("\n")
        .map((line) => (line.length ? `${prefix}${line}` : prefix.trimEnd()))
        .join("\n");
      return current.slice(0, start) + next + current.slice(end);
    });
  }

  async function insertImage() {
    const finalUrl = window.prompt("Image URL", "https://");
    if (!finalUrl) return;

    if (finalUrl.startsWith("blob:")) {
      const file = await fetch(finalUrl).then((r) => r.blob());
      const path = `blog/${Date.now()}-${Math.random().toString(36).slice(2)}.png`;
      const { error } = await supabase.storage.from("blog-images").upload(path, file, {
        contentType: file.type || "image/png",
        upsert: false,
      });
      if (error) {
        toast.error(error.message);
        return;
      }
      const { data: pub } = supabase.storage.from("blog-images").getPublicUrl(path);
      const alt = window.prompt("Alt text", "") ?? "";
      onChange(`${value}\n\n![${alt}](${pub.publicUrl})\n\n`);
      toast.success("Image inserted");
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
    "inline-flex items-center justify-center h-7 w-7 rounded border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors";

  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-muted-foreground">{label}</span>
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
          <button
            type="button"
            onClick={() => onChange(value + "\n\n---\n\n")}
            className="ml-1 px-2 text-[10px] text-muted-foreground hover:text-foreground"
            title="Horizontal rule"
          >
            HR
          </button>
          <span className="ml-auto text-[10px] tabular-nums text-muted-foreground">
            {value.length.toLocaleString()} chars · ~{Math.max(1, Math.round(value.split(/\s+/).filter(Boolean).length / 200))} min read
          </span>
        </div>
        <textarea
          ref={textareaRef}
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-3 py-2 text-sm font-mono focus:outline-none"
          placeholder={placeholder}
        />
      </div>
    </label>
  );
}