import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { ChevronDown } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { listPublishedFaqs, type FaqItem } from "@/lib/cms.functions";

const faqsQuery = queryOptions({
  queryKey: ["faqs", "published"],
  queryFn: () => listPublishedFaqs(),
});

export const Route = createFileRoute("/faqs")({
  loader: ({ context }) => context.queryClient.ensureQueryData(faqsQuery),
  head: () => ({
    meta: [
      { title: "FAQs — vrseoguru" },
      { name: "description", content: "Frequently asked questions about vrseoguru's AI-powered digital marketing services." },
    ],
  }),
  errorComponent: ({ error }) => <div className="p-10 text-center text-muted-foreground">{error.message}</div>,
  notFoundComponent: () => <div className="p-10 text-center">No FAQs yet.</div>,
  component: FaqsPage,
});

function FaqsPage() {
  const { data: faqs } = useSuspenseQuery(faqsQuery);
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);

  const grouped = useMemo(() => {
    const map = new Map<string, FaqItem[]>();
    for (const f of faqs) {
      const key = f.category || "General";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(f);
    }
    return [...map.entries()];
  }, [faqs]);

  return (
    <section className="mx-auto max-w-3xl px-5 sm:px-6 py-10 sm:py-16">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-display tracking-tight leading-tight">Frequently asked questions</h1>
      <p className="mt-3 text-sm sm:text-base text-muted-foreground">Quick answers to what most people ask before getting started.</p>
      {grouped.length === 0 && (
        <p className="mt-10 text-muted-foreground">FAQs are being updated. Check back soon.</p>
      )}
      {grouped.map(([cat, items]) => (
        <div key={cat} className="mt-8 sm:mt-10">
          {grouped.length > 1 && (
            <h2 className="mb-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">{cat}</h2>
          )}
          <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
            {items.map((f) => {
              const isOpen = open === f.id;
              return (
                <li key={f.id}>
                  <button
                    onClick={() => setOpen(isOpen ? null : f.id)}
                    className="w-full flex items-start gap-4 px-5 sm:px-6 py-5 text-left transition-colors hover:bg-secondary/50"
                    aria-expanded={isOpen}
                  >
                    <span className="flex-1 text-base sm:text-lg font-medium text-foreground leading-snug">{f.question}</span>
                    <ChevronDown className={`h-5 w-5 shrink-0 mt-1 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 -mt-1 text-sm sm:text-base leading-7 text-muted-foreground prose prose-sm sm:prose-base max-w-none prose-p:my-2 prose-a:text-primary">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{f.answer}</ReactMarkdown>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </section>
  );
}