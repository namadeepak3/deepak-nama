import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check, ArrowLeft, Sparkles } from "lucide-react";
import { serviceBySlug, services, type Service } from "@/lib/service-catalog";

export const Route = createFileRoute("/services/$slug")({
  head: ({ params }) => {
    const svc = params?.slug ? serviceBySlug(params.slug) : undefined;
    const title = svc ? `${svc.title} — vrseoguru` : "Service — vrseoguru";
    const description = svc?.shortDesc ?? "AI-powered digital marketing services.";
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
  loader: ({ params }) => {
    const svc = serviceBySlug(params.slug);
    if (!svc) throw notFound();
    return { svc };
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
  const { svc } = Route.useLoaderData() as { svc: Service };
  const Icon = svc.icon;
  const related = services.filter((s) => s.slug !== svc.slug).slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="bg-noir-grid border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <Link to="/services" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> All services
          </Link>
          <div className="mt-8 flex items-start gap-5">
            <div className="h-14 w-14 shrink-0 rounded-2xl bg-primary/10 border border-primary/30 grid place-items-center">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-primary">{svc.tag}</p>
              <h1 className="mt-2 text-4xl md:text-6xl font-display font-semibold leading-tight">
                {svc.title}
              </h1>
            </div>
          </div>
          <p className="mt-8 max-w-3xl text-lg md:text-xl text-muted-foreground">{svc.shortDesc}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-gold hover:bg-accent transition-colors">
              Get a proposal <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#pricing" className="inline-flex items-center gap-2 rounded-md border border-border bg-card/60 px-6 py-3 text-sm font-medium text-foreground hover:border-primary transition-colors">
              See pricing
            </a>
          </div>
        </div>
      </section>

      {/* Intro + AI angle */}
      <section className="mx-auto max-w-7xl px-6 py-20 grid md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-3xl font-display font-semibold">What this looks like</h2>
          <p className="text-muted-foreground leading-relaxed">{svc.intro}</p>
        </div>
        <aside className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
          <div className="flex items-center gap-2 text-primary">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs uppercase tracking-widest">AI advantage</span>
          </div>
          <p className="mt-4 text-sm text-foreground/90 leading-relaxed">{svc.aiAngle}</p>
        </aside>
      </section>

      {/* Deliverables */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <h2 className="text-3xl font-display font-semibold">What you get</h2>
        <ul className="mt-8 grid md:grid-cols-2 gap-4">
          {svc.deliverables.map((d) => (
            <li key={d} className="flex gap-3 rounded-xl border border-border bg-card p-5">
              <Check className="h-5 w-5 shrink-0 text-primary mt-0.5" />
              <span className="text-sm text-foreground/90">{d}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Process */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <h2 className="text-3xl font-display font-semibold">How we work</h2>
        <div className="mt-8 grid md:grid-cols-4 gap-5">
          {svc.process.map((p, i) => (
            <div key={p.step} className="rounded-2xl border border-border bg-card p-6">
              <div className="text-xs text-primary uppercase tracking-widest">Step {String(i + 1).padStart(2, "0")}</div>
              <h3 className="mt-2 text-xl font-display font-semibold">{p.step}</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{p.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-7xl px-6 pb-20">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm text-primary uppercase tracking-widest">Pricing</p>
          <h2 className="mt-3 text-4xl font-display font-semibold">Simple, outcome-driven retainers</h2>
          <p className="mt-3 text-muted-foreground">No hidden fees, no long contracts. Cancel anytime after the first 90 days.</p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {svc.tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-2xl border p-8 flex flex-col ${
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
                className={`mt-8 inline-flex items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-medium transition-colors ${
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
      <section className="mx-auto max-w-4xl px-6 pb-20">
        <h2 className="text-3xl font-display font-semibold text-center">Frequently asked questions</h2>
        <div className="mt-10 space-y-3">
          {svc.faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-border bg-card p-6 open:border-primary/50 transition-colors">
              <summary className="cursor-pointer list-none flex items-center justify-between text-foreground font-medium">
                <span>{f.q}</span>
                <span className="ml-4 h-6 w-6 rounded-full border border-border grid place-items-center text-muted-foreground group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Related */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <h2 className="text-2xl font-display font-semibold">Related services</h2>
        <div className="mt-6 grid md:grid-cols-3 gap-5">
          {related.map((r) => {
            const RIcon = r.icon;
            return (
              <Link
                key={r.slug}
                to="/services/$slug"
                params={{ slug: r.slug }}
                className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/60 transition-colors"
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
        <div className="rounded-3xl border border-border bg-noir-grid p-10 md:p-16 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-semibold">
            Ready to scale <span className="text-gradient-gold">{svc.tag.toLowerCase()}</span>?
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Book a free 30-minute call. I'll audit your current setup and outline a path to compounding results.
          </p>
          <Link to="/contact" className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-gold hover:bg-accent transition-colors">
            Book a strategy call <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}