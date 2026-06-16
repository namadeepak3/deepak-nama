import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  MapPin,
  Star,
  Phone,
  Search,
  TrendingUp,
  CheckCircle2,
  Send,
  Building2,
  Quote,
  ArrowRight,
  Sparkles,
  Target,
  MessageSquare,
  Camera,
  Wrench,
  Stethoscope,
  Scissors,
  Home,
  UtensilsCrossed,
  Dumbbell,
  Scale,
  ShieldCheck,
  Clock,
  Award,
  ChevronDown,
} from "lucide-react";
import { createLead } from "@/lib/leads.functions";
import gmbDashboard from "@/assets/local-seo-gmb-dashboard.jpg";
import mapPack from "@/assets/local-seo-map-pack.jpg";

export const Route = createFileRoute("/local-seo")({
  head: () => ({
    meta: [
      { title: "Local SEO Services — Rank in Google Map Pack | vrseoguru" },
      {
        name: "description",
        content:
          "Local SEO that puts your business in the Google Map 3-pack. GMB optimisation, local citations, review growth and hyper-local landing pages for service businesses.",
      },
      { property: "og:title", content: "Local SEO Services — Rank in Google Map Pack" },
      {
        property: "og:description",
        content:
          "Dominate your city on Google. GMB, citations, reviews & local landing pages built to convert nearby customers.",
      },
      { property: "og:url", content: "/local-seo" },
    ],
    links: [{ rel: "canonical", href: "/local-seo" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Local SEO Services",
          serviceType: "Local Search Engine Optimization",
          provider: { "@type": "Organization", name: "vrseoguru" },
          areaServed: "Worldwide",
          description:
            "GMB optimisation, citations, reviews, geo landing pages and local link building for service businesses.",
        }),
      },
    ],
  }),
  component: LocalSeoPage,
});

function LocalSeoPage() {
  const [sending, setSending] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const submitLead = useServerFn(createLead);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = ((fd.get("name") as string) || "").trim();
    const email = ((fd.get("email") as string) || "").trim();
    const phone = ((fd.get("phone") as string) || "").trim();
    const business = ((fd.get("business") as string) || "").trim();
    const city = ((fd.get("city") as string) || "").trim();
    const website = ((fd.get("website") as string) || "").trim();
    const goal = ((fd.get("goal") as string) || "").trim();
    const message = `Local SEO inquiry
Business: ${business}
City / service area: ${city}
Primary goal: ${goal}
Website / GMB: ${website || "—"}`;
    setSending(true);
    try {
      const params =
        typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      await submitLead({
        data: {
          name,
          email,
          phone,
          company: business,
          website,
          service: "Local SEO",
          budget: "",
          message,
          kind: "inquiry",
          pageUrl: typeof window !== "undefined" ? window.location.href : "",
          referrer: typeof document !== "undefined" ? document.referrer : "",
          utmSource: params?.get("utm_source") ?? "",
          utmMedium: params?.get("utm_medium") ?? "",
          utmCampaign: params?.get("utm_campaign") ?? "landing_local_seo",
        },
      });
      form.reset();
      toast.success("Got it — I'll send your free local SEO audit within 24 hours.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit. Try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster />

      {/* HERO */}
      <section id="audit" className="relative overflow-hidden bg-aurora border-b border-border">
        <div className="absolute inset-0 -z-10 opacity-50 pointer-events-none">
          <div className="absolute -top-32 -left-20 h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute top-40 -right-20 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-5 sm:px-6 py-16 md:py-24 lg:py-28 grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] text-primary font-semibold">
              <MapPin className="h-3.5 w-3.5" /> Local SEO that ranks you in the map pack
            </span>
            <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-display leading-[1.08] tracking-tight">
              Own the <span className="text-gradient-gold italic">"near&nbsp;me"</span> searches in your city.
            </h1>
            <p className="mt-5 max-w-xl text-muted-foreground text-base sm:text-lg leading-relaxed">
              We get service businesses into Google&apos;s top 3-pack — so nearby customers call you before they ever scroll past your competitors.
            </p>
            <ul className="mt-7 space-y-3 text-sm">
              {[
                "Free GMB & map-pack audit in 24 hours",
                "1-page action plan tailored to your city",
                "No spam, no sales script — just useful data",
              ].map((x) => (
                <li key={x} className="flex gap-3 items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
              <HeroStat k="+312%" v="map views" />
              <HeroStat k="3.1x" v="GMB calls" />
              <HeroStat k="Top 3" v="map pack" />
            </div>
          </div>

          <div className="lg:col-span-6 w-full">
            <form
              onSubmit={onSubmit}
              className="rounded-3xl border border-border bg-card p-6 sm:p-8 md:p-10 space-y-5 shadow-gold"
            >
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-primary font-semibold">
                <Sparkles className="h-3.5 w-3.5" /> Free local SEO audit
              </div>
              <h2 className="text-xl sm:text-2xl font-display leading-tight">
                Get your free local SEO audit
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Your name" name="name" placeholder="Jane Doe" required />
                <FormField label="Phone / WhatsApp" name="phone" placeholder="+91 98xxxxxxxx" required />
              </div>
              <FormField label="Email" name="email" type="email" placeholder="you@business.com" required />
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Business name" name="business" placeholder="Smile Studio Dental" required />
                <FormField label="City / area you serve" name="city" placeholder="Pune, Kothrud" required />
              </div>
              <FormField label="Website or Google Maps URL" name="website" placeholder="https://" />
              <div>
                <label className="block text-sm font-medium mb-2">Your #1 local SEO goal</label>
                <select
                  name="goal"
                  className="w-full rounded-xl bg-input/40 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                >
                  <option>Rank in Google Map 3-pack</option>
                  <option>More phone calls from Google</option>
                  <option>Fix & optimise my GMB profile</option>
                  <option>Get more 5-star reviews</option>
                  <option>Beat a specific competitor</option>
                  <option>Multi-location local SEO</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full inline-flex justify-center items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 text-sm font-semibold shadow-gold btn-fx disabled:opacity-60"
              >
                {sending ? "Sending..." : <>Send me my free audit <Send className="h-4 w-4" /></>}
              </button>
              <p className="text-xs text-muted-foreground text-center">
                No spam. Audit delivered to your inbox within 24 hours.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-b border-border bg-primary/[0.03]">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 py-8 md:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: ShieldCheck, label: "Google Partner mindset" },
              { icon: Award, label: "100+ local brands scaled" },
              { icon: Clock, label: "30-day visible results" },
              { icon: CheckCircle2, label: "No long contracts" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 grid place-items-center shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="mx-auto max-w-7xl px-5 sm:px-6 py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold">Built for local service businesses</p>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-display leading-tight">
            If customers find you on Google, this is for you.
          </h2>
        </div>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {businessTypes.map((b) => (
            <div key={b.label} className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-300">
              <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/20 grid place-items-center group-hover:bg-primary/15 transition-colors">
                <b.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-4 text-sm font-semibold text-foreground">{b.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* IMPROVEMENTS */}
      <section id="improvements" className="bg-card/40 border-y border-border">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 py-20 md:py-28">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold">Local SEO improvements</p>
              <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-display leading-tight text-foreground">
                Everything we fix to get you in the <span className="text-gradient-gold">3-pack.</span>
              </h2>
              <p className="mt-5 text-muted-foreground text-base leading-relaxed">
                A 47-point local SEO playbook running every month — built around how Google ranks businesses for &quot;near me&quot; and city + service queries.
              </p>
              <div className="mt-10 rounded-2xl border border-border bg-background p-3 shadow-sm">
                <img
                  src={mapPack}
                  alt="Google Maps 3-pack screenshot"
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="rounded-xl w-full h-auto"
                />
              </div>
            </div>
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
              {improvements.map((it) => (
                <div key={it.title} className="group rounded-2xl border border-border bg-background p-6 hover:border-primary/40 hover:shadow-md transition-all duration-300">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 grid place-items-center group-hover:bg-primary/15 transition-colors">
                    <it.icon className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground">{it.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{it.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="mx-auto max-w-7xl px-5 sm:px-6 py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold">How it works</p>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-display leading-tight">
            From invisible to inbound calls in 90 days.
          </h2>
        </div>
        <div className="mt-14 grid md:grid-cols-4 gap-6 relative">
          {/* Connecting line - desktop only */}
          <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30" />
          {process.map((p, i) => (
            <div key={p.title} className="relative">
              <div className="rounded-2xl border border-border bg-card p-7 relative z-10">
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground grid place-items-center text-sm font-bold shadow-gold">
                  {i + 1}
                </div>
                <h3 className="mt-5 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CASE STUDIES */}
      <section id="proof" className="bg-card/30 border-y border-border">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 py-20 md:py-28">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold">Local SEO case studies</p>
              <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-display leading-tight">
                Real local brands, <span className="text-gradient-gold">real map pack wins.</span>
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Every number is pulled from the client&apos;s own Google Business Profile dashboard.
            </p>
          </div>

          <div className="mt-14 grid lg:grid-cols-3 gap-6">
            {caseStudies.map((cs) => (
              <article
                key={cs.title}
                className="group rounded-3xl border border-border bg-background overflow-hidden hover:border-primary/40 hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  <img
                    src={cs.image}
                    alt={`${cs.title} GMB dashboard`}
                    width={1280}
                    height={960}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground text-[10px] px-3 py-1.5 uppercase tracking-widest font-semibold">
                    <Camera className="h-3 w-3" /> GMB screenshot
                  </span>
                </div>
                <div className="p-7 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {cs.city} · {cs.industry}
                  </div>
                  <h3 className="mt-3 text-lg font-display leading-snug">{cs.title}</h3>
                  <div className="mt-6 grid grid-cols-3 gap-3">
                    {cs.stats.map((s) => (
                      <div key={s.v} className="rounded-xl border border-border bg-card p-3 text-center">
                        <div className="text-lg font-display text-gradient-gold leading-none">{s.k}</div>
                        <div className="mt-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">{s.v}</div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-6 text-sm text-muted-foreground leading-relaxed flex-1">{cs.summary}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-14 rounded-3xl border border-border bg-card p-8 md:p-12 flex flex-col md:flex-row gap-6 items-start">
            <div className="h-12 w-12 rounded-2xl bg-primary/10 border border-primary/20 grid place-items-center shrink-0">
              <Quote className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-lg md:text-xl font-display leading-relaxed text-foreground">
                &quot;We went from page 3 to the top of the map pack in 8 weeks. Our phone hasn&apos;t stopped ringing — 40+ new patients a month from Google alone.&quot;
              </p>
              <p className="mt-5 text-sm text-muted-foreground font-medium">
                Dr. Rohan Mehta — Smile Studio Dental, Pune
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-5 sm:px-6 py-20 md:py-28">
        <div className="text-center">
          <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold">FAQ</p>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-display leading-tight">
            Local SEO, answered.
          </h2>
        </div>
        <div className="mt-14 space-y-4">
          {faqs.map((f, i) => (
            <div
              key={f.q}
              className={`rounded-2xl border transition-all duration-300 ${
                openFaq === i ? "border-primary/40 bg-card shadow-md" : "border-border bg-card/50 hover:border-primary/25"
              }`}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="text-base font-medium pr-6 text-foreground">{f.q}</span>
                <span className={`h-8 w-8 rounded-full border grid place-items-center shrink-0 transition-all duration-300 ${
                  openFaq === i ? "border-primary bg-primary text-primary-foreground rotate-180" : "border-border text-muted-foreground"
                }`}>
                  <ChevronDown className="h-4 w-4" />
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-96" : "max-h-0"}`}>
                <p className="px-6 pb-6 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section id="bottom-cta" className="mx-auto max-w-7xl px-5 sm:px-6 pb-20 md:pb-28">
        <div className="rounded-3xl border border-border bg-card p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-lg">
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-primary/12 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl pointer-events-none" />

          <div className="relative grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] text-primary font-semibold">
                <Sparkles className="h-3.5 w-3.5" /> Free local SEO audit — 24 hr delivery
              </span>
              <h2 className="mt-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display leading-tight text-foreground">
                Ready to own the <span className="text-gradient-gold italic">&quot;near me&quot;</span> searches in your city?
              </h2>
              <p className="mt-5 text-muted-foreground max-w-md text-base leading-relaxed">
                Submit your details and get a personalised GMB + map-pack audit with a 1-page action plan — no sales call required.
              </p>

              <ul className="mt-8 space-y-3 text-sm">
                {[
                  "Full GMB health check + competitor gap analysis",
                  "Priority keyword map for your city & neighbourhood",
                  "Citations & review velocity score",
                  "Delivered to your inbox within 24 hours",
                ].map((x) => (
                  <li key={x} className="flex gap-3 items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span className="text-foreground/80">{x}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="h-9 w-9 rounded-full border-2 border-card bg-primary/15 flex items-center justify-center text-[10px] font-semibold text-primary"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="text-foreground font-semibold">100+ local brands</span> audited this quarter
                </p>
              </div>
            </div>

            <form
              onSubmit={onSubmit}
              className="rounded-3xl border border-border bg-background p-6 sm:p-8 md:p-10 space-y-5 shadow-xl"
            >
              <h3 className="text-lg sm:text-xl font-display text-foreground">Get my free audit</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Your name" name="name" placeholder="Jane Doe" required />
                <FormField label="Phone / WhatsApp" name="phone" placeholder="+91 98xxxxxxxx" required />
              </div>
              <FormField label="Email" name="email" type="email" placeholder="you@business.com" required />
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Business name" name="business" placeholder="Smile Studio Dental" required />
                <FormField label="City you serve" name="city" placeholder="Pune, Kothrud" required />
              </div>
              <FormField label="Website or Google Maps URL" name="website" placeholder="https://" />
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Your #1 local SEO goal</label>
                <select
                  name="goal"
                  className="w-full rounded-xl bg-input/40 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                >
                  <option>Rank in Google Map 3-pack</option>
                  <option>More phone calls from Google</option>
                  <option>Fix & optimise my GMB profile</option>
                  <option>Get more 5-star reviews</option>
                  <option>Beat a specific competitor</option>
                  <option>Multi-location local SEO</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full inline-flex justify-center items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 text-sm font-semibold shadow-gold btn-fx disabled:opacity-60"
              >
                {sending ? "Sending..." : <>Send me my free audit <Send className="h-4 w-4" /></>}
              </button>
              <p className="text-[11px] text-muted-foreground text-center">
                No spam. Unsubscribe anytime. Audit delivered within 24 hours.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* STICKY MOBILE CTA BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-background/95 backdrop-blur-md border-t border-border lg:hidden shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.15)]">
        <a
          href="#bottom-cta"
          className="w-full inline-flex justify-center items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 text-sm font-semibold shadow-gold btn-fx"
        >
          Get free local SEO audit <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
}

function HeroStat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/70 backdrop-blur p-4 text-center">
      <div className="text-xl md:text-2xl font-display text-gradient-gold leading-none">{k}</div>
      <div className="mt-2 text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{v}</div>
    </div>
  );
}

function FormField({
  label,
  className = "",
  ...rest
}: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        {...rest}
        className={
          "w-full rounded-xl bg-input/40 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors " +
          className
        }
      />
    </div>
  );
}

const businessTypes = [
  { label: "Plumbers & electricians", icon: Wrench },
  { label: "Dentists & clinics", icon: Stethoscope },
  { label: "Salons & spas", icon: Scissors },
  { label: "Real estate & PG", icon: Home },
  { label: "Restaurants & cafés", icon: UtensilsCrossed },
  { label: "Gyms & studios", icon: Dumbbell },
  { label: "Law & CA firms", icon: Scale },
  { label: "Home services", icon: Building2 },
];

const improvements = [
  {
    icon: MapPin,
    title: "Google Business Profile overhaul",
    body: "Category fixes, services, products, attributes, geo-tagged photos and weekly posts — the foundation of every map-pack ranking.",
  },
  {
    icon: Search,
    title: "Local keyword + competitor map",
    body: "We map every 'service + city' and 'near me' keyword your buyers use, then reverse-engineer the top 3 ranking competitors.",
  },
  {
    icon: Building2,
    title: "NAP & citation cleanup",
    body: "Consistent Name-Address-Phone across 80+ directories — JustDial, Sulekha, Yelp, Apple Maps, Bing Places and industry-specific sites.",
  },
  {
    icon: Star,
    title: "Review velocity engine",
    body: "Automated review request flows over WhatsApp + email, smart reply templates and 1-click negative-review escalation.",
  },
  {
    icon: Target,
    title: "Hyper-local landing pages",
    body: "City + neighbourhood landing pages with unique content, schema, embedded maps and conversion-tuned CTAs.",
  },
  {
    icon: TrendingUp,
    title: "Local link & PR building",
    body: "Chamber of commerce, local press, sponsorships and partner backlinks — the off-page signals Google uses to rank you locally.",
  },
  {
    icon: Phone,
    title: "Call tracking & attribution",
    body: "We tag every call, direction request and form fill from GMB so you see real ROI — not vanity impressions.",
  },
  {
    icon: MessageSquare,
    title: "Q&A and review-content SEO",
    body: "Seed and answer Google Q&A, optimise review wording for keywords, and feed it all back into your GMB authority.",
  },
];

const process = [
  { title: "Local audit", body: "Map pack rankings, GMB health, citations, reviews & competitor gaps — week 1." },
  { title: "Fix the foundation", body: "GMB rebuild, NAP cleanup, on-page geo SEO and schema across your site." },
  { title: "Scale signals", body: "Reviews, posts, photos, local links and city pages on a weekly cadence." },
  { title: "Track & compound", body: "Monthly map pack reports, call tracking and continuous A/B on listings." },
];

const caseStudies = [
  {
    title: "From page 3 to #1 in the map pack",
    city: "Pune",
    industry: "Dental clinic",
    image: gmbDashboard,
    stats: [
      { k: "+412%", v: "map views" },
      { k: "+38", v: "calls / week" },
      { k: "#1", v: "map pack" },
    ],
    summary:
      "Rebuilt the GMB profile, cleaned 60+ citations and ran a review engine that pushed the clinic from 47 to 286 reviews in 90 days.",
  },
  {
    title: "12 locations, one local SEO system",
    city: "Mumbai · Pan-India",
    industry: "Salon chain",
    image: mapPack,
    stats: [
      { k: "+268%", v: "direction asks" },
      { k: "4.8★", v: "avg rating" },
      { k: "12/12", v: "top 3 ranked" },
    ],
    summary:
      "Standardised GMB across 12 outlets, deployed neighbourhood landing pages and review automation — every location now ranks top 3 for its city.",
  },
  {
    title: "Outranking national brands locally",
    city: "Bengaluru",
    industry: "Plumbing services",
    image: gmbDashboard,
    stats: [
      { k: "3.1x", v: "GMB calls" },
      { k: "+540%", v: "website clicks" },
      { k: "Top 3", v: "for 24 kws" },
    ],
    summary:
      "Hyper-local landing pages, geo-tagged job photos and a 5-star review flow took this 2-man crew above Urban Company in 'plumber near me'.",
  },
];

const faqs = [
  {
    q: "How long until I see results in the map pack?",
    a: "Most clients see GMB impression and call lifts in 30 days. Top-3 map pack rankings for primary keywords typically land in 60-90 days, depending on city competition.",
  },
  {
    q: "Do I need a website, or is GMB enough?",
    a: "GMB alone can rank, but a fast, schema-rich website with city pages compounds your authority and converts the click into a call. We handle both.",
  },
  {
    q: "Do you work with multi-location businesses?",
    a: "Yes — from 2 outlets to 200. We standardise GMB, run location-level reporting and deploy programmatic city pages so every outlet ranks in its own map pack.",
  },
  {
    q: "Will I be locked into a long contract?",
    a: "No. Local SEO is month-to-month. We earn the renewal with map pack rankings, calls and reviews — not paperwork.",
  },
  {
    q: "Can you help me get more reviews ethically?",
    a: "Yes. We automate post-service WhatsApp + email review requests to real, happy customers — fully compliant with Google's review policies.",
  },
];
