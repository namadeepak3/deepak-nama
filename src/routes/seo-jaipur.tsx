import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  MapPin,
  Star,
  Search,
  TrendingUp,
  CheckCircle2,
  Send,
  Building2,
  Quote,
  ArrowRight,
  Sparkles,
  Target,
  Globe2,
  ShoppingBag,
  Stethoscope,
  GraduationCap,
  Hotel,
  Factory,
  Scale,
  Briefcase,
  ShieldCheck,
  Clock,
  Award,
  ChevronDown,
  BarChart3,
  Link2,
  FileText,
} from "lucide-react";
import { createLead } from "@/lib/leads.functions";
import { track } from "@/lib/analytics";
import gmbDashboard from "@/assets/local-seo-gmb-dashboard.jpg";
import mapPack from "@/assets/local-seo-map-pack.jpg";

export const Route = createFileRoute("/seo-jaipur")({
  head: () => ({
    meta: [
      { title: "SEO Services in Jaipur — Rank Across India | vrseoguru" },
      {
        name: "description",
        content:
          "Best SEO company in Jaipur serving brands across India in every industry — eCommerce, healthcare, education, real estate, SaaS and more. On-page, off-page, technical SEO that ranks.",
      },
      { property: "og:title", content: "SEO Services in Jaipur — Rank Across India" },
      {
        property: "og:description",
        content:
          "Jaipur-based SEO experts. Pan-India rankings for every industry. Technical SEO, content, backlinks and conversion-tuned landing pages.",
      },
      { property: "og:url", content: "/seo-jaipur" },
    ],
    links: [{ rel: "canonical", href: "/seo-jaipur" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "SEO Services Jaipur",
          serviceType: "Search Engine Optimization",
          provider: {
            "@type": "Organization",
            name: "vrseoguru",
            address: { "@type": "PostalAddress", addressLocality: "Jaipur", addressRegion: "Rajasthan", addressCountry: "IN" },
          },
          areaServed: ["Jaipur", "India"],
          description:
            "End-to-end SEO from Jaipur for businesses across India and every industry — technical SEO, content, link building and analytics.",
        }),
      },
    ],
  }),
  component: SeoJaipurPage,
});

function SeoJaipurPage() {
  const [sending, setSending] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const submitLead = useServerFn(createLead);

  const getDeviceType = () => {
    if (typeof window === "undefined") return "unknown";
    const w = window.innerWidth;
    if (w < 768) return "mobile";
    if (w < 1024) return "tablet";
    return "desktop";
  };

  useEffect(() => {
    track("lead_form_view", {
      page: "seo-jaipur",
      device: getDeviceType(),
      referrer: typeof document !== "undefined" ? document.referrer : "",
    });
  }, []);

  const validateForm = (fd: FormData) => {
    const errors: Record<string, string> = {};
    const name = ((fd.get("name") as string) || "").trim();
    const email = ((fd.get("email") as string) || "").trim();
    const phone = ((fd.get("phone") as string) || "").trim();
    const business = ((fd.get("business") as string) || "").trim();
    const city = ((fd.get("city") as string) || "").trim();

    if (!name) errors.name = "Name is required";
    else if (name.length < 2) errors.name = "Name must be at least 2 characters";
    else if (name.length > 100) errors.name = "Name must be under 100 characters";

    if (!email) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Invalid email address";
    else if (email.length > 255) errors.email = "Email must be under 255 characters";

    if (!phone) errors.phone = "Phone is required";
    else if (phone.length < 6) errors.phone = "Phone number seems too short";
    else if (phone.length > 30) errors.phone = "Phone must be under 30 characters";

    if (!business) errors.business = "Business name is required";
    else if (business.length > 150) errors.business = "Business name must be under 150 characters";

    if (!city) errors.city = "City is required";
    else if (city.length > 100) errors.city = "City must be under 100 characters";

    const website = ((fd.get("website") as string) || "").trim();
    if (website && !/^https?:\/\/.+/.test(website)) errors.website = "Website must start with http:// or https://";

    return { errors, isValid: Object.keys(errors).length === 0 };
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const form = e.currentTarget;
      const formId = form.dataset.formId || "seo_jaipur_form";
      const fd = new FormData(form);

      const device = getDeviceType();
      const params =
        typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      const utmSource = params?.get("utm_source") ?? "";
      const utmMedium = params?.get("utm_medium") ?? "";
      const utmCampaign = params?.get("utm_campaign") ?? "landing_seo_jaipur";
      const source = utmSource || (typeof document !== "undefined" && document.referrer
        ? new URL(document.referrer).hostname
        : "direct");

      const { errors, isValid } = validateForm(fd);
      if (!isValid) {
        track("lead_validation_error", {
          form_id: formId,
          page: "seo-jaipur",
          device,
          source,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          failed_fields: Object.keys(errors).join(","),
          error_count: Object.keys(errors).length,
        });
        const firstField = form.querySelector<HTMLElement>(
          `[name="${Object.keys(errors)[0]}"]`,
        );
        firstField?.focus();
        toast.error(Object.values(errors)[0]);
        return;
      }

      const name = ((fd.get("name") as string) || "").trim();
      const email = ((fd.get("email") as string) || "").trim();
      const phone = ((fd.get("phone") as string) || "").trim();
      const business = ((fd.get("business") as string) || "").trim();
      const city = ((fd.get("city") as string) || "").trim();
      const website = ((fd.get("website") as string) || "").trim();
      const industry = ((fd.get("industry") as string) || "").trim();
      const goal = ((fd.get("goal") as string) || "").trim();
      const message = `SEO Jaipur / India inquiry
Business: ${business}
City: ${city}
Industry: ${industry}
Primary goal: ${goal}
Website: ${website || "—"}`;
      setSending(true);

      track("lead_submit_attempt", {
        form_id: formId,
        page: "seo-jaipur",
        device,
        source,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        goal,
      });

      try {
        await submitLead({
          data: {
            name,
            email,
            phone,
            company: business,
            website,
            service: "SEO Jaipur / India",
            budget: "",
            message,
            kind: "inquiry",
            pageUrl: typeof window !== "undefined" ? window.location.href : "",
            referrer: typeof document !== "undefined" ? document.referrer : "",
            utmSource,
            utmMedium,
            utmCampaign,
          },
        });
        form.reset();
        track("generate_lead", {
          form_id: formId,
          page: "seo-jaipur",
          device,
          source,
          utm_source: utmSource,
          utm_medium: utmMedium,
          utm_campaign: utmCampaign,
          goal,
          value: 1,
          currency: "USD",
        });
        track("lead_submit_success", {
          form_id: formId,
          page: "seo-jaipur",
          device,
          source,
          goal,
        });
        toast.success("Got it — I'll send your free SEO audit within 24 hours.");
      } catch (err) {
        track("lead_submit_error", {
          form_id: formId,
          page: "seo-jaipur",
          device,
          source,
          error: err instanceof Error ? err.message : "unknown",
        });
        toast.error(err instanceof Error ? err.message : "Could not submit. Try again.");
      } finally {
        setSending(false);
      }
    } catch (clientErr) {
      const device = getDeviceType();
      const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      const source = params?.get("utm_source") || (typeof document !== "undefined" && document.referrer ? new URL(document.referrer).hostname : "direct");
      track("lead_client_error", {
        form_id: "seo_jaipur_form",
        page: "seo-jaipur",
        device,
        source,
        error: clientErr instanceof Error ? clientErr.message : "unknown_client_error",
        error_type: clientErr instanceof Error ? clientErr.name : "unknown",
      });
      toast.error("Something went wrong. Please refresh and try again.");
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
              <MapPin className="h-3.5 w-3.5" /> SEO Company in Jaipur · Serving All India
            </span>
            <h1 className="mt-6 text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] font-display leading-[1.08] tracking-tight">
              SEO that ranks your brand <span className="text-gradient-gold italic">across India</span> — from Jaipur.
            </h1>
            <p className="mt-5 max-w-xl text-muted-foreground text-base sm:text-lg leading-relaxed">
              A Jaipur-based SEO team running technical SEO, content and backlinks for businesses in every industry — eCommerce, healthcare, education, SaaS, real estate and more.
            </p>
            <ul className="mt-7 space-y-3 text-sm">
              {[
                "Free SEO audit + keyword roadmap in 24 hours",
                "Pan-India rankings — any city, any industry",
                "Transparent reporting, no long contracts",
              ].map((x) => (
                <li key={x} className="flex gap-3 items-start">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
              <HeroStat k="+420%" v="organic traffic" />
              <HeroStat k="200+" v="brands ranked" />
              <HeroStat k="Pan‑India" v="coverage" />
            </div>
          </div>

          <div className="lg:col-span-6 w-full">
            <form
              onSubmit={onSubmit}
              data-form-id="seo_jaipur_hero_form"
              className="rounded-3xl border border-border bg-card p-6 sm:p-8 md:p-10 space-y-5 shadow-gold"
            >
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-primary font-semibold">
                <Sparkles className="h-3.5 w-3.5" /> Free SEO audit
              </div>
              <h2 className="text-xl sm:text-2xl font-display leading-tight">
                Get your free SEO audit & growth plan
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Your name" name="name" placeholder="Jane Doe" required />
                <FormField label="Phone / WhatsApp" name="phone" placeholder="+91 98xxxxxxxx" required />
              </div>
              <FormField label="Email" name="email" type="email" placeholder="you@business.com" required />
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Business name" name="business" placeholder="Acme Pvt Ltd" required />
                <FormField label="City" name="city" placeholder="Jaipur" required />
              </div>
              <FormField label="Website" name="website" placeholder="https://" />
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Industry</label>
                  <select
                    name="industry"
                    className="w-full rounded-xl bg-input/40 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  >
                    <option>eCommerce / D2C</option>
                    <option>Healthcare / Clinic / Hospital</option>
                    <option>Education / EdTech</option>
                    <option>Real Estate</option>
                    <option>Hospitality / Travel</option>
                    <option>SaaS / IT Services</option>
                    <option>Manufacturing / B2B</option>
                    <option>Finance / Legal</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Primary goal</label>
                  <select
                    name="goal"
                    className="w-full rounded-xl bg-input/40 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  >
                    <option>Rank pan-India for my keywords</option>
                    <option>More organic traffic & leads</option>
                    <option>Fix technical SEO issues</option>
                    <option>Outrank a specific competitor</option>
                    <option>Launch a new website / migration</option>
                    <option>Scale content & backlinks</option>
                  </select>
                </div>
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
              { icon: ShieldCheck, label: "White-hat SEO only" },
              { icon: Award, label: "200+ brands ranked" },
              { icon: Clock, label: "90-day visible growth" },
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

      {/* INDUSTRIES */}
      <section className="mx-auto max-w-7xl px-5 sm:px-6 py-20 md:py-28">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold">Every industry, every city in India</p>
          <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-display leading-tight">
            SEO tailored to your industry.
          </h2>
          <p className="mt-5 text-muted-foreground">
            From Jaipur startups to Mumbai enterprises — we&apos;ve ranked brands in 15+ verticals across every metro and tier-2 city in India.
          </p>
        </div>
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {industries.map((b) => (
            <div key={b.label} className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/40 hover:shadow-lg transition-all duration-300">
              <div className="h-11 w-11 rounded-xl bg-primary/10 border border-primary/20 grid place-items-center group-hover:bg-primary/15 transition-colors">
                <b.icon className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-4 text-sm font-semibold text-foreground">{b.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="bg-card/40 border-y border-border">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 py-20 md:py-28">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold">Full-stack SEO</p>
              <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-display leading-tight text-foreground">
                Everything we do to <span className="text-gradient-gold">rank you nationally.</span>
              </h2>
              <p className="mt-5 text-muted-foreground text-base leading-relaxed">
                A complete SEO engine — technical, on-page, content, off-page and analytics — calibrated to how Google ranks in India today.
              </p>
              <div className="mt-10 rounded-2xl border border-border bg-background p-3 shadow-sm">
                <img
                  src={gmbDashboard}
                  alt="SEO performance dashboard"
                  width={1024}
                  height={1024}
                  loading="lazy"
                  className="rounded-xl w-full h-auto"
                />
              </div>
            </div>
            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
              {services.map((it) => (
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
            From audit to page 1 in 90 days.
          </h2>
        </div>
        <div className="mt-14 grid md:grid-cols-4 gap-6 relative">
          <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30" />
          {seoProcess.map((p, i) => (
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
              <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold">SEO case studies</p>
              <h2 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-display leading-tight">
                Real Indian brands, <span className="text-gradient-gold">real ranking wins.</span>
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Every metric pulled directly from Google Search Console & GA4.
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
                    alt={`${cs.title} analytics`}
                    width={1280}
                    height={960}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-primary text-primary-foreground text-[10px] px-3 py-1.5 uppercase tracking-widest font-semibold">
                    <BarChart3 className="h-3 w-3" /> Search Console
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
                &quot;Working with vrseoguru from Jaipur, we went from 8k to 95k monthly organic visitors in 6 months. Best SEO partner we&apos;ve had — and we&apos;ve tried 4.&quot;
              </p>
              <p className="mt-5 text-sm text-muted-foreground font-medium">
                Aditi Sharma — Head of Growth, D2C Beauty Brand (Delhi NCR)
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
            SEO in Jaipur & India, answered.
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
                <Sparkles className="h-3.5 w-3.5" /> Free SEO audit — 24 hr delivery
              </span>
              <h2 className="mt-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display leading-tight text-foreground">
                Ready to <span className="text-gradient-gold italic">rank across India?</span>
              </h2>
              <p className="mt-5 text-muted-foreground max-w-md text-base leading-relaxed">
                Tell us about your business and get a personalised SEO audit with a 90-day growth roadmap — straight from our Jaipur team.
              </p>

              <ul className="mt-8 space-y-3 text-sm">
                {[
                  "Technical SEO health + Core Web Vitals report",
                  "Industry-specific keyword opportunity map",
                  "Competitor gap analysis (top 3 in your space)",
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
                  <span className="text-foreground font-semibold">200+ Indian brands</span> ranked this year
                </p>
              </div>
            </div>

            <form
              onSubmit={onSubmit}
              data-form-id="seo_jaipur_bottom_form"
              className="rounded-3xl border border-border bg-background p-6 sm:p-8 md:p-10 space-y-5 shadow-xl"
            >
              <h3 className="text-lg sm:text-xl font-display text-foreground">Get my free SEO audit</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Your name" name="name" placeholder="Jane Doe" required />
                <FormField label="Phone / WhatsApp" name="phone" placeholder="+91 98xxxxxxxx" required />
              </div>
              <FormField label="Email" name="email" type="email" placeholder="you@business.com" required />
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField label="Business name" name="business" placeholder="Acme Pvt Ltd" required />
                <FormField label="City" name="city" placeholder="Jaipur" required />
              </div>
              <FormField label="Website" name="website" placeholder="https://" />
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Industry</label>
                  <select
                    name="industry"
                    className="w-full rounded-xl bg-input/40 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  >
                    <option>eCommerce / D2C</option>
                    <option>Healthcare</option>
                    <option>Education / EdTech</option>
                    <option>Real Estate</option>
                    <option>Hospitality / Travel</option>
                    <option>SaaS / IT Services</option>
                    <option>Manufacturing / B2B</option>
                    <option>Finance / Legal</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Primary goal</label>
                  <select
                    name="goal"
                    className="w-full rounded-xl bg-input/40 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  >
                    <option>Rank pan-India for my keywords</option>
                    <option>More organic traffic & leads</option>
                    <option>Fix technical SEO issues</option>
                    <option>Outrank a competitor</option>
                    <option>Launch / migration SEO</option>
                    <option>Scale content & backlinks</option>
                  </select>
                </div>
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
          Get free SEO audit <ArrowRight className="h-4 w-4" />
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

const industries = [
  { label: "eCommerce & D2C", icon: ShoppingBag },
  { label: "Healthcare & Hospitals", icon: Stethoscope },
  { label: "Education & EdTech", icon: GraduationCap },
  { label: "Real Estate", icon: Building2 },
  { label: "Hospitality & Travel", icon: Hotel },
  { label: "SaaS & IT Services", icon: Globe2 },
  { label: "Manufacturing & B2B", icon: Factory },
  { label: "Finance, Law & CA", icon: Scale },
];

const services = [
  {
    icon: Search,
    title: "Technical SEO audit",
    body: "Core Web Vitals, crawl budget, indexation, schema, sitemaps, hreflang and JS rendering — fixed at the code level.",
  },
  {
    icon: FileText,
    title: "On-page & content SEO",
    body: "Keyword-mapped page rewrites, intent-matched content briefs and topical clusters built around your ICP.",
  },
  {
    icon: Link2,
    title: "Authority link building",
    body: "Editorial backlinks from real Indian and global publications — digital PR, guest posts and HARO-style placements.",
  },
  {
    icon: Target,
    title: "Keyword & competitor research",
    body: "Deep gap analysis across India search volume, intent and SERP features to prioritise the keywords that actually convert.",
  },
  {
    icon: Globe2,
    title: "Pan-India & multi-city SEO",
    body: "City landing pages, hreflang, regional content and structured data to capture every metro and tier-2 market.",
  },
  {
    icon: Briefcase,
    title: "Industry-specific SEO",
    body: "Playbooks built for eCommerce, SaaS, healthcare, real estate and B2B — not the same generic template recycled.",
  },
  {
    icon: BarChart3,
    title: "Analytics & reporting",
    body: "GA4 + Search Console dashboards, weekly rank tracking and revenue attribution — you see exactly what SEO returns.",
  },
  {
    icon: TrendingUp,
    title: "Conversion-rate SEO",
    body: "We don&apos;t just rank — we rebuild the landing experience so traffic turns into calls, demos and orders.",
  },
];

const seoProcess = [
  { title: "Deep SEO audit", body: "Technical, on-page, backlink and content audit + competitor gap mapping — week 1." },
  { title: "Fix the foundation", body: "Site speed, schema, indexation, internal linking and on-page rewrites." },
  { title: "Scale signals", body: "Content publishing, digital PR, backlink campaigns and topical authority build." },
  { title: "Track & compound", body: "Monthly reporting, A/B SERP tests and continuous expansion into new keywords." },
];

const caseStudies = [
  {
    title: "8k → 95k organic visits in 6 months",
    city: "Delhi NCR",
    industry: "D2C Beauty",
    image: gmbDashboard,
    stats: [
      { k: "+1087%", v: "organic" },
      { k: "320", v: "kws page 1" },
      { k: "4.2x", v: "revenue" },
    ],
    summary:
      "Programmatic category pages, internal linking overhaul and a content engine took this D2C brand from invisible to category leader in Indian beauty search.",
  },
  {
    title: "SaaS ranking #1 across India",
    city: "Bengaluru · Pan-India",
    industry: "B2B SaaS",
    image: mapPack,
    stats: [
      { k: "+612%", v: "organic" },
      { k: "#1", v: "for ICP kw" },
      { k: "+38%", v: "MQLs" },
    ],
    summary:
      "Topical authority strategy + thought-leadership PR backlinks put the product page above HubSpot & Zoho for India-specific buying queries.",
  },
  {
    title: "Jaipur real estate, pan-India buyers",
    city: "Jaipur",
    industry: "Real Estate",
    image: gmbDashboard,
    stats: [
      { k: "+482%", v: "leads" },
      { k: "Top 3", v: "for 41 kws" },
      { k: "₹0", v: "ad spend" },
    ],
    summary:
      "City + project landing pages, schema-rich listings and authority links generated NRI and metro-city buyer leads without paid ads.",
  },
];

const faqs = [
  {
    q: "Are you an SEO company based in Jaipur?",
    a: "Yes — our team is headquartered in Jaipur and we work with clients across India and abroad. You can meet us in person at our Jaipur office or work fully remote.",
  },
  {
    q: "Do you only handle Jaipur clients, or pan-India?",
    a: "We rank brands across every metro and tier-2 city in India — Delhi, Mumbai, Bengaluru, Hyderabad, Pune, Ahmedabad, Jaipur and beyond — and we work with international clients too.",
  },
  {
    q: "Which industries do you specialise in?",
    a: "We have proven playbooks for eCommerce / D2C, healthcare, education, real estate, hospitality, SaaS / IT services, manufacturing / B2B and finance / legal. If your industry isn't listed, ask us — we likely still cover it.",
  },
  {
    q: "How long until I see SEO results?",
    a: "Most clients see meaningful traffic and ranking lifts within 60-90 days. Competitive national keywords typically take 4-6 months for first-page rankings; long-tail wins land faster.",
  },
  {
    q: "Do you do white-hat SEO only?",
    a: "Yes. 100% white-hat — no PBNs, no spammy links, no keyword stuffing. Everything we do is built to compound safely under every Google update.",
  },
  {
    q: "What does pricing look like?",
    a: "SEO retainers are month-to-month and scale with your goals, industry competitiveness and the markets you target. We share a transparent custom quote after the free audit — no long lock-ins.",
  },
];
