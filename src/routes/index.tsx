import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, ShieldCheck, Zap, LineChart, Send, CheckCircle2, TrendingUp, Award, Star, Quote, Phone, Bot, Search, Megaphone, Target, BarChart3, Globe, Rocket, Activity, Play, MousePointerClick, Mail, ShoppingCart, Youtube } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listServices } from "@/lib/services.functions";
import { createLead } from "@/lib/leads.functions";
import { iconFor } from "@/lib/services.shared";
import { useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { z } from "zod";
import heroBg from "@/assets/hero-digital.jpg";

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
  const submitLead = useServerFn(createLead);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<null | { name: string; email: string }>(null);

  const inquirySchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
    email: z.string().trim().email("Enter a valid email address").max(255, "Email is too long"),
    service: z.string().min(1, "Select a service"),
    budget: z.string().min(1, "Select a budget range"),
    message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000, "Message is too long"),
  });

  const onInquiry = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const formData = new FormData(e.currentTarget);
    const raw = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      service: formData.get("service") as string,
      budget: formData.get("budget") as string,
      message: formData.get("message") as string,
    };
    const result = inquirySchema.safeParse(raw);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const key = issue.path[0] as string;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      });
      setErrors(fieldErrors);
      toast.error("Please fix the form errors.");
      return;
    }
    setSending(true);
    try {
      await submitLead({ data: result.data });
      (e.target as HTMLFormElement).reset();
      setErrors({});
      setSubmitted({ name: result.data.name, email: result.data.email });
      toast.success("Inquiry sent — I'll reply within 24 hours.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send inquiry.");
    } finally {
      setSending(false);
    }
  };
  return (
    <>
      <Toaster />

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Digital background image */}
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

        <div className="relative mx-auto max-w-7xl px-6 pt-6 pb-16 md:pt-10 md:pb-20 grid lg:grid-cols-12 gap-10 items-center">
          {/* LEFT — details */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur px-3 py-1 text-xs text-foreground">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span></span>
              AI-native freelance studio · open for projects
            </div>
            <h1 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-display uppercase leading-[0.95] tracking-tight">
              Growth, <span className="text-gradient-gold">engineered</span><br/>by algorithms.
            </h1>
            <p className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground leading-relaxed">
              I&apos;m <span className="text-foreground font-semibold">vrseoguru</span> — a freelance partner fusing SEO, PPC, performance marketing &amp; social into AI-driven systems that compound revenue, not vanity metrics.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition shadow-gold">
                Book strategy call <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/services" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:border-primary transition">
                <Play className="h-3.5 w-3.5" /> See services
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-lg">
              {[["4.2x","Avg ROAS"],["120+","Campaigns"],["24h","Reply"]].map(([k,v])=>(
                <div key={v}>
                  <div className="text-2xl md:text-3xl font-display text-gradient-gold">{k}</div>
                  <div className="mt-1 text-xs text-muted-foreground uppercase tracking-widest">{v}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary"/> Transparent reporting</div>
              <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-primary"/> Ship in days</div>
              <div className="flex items-center gap-2"><LineChart className="h-4 w-4 text-primary"/> Profit-first</div>
            </div>
          </div>

          {/* RIGHT — inquiry form */}
          <div id="inquiry" className="lg:col-span-5">
            {submitted ? (
              <div className="rounded-3xl border border-border bg-card shadow-gold p-10 text-center">
                <div className="mx-auto h-14 w-14 rounded-full bg-primary/15 grid place-items-center">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-5 text-2xl font-display uppercase">Thanks, {submitted.name}!</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your inquiry has been received. I&apos;ll reply to <span className="text-foreground font-medium">{submitted.email}</span> within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(null)}
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-5 py-2.5 text-sm font-medium text-foreground hover:border-primary transition"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
            <form
              onSubmit={onInquiry}
              className="rounded-3xl border border-border bg-card/95 backdrop-blur shadow-gold p-6 md:p-7 space-y-4"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Quick inquiry</p>
                <h3 className="mt-1 text-2xl font-display uppercase">Get a free 30-day plan</h3>
              </div>
              <div>
                  <input name="name" placeholder="Your name" className={`w-full rounded-xl bg-secondary border px-4 py-3 text-sm focus:outline-none focus:border-primary ${errors.name ? "border-red-400" : "border-border"}`} />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>
              <div>
                  <input name="email" type="email" placeholder="Email address" className={`w-full rounded-xl bg-secondary border px-4 py-3 text-sm focus:outline-none focus:border-primary ${errors.email ? "border-red-400" : "border-border"}`} />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <select name="service" className={`w-full rounded-xl bg-secondary border px-4 py-3 text-sm focus:outline-none focus:border-primary ${errors.service ? "border-red-400" : "border-border"}`}>
                    <option value="">Service</option>
                    <option>SEO</option>
                    <option>Performance Marketing</option>
                    <option>PPC</option>
                    <option>Social Media (SMO)</option>
                    <option>AI Automation</option>
                  </select>
                  {errors.service && <p className="mt-1 text-xs text-red-500">{errors.service}</p>}
                </div>
                <div>
                  <select name="budget" className={`w-full rounded-xl bg-secondary border px-4 py-3 text-sm focus:outline-none focus:border-primary ${errors.budget ? "border-red-400" : "border-border"}`}>
                    <option value="">Budget</option>
                    <option>Under ₹10,000</option>
                    <option>₹10,000 – ₹50,000</option>
                    <option>₹50,000 – ₹1,00,000</option>
                    <option>₹1,00,000 – ₹5,00,000</option>
                    <option>₹5,00,000+</option>
                  </select>
                  {errors.budget && <p className="mt-1 text-xs text-red-500">{errors.budget}</p>}
                </div>
              </div>
              <div>
                  <textarea name="message" rows={3} placeholder="Tell me about your goals..." className={`w-full rounded-xl bg-secondary border px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none ${errors.message ? "border-red-400" : "border-border"}`} />
                  {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
              </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full inline-flex justify-center items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-60 shadow-gold"
                >
                  {sending ? "Sending..." : <>Send inquiry <Send className="h-4 w-4" /></>}
                </button>
              <p className="text-[11px] text-muted-foreground text-center">Reply within 24 hours · No spam.</p>
            </form>
            )}
          </div>
        </div>
      </section>

      {/* ============ CHANNELS I RUN ============ */}
      <section className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="text-center text-xs uppercase tracking-[0.25em] text-primary font-semibold mb-6">Channels I run</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { Icon: Search, label: "Google Ads" },
              { Icon: TrendingUp, label: "SEO / GEO" },
              { Icon: Megaphone, label: "Meta Ads" },
              { Icon: Youtube, label: "YouTube" },
              { Icon: ShoppingCart, label: "Amazon" },
              { Icon: Mail, label: "Email / CRM" },
            ].map(({Icon,label})=>(
              <div key={label} className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-3 py-3 text-sm font-medium text-foreground hover:border-primary hover:text-primary transition">
                <Icon className="h-4 w-4 text-primary"/> {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SERVICES — BENTO ============ */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">What I do</p>
            <h2 className="mt-3 text-4xl md:text-5xl font-display uppercase leading-[1.05]">A full-stack growth <span className="text-gradient-gold">engine.</span></h2>
          </div>
          <Link to="/services" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1">
            All services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-12 auto-rows-[minmax(180px,auto)] gap-4">
          {services.map((s, i) => {
            const Icon = iconFor(s.icon);
            const sizes = [
              "col-span-12 md:col-span-7",
              "col-span-12 md:col-span-5",
              "col-span-12 md:col-span-4",
              "col-span-12 md:col-span-4",
              "col-span-12 md:col-span-4",
              "col-span-12 md:col-span-6",
              "col-span-12 md:col-span-6",
            ];
            return (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className={`group relative ${sizes[i % sizes.length]} rounded-3xl border border-border bg-card p-7 hover:border-primary transition overflow-hidden`}
              >
                <div className="absolute -bottom-16 -right-16 h-44 w-44 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition" />
                <div className="relative h-11 w-11 rounded-xl bg-primary/15 border border-primary/30 grid place-items-center mb-5">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="relative text-xl md:text-2xl font-display uppercase">{s.title}</h3>
                <p className="relative mt-2 text-sm text-muted-foreground leading-relaxed">{s.shortDesc}</p>
                <div className="relative mt-5 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition">
                  Learn more <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ============ 2026 TRENDS ============ */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid lg:grid-cols-12 gap-10 items-end mb-12">
            <div className="lg:col-span-7">
              <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">2026 playbook</p>
              <h2 className="mt-3 text-4xl md:text-5xl font-display uppercase leading-[1.05]">Marketing trends I&apos;m <span className="text-gradient-gold">building on.</span></h2>
            </div>
            <p className="lg:col-span-5 text-muted-foreground">Every strategy I ship leans into where attention &amp; algorithms are heading next — not where they used to be.</p>
          </div>
          <div className="grid grid-cols-12 auto-rows-[minmax(160px,auto)] gap-4">
            {[
              { Icon: Search, title: "AI Search (SGE & GEO)", desc: "Optimizing for Google AI Overviews, Perplexity & ChatGPT citations.", span: "col-span-12 md:col-span-6 lg:col-span-5" },
              { Icon: Bot, title: "Agentic Automation", desc: "AI agents handling reporting, bidding & creative iteration 24/7.", span: "col-span-12 md:col-span-6 lg:col-span-4" },
              { Icon: Target, title: "First-party data", desc: "Server-side tracking, CAPI & CDPs in a cookieless world.", span: "col-span-12 md:col-span-12 lg:col-span-3" },
              { Icon: Megaphone, title: "Short-form video", desc: "Reels, Shorts & TikTok funnels engineered to convert, not just go viral.", span: "col-span-12 md:col-span-6 lg:col-span-4" },
              { Icon: BarChart3, title: "Incrementality testing", desc: "Geo-lifts & MMM to prove what actually drives revenue.", span: "col-span-12 md:col-span-6 lg:col-span-4" },
              { Icon: Globe, title: "Omnichannel attribution", desc: "Unified GA4 + warehouse views — one source of truth.", span: "col-span-12 md:col-span-12 lg:col-span-4" },
            ].map(({ Icon, title, desc, span }) => (
              <div key={title} className={`${span} rounded-3xl border border-border bg-card p-7 hover:border-primary transition`}>
                <Icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 text-lg md:text-xl font-display uppercase">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">My process</p>
          <h2 className="mt-3 text-4xl md:text-5xl font-display uppercase">A proven path to growth</h2>
          <p className="mt-4 text-muted-foreground">A transparent, repeatable system that turns goals into compounding revenue.</p>
        </div>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            ["01","Discovery & Audit","Deep market, competitor & funnel analysis."],
            ["02","Strategy","Custom data-backed roadmap aligned to revenue."],
            ["03","Implementation","Multi-channel execution with AI-assisted ops."],
            ["04","Optimization","Continuous testing, learning, scaling."],
            ["05","Reporting","Real-time dashboards. Monthly strategic reviews."],
          ].map(([num, title, desc]) => (
            <div key={num} className="rounded-3xl border border-border bg-card p-6 hover:border-primary transition">
              <div className="text-3xl font-display text-gradient-gold">{num}</div>
              <h3 className="mt-3 font-display uppercase">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============ WHO I AM ============ */}
      <section className="relative border-y border-border bg-card/30 overflow-hidden">
        <div aria-hidden className="absolute -top-20 left-1/2 -translate-x-1/2 h-72 w-[60%] rounded-full bg-primary/15 blur-3xl"/>
        <div className="relative mx-auto max-w-5xl px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold text-foreground">
            <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span></span>
            Available · Q3 2026 · Mumbai, IN
          </div>
          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-primary font-semibold">Who I am</p>
          <h2 className="mt-4 text-4xl md:text-6xl font-display uppercase leading-[1.02]">
            Hi, I&apos;m <span className="text-gradient-gold">vrseoguru</span> —<br/>your freelance growth partner.
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-muted-foreground leading-relaxed">
            For 7+ years I&apos;ve built revenue systems for ecommerce, SaaS &amp; D2C brands across India and abroad — fusing senior strategy with AI-powered execution. Every campaign engineered around your <span className="text-foreground font-semibold">bottom line</span>, not vanity metrics.
          </p>

          {/* Certification chips */}
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {["Google Ads Certified","Meta Blueprint","GA4 Certified","Amazon Ads","HubSpot","SEMrush Pro"].map(c=>(
              <span key={c} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary"/> {c}
              </span>
            ))}
          </div>

          {/* Pillars */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            {[
              { Icon: TrendingUp, title: "ROI-Focused", desc: "Every rupee tied to revenue." },
              { Icon: ShieldCheck, title: "Transparent", desc: "Live dashboards, no jargon." },
              { Icon: Award, title: "Certified", desc: "Google · Meta · Amazon." },
              { Icon: Rocket, title: "Fast", desc: "Live in under 14 days." },
            ].map(({Icon,title,desc})=>(
              <div key={title} className="rounded-2xl border border-border bg-card p-5 hover:border-primary transition">
                <div className="h-10 w-10 rounded-xl bg-primary/15 border border-primary/30 grid place-items-center">
                  <Icon className="h-5 w-5 text-primary"/>
                </div>
                <h3 className="mt-4 text-sm font-display uppercase">{title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            <Link to="/about" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition shadow-gold">
              Full story <ArrowRight className="h-4 w-4"/>
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:border-primary transition">
              Let&apos;s talk
            </Link>
          </div>
        </div>
      </section>

      {/* ============ RESULTS ============ */}
      <section className="relative border-y border-border bg-gradient-to-br from-primary/10 via-card/30 to-card/30 overflow-hidden">
        <div aria-hidden className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-primary/20 blur-3xl"/>
        <div aria-hidden className="absolute -bottom-32 right-1/4 h-72 w-72 rounded-full bg-primary/15 blur-3xl"/>
        <div className="relative mx-auto max-w-7xl px-6 py-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Results that compound</p>
            <h2 className="mt-3 text-4xl md:text-5xl font-display uppercase">Numbers do the talking</h2>
            <p className="mt-4 text-muted-foreground">Aggregate impact across 120+ campaigns shipped in the last 24 months.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { k: "₹84Cr+", v: "Revenue driven", Icon: TrendingUp },
              { k: "4.2x", v: "Average ROAS", Icon: Activity },
              { k: "-47%", v: "Avg CPA reduction", Icon: Target },
              { k: "+240%", v: "Organic traffic lift", Icon: Search },
              { k: "120+", v: "Campaigns shipped", Icon: Rocket },
              { k: "32M+", v: "Ad impressions", Icon: MousePointerClick },
              { k: "98%", v: "Client retention", Icon: ShieldCheck },
              { k: "18", v: "Industries served", Icon: Globe },
            ].map(({k,v,Icon})=>(
              <div key={v} className="rounded-3xl border border-border bg-card p-6 hover:border-primary transition">
                <Icon className="h-5 w-5 text-primary"/>
                <div className="mt-4 text-3xl md:text-4xl font-display text-gradient-gold leading-none">{k}</div>
                <div className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{v}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CASE STUDIES ============ */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Case studies</p>
            <h2 className="mt-3 text-4xl md:text-5xl font-display uppercase leading-[1.05]">Brands I&apos;ve <span className="text-gradient-gold">scaled.</span></h2>
            <p className="mt-4 text-muted-foreground">A few recent wins — full breakdowns inside.</p>
          </div>
          <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1">View all <ArrowRight className="h-4 w-4"/></Link>
        </div>
        <div className="grid grid-cols-12 gap-4">
          {[
            {
              span: "col-span-12 lg:col-span-7",
              tag: "D2C · Ecommerce",
              title: "Lumen Skincare — From ₹40L to ₹3.2Cr/mo in 9 months",
              desc: "Rebuilt the Meta + Google funnel with creative iteration loops and server-side tracking. Profit-first scaling, not blended ROAS theatre.",
              stats: [["8.1x","Peak ROAS"],["+312%","Revenue"],["-44%","CAC"]],
              channels: ["Meta","Google","Email"],
            },
            {
              span: "col-span-12 lg:col-span-5",
              tag: "B2B SaaS",
              title: "Velocity SaaS — CPL cut by 52% in 4 months",
              desc: "Restructured Google Ads accounts, layered intent + LinkedIn retargeting, and built a content-led demo funnel.",
              stats: [["-52%","CPL"],["2.1x","MQLs"]],
              channels: ["Google","LinkedIn"],
            },
            {
              span: "col-span-12 lg:col-span-5",
              tag: "Fintech",
              title: "Finovate — #1 ranking on 14 money keywords",
              desc: "Technical SEO overhaul + topical authority programme. AI-search optimization (GEO) baked in from day one.",
              stats: [["+240%","Organic"],["#1","SERP"]],
              channels: ["SEO","Content"],
            },
            {
              span: "col-span-12 lg:col-span-7",
              tag: "Real Estate",
              title: "Harborline Homes — Regional to national in 12 months",
              desc: "Geo-expansion playbook with localized landing pages, performance creative testing, and a lifecycle engine that nurtures cold leads to booked tours.",
              stats: [["5.8x","ROAS"],["+186%","Site visits"],["3.4x","Bookings"]],
              channels: ["Google","Meta","SEO"],
            },
          ].map((c)=>(
            <Link key={c.title} to="/blog" className={`${c.span} group relative rounded-3xl border border-border bg-card p-7 md:p-8 hover:border-primary transition overflow-hidden`}>
              <div className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition"/>
              <div className="relative flex items-center justify-between flex-wrap gap-2">
                <span className="rounded-full bg-primary/15 border border-primary/30 px-3 py-0.5 text-[11px] font-semibold text-primary uppercase tracking-widest">{c.tag}</span>
                <div className="flex gap-1.5">
                  {c.channels.map(ch=>(
                    <span key={ch} className="rounded-md bg-secondary border border-border px-2 py-0.5 text-[10px] text-muted-foreground">{ch}</span>
                  ))}
                </div>
              </div>
              <h3 className="relative mt-5 text-2xl md:text-3xl font-display uppercase leading-tight">{c.title}</h3>
              <p className="relative mt-3 text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              <div className="relative mt-6 grid grid-cols-3 gap-3">
                {c.stats.map(([k,v])=>(
                  <div key={v} className="rounded-2xl border border-border bg-background/40 p-3">
                    <div className="text-xl md:text-2xl font-display text-gradient-gold leading-none">{k}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">{v}</div>
                  </div>
                ))}
              </div>
              <div className="relative mt-5 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                Read case study <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"/>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ INSIGHTS ============ */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Insights</p>
              <h2 className="mt-3 text-4xl md:text-5xl font-display uppercase">Fresh from the blog</h2>
            </div>
            <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1">All articles <ArrowRight className="h-4 w-4"/></Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              ["SEO","10 SEO Trends That Will Define 2026","AI search, entity optimization & what brands are doing to stay ahead.","May 28 · 8 min"],
              ["PPC","Maximize ROI From Google Ads in 2026","Lower CPA and scale profitable campaigns with AI bidding.","May 14 · 6 min"],
              ["Content","Content That Actually Converts","The framework I use to build assets that drive real revenue.","Apr 30 · 7 min"],
            ].map(([tag,title,desc,meta])=>(
              <article key={title} className="rounded-3xl border border-border bg-card p-6 flex flex-col hover:border-primary transition">
                <span className="self-start rounded-full bg-primary/15 border border-primary/30 px-3 py-0.5 text-[11px] font-semibold text-primary uppercase tracking-widest">{tag}</span>
                <h3 className="mt-4 text-lg font-display uppercase leading-snug">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{desc}</p>
                <p className="mt-5 text-xs text-muted-foreground">{meta}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/30 via-card to-card p-12 md:p-20 text-center">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-primary/30 blur-3xl"/>
          <p className="relative text-xs uppercase tracking-[0.25em] text-primary font-semibold">Let&apos;s build</p>
          <h2 className="relative mt-4 text-4xl md:text-6xl font-display uppercase leading-[1.02]">Ready to <span className="text-gradient-gold">accelerate</span><br/>your growth?</h2>
          <p className="relative mt-5 max-w-xl mx-auto text-muted-foreground">Free, no-obligation strategy call. I&apos;ll audit your marketing &amp; show you the biggest opportunities.</p>
          <div className="relative mt-8 flex flex-wrap gap-3 justify-center">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition shadow-gold">
              Book free call <ArrowRight className="h-4 w-4"/>
            </Link>
            <Link to="/services" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground hover:border-primary transition">
              <Phone className="h-4 w-4"/> View services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
