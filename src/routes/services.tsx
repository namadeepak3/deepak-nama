import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Search, BarChart3, Share2, Megaphone, Bot, TrendingUp, Mail, Code2 } from "lucide-react";

export const Route = createFileRoute("/services")({
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

const services = [
  {
    icon: Search,
    title: "Search Engine Optimization",
    tag: "SEO",
    points: ["Technical audits & Core Web Vitals", "Topical authority maps with AI", "Programmatic & local SEO", "Link strategy that compounds"],
  },
  {
    icon: BarChart3,
    title: "Performance Marketing",
    tag: "Paid social & programmatic",
    points: ["Meta, TikTok & LinkedIn ads", "Creative testing frameworks", "Pixel & server-side tracking", "ROAS-driven scaling playbooks"],
  },
  {
    icon: Megaphone,
    title: "Pay-Per-Click",
    tag: "PPC",
    points: ["Google Search, Shopping, YouTube", "AI ad copy & RSA optimization", "Bid scripts & automation", "Conversion-tracking hygiene"],
  },
  {
    icon: Share2,
    title: "Social Media Optimization",
    tag: "SMO",
    points: ["Brand systems & content engines", "Short-form video strategy", "Community building & DMs", "Influencer collaborations"],
  },
  {
    icon: Bot,
    title: "AI Automation",
    tag: "Workflows & GPTs",
    points: ["Custom GPTs for your stack", "n8n / Zapier automations", "AI content production lines", "Outreach & lead scoring"],
  },
  {
    icon: TrendingUp,
    title: "CRO & Analytics",
    tag: "Optimization",
    points: ["GA4 + Looker dashboards", "Funnel & heatmap audits", "A/B testing roadmaps", "Attribution modeling"],
  },
  {
    icon: Mail,
    title: "Email & Lifecycle",
    tag: "Retention",
    points: ["Klaviyo / Mailchimp setup", "Automated journeys", "AI personalisation", "Win-back & loyalty"],
  },
  {
    icon: Code2,
    title: "Web & Landing Pages",
    tag: "Build",
    points: ["Conversion-first landing pages", "Headless / Webflow / Next.js", "Speed & SEO baked in", "Continuous experimentation"],
  },
];

function ServicesPage() {
  return (
    <>
      <section className="bg-noir-grid border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <p className="text-sm text-primary uppercase tracking-widest">Services</p>
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
          {services.map(({ icon: Icon, title, tag, points }) => (
            <article key={title} className="group rounded-2xl border border-border bg-card p-8 hover:border-primary/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/30 grid place-items-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xs uppercase tracking-widest text-muted-foreground">{tag}</span>
              </div>
              <h2 className="mt-6 text-2xl font-display font-semibold">{title}</h2>
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                {points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="text-primary mt-1">—</span>{p}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-20 rounded-2xl border border-border bg-card p-10 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-semibold">Not sure where to start?</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Share your business goals and I&apos;ll recommend the highest-leverage services for your stage.</p>
          <Link to="/contact" className="mt-6 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-gold hover:bg-accent transition-colors">
            Get a custom plan <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}