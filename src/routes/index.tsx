import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Sparkles, ShieldCheck, Zap, LineChart, Send, CheckCircle2, TrendingUp, Award, Star, Quote, Phone, Bot, Search, Megaphone, Target, BarChart3, Globe, Rocket, Activity, Play, MousePointerClick, Mail, Compass, Hammer, FlaskConical, FileBarChart, PenTool, Share2, Code2, ShoppingCart, Youtube, Linkedin } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useServerFn } from "@tanstack/react-start";
import { createLead } from "@/lib/leads.functions";
import { generateAuditPreview, type AuditPreview } from "@/lib/audit-preview.functions";
import { listCaseStudies } from "@/lib/case-studies.functions";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { z } from "zod";
import { track } from "@/lib/analytics";
import { AuditPopup } from "@/components/audit-popup";
import blogSeoAsset from "@/assets/blog-seo.jpg.asset.json";
import blogPpcAsset from "@/assets/blog-ppc.jpg.asset.json";
import blogContentAsset from "@/assets/blog-content.jpg.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "vrseoguru — AI-Powered Digital Marketing Services Agency" },
      { name: "description", content: "An AI-powered digital marketing services agency delivering SEO, paid media, performance creative and lifecycle programs that compound revenue." },
      { property: "og:title", content: "vrseoguru — AI-Powered Digital Marketing Services Agency" },
      { property: "og:description", content: "AI-powered SEO, paid media, performance creative and lifecycle — engineered for revenue." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});


function Home() {
  const navigate = useNavigate();
  const submitLead = useServerFn(createLead);
  const fetchAuditPreview = useServerFn(generateAuditPreview);
  const fetchCases = useServerFn(listCaseStudies);
  const { data: caseStudies = [] } = useQuery({ queryKey: ["case-studies", "home"], queryFn: () => fetchCases() });
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<null | { name: string; email: string }>(null);
  const [auditOpen, setAuditOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem("auditPopupShown") === "1") return;
    } catch { /* ignore */ }
    const t = setTimeout(() => {
      setAuditOpen(true);
      track("audit_popup_opened", { source: "auto" });
    }, 1500);
    return () => clearTimeout(t);
  }, []);

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
    const phone = (formData.get("phone") as string) || "";
    const company = (formData.get("company") as string) || "";
    const website = (formData.get("website") as string) || "";
    const timeline = (formData.get("timeline") as string) || "";
    const messageBody = (formData.get("message") as string) || "";
    const composedMessage = [
      timeline && `Timeline: ${timeline}`,
      messageBody && `\n${messageBody}`,
    ].filter(Boolean).join("\n");
    const raw = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      service: formData.get("service") as string,
      budget: formData.get("budget") as string,
      message: composedMessage || messageBody,
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
      const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      await submitLead({
        data: {
          ...result.data,
          phone,
          website,
          company,
          kind: "inquiry",
          pageUrl: typeof window !== "undefined" ? window.location.href : "",
          referrer: typeof document !== "undefined" ? document.referrer : "",
          utmSource: params?.get("utm_source") ?? "",
          utmMedium: params?.get("utm_medium") ?? "",
          utmCampaign: params?.get("utm_campaign") ?? "",
        },
      });
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
      <AuditPopup
        open={auditOpen}
        onClose={() => {
          setAuditOpen(false);
          track("audit_popup_dismissed");
          try { sessionStorage.setItem("auditPopupShown", "1"); } catch { /* ignore */ }
        }}
        onSubmitLead={async (values) => {
          const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
          await submitLead({
            data: {
              ...values,
              kind: "audit",
              service: "Website Audit",
              budget: "",
              pageUrl: typeof window !== "undefined" ? window.location.href : "",
              referrer: typeof document !== "undefined" ? document.referrer : "",
              utmSource: params?.get("utm_source") ?? "",
              utmMedium: params?.get("utm_medium") ?? "",
              utmCampaign: params?.get("utm_campaign") ?? "",
            },
          });
          track("audit_popup_submitted", {
            has_phone: Boolean(values.phone),
            has_website: Boolean(values.website),
          });
          try { sessionStorage.setItem("auditPopupShown", "1"); } catch { /* ignore */ }
        }}
        onGeneratePreview={async (values) =>
          fetchAuditPreview({ data: { website: values.website, message: values.message } })
        }
        onViewFullResult={() => {
          setAuditOpen(false);
          navigate({ to: "/thank-you" });
        }}
      />

      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden border-b border-border">
        {/* Clean monochrome backdrop */}
        <div aria-hidden className="absolute inset-0 bg-background" />
        <div aria-hidden className="absolute inset-0 bg-ai-grid opacity-70" />
        <div aria-hidden className="pointer-events-none absolute top-20 right-[8%] h-72 w-72 rounded-full bg-foreground/[0.06] blur-3xl animate-ai-pulse" />
        <div aria-hidden className="pointer-events-none absolute bottom-10 left-[10%] h-56 w-56 rounded-full bg-foreground/[0.04] blur-3xl animate-ai-pulse" style={{ animationDelay: "1.2s" }} />

        <div className="relative mx-auto max-w-7xl px-6 pt-4 pb-8 md:pt-8 md:pb-14 grid lg:grid-cols-12 gap-8 items-center">
          {/* LEFT — details */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
              <Bot className="h-3.5 w-3.5" /> AI-powered digital marketing services
            </div>
            <h1 className="mt-6 text-4xl sm:text-5xl md:text-6xl font-display leading-[1.02] tracking-tight">
              The <span className="text-gradient-gold">AI-powered</span> growth partner for ambitious modern brands.
            </h1>
            <p className="mt-6 max-w-xl text-sm md:text-base text-muted-foreground leading-relaxed">
              We&apos;re <span className="text-foreground font-semibold">vrseoguru</span> — an AI-powered digital marketing agency. AI agents, predictive media buying, generative creative, AI search (GEO) and intelligent lifecycle — unified into one revenue engine, run by senior strategists.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setAuditOpen(true);
                  track("audit_popup_opened", { source: "hero_cta" });
                }}
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition shadow-gold"
              >
                <Search className="h-4 w-4" /> Free Website Audit
              </button>
              <a
                href="#inquiry"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:border-primary transition"
              >
                <Send className="h-3.5 w-3.5" /> Send Inquiry
              </a>
              <Link to="/services" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:border-primary transition">
                <Play className="h-3.5 w-3.5" /> Our services
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-lg">
              {[["4.2x","Avg client ROAS"],["120+","Campaigns shipped"],["98%","Client retention"]].map(([k,v])=>(
                <div key={v}>
                  <div className="text-2xl md:text-3xl font-display text-gradient-gold">{k}</div>
                  <div className="mt-1 text-xs text-muted-foreground uppercase tracking-widest">{v}</div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary"/> Senior team, no juniors</div>
              <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-primary"/> Onboard in 14 days</div>
              <div className="flex items-center gap-2"><LineChart className="h-4 w-4 text-primary"/> Revenue-first reporting</div>
            </div>
          </div>

          {/* RIGHT — inquiry form */}
          <div id="inquiry" className="lg:col-span-5">
            {submitted ? (
              <div className="rounded-3xl border border-border bg-card shadow-gold p-10 text-center">
                <div className="mx-auto h-14 w-14 rounded-full bg-primary/15 grid place-items-center">
                  <CheckCircle2 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-5 text-2xl font-display">Thanks, {submitted.name}.</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your brief is in. A strategist will reply to <span className="text-foreground font-medium">{submitted.email}</span> within one business day.
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
              className="rounded-3xl border border-border bg-card/95 backdrop-blur shadow-gold p-6 md:p-7 space-y-3"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Start a project</p>
                <h3 className="mt-1 text-2xl font-display">Request a free growth audit</h3>
                <p className="mt-1 text-xs text-muted-foreground">Tell us a bit about your brand — a senior strategist replies in 1 business day.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input name="name" placeholder="Your name" className={`w-full rounded-xl bg-secondary border px-4 py-3 text-sm focus:outline-none focus:border-primary ${errors.name ? "border-red-400" : "border-border"}`} />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>
                <div>
                  <input name="phone" placeholder="Phone (optional)" className="w-full rounded-xl bg-secondary border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input name="email" type="email" placeholder="Email address" className={`w-full rounded-xl bg-secondary border px-4 py-3 text-sm focus:outline-none focus:border-primary ${errors.email ? "border-red-400" : "border-border"}`} />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>
                <div>
                  <input name="company" placeholder="Company / Brand" className="w-full rounded-xl bg-secondary border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div>
                <input name="website" placeholder="Website (optional)" className="w-full rounded-xl bg-secondary border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary" />
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
                    <option>Content Marketing</option>
                    <option>Email & Lifecycle</option>
                    <option>Web & CRO</option>
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
                <select name="timeline" className="w-full rounded-xl bg-secondary border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary">
                  <option value="">When do you want to start?</option>
                  <option>ASAP (within 2 weeks)</option>
                  <option>Within 1 month</option>
                  <option>1–3 months</option>
                  <option>Just exploring</option>
                </select>
              </div>
              <div>
                  <textarea name="message" rows={3} placeholder="Tell us about your goals, current marketing & biggest challenge..." className={`w-full rounded-xl bg-secondary border px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none ${errors.message ? "border-red-400" : "border-border"}`} />
                  {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
              </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full inline-flex justify-center items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-60 shadow-gold"
                >
                  {sending ? "Sending..." : <>Send inquiry <Send className="h-4 w-4" /></>}
                </button>
              <p className="text-[11px] text-muted-foreground text-center">🔒 Your details stay private. No spam, ever.</p>
            </form>
            )}
          </div>
        </div>
      </section>

      {/* ============ CHANNELS I RUN ============ */}
      <section className="border-y border-border bg-card/40">
        <div className="mx-auto max-w-7xl px-6 py-8 md:py-12">
          <p className="text-center text-xs tracking-[0.22em] uppercase text-primary font-semibold mb-6">AI-powered channels we run</p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { Icon: Bot, label: "AI Agents" },
              { Icon: Sparkles, label: "GenAI Creative" },
              { Icon: Target, label: "Predictive Ads" },
              { Icon: Search, label: "AI Search / GEO" },
              { Icon: BarChart3, label: "ML Attribution" },
              { Icon: Mail, label: "AI Lifecycle" },
            ].map(({Icon,label})=>(
              <div key={label} className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-3 py-3 text-sm font-medium text-foreground hover:border-primary hover:text-primary transition">
                <Icon className="h-4 w-4 text-primary"/> {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ AI-POWERED STACK ============ */}
      <section className="relative overflow-hidden border-b border-border bg-background">
        <div aria-hidden className="absolute inset-0 bg-ai-dots opacity-70" />
        <div aria-hidden className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[60%] rounded-full bg-primary/15 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-6 py-8 md:py-12">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Left — copy */}
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground">
                <Sparkles className="h-3.5 w-3.5" /> The AI Core
              </div>
              <h2 className="mt-5 text-3xl md:text-4xl font-display leading-[1.05]">
                Your <span className="text-gradient-gold">growth engine,</span> always on.
              </h2>
              <p className="mt-5 text-muted-foreground leading-relaxed">
                One AI core wired into every channel — bidding, creative, SEO and analytics — so your campaigns improve every hour, not every quarter.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  ["10x", "Faster creative"],
                  ["24/7", "Live optimization"],
                  ["-32%", "Lower CPA"],
                  ["+58%", "More revenue"],
                ].map(([k,v])=>(
                  <div key={v} className="rounded-2xl border border-border bg-card p-4">
                    <div className="text-2xl font-display text-gradient-gold leading-none">{k}</div>
                    <div className="mt-2 text-xs text-muted-foreground">{v}</div>
                  </div>
                ))}
              </div>
              {/* CTAs */}
              <div className="mt-7 flex flex-wrap gap-3">
                <button onClick={() => setAuditOpen(true)} className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-3 text-sm font-semibold hover:opacity-90 transition">
                  Free Website Audit <ArrowRight className="h-4 w-4" />
                </button>
                <Link to="/services" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground hover:border-foreground transition">
                  See how it works
                </Link>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Free 30-min audit · No obligation · Reply within 1 business day.</p>
            </div>

            {/* Right — AI orbit visual */}
            <div className="lg:col-span-7 overflow-hidden">
              <div className="relative aspect-square max-w-[600px] mx-auto scale-[0.78] sm:scale-90 md:scale-100 origin-center">
                {/* Concentric rings */}
                <div aria-hidden className="absolute inset-0 rounded-full border border-foreground/10" />
                <div aria-hidden className="absolute inset-[12%] rounded-full border border-dashed border-foreground/15" />
                <div aria-hidden className="absolute inset-[26%] rounded-full border border-foreground/20" />
                <div aria-hidden className="absolute inset-[40%] rounded-full border border-foreground/25" />

                {/* SVG connection lines from core to each chip */}
                <svg aria-hidden className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
                      <stop offset="50%" stopColor="currentColor" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <g className="text-foreground" stroke="url(#beam)" strokeWidth="0.25" strokeDasharray="0.6 0.6">
                    {[[50,4],[96,50],[50,96],[4,50],[82,18],[18,82],[82,82],[18,18]].map(([x,y],i)=>(
                      <line key={i} x1="50" y1="50" x2={x} y2={y} />
                    ))}
                  </g>
                </svg>

                {/* Rotating tick ring */}
                <div aria-hidden className="absolute inset-[6%] rounded-full" style={{ animation: "ai-orbit 40s linear infinite" }}>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <span
                      key={i}
                      className="absolute left-1/2 top-0 -translate-x-1/2 block h-2 w-px bg-foreground/30"
                      style={{ transform: `rotate(${i * 15}deg) translateY(-1px)`, transformOrigin: "50% 50vh" as never }}
                    />
                  ))}
                </div>

                {/* Center AI core */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-32 w-32 md:h-36 md:w-36 rounded-3xl bg-foreground text-background grid place-items-center shadow-2xl ring-1 ring-foreground/20">
                  <div aria-hidden className="absolute inset-0 rounded-3xl bg-ai-grid opacity-30" />
                  <div aria-hidden className="absolute -inset-3 rounded-[2rem] border border-foreground/10 animate-ai-pulse" />
                  <div className="relative flex flex-col items-center gap-1">
                    <Bot className="h-10 w-10" />
                    <div className="text-[9px] font-semibold uppercase tracking-[0.2em] opacity-80">AI Core</div>
                  </div>
                </div>

                {/* Live status badge above core */}
                <div className="absolute left-1/2 top-[12%] -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full border border-border bg-card/95 backdrop-blur px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-foreground shadow-sm">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-foreground" />
                  </span>
                  Live · 24/7
                </div>

                {/* Orbiting capability chips */}
                {[
                  { Icon: Search,     label: "Semantic SEO",    meta: "+38% CTR",   pos: "top-[2%] left-1/2 -translate-x-1/2" },
                  { Icon: Target,     label: "Predictive bids", meta: "-27% CPA",   pos: "top-1/2 right-[2%] -translate-y-1/2" },
                  { Icon: Megaphone,  label: "GenAI creative",  meta: "10x output", pos: "bottom-[2%] left-1/2 -translate-x-1/2" },
                  { Icon: BarChart3,  label: "Live attribution",meta: "1st-party",  pos: "top-1/2 left-[2%] -translate-y-1/2" },
                  { Icon: MousePointerClick, label: "GEO answers", meta: "AI search", pos: "top-[14%] right-[10%]" },
                  { Icon: Activity,   label: "Anomaly alerts",  meta: "<60s", pos: "bottom-[14%] left-[10%]" },
                  { Icon: Bot,        label: "Auto reports",    meta: "Daily", pos: "top-[14%] left-[10%]" },
                  { Icon: Sparkles,   label: "Creative tests",  meta: "A/B/n", pos: "bottom-[14%] right-[10%]" },
                ].map(({Icon,label,meta,pos},i)=>(
                  <div
                    key={label}
                    className={`absolute ${pos} animate-ai-float`}
                    style={{ animationDelay: `${i * 0.35}s` }}
                  >
                    <div className="inline-flex items-center gap-2 rounded-2xl border border-border bg-card/95 backdrop-blur pl-2 pr-3 py-1.5 text-xs font-medium text-foreground shadow-sm hover:border-foreground hover:-translate-y-0.5 transition">
                      <span className="h-6 w-6 rounded-lg bg-foreground text-background grid place-items-center">
                        <Icon className="h-3 w-3" />
                      </span>
                      <span className="flex flex-col leading-tight">
                        <span>{label}</span>
                        <span className="text-[9px] uppercase tracking-widest text-muted-foreground">{meta}</span>
                      </span>
                    </div>
                  </div>
                ))}

                {/* Floating data points */}
                <div aria-hidden className="absolute top-[30%] right-[36%] h-1.5 w-1.5 rounded-full bg-foreground animate-ai-pulse" />
                <div aria-hidden className="absolute bottom-[30%] left-[36%] h-1.5 w-1.5 rounded-full bg-foreground/60 animate-ai-pulse" style={{ animationDelay: "0.8s" }} />
                <div aria-hidden className="absolute top-[44%] left-[26%] h-1 w-1 rounded-full bg-foreground/50 animate-ai-pulse" style={{ animationDelay: "1.4s" }} />
                <div aria-hidden className="absolute bottom-[42%] right-[28%] h-1 w-1 rounded-full bg-foreground/50 animate-ai-pulse" style={{ animationDelay: "1.8s" }} />
              </div>

              {/* Bottom stat strip */}
              <div className="mt-6 grid grid-cols-3 gap-3 max-w-[600px] mx-auto">
                {[["12k+","Decisions / day"],["<60s","Anomaly response"],["48","Data sources"]].map(([k,v])=>(
                  <div key={v} className="rounded-2xl border border-border bg-card px-4 py-3 text-center">
                    <div className="font-display text-lg text-foreground leading-none">{k}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ============ SERVICES — BENTO ============ */}
      {/* ============ DIGITAL MARKETING SERVICES ============ */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-8 md:py-12">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-6">
            <div className="max-w-2xl">
              <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold">Digital marketing services</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-display leading-[1.05]">Every channel your brand <span className="text-gradient-gold">needs to grow.</span></h2>
              <p className="mt-4 text-muted-foreground">Senior specialists across SEO, paid media, social, content, email and web — all wired into our AI ops layer.</p>
            </div>
            <Link to="/services" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">All services <ArrowRight className="h-4 w-4"/></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { Icon: Search, title: "SEO & GEO", desc: "Technical SEO, topical authority and AI-search optimization to win Google + LLM citations.", bullets: ["Tech audits", "Content clusters", "AI Overviews"] },
              { Icon: Globe, title: "Local SEO Growth", desc: "Win the Google Map Pack and ‘near me’ searches — calls, walk-ins and bookings from high-intent locals.", bullets: ["Map Pack", "GBP optimisation", "Local citations"] },
              { Icon: Target, title: "PPC / Google Ads", desc: "Search, Performance Max, Shopping and YouTube — profit-modeled and ML-bid.", bullets: ["Search & PMax", "Shopping feeds", "Conversion API"] },
              { Icon: Megaphone, title: "Meta & Paid Social", desc: "Facebook, Instagram, TikTok and Pinterest funnels engineered for return on ad spend.", bullets: ["Creative testing", "Retargeting", "UGC & influencers"] },
              { Icon: Linkedin, title: "LinkedIn & B2B", desc: "Account-based campaigns, demand-gen and pipeline programs for B2B SaaS and services.", bullets: ["ABM lists", "Demand gen", "Sales enablement"] },
              { Icon: ShoppingCart, title: "Amazon & Marketplaces", desc: "Sponsored Ads, listing optimization and DSP for brands scaling on Amazon and Flipkart.", bullets: ["Sponsored Ads", "Listing SEO", "Amazon DSP"] },
              { Icon: Share2, title: "Social Media (SMO)", desc: "Organic content calendars, community management and short-form video that compounds reach.", bullets: ["Content calendar", "Community ops", "Reels & Shorts"] },
              { Icon: PenTool, title: "Content Marketing", desc: "SEO-led articles, thought-leadership and lead magnets built to convert, not just rank.", bullets: ["Editorial strategy", "Long-form content", "Lead magnets"] },
              { Icon: Mail, title: "Email & Lifecycle", desc: "Klaviyo, HubSpot and Mailchimp flows that turn one-time buyers into repeat revenue.", bullets: ["Welcome flows", "Win-back", "Segmentation"] },
              { Icon: Youtube, title: "Video & YouTube Ads", desc: "Performance video production plus YouTube media buying for awareness and conversion.", bullets: ["Ad production", "YouTube Ads", "Connected TV"] },
              { Icon: Code2, title: "Web & CRO", desc: "Landing pages, Shopify and Webflow builds — designed and tested to lift conversion.", bullets: ["Landing pages", "A/B testing", "Page speed"] },
              { Icon: BarChart3, title: "Analytics & Tracking", desc: "GA4, server-side tracking, BigQuery and Looker dashboards you can actually trust.", bullets: ["GA4 setup", "Server-side CAPI", "Looker dashboards"] },
              { Icon: Bot, title: "Marketing Automation", desc: "AI agents and workflow automation across CRM, ads and content ops — 24/7.", bullets: ["AI agents", "CRM workflows", "Auto-reporting"] },
            ].map(({ Icon, title, desc, bullets }) => (
              <Link
                key={title}
                to="/services"
                className="group relative rounded-3xl border border-border bg-card p-6 hover:border-foreground transition overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-foreground text-background grid place-items-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-lg">{title}</h3>
                </div>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{desc}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {bullets.map((b) => (
                    <span key={b} className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-[10px] text-muted-foreground">{b}</span>
                  ))}
                </div>
                <div className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-foreground">
                  Learn more <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ INDUSTRIES WE SERVE ============ */}
      <section className="mx-auto max-w-7xl px-6 py-8 md:py-12">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-6">
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold">Industries we serve</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-display leading-[1.05]">AI-powered growth, <span className="text-gradient-gold">tuned to your sector.</span></h2>
            <p className="mt-4 text-muted-foreground">18+ industries shipped — every model, funnel and dashboard adapted to how your buyers actually convert.</p>
          </div>
          <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">Talk to a strategist <ArrowRight className="h-4 w-4"/></Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            { Icon: ShoppingCart, name: "Ecommerce & D2C", note: "Shopify, Amazon, marketplaces" },
            { Icon: Bot, name: "SaaS & B2B", note: "Demand-gen & ABM pipelines" },
            { Icon: LineChart, name: "Fintech", note: "Compliance-aware acquisition" },
            { Icon: ShieldCheck, name: "Healthcare", note: "HIPAA-safe campaigns" },
            { Icon: Globe, name: "Real Estate", note: "Geo-targeted lead funnels" },
            { Icon: Award, name: "Education & EdTech", note: "Enrollment & retention" },
            { Icon: Sparkles, name: "Beauty & Lifestyle", note: "Influencer + UGC engines" },
            { Icon: Rocket, name: "Travel & Hospitality", note: "Seasonal demand modeling" },
            { Icon: Target, name: "Automotive", note: "Local + national hybrid" },
            { Icon: Megaphone, name: "Media & Publishing", note: "Audience growth + retention" },
            { Icon: BarChart3, name: "Manufacturing & B2B", note: "Long-cycle attribution" },
            { Icon: Mail, name: "Professional Services", note: "Authority + lead capture" },
          ].map(({ Icon, name, note }) => (
            <div key={name} className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:border-foreground transition">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-foreground text-background grid place-items-center">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="font-display text-sm text-foreground truncate">{name}</div>
                <div className="text-[11px] text-muted-foreground truncate">{note}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      <section className="mx-auto max-w-7xl px-6 py-8 md:py-12">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold">End-to-end AI workflow</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-display">Plan. Build. Launch. Optimize. Report.</h2>
          <p className="mt-4 text-muted-foreground">A repeatable AI-augmented system that moves from brief to booked revenue — with humans in the loop at every step.</p>
        </div>
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              num: "01", title: "Plan", Icon: Compass,
              desc: "LLM-powered audit of your market, competitors, funnel and account data. Output: a 90-day revenue roadmap.",
              cta: "Book a free audit", href: "/contact",
            },
            {
              num: "02", title: "Build", Icon: Hammer,
              desc: "GenAI creative, GEO-ready content, tracking, dashboards and agent workflows — built and brand-tuned.",
              cta: "See deliverables", href: "/services",
            },
            {
              num: "03", title: "Launch", Icon: Rocket,
              desc: "Multi-channel rollout across Google, Meta, LinkedIn, Amazon and AI search — live in under 14 days.",
              cta: "Start a project", href: "/contact",
            },
            {
              num: "04", title: "Optimize", Icon: FlaskConical,
              desc: "ML bidding, predictive creative rotation and 24/7 anomaly agents tuning campaigns to your real margin.",
              cta: "Our AI stack", href: "/services",
            },
            {
              num: "05", title: "Report", Icon: FileBarChart,
              desc: "Live executive dashboards plus a monthly strategic review from your senior account lead.",
              cta: "View sample report", href: "/blog",
            },
          ].map(({ num, title, desc, Icon, cta, href }) => (
            <div key={num} className="flex flex-col rounded-3xl border border-border bg-card p-6 hover:border-foreground transition">
              <div className="flex items-center justify-between">
                <div className="text-3xl font-display text-foreground/30">{num}</div>
                <div className="h-10 w-10 rounded-xl bg-foreground text-background grid place-items-center">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <h3 className="mt-4 font-display text-lg">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{desc}</p>
              <Link to={href} className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:opacity-70 transition">
                {cta} <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ============ WHO I AM ============ */}
      <section className="relative border-y border-border bg-card/30 overflow-hidden">
        <div aria-hidden className="absolute -top-20 left-1/2 -translate-x-1/2 h-72 w-[60%] rounded-full bg-primary/15 blur-3xl"/>
        <div className="relative mx-auto max-w-5xl px-6 py-8 md:py-12 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-semibold text-foreground">
            <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span></span>
            Accepting Q3 2026 retainers · Headquartered in Mumbai, IN
          </div>
          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-primary font-semibold">About the agency</p>
          <h2 className="mt-4 text-3xl md:text-5xl font-display leading-[1.02]">
            <span className="text-gradient-gold">vrseoguru</span> — an AI-powered<br/>digital marketing services agency.
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-sm md:text-base text-muted-foreground leading-relaxed">
            For over seven years our team has built revenue systems for ecommerce, SaaS and D2C brands across India and abroad — pairing senior strategists and a proprietary AI stack with paid-media, SEO, creative and lifecycle specialists. Every engagement is engineered around your <span className="text-foreground font-semibold">bottom line</span>, not vanity metrics.
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
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
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
                <h3 className="mt-4 text-sm font-display">{title}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3 justify-center">
            <Link to="/about" className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition shadow-gold">
              Meet the agency <ArrowRight className="h-4 w-4"/>
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:border-primary transition">
              Start a project
            </Link>
          </div>
        </div>
      </section>

      {/* ============ RESULTS ============ */}
      <section className="relative border-y border-border bg-gradient-to-br from-primary/10 via-card/30 to-card/30 overflow-hidden">
        <div aria-hidden className="absolute -top-24 left-1/4 h-56 w-56 rounded-full bg-primary/20 blur-3xl"/>
        <div className="relative mx-auto max-w-7xl px-6 py-8 md:py-12">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
            <div>
              <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold">Numbers do the talking</p>
              <h2 className="mt-2 text-2xl md:text-3xl font-display">Impact across 120+ engagements</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { k: "₹84Cr+", v: "Revenue driven", Icon: TrendingUp },
              { k: "4.2x", v: "Average ROAS", Icon: Activity },
              { k: "-47%", v: "Avg CPA reduction", Icon: Target },
              { k: "+240%", v: "Organic traffic", Icon: Search },
            ].map(({k,v,Icon})=>(
              <div key={v} className="rounded-2xl border border-border bg-card p-4 hover:border-primary transition flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/15 border border-primary/30 grid place-items-center shrink-0">
                  <Icon className="h-4 w-4 text-primary"/>
                </div>
                <div className="min-w-0">
                  <div className="text-xl md:text-2xl font-display text-gradient-gold leading-none">{k}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground truncate">{v}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CASE STUDIES ============ */}
      <section className="mx-auto max-w-7xl px-6 py-8 md:py-12">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold">Case studies</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-display leading-[1.05]">Brands we&apos;ve <span className="text-gradient-gold">scaled.</span></h2>
          </div>
          <Link to="/case-studies" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1">View all <ArrowRight className="h-4 w-4"/></Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {caseStudies.slice(0, 3).map((c) => (
            <Link key={c.slug} to="/case-studies/$slug" params={{ slug: c.slug }} className="group flex flex-col rounded-2xl border border-border bg-card p-5 hover:border-foreground transition">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{c.tag}</span>
              <h3 className="mt-2 text-base font-display leading-snug line-clamp-2">{c.title}</h3>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {c.heroStats.slice(0, 3).map((s) => (
                  <div key={s.v} className="rounded-xl border border-border bg-background/40 p-2 text-center">
                    <div className="text-sm font-display text-gradient-gold leading-none">{s.k}</div>
                    <div className="mt-0.5 text-[9px] uppercase tracking-widest text-muted-foreground truncate">{s.v}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-foreground">
                Read case study <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1"/>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ INSIGHTS ============ */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-8 md:py-12">
          <div className="flex items-end justify-between flex-wrap gap-6 mb-6">
            <div>
              <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold">Insights</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-display">Fresh from the blog</h2>
            </div>
            <Link to="/blog" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1">All articles <ArrowRight className="h-4 w-4"/></Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { tag: "SEO", title: "10 SEO Trends That Will Define 2026", desc: "AI search, entity optimization & what brands are doing to stay ahead.", meta: "May 28 · 8 min", img: blogSeoAsset.url },
              { tag: "PPC", title: "Maximize ROI From Google Ads in 2026", desc: "Lower CPA and scale profitable campaigns with AI bidding.", meta: "May 14 · 6 min", img: blogPpcAsset.url },
              { tag: "Content", title: "Content That Actually Converts", desc: "The framework our team uses to build assets that drive real revenue.", meta: "Apr 30 · 7 min", img: blogContentAsset.url },
            ].map(({tag,title,desc,meta,img})=>(
              <article key={title} className="group rounded-3xl border border-border bg-card flex flex-col overflow-hidden hover:border-primary transition">
                <div className="relative aspect-[16/9] border-b border-border overflow-hidden bg-secondary">
                  <img src={img} alt={title} loading="lazy" width={1280} height={720} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />
                  <span className="absolute top-3 left-3 rounded-full bg-background/90 backdrop-blur border border-border px-3 py-0.5 text-[11px] font-semibold text-primary uppercase tracking-widest">{tag}</span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-base font-display leading-snug">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-2">{desc}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">{meta}</p>
                    <Link to="/blog" className="inline-flex items-center gap-1 text-xs font-semibold text-foreground hover:text-primary transition">
                      Read <ArrowRight className="h-3.5 w-3.5"/>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS CAROUSEL ============ */}
      <section className="border-y border-border bg-card/30">
        <div className="mx-auto max-w-7xl px-6 py-8 md:py-12">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold">Receipts</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-display">What clients say</h2>
            <p className="mt-4 text-muted-foreground">Real results from real brands — across SEO, paid media, social and lifecycle.</p>
          </div>
          <Carousel opts={{ align: "start", loop: true }} className="relative">
            <CarouselContent className="-ml-4">
              {[
                { q: "Organic traffic up 240% and qualified leads have never been higher.", n: "Sarah Mitchell", r: "CEO, Northbridge Retail", m: "SEO · 6 months", k: "+240%", kl: "Organic" },
                { q: "PPC cut our CPL in half while doubling lead volume. Reporting is unmatched.", n: "David Chen", r: "Founder, Velocity SaaS", m: "Google Ads · 4 months", k: "-52%", kl: "CPL" },
                { q: "We scaled from a regional player to a national brand. Strategy made the difference.", n: "Maria Lopez", r: "CMO, Harborline Homes", m: "Performance · 9 months", k: "5.8x", kl: "ROAS" },
                { q: "Meta &amp; Google funnels now print revenue. Best marketing hire we&apos;ve made.", n: "Aarav Khanna", r: "Founder, Lumen D2C", m: "Paid Social · 5 months", k: "+312%", kl: "Revenue" },
                { q: "Content + technical SEO finally clicked. We rank #1 on our money keywords.", n: "Priya Raman", r: "Head of Growth, Finovate", m: "SEO · 8 months", k: "#1", kl: "SERP" },
              ].map((t) => (
                <CarouselItem key={t.n} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="h-full rounded-3xl border border-border bg-card p-7 flex flex-col">
                    <div className="flex items-center justify-between">
                      <Quote className="h-6 w-6 text-primary" />
                      <div className="text-right">
                        <div className="text-2xl font-display text-gradient-gold leading-none">{t.k}</div>
                        <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">{t.kl}</div>
                      </div>
                    </div>
                    <p className="mt-5 text-base leading-relaxed flex-1">{`“${t.q.replace(/&amp;/g, "&")}”`}</p>
                    <div className="mt-5 flex items-center gap-1">{Array.from({length:5}).map((_,i)=><Star key={i} className="h-4 w-4 fill-primary text-primary"/>)}</div>
                    <div className="mt-4 pt-4 border-t border-border flex items-center justify-between gap-2">
                      <div>
                        <div className="font-semibold text-sm">{t.n}</div>
                        <div className="text-xs text-muted-foreground">{t.r}</div>
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-primary font-semibold">{t.m}</span>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-3 mt-8">
              <CarouselPrevious className="static translate-y-0 h-10 w-10 border-border bg-card text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary" />
              <CarouselNext className="static translate-y-0 h-10 w-10 border-border bg-card text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="mx-auto max-w-4xl px-6 py-8 md:py-12">
        <div className="text-center mb-6">
          <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold">FAQs</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-display">Common questions</h2>
          <p className="mt-4 text-muted-foreground">Everything you want to know before we kick off your engagement.</p>
        </div>
        <Accordion type="single" collapsible className="space-y-3">
          {[
            { q: "What services does the agency offer?", a: "Full-service digital marketing — SEO & GEO, Google Ads, Meta & LinkedIn paid social, performance creative, lifecycle/email, analytics, and AI-powered automation." },
            { q: "How are engagements priced?", a: "Retainers typically range ₹50k–₹5L/mo depending on scope, channels and ad spend. Every proposal is custom — request a strategy call for a tailored quote." },
            { q: "How fast will we see results?", a: "Paid channels usually show signal within 2–3 weeks. SEO compounds over 3–6 months. We share a 30/60/90-day roadmap before kickoff so expectations are crystal clear." },
            { q: "Do you work with our industry?", a: "We've shipped campaigns across 18+ industries — ecommerce, SaaS, fintech, healthcare, real estate, education, D2C and B2B. If your funnel needs growth, we can help." },
            { q: "Do you handle ad spend management?", a: "Yes. Our paid-media team manages Google, Meta, LinkedIn, Amazon & YouTube ad accounts end-to-end — strategy, creative, bidding, tracking and weekly optimization." },
            { q: "How do you report on performance?", a: "Live Looker Studio dashboards tied to your GA4, ad accounts and CRM — plus a written monthly review with insights, learnings and next bets from your account lead." },
            { q: "Can we cancel anytime?", a: "Yes. Month-to-month retainers with 30-day notice. No long lock-ins, no hidden fees — performance keeps the partnership going." },
          ].map((f,i)=>(
            <AccordionItem key={i} value={`item-${i}`} className="rounded-2xl border border-border bg-card px-5 data-[state=open]:border-primary transition">
              <AccordionTrigger className="text-left text-base font-display hover:no-underline">{f.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="mx-auto max-w-7xl px-6 py-8 md:py-12">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/30 via-card to-card p-12 md:p-20 text-center">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-primary/30 blur-3xl"/>
          <p className="relative text-xs tracking-[0.22em] uppercase text-primary font-semibold">Let&apos;s build</p>
          <h2 className="relative mt-4 text-3xl md:text-5xl font-display leading-[1.02]">Ready to <span className="text-gradient-gold">accelerate</span><br/>your growth?</h2>
          <p className="relative mt-5 max-w-xl mx-auto text-muted-foreground">Book a free, no-obligation strategy call. Our team will audit your marketing and show you the biggest opportunities.</p>
          <div className="relative mt-8 flex flex-wrap gap-3 justify-center">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition shadow-gold">
              Book free strategy call <ArrowRight className="h-4 w-4"/>
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

