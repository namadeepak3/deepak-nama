import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, TrendingUp, Search, Megaphone, BarChart3, Share2, Bot } from "lucide-react";
import heroImage from "@/assets/hero-noir.jpg";

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

const services = [
  { icon: Search, title: "SEO", desc: "AI-driven keyword strategy, technical audits and content systems that rank and compound." },
  { icon: BarChart3, title: "Performance Marketing", desc: "ROAS-obsessed campaigns across Meta, Google and programmatic with creative testing at scale." },
  { icon: Share2, title: "Social Media (SMO)", desc: "Brand-first social systems — content engines, community and growth loops." },
  { icon: Megaphone, title: "PPC", desc: "Search, Shopping and YouTube ads tuned weekly with bid scripts and AI copy." },
  { icon: Bot, title: "AI Automation", desc: "Custom GPTs, workflows and dashboards that automate your reporting and outreach." },
  { icon: TrendingUp, title: "CRO & Analytics", desc: "Funnels, A/B tests and GA4 setups that turn clicks into measurable revenue." },
];

function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-noir-grid">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            maskImage: "linear-gradient(to bottom, black 30%, transparent 100%)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-32 md:pt-36 md:pb-44">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" />
            AI-native freelance studio · open for projects
          </div>
          <h1 className="mt-6 max-w-4xl text-5xl md:text-7xl font-display font-semibold leading-[1.02]">
            Digital marketing,<br />
            <span className="text-gradient-gold">engineered with AI.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground">
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

          <dl className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl">
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
          {services.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group bg-card p-8 hover:bg-secondary transition-colors">
              <div className="h-11 w-11 rounded-lg bg-primary/10 border border-primary/30 grid place-items-center mb-5">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
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
