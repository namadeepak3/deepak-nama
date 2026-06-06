import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Quote, Star, Target, Sparkles, TrendingUp } from "lucide-react";
import { getCaseStudyBySlug } from "@/lib/case-studies.functions";

export const Route = createFileRoute("/case-studies/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — Case Study | vrseoguru` },
      { name: "description", content: "AI-powered marketing case study from vrseoguru." },
      { property: "og:title", content: `${params.slug} — Case Study` },
      { property: "og:url", content: `/case-studies/${params.slug}` },
    ],
    links: [{ rel: "canonical", href: `/case-studies/${params.slug}` }],
  }),
  component: CaseStudyDetail,
  errorComponent: ({ reset }) => {
    const router = useRouter();
    return (
      <div className="p-12 text-center">
        <p className="text-muted-foreground">Couldn&apos;t load this case study.</p>
        <button onClick={() => { reset(); router.invalidate(); }} className="mt-4 underline text-sm">Retry</button>
      </div>
    );
  },
  notFoundComponent: () => (
    <div className="p-12 text-center">
      <h1 className="text-2xl font-display">Case study not found</h1>
      <Link to="/case-studies" className="mt-4 inline-block underline text-sm">View all case studies</Link>
    </div>
  ),
});

function CaseStudyDetail() {
  const { slug } = Route.useParams();
  const fetchCase = useServerFn(getCaseStudyBySlug);
  const { data: c, isLoading } = useQuery({
    queryKey: ["case-study", slug],
    queryFn: () => fetchCase({ data: { slug } }),
  });

  if (isLoading) return <div className="p-12 text-center text-muted-foreground">Loading…</div>;
  if (!c) throw notFound();

  return (
    <>
      <section className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-5xl px-6 py-14">
          <Link to="/case-studies" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            ← All case studies
          </Link>
          {c.coverImage && (
            <div className="mt-6 aspect-[16/7] overflow-hidden rounded-3xl border border-border bg-muted">
              <img src={c.coverImage} alt={c.title} className="h-full w-full object-cover" />
            </div>
          )}
          <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
            <span className="rounded-full bg-secondary border border-border px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">{c.tag}</span>
            <div className="flex gap-1.5">
              {c.channels.map((ch) => (
                <span key={ch} className="rounded-md bg-secondary border border-border px-2.5 py-0.5 text-[10px] text-muted-foreground">{ch}</span>
              ))}
            </div>
          </div>
          <h1 className="mt-5 text-4xl md:text-5xl font-display leading-[1.05]">{c.title}</h1>
          <p className="mt-5 max-w-2xl text-base text-muted-foreground leading-relaxed">{c.summary}</p>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {c.heroStats.map((s) => (
              <div key={s.v} className="rounded-2xl border border-border bg-card p-4">
                <div className="text-2xl md:text-3xl font-display text-gradient-gold leading-none">{s.k}</div>
                <div className="mt-2 text-[10px] uppercase tracking-widest text-muted-foreground">{s.v}</div>
              </div>
            ))}
            {c.duration && (
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="text-2xl md:text-3xl font-display text-foreground leading-none">{c.duration}</div>
                <div className="mt-2 text-[10px] uppercase tracking-widest text-muted-foreground">Engagement</div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14 grid lg:grid-cols-3 gap-8">
        {c.challenge && (
          <div className="rounded-3xl border border-border bg-card p-7">
            <Target className="h-6 w-6 text-foreground" />
            <h2 className="mt-4 text-xl font-display">The challenge</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{c.challenge}</p>
          </div>
        )}
        {c.approach && (
          <div className="rounded-3xl border border-border bg-card p-7">
            <Sparkles className="h-6 w-6 text-foreground" />
            <h2 className="mt-4 text-xl font-display">Our approach</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{c.approach}</p>
          </div>
        )}
        {c.results && (
          <div className="rounded-3xl border border-border bg-card p-7">
            <TrendingUp className="h-6 w-6 text-foreground" />
            <h2 className="mt-4 text-xl font-display">The results</h2>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{c.results}</p>
          </div>
        )}
      </section>

      {c.content && (
        <section className="mx-auto max-w-3xl px-6 pb-14">
          <article className="prose prose-neutral max-w-none whitespace-pre-line text-foreground leading-relaxed">
            {c.content}
          </article>
        </section>
      )}

      {c.testimonialQuote && (
        <section className="mx-auto max-w-4xl px-6 pb-14">
          <div className="rounded-3xl border border-border bg-card p-10">
            <Quote className="h-7 w-7 text-foreground" />
            <p className="mt-4 text-xl md:text-2xl font-display leading-snug">&ldquo;{c.testimonialQuote}&rdquo;</p>
            <div className="mt-5 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-foreground text-foreground" />
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <div className="font-semibold text-sm">{c.testimonialAuthor}</div>
              <div className="text-xs text-muted-foreground">{c.testimonialRole}</div>
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-4xl px-6 pb-20">
        <div className="rounded-3xl border border-border bg-card p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-display">Ready for results like these?</h2>
          <p className="mt-3 max-w-xl mx-auto text-sm text-muted-foreground">Book a free 30-min audit — no obligation, no pitch slides.</p>
          <Link to="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-semibold hover:opacity-90 transition">
            Get my free audit <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}