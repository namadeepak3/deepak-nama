import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — vrseoguru" },
      { name: "description", content: "vrseoguru is an AI-native freelance digital marketer helping brands compound growth across every channel." },
      { property: "og:title", content: "About — vrseoguru" },
      { property: "og:description", content: "Meet vrseoguru — freelance digital marketing operator." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const principles = [
  "Strategy first — channels second.",
  "AI is leverage, not a replacement for taste.",
  "Reporting that a CEO can read in 60 seconds.",
  "Ship weekly, learn faster than the market.",
];

function AboutPage() {
  return (
    <>
      <section className="bg-noir-grid border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
          <Breadcrumbs items={[{ label: "About" }]} />
          <p className="mt-6 text-sm text-primary uppercase tracking-widest">About</p>
          <h1 className="mt-4 text-5xl md:text-6xl font-display font-semibold leading-[1.05]">
            A freelance operator obsessed with <span className="text-gradient-gold">compounding growth</span>.
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20 grid md:grid-cols-5 gap-12">
        <div className="md:col-span-3 space-y-6 text-muted-foreground text-lg leading-relaxed">
          <p>
            Hi, I&apos;m <span className="text-foreground font-medium">vrseoguru</span>. For the last several years I&apos;ve helped
            startups and DTC brands build marketing engines that don&apos;t collapse the moment ad budgets shrink.
          </p>
          <p>
            My edge is combining classic marketing fundamentals — SEO, PPC, social — with modern AI workflows that
            do the boring 80% so I can spend the 20% on strategy, creative and growth bets.
          </p>
          <p>
            I work as a one-person studio. You get a senior operator, not an account manager passing your project to a junior team.
          </p>
        </div>
        <aside className="md:col-span-2 rounded-2xl border border-border bg-card p-8">
          <h2 className="text-sm uppercase tracking-widest text-primary">Operating principles</h2>
          <ul className="mt-5 space-y-3">
            {principles.map((p) => (
              <li key={p} className="flex gap-3 text-sm">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </aside>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="rounded-2xl border border-border bg-card p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-semibold">Let&apos;s build something that compounds.</h2>
            <p className="text-muted-foreground mt-2">Currently accepting 2 new retainer clients this quarter.</p>
          </div>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-gold hover:bg-accent transition-colors">
            Get in touch <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}