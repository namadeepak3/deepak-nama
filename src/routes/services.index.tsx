import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listServices } from "@/lib/services.functions";
import { iconFor } from "@/lib/services.shared";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Services — vrseoguru" },
      { name: "description", content: "AI-driven SEO, PPC, performance marketing, SMO, automation and CRO services for ambitious brands." },
      { property: "og:title", content: "Services — vrseoguru" },
      { property: "og:description", content: "Full-stack freelance digital marketing services powered by AI." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const fetchServices = useServerFn(listServices);
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: () => fetchServices() });
  return (
    <>
      <section className="bg-noir-grid border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <Breadcrumbs items={[{ label: "Services" }]} />
          <p className="mt-6 text-sm text-primary uppercase tracking-widest">Services</p>
          <h1 className="mt-4 text-5xl md:text-6xl font-display font-semibold max-w-3xl">
            Every lever of growth, <span className="text-gradient-gold">handled by one operator.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            From the first keyword to the last conversion — a unified system, not eight disconnected agencies.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((s) => {
            const Icon = iconFor(s.icon);
            return (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="btn-fx group rounded-2xl border border-border bg-card p-8 hover:border-primary/60 transition-colors block"
              >
                <div className="flex items-start justify-between">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/30 grid place-items-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">{s.tag}</span>
                </div>
                <h2 className="mt-6 text-2xl font-display font-semibold">{s.title}</h2>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{s.shortDesc}</p>
                <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                  {s.deliverables.slice(0, 3).map((p) => (
                    <li key={p} className="flex gap-2">
                      <span className="text-primary mt-1">—</span>
                      <span className="line-clamp-1">{p}</span>
                    </li>
                  ))}
                </ul>
                <span className="mt-6 inline-flex items-center gap-1 text-sm text-primary group-hover:gap-2 transition-all">
                  Explore service <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-20 rounded-2xl border border-border bg-card p-10 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-semibold">Not sure where to start?</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Share your business goals and I&apos;ll recommend the highest-leverage services for your stage.</p>
          <Link to="/contact" className="btn-fx mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-gold hover:bg-accent transition-colors">
            Get a custom plan <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}