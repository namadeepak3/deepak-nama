import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, ShieldCheck, Zap, LineChart } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listServices } from "@/lib/services.functions";
import { iconFor } from "@/lib/services.shared";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "vrseoguru — AI-Powered Digital Marketing Freelancer" },
      { name: "description", content: "SEO, PPC, performance marketing and SMO — engineered with AI to turn traffic into revenue." },
      { property: "og:title", content: "vrseoguru — AI-Powered Digital Marketing" },
      { property: "og:description", content: "SEO, PPC, performance marketing and SMO — engineered with AI." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});


function Home() {
  const fetchServices = useServerFn(listServices);
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: () => fetchServices() });
  return (
    <>
      <section className="relative overflow-hidden bg-aurora">
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 bg-noir-grid opacity-40" aria-hidden />
        {/* Soft glow accent */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-primary/10 blur-[120px] pointer-events-none" aria-hidden />

        <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-32 md:pt-36 md:pb-44">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 backdrop-blur px-3 py-1 text-xs text-foreground/80">
            <Sparkles className="h-3 w-3 text-primary" />
            AI-native freelance studio · open for projects
          </div>
          <h1 className="mt-6 max-w-4xl text-5xl md:text-7xl font-display font-semibold leading-[1.02] tracking-tight">
            Digital marketing,<br />
            <span className="text-gradient-gold">engineered with AI.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
            I&apos;m <span className="text-foreground font-medium">vrseoguru</span> — a freelance growth partner blending SEO, PPC,
            performance marketing and SMO with AI workflows that compound revenue.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/contact" className="group inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-gold hover:bg-accent transition-all">
              Book a free strategy call
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link to="/services" className="inline-flex items-center gap-2 rounded-md border border-border bg-card/50 backdrop-blur px-6 py-3 text-sm font-medium text-foreground hover:border-primary transition-colors">
              Explore services
            </Link>
          </div>


          {/* Trust strip */}
          <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Transparent reporting</div>
            <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Ship in days, not months</div>
            <div className="flex items-center gap-2"><LineChart className="h-4 w-4 text-primary" /> Profit-first metrics</div>
          </div>

          <dl className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl">
            {[["7+ yrs", "Marketing craft"],["120+", "Campaigns shipped"],["4.2x", "Avg. ROAS lift"],["24h", "Reply window"]].map(([k, v]) => (
              <div key={v}>
                <dt className="text-3xl font-display text-gradient-gold">{k}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <div>
            <p className="text-sm text-primary uppercase tracking-widest">What I do</p>
            <h2 className="mt-3 text-4xl md:text-5xl font-display font-semibold max-w-2xl">A full-stack growth engine for ambitious brands.</h2>
          </div>
          <Link to="/services" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1">
            All services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {services.map((s) => {
            const Icon = iconFor(s.icon);
            return (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group bg-card p-8 hover:bg-secondary transition-colors block"
              >
                <div className="h-11 w-11 rounded-lg bg-primary/10 border border-primary/30 grid place-items-center mb-5">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.shortDesc}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-12 md:p-16 bg-noir-grid">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-display font-semibold">Ready to outgrow your competitors?</h2>
            <p className="mt-4 text-muted-foreground text-lg">
              Tell me about your goals. I&apos;ll send back a 30-day AI growth blueprint within 48 hours — free.
            </p>
            <Link to="/contact" className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-gold hover:bg-accent transition-colors">
              Start the conversation <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
