import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Sparkles, ShieldCheck, Zap, LineChart, Send, CheckCircle2, TrendingUp, Award, Star, Quote, Phone, Bot, Search, Megaphone, Target, BarChart3, Globe, Rocket, Activity, Play, MousePointerClick, Mail, Compass, Hammer, FlaskConical, FileBarChart, PenTool, Share2, Code2, ShoppingCart, Youtube, Linkedin, MessageCircle, Smartphone, Database, Brain, Cpu, GitBranch, Layers, Workflow, Eye, Lightbulb } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useServerFn } from "@tanstack/react-start";
import { createLead } from "@/lib/leads.functions";
import { generateAuditPreview, type AuditPreview } from "@/lib/audit-preview.functions";
import { listCaseStudies } from "@/lib/case-studies.functions";
import { listPublishedPosts } from "@/lib/blog.functions";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
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

// ============ DIGITAL MARKETING SERVICES — TABBED SHOWCASE ============
function ServicesShowcase() {
  const TABS = [
    {
      key: "search",
      label: "SEO",
      Icon: Search,
      accent: "bg-amber-200",
      eyebrow: "Technical • Content • GEO",
      title: "Own every search — Google and AI Overviews.",
      desc: "Technical SEO, topical authority and answer-engine optimisation that compounds organic revenue. We win featured snippets and LLM citations across ChatGPT, Gemini and Perplexity.",
      bullets: [
        "Tech audits, content clusters & internal linking",
        "Programmatic SEO & topical authority maps",
        "GEO — get cited in ChatGPT, Gemini & Perplexity",
      ],
      metric: { primary: "+312%", primaryLabel: "Organic traffic", a: "Tracked queries", aVal: "12.4k", b: "AI citations", bVal: "284" },
    },
    {
      key: "local",
      label: "Local SEO",
      Icon: Compass,
      accent: "bg-lime-200",
      eyebrow: "GBP • Map Pack • Citations",
      title: "Dominate the Map Pack in every city you serve.",
      desc: "Google Business Profile optimisation, location pages, review velocity and citation building that put you in the top-3 local pack for high-intent searches.",
      bullets: [
        "GBP optimisation + weekly posts and Q&A",
        "Location landing pages at scale",
        "Review generation & reputation flywheel",
      ],
      metric: { primary: "Top 3", primaryLabel: "Map Pack rank", a: "GBP calls", aVal: "+184%", b: "Locations", bVal: "42" },
    },
    {
      key: "performance",
      label: "Performance Marketing",
      Icon: TrendingUp,
      accent: "bg-orange-200",
      eyebrow: "Full-funnel • Attribution • Profit",
      title: "Full-funnel performance modeled on real margin.",
      desc: "Cross-channel performance marketing instrumented with server-side CAPI, MMM and incrementality tests — every rupee tied to contribution profit, not vanity ROAS.",
      bullets: [
        "Server-side CAPI & GA4 attribution",
        "Media mix modelling + incrementality",
        "Profit-first dashboards in Looker",
      ],
      metric: { primary: "4.2x", primaryLabel: "Blended ROAS", a: "CPA reduced", aVal: "−41%", b: "Channels live", bVal: "8" },
    },
    {
      key: "paid",
      label: "Pay-Per-Click",
      Icon: Target,
      accent: "bg-rose-200",
      eyebrow: "Google • Meta • LinkedIn • Amazon",
      title: "PPC engineered for pipeline, not impressions.",
      desc: "ML-bid Search, PMax, Shopping, Meta, LinkedIn ABM and Amazon DSP — built around offline conversions and contribution margin.",
      bullets: [
        "Search, PMax, Shopping & YouTube — profit-modeled",
        "Meta + TikTok creative testing on UGC engines",
        "LinkedIn ABM and Amazon Sponsored / DSP",
      ],
      metric: { primary: "−52%", primaryLabel: "Cost per lead", a: "ROAS", aVal: "5.8x", b: "Channels", bVal: "8" },
    },
    {
      key: "social",
      label: "SMO",
      Icon: Share2,
      accent: "bg-violet-200",
      eyebrow: "Reels • UGC • Community • YouTube",
      title: "Social media optimisation that scales reach.",
      desc: "Brand-trained creative pods generate Reels, Shorts and UGC variants at velocity — paired with community management and influencer programs that compound organic reach.",
      bullets: [
        "Content calendars & short-form video at scale",
        "Influencer + UGC sourcing, briefing and rights",
        "Performance video & YouTube media buying",
      ],
      metric: { primary: "9.1M", primaryLabel: "Monthly reach", a: "Reels shipped", aVal: "180/mo", b: "Engagement", bVal: "+62%" },
    },
    {
      key: "ai",
      label: "AI Automation",
      Icon: Bot,
      accent: "bg-emerald-200",
      eyebrow: "Agents • n8n • Zapier • LLMs",
      title: "AI agents that run your marketing ops 24/7.",
      desc: "Custom GPT-class agents wired across CRM, ads, content and support — automating research, briefs, reporting, lead routing and lifecycle messaging on n8n and Zapier.",
      bullets: [
        "AI sales & support agents on WhatsApp + web",
        "n8n / Zapier workflows across your stack",
        "Auto research, briefs and weekly reports",
      ],
      metric: { primary: "24/7", primaryLabel: "Always-on agents", a: "Hours saved", aVal: "180/mo", b: "Workflows", bVal: "62" },
    },
    {
      key: "web",
      label: "Web Design & Dev",
      Icon: Code2,
      accent: "bg-sky-200",
      eyebrow: "Websites • Shopify • Webflow • CRO",
      title: "Fast, conversion-built websites — designed to rank.",
      desc: "Custom websites, Shopify and Webflow builds engineered for Core Web Vitals, SEO and conversion — with built-in A/B testing and analytics from day one.",
      bullets: [
        "Custom websites, Shopify & Webflow builds",
        "Core Web Vitals, SEO & accessibility baked in",
        "Landing pages with built-in A/B testing",
      ],
      metric: { primary: "98", primaryLabel: "PageSpeed score", a: "CRO lift", aVal: "+28%", b: "Builds live", bVal: "120+" },
    },
  ];

  const [active, setActive] = useState(TABS[0].key);
  const current = TABS.find((t) => t.key === active) ?? TABS[0];
  const CurrentIcon = current.Icon;

  return (
    <section className="bg-gradient-to-b from-background via-card/50 to-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold">Digital marketing services</p>
          <h2 className="mt-3 text-3xl md:text-5xl font-display leading-[1.05]">
            Every channel your brand <span className="text-gradient-gold">needs to grow.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Pick a discipline. See what we ship, the proof and the agents behind it — orchestrated under one AI ops layer.
          </p>
        </div>

        {/* Tab rail */}
        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 border-b border-border pb-1">
          {TABS.map(({ key, label, Icon }) => {
            const isActive = key === active;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActive(key)}
                className={`relative inline-flex items-center gap-2 px-3 sm:px-5 py-3 text-sm font-semibold transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
                {isActive && (
                  <span className="absolute left-2 right-2 -bottom-1 h-[3px] rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active panel */}
        <div className="mt-8 grid lg:grid-cols-2 gap-6">
          {/* Left — copy */}
          <div className="rounded-3xl bg-card border border-border p-8 md:p-10">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-primary font-semibold">
              <CurrentIcon className="h-4 w-4" /> {current.eyebrow}
            </div>
            <h3 className="mt-4 text-2xl md:text-3xl font-display leading-tight">{current.title}</h3>
            <p className="mt-4 text-muted-foreground leading-relaxed">{current.desc}</p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/services"
                className="btn-fx inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-gold"
              >
                Start free trial <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                to="/services"
                className="btn-fx inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:border-primary"
              >
                Learn more
              </Link>
            </div>

            <ul className="mt-7 space-y-3">
              {current.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-foreground/80">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — showcase card */}
          <div className={`relative rounded-3xl ${current.accent} p-6 md:p-10 overflow-hidden min-h-[420px] flex items-center justify-center`}>
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.6),transparent_60%)]" />
            {/* Mock dashboard */}
            <div className="relative w-full max-w-md">
              <div className="rounded-2xl bg-white shadow-xl border border-black/5 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-semibold">{current.label} performance</p>
                    <p className="mt-1 text-3xl font-display text-gray-900">{current.metric.primary}</p>
                    <p className="text-xs text-gray-500">{current.metric.primaryLabel} · last 30 days</p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary grid place-items-center">
                    <CurrentIcon className="h-5 w-5" />
                  </div>
                </div>
                {/* Bar chart */}
                <div className="mt-5 grid grid-cols-12 items-end gap-1 h-24">
                  {[40, 55, 35, 70, 50, 80, 60, 90, 72, 95, 85, 100].map((h, i) => (
                    <div key={i} className="rounded-t bg-gradient-to-t from-primary/30 to-primary" style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                    <p className="text-[10px] uppercase tracking-widest text-gray-500">{current.metric.a}</p>
                    <p className="mt-1 text-lg font-display text-gray-900">{current.metric.aVal}</p>
                  </div>
                  <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
                    <p className="text-[10px] uppercase tracking-widest text-gray-500">{current.metric.b}</p>
                    <p className="mt-1 text-lg font-display text-gray-900">{current.metric.bVal}</p>
                  </div>
                </div>
              </div>

              {/* Floating mini-card */}
              <div className="absolute -bottom-4 -right-2 hidden sm:block w-56 rounded-2xl bg-white shadow-xl border border-black/5 p-4 rotate-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <p className="text-[11px] font-semibold text-gray-700">AI agent live</p>
                </div>
                <p className="mt-2 text-xs text-gray-600 leading-snug">
                  Optimising {current.label.toLowerCase()} every 15 min. Next action queued.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


function Home() {
  const navigate = useNavigate();
  const submitLead = useServerFn(createLead);
  const fetchAuditPreview = useServerFn(generateAuditPreview);
  const fetchCases = useServerFn(listCaseStudies);
  const { data: caseStudies = [] } = useQuery({ queryKey: ["case-studies", "home"], queryFn: () => fetchCases() });
  const fetchPosts = useServerFn(listPublishedPosts);
  const { data: blogPosts = [] } = useQuery({ queryKey: ["blog-posts", "home"], queryFn: () => fetchPosts() });
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<null | { name: string; email: string }>(null);
  const [auditOpen, setAuditOpen] = useState(false);
  const [openStep, setOpenStep] = useState<string>("1");
  const [waName, setWaName] = useState("");
  const [waPhone, setWaPhone] = useState("");
  const [waChannel, setWaChannel] = useState<"whatsapp" | "sms">("whatsapp");
  const [waMessage, setWaMessage] = useState("");

  const BUSINESS_WHATSAPP = "919999999999"; // E.164 without +
  const BUSINESS_SMS = "+919999999999";

  const launchWhatsApp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = waName.trim();
    const phone = waPhone.trim();
    const msg = waMessage.trim();
    if (!name || !phone || !msg) {
      toast.error("Please fill name, phone and message");
      return;
    }
    track("lead_submit", { source: `${waChannel}_form` });
    // Route to CRM/inbox with timestamp + source
    submitLead({
      data: {
        name,
        email: `noreply+${waChannel}@vrseoguru.lead`,
        phone,
        service: `${waChannel}_form`,
        budget: "",
        message: `[${waChannel} • ${new Date().toISOString()}]\n${msg}`,
        kind: "inquiry",
        pageUrl: typeof window !== "undefined" ? window.location.href : "",
        referrer: typeof document !== "undefined" ? document.referrer : "",
        utmSource: `${waChannel}_form`,
        utmMedium: waChannel,
        utmCampaign: "homepage_widget",
      },
    }).catch(() => { /* non-blocking */ });
    const body = `Hi vrseoguru — I'm ${name} (${phone}). ${msg}`;
    const encoded = encodeURIComponent(body);
    const url = waChannel === "whatsapp"
      ? `https://wa.me/${BUSINESS_WHATSAPP}?text=${encoded}`
      : `sms:${BUSINESS_SMS}?&body=${encoded}`;
    window.open(url, "_blank");
    toast.success(`Opening ${waChannel === "whatsapp" ? "WhatsApp" : "SMS"}…`);
  };

  const PROCESS_STEPS = [
    { n: "1", Icon: LineChart, title: "Analyze Business Landscape", desc: "AI audits market, competitors and your data signals.",
      details: "We ingest GA4, GSC, CRM and competitor data. AI agents identify positioning gaps, demand signals and revenue leaks.",
      examples: ["50-point SEO + UX audit", "Competitor share-of-search", "ICP & jobs-to-be-done synthesis"] },
    { n: "2", Icon: Lightbulb, title: "Build Smart Strategies", desc: "Agent-generated channel mix, hypotheses and roadmap.",
      details: "GPT-class models propose channel mix, KPIs and a 90-day roadmap. Senior strategists approve before launch.",
      examples: ["Channel mix model", "Quarterly OKRs & KPIs", "Budget pacing plan"] },
    { n: "3", Icon: PenTool, title: "Create Compelling Content", desc: "GenAI creative, copy and assets — at brand and at scale.",
      details: "Brand-trained models produce on-message copy, statics, motion and UGC briefs — reviewed by editors.",
      examples: ["SEO articles & landing pages", "Ad creative + variants", "Short-form video scripts"] },
    { n: "4", Icon: Brain, title: "Derive Meaningful Insights", desc: "Live attribution, anomaly alerts and predictive next steps.",
      details: "Warehouse-grade attribution with anomaly detection. AI summarises wins, losses and the next best action — daily.",
      examples: ["GA4 + server-side CAPI", "Daily Slack digests", "Predictive LTV & churn"] },
    { n: "5", Icon: Award, title: "Enrich Customer Experiences", desc: "Personalised journeys, lifecycle and CX automation.",
      details: "Lifecycle automations across WhatsApp, SMS, email and on-site — personalised by AI segments.",
      examples: ["WhatsApp & SMS journeys", "On-site personalisation", "Win-back & loyalty flows"] },
  ];

  const AI_TOOLS = [
    { name: "ChatGPT", sub: "OpenAI", slug: "openai", color: "10A37F" },
    { name: "Claude", sub: "Anthropic", slug: "anthropic", color: "D97757" },
    { name: "Gemini", sub: "Google", slug: "googlegemini", color: "8E75B2" },
    { name: "Perplexity", sub: "Answer engine", slug: "perplexity", color: "20808D" },
    { name: "Midjourney", sub: "Image", slug: "midjourney", color: "000000" },
    { name: "Runway", sub: "Video", slug: "runway", color: "000000" },
    { name: "ElevenLabs", sub: "Voice", slug: "elevenlabs", color: "000000" },
    { name: "n8n", sub: "Agents", slug: "n8n", color: "EA4B71" },
    { name: "LangChain", sub: "Orchestration", slug: "langchain", color: "1C3C3C" },
    { name: "Zapier", sub: "Automation", slug: "zapier", color: "FF4F00" },
    { name: "Cursor", sub: "Dev agent", slug: "cursor", color: "000000" },
    { name: "HuggingFace", sub: "Models", slug: "huggingface", color: "FFD21E" },
  ];

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
      track("lead_submit", { source: "homepage_inquiry_form", service: result.data.service });
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
      <section className="relative overflow-hidden">
        {/* Clean monochrome backdrop */}
        <div aria-hidden className="absolute inset-0 bg-background" />
        <div aria-hidden className="absolute inset-0 bg-ai-grid opacity-70" />
        <div aria-hidden className="pointer-events-none absolute top-20 right-[8%] h-72 w-72 rounded-full bg-foreground/[0.06] blur-3xl animate-ai-pulse" />
        <div aria-hidden className="pointer-events-none absolute bottom-10 left-[10%] h-56 w-56 rounded-full bg-foreground/[0.04] blur-3xl animate-ai-pulse" style={{ animationDelay: "1.2s" }} />

        <div className="relative mx-auto max-w-7xl overflow-x-clip px-4 sm:px-6 pt-4 pb-8 md:pt-8 md:pb-14 grid lg:grid-cols-12 gap-8 items-center">
          {/* LEFT — details */}
          <div className="lg:col-span-7">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] text-primary">
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
                className="btn-fx group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-gold"
              >
                <Search className="h-4 w-4" /> Free Website Audit
              </button>
              <a
                href="#inquiry"
                className="btn-fx inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:border-primary"
              >
                <Send className="h-3.5 w-3.5" /> Send Inquiry
              </a>
              <Link to="/services" className="btn-fx inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:border-primary">
                <Play className="h-3.5 w-3.5" /> Our services
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-6 max-w-lg">
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
            <div id="inquiry" className="min-w-0 lg:col-span-5">
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
              className="rounded-3xl border border-border bg-card/95 backdrop-blur shadow-gold p-4 sm:p-6 md:p-7 space-y-3"
            >
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">Start a project</p>
                <h3 className="mt-1 text-2xl font-display">Request a free growth audit</h3>
                <p className="mt-1 text-xs text-muted-foreground">Tell us a bit about your brand — a senior strategist replies in 1 business day.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input name="name" placeholder="Your name" className={`w-full rounded-xl bg-secondary border px-4 py-3 text-sm focus:outline-none focus:border-primary ${errors.name ? "border-red-400" : "border-border"}`} />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>
                <div>
                  <input name="phone" placeholder="Phone (optional)" className="w-full rounded-xl bg-secondary border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <select name="service" className={`w-full rounded-xl bg-secondary border px-4 py-3 text-sm focus:outline-none focus:border-primary ${errors.service ? "border-red-400" : "border-border"}`}>
                    <option value="">Service</option>
                    <option>SEO</option>
                    <option>Performance Marketing</option>
                    <option>PPC</option>
                    <option>Social Media (SMO)</option>
                    <option>AI Automation</option>
                    <option>Content Marketing</option>
                    <option>WhatsApp & SMS Marketing</option>
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
                  className="btn-fx w-full inline-flex justify-center items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60 shadow-gold"
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
      <section className="bg-gradient-to-b from-background via-card/60 to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 md:py-12 overflow-x-clip">
          <p className="text-center text-xs tracking-[0.22em] uppercase text-primary font-semibold mb-6">AI-powered channels we run</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { Icon: Bot, label: "AI Agents" },
              { Icon: Sparkles, label: "GenAI Creative" },
              { Icon: Target, label: "Predictive Ads" },
              { Icon: Search, label: "AI Search / GEO" },
              { Icon: BarChart3, label: "ML Attribution" },
              { Icon: Mail, label: "AI Lifecycle" },
            ].map(({Icon,label})=>(
              <div key={label} className="btn-fx min-w-0 flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-3 py-3 text-center text-xs sm:text-sm font-medium text-foreground hover:border-primary hover:text-primary transition">
                <Icon className="h-4 w-4 text-primary"/> {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ AI-POWERED STACK ============ */}
      <section className="relative overflow-hidden bg-background bg-ai-signal">
        <div aria-hidden className="absolute inset-0 bg-ai-dots opacity-70" />
        <div aria-hidden className="absolute -top-24 left-1/2 -translate-x-1/2 h-72 w-[60%] rounded-full bg-primary/15 blur-3xl" />
        <div className="relative mx-auto max-w-7xl overflow-x-clip px-4 sm:px-6 py-8 md:py-12">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Left — copy */}
            <div className="lg:col-span-5">
              <h2 className="text-3xl md:text-4xl font-display leading-[1.05]">
                Your <span className="text-gradient-gold">growth engine,</span> always on.
              </h2>
              <p className="mt-5 text-muted-foreground leading-relaxed">
                One AI core wired into every channel — bidding, creative, SEO and analytics — so your campaigns improve every hour, not every quarter.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-2 sm:gap-3">
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
              <div className="mt-7 flex flex-col sm:flex-row sm:flex-wrap gap-3">
                <button onClick={() => setAuditOpen(true)} className="btn-fx inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-3 text-sm font-semibold hover:opacity-90">
                  Free Website Audit <ArrowRight className="h-4 w-4" />
                </button>
                <Link to="/services" className="btn-fx inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground hover:border-foreground">
                  See how it works
                </Link>
              </div>
            </div>

            {/* Right — AI orbit visual */}
            <div className="min-w-0 lg:col-span-7 overflow-hidden">
              <div className="relative aspect-square max-w-[600px] w-full mx-auto scale-[0.68] sm:scale-90 md:scale-100 origin-center">
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
                    <div className="text-[9px] font-semibold uppercase tracking-[0.2em] opacity-80">AI</div>
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
                    <div className="inline-flex max-w-[120px] sm:max-w-none items-center gap-2 rounded-2xl border border-border bg-card/95 backdrop-blur pl-2 pr-2 sm:pr-3 py-1.5 text-[10px] sm:text-xs font-medium text-foreground shadow-sm hover:border-foreground hover:-translate-y-0.5 transition">
                      <span className="h-6 w-6 rounded-lg bg-foreground text-background grid place-items-center">
                        <Icon className="h-3 w-3" />
                      </span>
                      <span className="flex min-w-0 flex-col leading-tight">
                        <span className="truncate">{label}</span>
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
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-[600px] mx-auto">
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

      <ServicesShowcase />

      {/* ============ MARKETING PLATFORMS ============ */}
      <section className="relative overflow-hidden bg-background">
        <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-[60%] rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-24">
          <div className="mt-12">
            <div className="text-center">
              <p className="text-[11px] uppercase tracking-[0.22em] text-primary font-bold">Marketing Platforms</p>
              <h3 className="mt-2 text-2xl md:text-3xl font-display">The stack <span className="text-gradient-gold">we orchestrate</span></h3>
            </div>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {[
                  { name: "Google Analytics", slug: "googleanalytics", color: "E37400" },
                  { name: "Search Console", slug: "googlesearchconsole", color: "458CF5" },
                  { name: "Google Ads", slug: "googleads", color: "4285F4" },
                  { name: "Bing", slug: "microsoftbing", color: "008373" },
                  { name: "Meta Ads", slug: "meta", color: "0467DF" },
                  { name: "Instagram", slug: "instagram", color: "E4405F" },
                  { name: "LinkedIn Ads", slug: "linkedin", color: "0A66C2" },
                  { name: "YouTube", slug: "youtube", color: "FF0000" },
                  { name: "Semrush", slug: "semrush", color: "FF642D" },
                  { name: "Ahrefs", slug: "ahrefs", color: "0F66E9" },
                  { name: "Canva", slug: "canva", color: "00C4CC" },
                  { name: "Hootsuite", slug: "hootsuite", color: "143059" },
                  { name: "Mailchimp", slug: "mailchimp", color: "FFE01B" },
                  { name: "HubSpot", slug: "hubspot", color: "FF7A59" },
                  { name: "Shopify", slug: "shopify", color: "7AB55C" },
                  { name: "WordPress", slug: "wordpress", color: "21759B" },
                ].map((t) => (
                  <a
                    key={t.name}
                    href={`https://www.google.com/search?q=${encodeURIComponent(t.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => track("tools_carousel_click", { tool: t.name, kind: "marketing" })}
                    className="group rounded-2xl border border-border bg-gradient-to-b from-card to-card/60 p-4 flex flex-col items-center gap-2 hover:border-primary hover:-translate-y-1 hover:shadow-gold transition-all"
                  >
                    <div className="h-14 w-14 rounded-2xl bg-white border border-border grid place-items-center shrink-0 group-hover:scale-110 transition-transform shadow-sm">
                      <img
                        src={`https://cdn.simpleicons.org/${t.slug}/${t.color}`}
                        alt={t.name}
                        loading="lazy"
                        className="h-8 w-8 object-contain"
                      />
                    </div>
                    <span className="font-display text-sm font-semibold leading-tight text-center">{t.name}</span>
                  </a>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ WHATSAPP & SMS LEAD FORM ============ */}
      <section className="relative overflow-hidden bg-background">
        <div aria-hidden className="pointer-events-none absolute -top-24 left-[-10%] h-80 w-80 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 py-16 md:py-24">
          <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-card via-primary/5 to-card p-8 md:p-12 shadow-gold">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold inline-flex items-center gap-2">
                  <MessageCircle className="h-3.5 w-3.5" /> Instant lead routing
                </p>
                <h2 className="mt-3 text-3xl md:text-4xl font-display leading-[1.05]">
                  Talk on <span className="text-gradient-gold">WhatsApp</span> or SMS — now.
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Skip the inbox. Send a message and a senior strategist will reply within minutes during business hours.
                </p>
                <ul className="mt-5 space-y-2 text-sm">
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /> Average reply in &lt; 15 min</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /> Free 20-min growth call</li>
                  <li className="flex gap-2"><CheckCircle2 className="h-4 w-4 text-primary mt-0.5" /> 100% confidential</li>
                </ul>
              </div>

              <form onSubmit={launchWhatsApp} className="rounded-2xl border border-border bg-background/80 p-5 space-y-3">
                <div className="inline-flex rounded-full border border-border bg-card p-1 text-xs font-semibold">
                  <button type="button" onClick={() => setWaChannel("whatsapp")} className={`px-3 py-1.5 rounded-full inline-flex items-center gap-1 ${waChannel === "whatsapp" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                    <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                  </button>
                  <button type="button" onClick={() => setWaChannel("sms")} className={`px-3 py-1.5 rounded-full inline-flex items-center gap-1 ${waChannel === "sms" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                    <Smartphone className="h-3.5 w-3.5" /> SMS
                  </button>
                </div>
                <input
                  value={waName}
                  onChange={(e) => setWaName(e.target.value)}
                  placeholder="Your name"
                  maxLength={80}
                  className="w-full h-10 rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-primary"
                />
                <input
                  value={waPhone}
                  onChange={(e) => setWaPhone(e.target.value)}
                  placeholder="Phone (with country code)"
                  maxLength={20}
                  className="w-full h-10 rounded-md border border-border bg-card px-3 text-sm outline-none focus:border-primary"
                />
                <textarea
                  value={waMessage}
                  onChange={(e) => setWaMessage(e.target.value)}
                  placeholder="What do you need help with?"
                  maxLength={500}
                  rows={3}
                  className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary resize-none"
                />
                <button type="submit" className="btn-fx w-full h-11 rounded-md bg-primary text-primary-foreground font-semibold inline-flex items-center justify-center gap-2 shadow-gold">
                  {waChannel === "whatsapp" ? <><MessageCircle className="h-4 w-4" /> Send on WhatsApp</> : <><Smartphone className="h-4 w-4" /> Send via SMS</>}
                </button>
                <p className="text-[10px] text-muted-foreground text-center">Opens your {waChannel === "whatsapp" ? "WhatsApp" : "SMS"} app with your message pre-filled.</p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* ============ AI-POWERED PROCESS ============ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-ai-grid opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold inline-flex items-center gap-2 justify-center">
              <Workflow className="h-3.5 w-3.5" /> Our AI agentic process
            </p>
            <h2 className="mt-3 text-3xl md:text-5xl font-display leading-[1.05]">
              Our <span className="text-gradient-gold">Digital Marketing Process</span>
            </h2>
            <div className="mt-3 mx-auto h-1 w-16 rounded bg-primary" />
            <p className="mt-4 text-muted-foreground">
              Click any step to expand details and examples — autonomous agents working alongside senior marketers.
            </p>
          </div>

          {/* Expandable step rail */}
          <div className="mt-12 grid md:grid-cols-5 gap-3">
            {PROCESS_STEPS.map(({ n, Icon, title }) => {
              const active = openStep === n;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => { setOpenStep(n); track("process_step_click", { step: n, title }); }}
                  className={`btn-fx group flex md:flex-col items-center gap-3 md:gap-2 rounded-2xl border p-3 md:p-4 text-left md:text-center transition-all ${active ? "border-primary bg-primary/10 shadow-gold" : "border-border bg-card hover:border-primary/60"}`}
                >
                  <div className={`relative h-12 w-12 md:h-14 md:w-14 rounded-full grid place-items-center shrink-0 ${active ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary border border-primary/30"}`}>
                    <Icon className="h-5 w-5 md:h-6 md:w-6" />
                    <span className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold grid place-items-center">{n}</span>
                  </div>
                  <div className="font-display text-sm font-semibold leading-tight">{title}</div>
                </button>
              );
            })}
          </div>

          {/* Expanded panel */}
          {PROCESS_STEPS.filter((s) => s.n === openStep).map((s) => (
            <div key={s.n} className="mt-6 rounded-3xl border border-primary/30 bg-card/80 backdrop-blur p-6 md:p-10 animate-fade-in">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary font-semibold">
                    <s.Icon className="h-4 w-4" /> Step {s.n}
                  </div>
                  <h3 className="mt-2 text-2xl md:text-3xl font-display">{s.title}</h3>
                  <p className="mt-3 text-muted-foreground">{s.details}</p>
                </div>
                <ul className="space-y-2">
                  {s.examples.map((ex) => (
                    <li key={ex} className="flex items-start gap-2 rounded-xl border border-border bg-background/60 px-3 py-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ WHO I AM ============ */}
      <section className="relative bg-gradient-to-b from-background via-card/50 to-background overflow-hidden">
        <div aria-hidden className="absolute -top-20 left-1/2 -translate-x-1/2 h-72 w-[60%] rounded-full bg-primary/15 blur-3xl"/>
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 py-8 md:py-12 text-center">
          <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[10px] sm:text-[11px] font-semibold text-foreground">
            <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span></span>
            Headquartered in Mumbai, IN
          </div>
          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-primary font-semibold">About the agency</p>
          <h2 className="mt-4 text-3xl md:text-5xl font-display leading-[1.02]">
            <span className="text-gradient-gold">vrseoguru</span> — an AI-powered <br className="hidden sm:block"/>digital marketing services agency.
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
            <Link to="/about" className="btn-fx inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 shadow-gold">
              Meet the agency <ArrowRight className="h-4 w-4"/>
            </Link>
            <Link to="/contact" className="btn-fx inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground hover:border-primary">
              Start a project
            </Link>
          </div>
        </div>
      </section>

      {/* ============ INDUSTRIES WE SERVE ============ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 md:py-12 overflow-x-clip">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold">Industries we serve</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-display leading-[1.05]">AI-powered growth, <span className="text-gradient-gold">tuned to your sector.</span></h2>
          <p className="mt-4 text-muted-foreground">18+ industries shipped — every model, funnel and dashboard adapted to how your buyers actually convert.</p>
          <Link to="/contact" className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">Talk to a strategist <ArrowRight className="h-4 w-4"/></Link>
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
            <div key={name} className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 hover:border-primary hover:shadow-gold transition">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-primary/10 text-primary border border-primary/30 grid place-items-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="font-display text-sm text-foreground break-words leading-tight">{name}</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground break-words leading-snug">{note}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============ OUR AI + MARKETING STACK ============ */}
      <section className="relative overflow-hidden bg-background">
        <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-[60%] rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold inline-flex items-center gap-2 justify-center">
              <Cpu className="h-3.5 w-3.5" /> Our AI + Marketing Stack
            </p>
            <h2 className="mt-3 text-3xl md:text-5xl font-display leading-[1.05]">
              Tools <span className="text-gradient-gold">We Use</span>
            </h2>
            <div className="mt-3 mx-auto h-1 w-16 rounded bg-primary" />
            <p className="mt-4 text-muted-foreground">
              Frontier AI models and best-in-class marketing platforms — orchestrated by custom agents.
            </p>
          </div>

          <div className="mt-10">
            <p className="text-center text-[11px] uppercase tracking-[0.22em] text-muted-foreground font-semibold">AI Models & Agents</p>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {AI_TOOLS.map((t) => (
                <a
                  key={t.name}
                  href={`https://www.google.com/search?q=${encodeURIComponent(t.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => track("tools_carousel_click", { tool: t.name, kind: "ai" })}
                  className="group rounded-2xl border border-border bg-card/80 backdrop-blur p-4 text-center hover:border-primary hover:-translate-y-1 hover:shadow-gold transition-all"
                >
                  <div className="mx-auto h-14 w-14 rounded-2xl bg-white border border-border grid place-items-center group-hover:scale-110 transition-transform shadow-sm">
                    <img
                      src={`https://cdn.simpleicons.org/${t.slug}/${t.color}`}
                      alt={t.name}
                      loading="lazy"
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                  <div className="mt-3 font-display text-sm font-semibold">{t.name}</div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{t.sub}</div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ PROCESS ============ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 md:py-12">
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

      {/* ============ RESULTS ============ */}
      <section className="relative bg-gradient-to-br from-primary/10 via-card/30 to-background overflow-hidden">
        <div aria-hidden className="absolute -top-24 left-1/4 h-56 w-56 rounded-full bg-primary/20 blur-3xl"/>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-8 md:py-12">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold">Numbers do the talking</p>
            <h2 className="mt-2 text-2xl md:text-3xl font-display">Impact across 120+ engagements</h2>
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
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 md:py-12">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold">Case studies</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-display leading-[1.05]">Brands we&apos;ve <span className="text-gradient-gold">scaled.</span></h2>
          <Link to="/case-studies" className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">View all <ArrowRight className="h-4 w-4"/></Link>
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
      <section className="bg-gradient-to-b from-background via-card/50 to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 md:py-12">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold">Insights</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-display">Fresh from the blog</h2>
            <p className="mt-3 text-sm text-muted-foreground">The latest playbooks, frameworks and field notes from our team.</p>
            <Link to="/blog" className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline">All articles <ArrowRight className="h-4 w-4"/></Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {(blogPosts.length > 0
              ? blogPosts.slice(0, 3).map((p) => {
                  const fallbackImgs = [blogSeoAsset.url, blogPpcAsset.url, blogContentAsset.url];
                  return {
                    slug: p.slug,
                    tag: (p.category || (p.tags && p.tags[0]) || "Article") as string,
                    title: p.title,
                    desc: p.excerpt || "",
                    img: p.coverImage || fallbackImgs[0],
                    meta: `${p.publishedAt ? new Date(p.publishedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : ""}${p.readingMinutes ? ` · ${p.readingMinutes} min` : ""}`,
                  };
                })
              : [
                  { slug: "", tag: "SEO", title: "10 SEO Trends That Will Define 2026", desc: "AI search, entity optimization & what brands are doing to stay ahead.", meta: "May 28 · 8 min", img: blogSeoAsset.url },
                  { slug: "", tag: "PPC", title: "Maximize ROI From Google Ads in 2026", desc: "Lower CPA and scale profitable campaigns with AI bidding.", meta: "May 14 · 6 min", img: blogPpcAsset.url },
                  { slug: "", tag: "Content", title: "Content That Actually Converts", desc: "The framework our team uses to build assets that drive real revenue.", meta: "Apr 30 · 7 min", img: blogContentAsset.url },
                ]
            ).map(({ slug, tag, title, desc, meta, img }) => {
              const CardInner = (
                <>
                  <div className="relative aspect-[16/9] border-b border-border overflow-hidden bg-secondary">
                    {img && <img src={img} alt={title} loading="lazy" width={1280} height={720} className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />}
                    <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-card/90 via-card/20 to-transparent" />
                    <span className="absolute top-3 left-3 rounded-full bg-background/90 backdrop-blur border border-border px-3 py-0.5 text-[11px] font-semibold text-primary uppercase tracking-widest">{tag}</span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-base font-display leading-snug line-clamp-2">{title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-2">{desc}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">{meta}</p>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                        Read <ArrowRight className="h-3.5 w-3.5"/>
                      </span>
                    </div>
                  </div>
                </>
              );
              return slug ? (
                <Link key={slug || title} to="/blog/$slug" params={{ slug }} className="group rounded-3xl border border-border bg-card flex flex-col overflow-hidden hover:border-primary transition">
                  {CardInner}
                </Link>
              ) : (
                <Link key={title} to="/blog" className="group rounded-3xl border border-border bg-card flex flex-col overflow-hidden hover:border-primary transition">
                  {CardInner}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS CAROUSEL ============ */}
      <section className="bg-gradient-to-b from-background via-card/50 to-background w-full overflow-hidden">
        <div className="py-12 md:py-16">
          <div className="text-center max-w-2xl mx-auto mb-10 px-4">
            <p className="text-xs tracking-[0.22em] uppercase text-primary font-semibold">Receipts</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-display font-semibold">What our customers say</h2>
            <p className="mt-3 text-muted-foreground">Real results from real brands — across SEO, paid media, social and lifecycle.</p>
          </div>
          {(() => {
            const TESTIMONIALS = [
              { q: "Organic traffic up 240% and qualified leads have never been higher. The technical SEO playbook is the real deal.", n: "Sarah Mitchell", r: "CEO at Northbridge Retail", initials: "SM", color: "bg-amber-300" },
              { q: "PPC cut our CPL in half while doubling lead volume. Reporting is unmatched — every rupee tied to pipeline.", n: "David Chen", r: "Founder at Velocity SaaS", initials: "DC", color: "bg-rose-300" },
              { q: "We scaled from a regional player to a national brand. Strategy and execution made the difference.", n: "Maria Lopez", r: "CMO at Harborline Homes", initials: "ML", color: "bg-emerald-300" },
              { q: "Meta and Google funnels now print revenue. Best marketing hire we've made this year.", n: "Aarav Khanna", r: "Founder at Lumen D2C", initials: "AK", color: "bg-violet-300" },
              { q: "Content and technical SEO finally clicked. We rank #1 on every one of our money keywords.", n: "Priya Raman", r: "Head of Growth at Finovate", initials: "PR", color: "bg-sky-300" },
              { q: "The AI agents handle reporting and lead routing 24/7. It feels like we hired a 10-person ops team.", n: "Thomas Smith", r: "Digital Marketing Specialist", initials: "TS", color: "bg-orange-300" },
              { q: "Local SEO put us in the Map Pack across 30+ cities. Calls from Google jumped almost overnight.", n: "Neal Schaffer", r: "Marketing Director at LocalCo", initials: "NS", color: "bg-lime-300" },
              { q: "The new website looks beautiful and converts. Page speed and SEO baked-in from day one.", n: "Gareth O'Sullivan", r: "Content Manager at Creatify", initials: "GO", color: "bg-pink-300" },
              { q: "Lifecycle on WhatsApp and email lifted repeat revenue by 38%. The journeys are surgical.", n: "Abbie D", r: "Senior Engineer at Laywers", initials: "AD", color: "bg-cyan-300" },
              { q: "Easily the most transparent agency I've worked with. Weekly insights, no fluff, all numbers.", n: "Dennis Lewis", r: "Advisor at Image Protect", initials: "DL", color: "bg-fuchsia-300" },
            ];
            const row1 = TESTIMONIALS.slice(0, 5);
            const row2 = TESTIMONIALS.slice(5);
            const Card = (t: typeof TESTIMONIALS[number]) => (
              <div className="shrink-0 w-[320px] md:w-[380px] rounded-2xl bg-card border border-border p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full ${t.color} grid place-items-center text-neutral-900 font-semibold text-sm`}>{t.initials}</div>
                  <div>
                    <div className="font-semibold text-sm text-foreground">{t.n}</div>
                    <div className="text-xs text-muted-foreground">{t.r}</div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-foreground/80 leading-relaxed">{t.q}</p>
              </div>
            );
            return (
              <div className="space-y-5">
                <div className="relative">
                  <div className="flex gap-5 marquee-track">
                    {[...row1, ...row1].map((t, i) => <div key={`a-${i}`}>{Card(t)}</div>)}
                  </div>
                </div>
                <div className="relative">
                  <div className="flex gap-5 marquee-track-reverse">
                    {[...row2, ...row2].map((t, i) => <div key={`b-${i}`}>{Card(t)}</div>)}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
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

