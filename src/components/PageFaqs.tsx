export type FaqItem = { q: string; a: string };

export function PageFaqs({
  items,
  title = "Frequently asked questions",
  className = "",
}: {
  items: FaqItem[];
  title?: string;
  className?: string;
}) {
  const cleaned = items.filter((f) => f.q?.trim() && f.a?.trim());
  if (cleaned.length === 0) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: cleaned.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section className={`mx-auto max-w-4xl px-6 pb-20 ${className}`}>
      <h2 className="text-3xl font-display font-semibold text-center">{title}</h2>
      <div className="mt-10 space-y-3">
        {cleaned.map((f) => (
          <details
            key={f.q}
            className="group rounded-2xl border border-border bg-card p-6 open:border-primary/50 transition-colors"
          >
            <summary className="cursor-pointer list-none flex items-center justify-between text-foreground font-medium">
              <span>{f.q}</span>
              <span className="ml-4 h-6 w-6 rounded-full border border-border grid place-items-center text-muted-foreground group-open:rotate-45 transition-transform">
                +
              </span>
            </summary>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {f.a}
            </p>
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}