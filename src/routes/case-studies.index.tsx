import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Quote } from "lucide-react";
import { listCaseStudies } from "@/lib/case-studies.functions";

export const Route = createFileRoute("/case-studies/")({
  head: () => ({
    meta: [
      { title: "Case Studies — vrseoguru AI Marketing Wins" },
      { name: "description", content: "Real AI-powered marketing case studies — SEO, paid media, GEO and lifecycle results from D2C, SaaS, fintech and real estate brands." },
      { property: "og:title", content: "Case Studies — vrseoguru" },
      { property: "og:description", content: "AI marketing case studies with revenue, ROAS and pipeline outcomes." },
      { property: "og:url", content: "/case-studies" },
    ],
    links: [{ rel: "canonical", href: "/case-studies" }],
  }),
  component: CaseStudiesIndex,
  errorComponent: () => <div className="p-12 text-center text-muted-foreground">Couldn't load case studies. Please refresh.</div>,
  notFoundComponent: () => <div className="p-12 text-center text-muted-foreground">Page not found.</div>,
});

function CaseStudiesIndex() {
  const fetchCases = useServerFn(listCaseStudies);
  const { data: cases = [], isLoading } = useQuery({ queryKey: ["case-studies"], queryFn: () => fetchCases() });

  return (
    <>
      <section className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold">Case studies</p>
          <h1 className="mt-3 text-4xl md:text-6xl font-display leading-[1.02]">
            Brands we&apos;ve <span className="text-gradient-gold">scaled.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Real outcomes from real engagements. Every number is verifiable — no vanity metrics.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading case studies…</p>
        ) : cases.length === 0 ? (
          <p className="text-center text-muted-foreground">No case studies published yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cases.map((c) => (
              <Link
                key={c.slug}
                to="/case-studies/$slug"
                params={{ slug: c.slug }}
                className="group flex flex-col rounded-3xl border border-border bg-card p-6 hover:border-foreground transition"
              >
                {c.coverImage && (
                  <div className="-mx-6 -mt-6 mb-5 aspect-[16/9] overflow-hidden rounded-t-3xl bg-muted">
                    <img
                      src={c.coverImage}
                      alt={c.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="rounded-full bg-secondary border border-border px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">{c.tag}</span>
                  <div className="flex gap-1.5">
                    {c.channels.slice(0, 3).map((ch) => (
                      <span key={ch} className="rounded-md bg-secondary border border-border px-2 py-0.5 text-[10px] text-muted-foreground">{ch}</span>
                    ))}
                  </div>
                </div>
                <h2 className="mt-4 text-lg md:text-xl font-display leading-snug">{c.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-3">{c.summary}</p>
                <div className="mt-5 grid grid-cols-3 gap-2">
                  {c.heroStats.slice(0, 3).map((s) => (
                    <div key={s.v} className="rounded-xl border border-border bg-background/40 p-2.5 text-center">
                      <div className="text-base font-display text-gradient-gold leading-none">{s.k}</div>
                      <div className="mt-1 text-[9px] uppercase tracking-widest text-muted-foreground">{s.v}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-foreground">
                  Read case study <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-14">
        <div className="rounded-3xl border border-border bg-card p-10 text-center">
          <Quote className="mx-auto h-8 w-8 text-foreground" />
          <h2 className="mt-4 text-2xl md:text-3xl font-display">Want to be the next case study?</h2>
          <p className="mt-3 max-w-xl mx-auto text-sm text-muted-foreground">Book a free 30-min growth audit — we&apos;ll show you the biggest revenue opportunities in your funnel.</p>
          <Link to="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-semibold hover:opacity-90 transition">
            Book my free audit <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}