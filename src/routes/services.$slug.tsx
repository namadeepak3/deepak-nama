import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, ArrowLeft, Sparkles, TrendingUp, Quote } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { listServices, getServiceBySlug } from "@/lib/services.functions";
import { iconFor, coreAreasFor, type Service } from "@/lib/services.shared";
import { listCaseStudies } from "@/lib/case-studies.functions";
import type { CaseStudy } from "@/lib/case-studies.shared";
import { recordView } from "@/lib/views.functions";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageFaqs } from "@/components/PageFaqs";

export const Route = createFileRoute("/services/$slug")({
  head: ({ params }) => {
    const title = "Service — vrseoguru";
    const description = "AI-powered digital marketing services.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: `/services/${params?.slug ?? ""}` },
      ],
      links: [{ rel: "canonical", href: `/services/${params?.slug ?? ""}` }],
    };
  },
  component: ServiceDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-32 text-center">
      <h1 className="text-4xl font-display font-semibold">Service not found</h1>
      <p className="mt-3 text-muted-foreground">The service you're looking for doesn't exist.</p>
      <Link to="/services" className="mt-6 inline-flex items-center gap-2 text-primary hover:text-accent">
        <ArrowLeft className="h-4 w-4" /> Back to all services
      </Link>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="mx-auto max-w-3xl px-6 py-32 text-center">
      <h1 className="text-2xl font-display font-semibold">Something went wrong</h1>
      <button onClick={reset} className="mt-6 rounded-md bg-primary px-4 py-2 text-primary-foreground">Try again</button>
    </div>
  ),
});

function ServiceDetail() {
  const { slug } = Route.useParams();
  const fetchOne = useServerFn(getServiceBySlug);
  const fetchAll = useServerFn(listServices);
  const fetchCases = useServerFn(listCaseStudies);
  const trackView = useServerFn(recordView);
  const { data: svc, isLoading } = useQuery({ queryKey: ["service", slug], queryFn: () => fetchOne({ data: { slug } }) });
  const { data: all = [] } = useQuery({ queryKey: ["services"], queryFn: () => fetchAll() });
  const { data: cases = [] } = useQuery({ queryKey: ["case-studies"], queryFn: () => fetchCases() });
  useEffect(() => {
    if (!svc?.id) return;
    trackView({ data: { target_type: "service", target_id: svc.id } }).catch(() => {});
  }, [svc?.id, trackView]);
  if (isLoading) return <p className="px-6 py-20 text-center text-muted-foreground">Loading…</p>;
  if (!svc) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="text-4xl font-display font-semibold">Service not found</h1>
        <Link to="/services" className="mt-6 inline-flex items-center gap-2 text-primary hover:text-accent">
          <ArrowLeft className="h-4 w-4" /> Back to all services
        </Link>
      </div>
    );
  }
  const Icon = iconFor(svc.icon);
  const related = all.filter((s: Service) => s.slug !== svc.slug).slice(0, 3);
  const coreAreas = coreAreasFor(svc.slug);
  const matchedCases = matchCaseStudies(svc, cases as CaseStudy[]).slice(0, 3);
  const sections: { id: string; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "deliverables", label: "What you get" },
    ...(coreAreas.length ? [{ id: "core", label: "Core areas" }] : []),
    { id: "process", label: "Process" },
    ...(matchedCases.length ? [{ id: "proof", label: "Proof" }] : []),
    { id: "pricing", label: "Pricing" },
    { id: "faq", label: "FAQ" },
  ];

  return (
    <>
      {/* Editorial Hero */}
      <section className="relative overflow-hidden bg-noir-grid border-b border-border">
        <div className="pointer-events-none absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-[420px] w-[420px] rounded-full bg-accent/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 pt-12 pb-20 md:pt-16 md:pb-28">
          <Breadcrumbs
            items={[
              { label: "Services", to: "/services" },
              { label: svc.title },
            ]}
          />
          <div className="mt-10 grid lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-3 rounded-full border border-primary/30 bg-primary/5 pl-2 pr-4 py-1.5">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/15">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                </span>
                <span className="text-[11px] uppercase tracking-[0.18em] text-primary font-medium">{svc.tag}</span>
              </div>
              <h1 className="mt-7 font-display font-semibold leading-[0.95] tracking-tight text-[clamp(2.5rem,6.5vw,5.5rem)]">
                {svc.title.split(" ").slice(0, -1).join(" ")}{" "}
                <span className="text-gradient-gold italic">{svc.title.split(" ").slice(-1)}.</span>
              </h1>
              <p className="mt-7 max-w-2xl text-lg md:text-xl text-muted-foreground leading-relaxed">
                {svc.shortDesc}
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Link to="/contact" className="btn-fx inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-gold hover:bg-accent transition-colors">
                  Get a proposal <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#pricing" className="btn-fx inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-7 py-3.5 text-sm font-medium text-foreground hover:border-primary transition-colors">
                  See pricing
                </a>
              </div>
            </div>
            <div className="lg:col-span-4 grid grid-cols-2 gap-3">
              <HeroStat k="Deliverables" v={String(svc.deliverables.length).padStart(2, "0")} />
              <HeroStat k="Process steps" v={String(svc.process.length).padStart(2, "0")} />
              <HeroStat k="Core areas" v={String(coreAreas.length || svc.tiers.length).padStart(2, "0")} />
              <HeroStat k="Proof points" v={String(matchedCases.length).padStart(2, "0")} />
            </div>
          </div>
        </div>
      </section>

      {/* Sticky in-page nav */}
      <nav className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="mx-auto max-w-7xl px-6">
          <ul className="flex gap-1 overflow-x-auto py-2 text-sm scrollbar-none">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="inline-flex items-center whitespace-nowrap rounded-full px-4 py-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Intro + AI angle */}
      <section id="overview" className="mx-auto max-w-7xl px-6 py-24 grid md:grid-cols-12 gap-10 scroll-mt-20">
        <div className="md:col-span-7 space-y-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-primary">01 — Overview</p>
          <h2 className="text-3xl md:text-5xl font-display font-semibold leading-tight">
            What <span className="italic text-gradient-gold">this</span> looks like in practice.
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">{svc.intro}</p>
        </div>
        <aside className="md:col-span-5 md:mt-2 rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-8 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full bg-primary/20 blur-2xl" />
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-4 w-4" />
            <span className="text-[11px] uppercase tracking-[0.18em]">The AI advantage</span>
          </div>
          <p className="mt-5 text-base text-foreground/90 leading-relaxed">{svc.aiAngle}</p>
        </aside>
      </section>

      {/* Deliverables */}
      <section id="deliverables" className="mx-auto max-w-7xl px-6 pb-24 scroll-mt-20">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.18em] text-primary">02 — What you get</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-display font-semibold leading-tight">
              A full-stack <span className="italic text-gradient-gold">delivery</span> kit.
            </h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">Every engagement ships these artifacts — built once, refined every sprint.</p>
        </div>
        <ul className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {svc.deliverables.map((d, i) => (
            <li
              key={d}
              className="group relative rounded-2xl border border-border bg-card p-6 hover:border-primary/60 transition-colors overflow-hidden"
            >
              <span className="absolute top-4 right-5 text-[11px] tabular-nums font-mono text-muted-foreground/60">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Check className="h-5 w-5 text-primary" />
              <p className="mt-4 text-sm text-foreground/90 leading-relaxed pr-6">{d}</p>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </li>
          ))}
        </ul>
      </section>

      {/* Core areas */}
      {coreAreas.length > 0 && (
        <section id="core" className="mx-auto max-w-7xl px-6 pb-24 scroll-mt-20">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.18em] text-primary">03 — Core areas</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-display font-semibold leading-tight">
              Everything under <span className="italic text-gradient-gold">{svc.tag.toLowerCase()}</span>.
            </h2>
            <p className="mt-3 text-muted-foreground">A unified discipline broken into the workstreams that actually move the needle.</p>
          </div>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {coreAreas.map((c) => {
              const CIcon = iconFor(c.icon);
              return (
                <div
                  key={c.title}
                  className="group flex flex-col rounded-2xl border border-border bg-card p-6 hover:border-primary/60 transition-colors"
                >
                  <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/30 grid place-items-center">
                    <CIcon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mt-5 text-lg font-display font-semibold">{c.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
                  <ul className="mt-5 space-y-2 text-sm">
                    {c.bullets.map((b) => (
                      <li key={b} className="flex gap-2">
                        <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                        <span className="text-foreground/85">{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6 pt-5 border-t border-border/60">
                    <p className="text-[11px] uppercase tracking-widest text-primary">Outcome</p>
                    <p className="mt-1 text-sm text-foreground/90">{c.outcome}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Process */}
      <section id="process" className="bg-noir-grid border-y border-border scroll-mt-20">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.18em] text-primary">04 — Process</p>
            <h2 className="mt-3 text-3xl md:text-5xl font-display font-semibold leading-tight">
              How we <span className="italic text-gradient-gold">work</span>.
            </h2>
          </div>
          <div className="mt-12 relative">
            <div className="hidden md:block absolute left-0 right-0 top-8 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            <div className="grid md:grid-cols-4 gap-5">
              {svc.process.map((p, i) => (
                <div key={p.step} className="relative rounded-2xl border border-border bg-card/80 backdrop-blur p-6">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-mono font-semibold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Step</span>
                  </div>
                  <h3 className="mt-5 text-xl font-display font-semibold">{p.step}</h3>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Proof — matched case studies */}
      {matchedCases.length > 0 && (
        <section id="proof" className="mx-auto max-w-7xl px-6 py-24 scroll-mt-20">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div className="max-w-2xl">
              <p className="text-[11px] uppercase tracking-[0.18em] text-primary">05 — Proof</p>
              <h2 className="mt-3 text-3xl md:text-5xl font-display font-semibold leading-tight">
                Real outcomes from <span className="italic text-gradient-gold">{svc.tag.toLowerCase()}</span> work.
              </h2>
            </div>
            <Link to="/case-studies" className="text-sm text-primary hover:text-accent inline-flex items-center gap-1">
              All case studies <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-12 grid lg:grid-cols-3 gap-6">
            {matchedCases.map((cs, idx) => (
              <Link
                key={cs.id}
                to="/case-studies/$slug"
                params={{ slug: cs.slug }}
                className={`group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card hover:border-primary/60 transition-colors ${idx === 0 ? "lg:col-span-2 lg:row-span-1" : ""}`}
              >
                {cs.coverImage && (
                  <div className={`relative overflow-hidden ${idx === 0 ? "aspect-[16/9]" : "aspect-[16/10]"}`}>
                    <img src={cs.coverImage} alt={cs.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/20 to-transparent" />
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-background/80 backdrop-blur border border-border px-3 py-1 text-[11px] uppercase tracking-widest text-foreground">
                      {cs.tag || cs.industry || "Case study"}
                    </div>
                  </div>
                )}
                <div className="flex-1 flex flex-col p-7">
                  <p className="text-xs text-muted-foreground">{cs.client}</p>
                  <h3 className={`mt-2 font-display font-semibold leading-tight ${idx === 0 ? "text-2xl md:text-3xl" : "text-xl"}`}>
                    {cs.title}
                  </h3>
                  {cs.summary && <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{cs.summary}</p>}
                  {cs.heroStats?.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 pt-5 border-t border-border/60">
                      {cs.heroStats.slice(0, idx === 0 ? 4 : 2).map((s) => (
                        <div key={s.k}>
                          <p className="text-xl md:text-2xl font-display font-semibold text-gradient-gold tabular-nums">{s.v}</p>
                          <p className="text-[11px] uppercase tracking-widest text-muted-foreground mt-0.5">{s.k}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  <span className="mt-6 inline-flex items-center gap-1 text-sm text-primary group-hover:gap-2 transition-all">
                    Read the story <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
          {matchedCases[0]?.testimonialQuote && (
            <figure className="mt-10 relative rounded-3xl border border-border bg-card/60 p-10 md:p-14">
              <Quote className="absolute top-6 left-6 h-8 w-8 text-primary/40" />
              <blockquote className="text-xl md:text-2xl font-display leading-snug text-foreground">
                "{matchedCases[0].testimonialQuote}"
              </blockquote>
              <figcaption className="mt-6 text-sm text-muted-foreground">
                <span className="text-foreground font-medium">{matchedCases[0].testimonialAuthor}</span>
                {matchedCases[0].testimonialRole && ` — ${matchedCases[0].testimonialRole}`}
              </figcaption>
            </figure>
          )}
        </section>
      )}

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 pb-24 scroll-mt-20">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.18em] text-primary">06 — Pricing</p>
          <h2 className="mt-3 text-3xl md:text-5xl font-display font-semibold leading-tight">
            Simple, <span className="italic text-gradient-gold">outcome-driven</span> retainers.
          </h2>
          <p className="mt-3 text-muted-foreground">No hidden fees, no long contracts. Cancel anytime after the first 90 days.</p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {svc.tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-3xl border p-8 flex flex-col ${
                t.highlighted
                  ? "border-primary bg-primary/5 shadow-gold"
                  : "border-border bg-card"
              }`}
            >
              {t.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                  Most popular
                </span>
              )}
              <h3 className="text-xl font-display font-semibold">{t.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.blurb}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-display font-semibold text-gradient-gold">{t.price}</span>
                <span className="text-sm text-muted-foreground">{t.cadence}</span>
              </div>
              <ul className="mt-6 space-y-3 text-sm flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex gap-2">
                    <Check className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                    <span className="text-foreground/85">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className={`btn-fx mt-8 inline-flex items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                  t.highlighted
                    ? "bg-primary text-primary-foreground hover:bg-accent"
                    : "border border-border bg-background hover:border-primary text-foreground"
                }`}
              >
                Start with {t.name} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* FAQs */}
      <div id="faq" className="scroll-mt-20">
        <PageFaqs items={svc.faqs} />
      </div>

      {/* Related */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <p className="text-[11px] uppercase tracking-[0.18em] text-primary">More from us</p>
        <h2 className="mt-3 text-2xl md:text-3xl font-display font-semibold">Related services</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-5">
          {related.map((r) => {
            const RIcon = iconFor(r.icon);
            return (
              <Link
                key={r.slug}
                to="/services/$slug"
                params={{ slug: r.slug }}
                className="btn-fx group rounded-2xl border border-border bg-card p-6 hover:border-primary/60 transition-colors"
              >
                <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/30 grid place-items-center">
                  <RIcon className="h-4 w-4 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-display font-semibold">{r.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{r.shortDesc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm text-primary group-hover:gap-2 transition-all">
                  Learn more <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-noir-grid p-10 md:p-20 text-center">
          <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-[600px] rounded-full bg-primary/15 blur-3xl" />
          <div className="relative">
          <div className="inline-flex items-center gap-2 text-primary text-[11px] uppercase tracking-[0.18em]">
            <TrendingUp className="h-3.5 w-3.5" /> Ready when you are
          </div>
          <h2 className="mt-5 text-3xl md:text-5xl font-display font-semibold leading-tight">
            Let's scale your <span className="italic text-gradient-gold">{svc.tag.toLowerCase()}</span>.
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Book a free 30-minute call. I'll audit your current setup and outline a path to compounding results.
          </p>
          <Link to="/contact" className="btn-fx mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-gold hover:bg-accent transition-colors">
            Book a strategy call <ArrowRight className="h-4 w-4" />
          </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function HeroStat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/70 backdrop-blur p-5">
      <p className="text-3xl md:text-4xl font-display font-semibold text-gradient-gold tabular-nums leading-none">{v}</p>
      <p className="mt-2 text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{k}</p>
    </div>
  );
}

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s&/-]/g, " ")
    .split(/[\s/&-]+/)
    .filter((t) => t.length > 2 && !["and", "the", "for", "ads", "with"].includes(t));
}

function matchCaseStudies(svc: Service, cases: CaseStudy[]): CaseStudy[] {
  const needles = new Set<string>([
    ...tokenize(svc.tag || ""),
    ...tokenize(svc.title || ""),
    ...tokenize(svc.slug.replace(/-/g, " ")),
  ]);
  if (needles.size === 0) return cases.slice(0, 3);
  const scored = cases.map((c) => {
    const hay = [
      c.tag,
      c.industry,
      c.title,
      ...(c.channels || []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    let score = 0;
    needles.forEach((n) => {
      if (hay.includes(n)) score += 1;
    });
    if (c.featured) score += 0.5;
    return { c, score };
  });
  const matched = scored.filter((s) => s.score > 0).sort((a, b) => b.score - a.score).map((s) => s.c);
  // Fallback: if nothing matched, show featured/most recent
  return matched.length > 0 ? matched : cases.slice(0, 3);
}