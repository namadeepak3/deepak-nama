import { createFileRoute, Link } from "@tanstack/react-router";
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
    <>
      <Toaster />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border bg-noir-grid">
        <div className="absolute inset-0 -z-10 opacity-60 pointer-events-none">
          <div className="absolute -top-32 -left-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute top-40 -right-20 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-24 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] uppercase tracking-widest text-primary font-semibold">
              <MapPin className="h-3.5 w-3.5" /> Local SEO that ranks you in the map pack
            </span>
            <h1 className="mt-5 text-4xl md:text-6xl font-display leading-[1.05]">
              Own the <span className="text-gradient-gold italic">"near&nbsp;me"</span> searches in your city.
            </h1>
            <p className="mt-5 max-w-xl text-muted-foreground text-lg">
              We get service businesses into Google&apos;s top 3-pack — so nearby customers call you before they ever scroll past your competitors.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#audit"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold shadow-gold hover:opacity-90 transition"
              >
                Get my free local SEO audit <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#proof"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold hover:border-foreground transition"
              >
                See proof
              </a>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
              <HeroStat k="+312%" v="map views" />
              <HeroStat k="3.1x" v="GMB calls" />
              <HeroStat k="Top 3" v="map pack" />
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-3xl border border-border bg-card p-3 shadow-2xl">
              <img
                src={gmbDashboard}
                alt="Google Business Profile dashboard showing local ranking and call growth"
                width={1280}
                height={832}
                className="rounded-2xl w-full h-auto"
              />
              <div className="absolute -bottom-4 -left-4 rounded-2xl bg-ink text-white px-4 py-3 shadow-xl border border-white/10">
                <div className="flex items-center gap-2 text-xs">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-semibold">4.9 avg rating</span>
                  <span className="text-white/60">· 480+ reviews driven</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-b border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-xs uppercase tracking-widest text-muted-foreground">
          <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> Google Partner mindset</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> 100+ local brands scaled</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> 30-day visible results</span>
          <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> No long contracts</span>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="max-w-2xl">
          <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold">Built for local service businesses</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-display">If customers find you on Google, this is for you.</h2>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Plumbers & electricians", icon: Building2 },
            { label: "Dentists & clinics", icon: Building2 },
            { label: "Salons & spas", icon: Building2 },
            { label: "Real estate & PG", icon: Building2 },
            { label: "Restaurants & cafés", icon: Building2 },
            { label: "Gyms & studios", icon: Building2 },
            { label: "Law & CA firms", icon: Building2 },
            { label: "Home services", icon: Building2 },
          ].map((b) => (
            <div key={b.label} className="rounded-2xl border border-border bg-card p-5 hover:border-foreground transition">
              <b.icon className="h-5 w-5 text-primary" />
              <p className="mt-3 text-sm font-medium">{b.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* IMPROVEMENTS — WHAT WE FIX */}
      <section id="improvements" className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold">Local SEO improvements</p>
              <h2 className="mt-3 text-3xl md:text-5xl font-display leading-tight">
                Everything we fix to get you in the <span className="text-gradient-gold">3-pack.</span>
              </h2>
              <p className="mt-5 text-white/70">
                A 47-point local SEO playbook running every month — built around how Google ranks businesses for "near me" and city + service queries.
              </p>
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-3">
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
                <div key={it.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 hover:bg-white/[0.07] transition">
                  <div className="h-9 w-9 rounded-lg bg-primary/15 border border-primary/30 grid place-items-center">
                    <it.icon className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold">{it.title}</h3>
                  <p className="mt-2 text-sm text-white/70 leading-relaxed">{it.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-2xl">
          <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold">How it works</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-display">From invisible to inbound calls in 90 days.</h2>
        </div>
        <div className="mt-12 grid md:grid-cols-4 gap-4">
          {process.map((p, i) => (
            <div key={p.title} className="rounded-2xl border border-border bg-card p-6 relative">
              <span className="text-5xl font-display text-primary/30 leading-none">0{i + 1}</span>
              <h3 className="mt-4 text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CASE STUDIES — local stats + GMB screenshots */}
      <section id="proof" className="bg-card/30 border-y border-border">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div className="max-w-2xl">
              <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold">Local SEO case studies</p>
              <h2 className="mt-3 text-3xl md:text-5xl font-display leading-tight">
                Real local brands, <span className="text-gradient-gold">real map pack wins.</span>
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Every number is pulled from the client&apos;s own Google Business Profile dashboard.
            </p>
          </div>

          <div className="mt-12 grid lg:grid-cols-3 gap-5">
            {caseStudies.map((cs) => (
              <article
                key={cs.title}
                className="group rounded-3xl border border-border bg-background overflow-hidden hover:border-foreground transition flex flex-col"
              >
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  <img
                    src={cs.image}
                    alt={`${cs.title} GMB dashboard`}
                    width={1280}
                    height={960}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-ink/90 text-white text-[10px] px-2.5 py-1 uppercase tracking-widest">
                    <Camera className="h-3 w-3" /> GMB screenshot
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {cs.city} · {cs.industry}
                  </div>
                  <h3 className="mt-2 text-lg font-display">{cs.title}</h3>
                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {cs.stats.map((s) => (
                      <div key={s.v} className="rounded-xl border border-border bg-card p-2.5 text-center">
                        <div className="text-base font-display text-gradient-gold leading-none">{s.k}</div>
                        <div className="mt-1 text-[9px] uppercase tracking-widest text-muted-foreground">{s.v}</div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-5 text-sm text-muted-foreground leading-relaxed flex-1">{cs.summary}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-3xl border border-border bg-card p-8 md:p-10 flex flex-col md:flex-row gap-6 items-start">
            <Quote className="h-8 w-8 text-primary shrink-0" />
            <div>
              <p className="text-lg md:text-xl font-display leading-snug">
                "We went from page 3 to the top of the map pack in 8 weeks. Our phone hasn&apos;t stopped ringing — 40+ new patients a month from Google alone."
              </p>
              <p className="mt-4 text-sm text-muted-foreground">
                Dr. Rohan Mehta — Smile Studio Dental, Pune
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold">FAQ</p>
        <h2 className="mt-3 text-3xl md:text-4xl font-display">Local SEO, answered.</h2>
        <div className="mt-10 divide-y divide-border border-y border-border">
          {faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex items-center justify-between cursor-pointer list-none">
                <span className="text-base font-medium pr-6">{f.q}</span>
                <span className="h-7 w-7 rounded-full border border-border grid place-items-center text-muted-foreground group-open:rotate-45 transition">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* FORM */}
      <section id="audit" className="bg-noir-grid border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 grid md:grid-cols-5 gap-10">
          <div className="md:col-span-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] uppercase tracking-widest text-primary font-semibold">
              <Sparkles className="h-3.5 w-3.5" /> Free local SEO audit
            </span>
            <h2 className="mt-5 text-3xl md:text-4xl font-display leading-tight">
              Get a free local SEO audit of your business.
            </h2>
            <p className="mt-4 text-muted-foreground">
              We&apos;ll audit your Google Business Profile, citations, reviews and local rankings — and send back a 1-page action plan within 24 hours.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "GMB profile health score",
                "Map pack ranking check for your top 5 keywords",
                "Citation & NAP consistency report",
                "Review velocity benchmark vs competitors",
              ].map((x) => (
                <li key={x} className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" /> {x}</li>
              ))}
            </ul>
          </div>

          <form
            onSubmit={onSubmit}
            className="md:col-span-3 rounded-3xl border border-border bg-card p-7 md:p-8 space-y-4"
          >
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
                className="w-full rounded-md bg-input/30 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary"
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
              className="w-full inline-flex justify-center items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold shadow-gold hover:opacity-90 transition disabled:opacity-60"
            >
              {sending ? "Sending..." : <>Send me my free audit <Send className="h-4 w-4" /></>}
            </button>
            <p className="text-xs text-muted-foreground text-center">
              No spam. No sales script. Just a useful audit in your inbox within 24 hours.
            </p>
          </form>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-3xl border border-border bg-ink text-white p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold">Ready to be the #1 result?</p>
          <h2 className="mt-3 text-3xl md:text-5xl font-display max-w-2xl mx-auto leading-tight">
            Stop losing customers to the business next door.
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-white/70">
            Book a free 20-min local SEO strategy call — we&apos;ll map out exactly what it takes to dominate your city on Google.
          </p>
          <Link
            to="/contact"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm font-semibold shadow-gold hover:opacity-90 transition"
          >
            Book my strategy call <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

function HeroStat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/60 backdrop-blur p-3 text-center">
      <div className="text-xl md:text-2xl font-display text-gradient-gold leading-none">{k}</div>
      <div className="mt-1.5 text-[10px] uppercase tracking-widest text-muted-foreground">{v}</div>
    </div>
  );
}

function FormField({
  label,
  ...rest
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        {...rest}
        className="w-full rounded-md bg-input/30 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary"
      />
    </div>
  );
}

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