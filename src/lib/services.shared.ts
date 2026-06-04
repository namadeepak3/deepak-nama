import {
  Search,
  BarChart3,
  Share2,
  Megaphone,
  Bot,
  TrendingUp,
  Mail,
  Code2,
  Sparkles,
  Zap,
  Globe,
  Rocket,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";

export type Tier = {
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  features: string[];
  highlighted?: boolean;
};

export type ProcessStep = { step: string; detail: string };
export type FAQ = { q: string; a: string };

export type Service = {
  id: string;
  slug: string;
  title: string;
  tag: string;
  icon: string;
  shortDesc: string;
  intro: string;
  aiAngle: string;
  deliverables: string[];
  process: ProcessStep[];
  faqs: FAQ[];
  tiers: Tier[];
  sortOrder: number;
  viewCount: number;
};

export const ICON_MAP: Record<string, LucideIcon> = {
  Search,
  ChartColumn: BarChart3,
  BarChart3,
  Share2,
  Megaphone,
  Bot,
  TrendingUp,
  Mail,
  Code2,
  Sparkles,
  Zap,
  Globe,
  Rocket,
  Target,
  Users,
};

export const ICON_OPTIONS = Object.keys(ICON_MAP);

export function iconFor(name: string): LucideIcon {
  return ICON_MAP[name] ?? Sparkles;
}

export type CoreArea = {
  title: string;
  desc: string;
  icon: string;
  bullets: string[];
  outcome: string;
};

export const CORE_AREAS: Record<string, CoreArea[]> = {
  seo: [
    {
      title: "On-Page SEO",
      desc: "Per-URL optimisation that turns published pages into ranking, click-worthy assets.",
      icon: "Search",
      bullets: [
        "Keyword mapping & search-intent matching",
        "Title, meta, H1–H3 and internal link rewrites",
        "Schema (Article, FAQ, Product, HowTo)",
        "Content gap analysis vs. top 10 SERPs",
      ],
      outcome: "Higher CTR and rankings on existing pages without new content.",
    },
    {
      title: "Off-Page SEO",
      desc: "Authority building through ethical, editorial link acquisition and digital PR.",
      icon: "Share2",
      bullets: [
        "Digital PR & data-led link campaigns",
        "Niche edits and guest placements",
        "HARO / Qwoted expert quotes",
        "Toxic backlink audits & disavow",
      ],
      outcome: "Domain authority that compounds month over month.",
    },
    {
      title: "Technical SEO",
      desc: "Make sure Google can crawl, render and index every URL that matters.",
      icon: "Code2",
      bullets: [
        "Core Web Vitals (LCP / INP / CLS)",
        "Crawl budget, robots.txt, XML sitemaps",
        "JS rendering & hydration audits",
        "Site architecture & canonical strategy",
      ],
      outcome: "Clean foundation so content & links actually rank.",
    },
    {
      title: "Local SEO",
      desc: "Dominate the Map Pack and geo-modified queries in every city you serve.",
      icon: "Globe",
      bullets: [
        "Google Business Profile optimisation",
        "Local citations & NAP consistency",
        "Review generation & response systems",
        "City / service landing-page templates",
      ],
      outcome: "Phone calls and direction requests from high-intent locals.",
    },
    {
      title: "AIO — AI Optimisation",
      desc: "Structure content so ChatGPT, Perplexity and AI Overviews quote you, not your competitors.",
      icon: "Bot",
      bullets: [
        "Entity-first content modelling",
        "Answer-engine formatting (Q&A, lists, tables)",
        "llms.txt and AI-bot access policy",
        "AI Overview visibility tracking",
      ],
      outcome: "Brand mentions inside AI answers, not just blue links.",
    },
    {
      title: "GEO — Generative Engine Optimisation",
      desc: "Engineer your brand into the citations generative engines rely on.",
      icon: "Sparkles",
      bullets: [
        "Citation & mention strategy across the web",
        "Schema + Knowledge Graph entity work",
        "Comparative and listicle placements",
        "Prompt-coverage gap analysis",
      ],
      outcome: "Cited as the source in generative answers.",
    },
  ],
  "performance-marketing": [
    {
      title: "Paid Search",
      desc: "Capture high-intent demand on Google & Bing at a profitable blended CAC.",
      icon: "Search",
      bullets: ["Account restructure & keyword strategy", "Smart bidding with value signals", "Negative keyword hygiene", "Geo, device & dayparting tuning"],
      outcome: "More qualified leads at a lower cost per acquisition.",
    },
    {
      title: "Paid Social",
      desc: "Creative-led testing on Meta, TikTok, LinkedIn and X to generate demand.",
      icon: "Share2",
      bullets: ["Creative testing frameworks", "Audience & lookalike strategy", "CAPI & server-side events", "Incrementality lift testing"],
      outcome: "Predictable pipeline from social-first creative.",
    },
    {
      title: "Programmatic & Display",
      desc: "Top-of-funnel awareness and retargeting via DV360, StackAdapt and native.",
      icon: "Megaphone",
      bullets: ["Audience & inventory planning", "Contextual & 1P-data targeting", "Frequency capping & brand-safety", "Cross-channel retargeting"],
      outcome: "Awareness that measurably feeds your bottom-of-funnel.",
    },
    {
      title: "Creative Strategy",
      desc: "Hook-led ad concepts, UGC briefs and rapid iteration loops.",
      icon: "Sparkles",
      bullets: ["Weekly hook & angle production", "UGC creator briefs & sourcing", "Static + motion ad variants", "Winning-ad teardowns"],
      outcome: "A pipeline of fresh ads — never creative fatigue.",
    },
    {
      title: "Tracking & Attribution",
      desc: "Clean signal in, clean decisions out — across every channel.",
      icon: "BarChart3",
      bullets: ["GA4 + server-side GTM", "Meta / TikTok CAPI", "Offline & CRM conversion imports", "MMM-lite & marketing-mix views"],
      outcome: "Confidence in what's actually driving revenue.",
    },
    {
      title: "Landing Page CRO",
      desc: "Dedicated LPs and offer testing to lift conversion rate of paid traffic.",
      icon: "Target",
      bullets: ["Offer + message-market fit testing", "Modular LP component library", "A/B tests with statistical rigour", "Mobile-first performance"],
      outcome: "Same spend, materially more conversions.",
    },
  ],
  ppc: [
    {
      title: "Search Ads",
      desc: "Intent-led keyword strategy and modern bid management on Google & Bing.",
      icon: "Search",
      bullets: ["Theme-based ad groups & RSAs", "Smart bidding with value layering", "Search-term sculpting", "Aggressive negative hygiene"],
      outcome: "Lower CPL with higher lead quality.",
    },
    {
      title: "Shopping & PMax",
      desc: "Get the most out of Performance Max and Shopping for ecommerce.",
      icon: "TrendingUp",
      bullets: ["Feed optimisation & merchant rules", "Asset groups by margin tier", "Search-term & brand exclusions", "PMax steering with scripts"],
      outcome: "Better ROAS without losing scale.",
    },
    {
      title: "YouTube Ads",
      desc: "Demand-gen, in-stream and Shorts campaigns built around strong creative.",
      icon: "Megaphone",
      bullets: ["Creative briefs & shotlists", "Audience & affinity targeting", "View-through measurement", "Sequential storytelling"],
      outcome: "Brand-building that also drives measurable conversions.",
    },
    {
      title: "Remarketing",
      desc: "Bring back warm audiences with the right message at the right time.",
      icon: "Users",
      bullets: ["RLSA & customer match", "Dynamic remarketing feeds", "Funnel-stage segmentation", "Frequency & recency rules"],
      outcome: "Higher repeat conversion at a fraction of new-user CPA.",
    },
    {
      title: "Conversion Tracking",
      desc: "Set up enhanced, value-based and offline conversions correctly.",
      icon: "BarChart3",
      bullets: ["Enhanced conversions setup", "Offline conversion imports", "Value-based bidding signals", "Consent Mode v2"],
      outcome: "Bidding algorithms optimise toward real revenue.",
    },
    {
      title: "Bid & Budget Mgmt",
      desc: "Portfolio bid strategies, pacing and modifier tuning across the account.",
      icon: "Zap",
      bullets: ["Portfolio strategies & tROAS / tCPA", "Daily pacing & spend alerts", "Geo & device modifiers", "Seasonality adjustments"],
      outcome: "Spend stays efficient, even at scale.",
    },
  ],
  smo: [
    {
      title: "Content Strategy",
      desc: "Pillar/cluster planning per platform with a hook & angle library.",
      icon: "Sparkles",
      bullets: ["Platform-specific pillars", "Monthly content calendars", "Hook & angle libraries", "Creator collab planning"],
      outcome: "A consistent, on-brand publishing engine.",
    },
    {
      title: "Short-Form Video",
      desc: "Reels, Shorts and TikTok production briefs and editing direction.",
      icon: "Megaphone",
      bullets: ["Hook-first scripting", "Edit briefs & b-roll lists", "Captioning & on-screen text", "Trending audio strategy"],
      outcome: "Watch-time that compounds into followers.",
    },
    {
      title: "Community Mgmt",
      desc: "Replies, DMs and engagement loops that build an owned audience.",
      icon: "Users",
      bullets: ["Reply & DM SLAs", "Engagement playbooks", "Crisis & escalation flows", "Sentiment monitoring"],
      outcome: "An audience that actually feels heard.",
    },
    {
      title: "Influencer & UGC",
      desc: "Source, brief and whitelist creators for paid amplification.",
      icon: "Share2",
      bullets: ["Creator sourcing & vetting", "Briefs & usage rights", "Whitelisting / Spark Ads", "Performance-based deals"],
      outcome: "Authentic creative that scales as paid ads.",
    },
    {
      title: "Analytics & Listening",
      desc: "Track what actually matters: reach, saves, watch-time and SOV.",
      icon: "BarChart3",
      bullets: ["Cross-platform dashboards", "Share-of-voice tracking", "Competitor benchmarks", "Monthly insight reports"],
      outcome: "Data-backed creative decisions, not vibes.",
    },
    {
      title: "LinkedIn Growth",
      desc: "Founder-led thought leadership systems for B2B pipeline.",
      icon: "TrendingUp",
      bullets: ["Founder voice & angle ghostwriting", "Comment & DM playbooks", "Document & carousel posts", "Lead-magnet funnels"],
      outcome: "Inbound demos from the people who already know you.",
    },
  ],
  "ai-automation": [
    {
      title: "Workflow Automation",
      desc: "n8n, Make and Zapier flows that connect your CRM, ads and ops tools.",
      icon: "Zap",
      bullets: ["Cross-tool data sync", "Slack / email alerting", "Error monitoring & retries", "Version-controlled flows"],
      outcome: "Hours of manual work removed every week.",
    },
    {
      title: "AI Agents",
      desc: "Custom GPTs and agents for research, outreach and reporting.",
      icon: "Bot",
      bullets: ["Custom GPT / Assistant build", "Tool-using agents (web, CRM, calendar)", "Guardrails & evaluation", "Cost & latency monitoring"],
      outcome: "Always-on virtual teammates for repeatable tasks.",
    },
    {
      title: "RAG & Knowledge Bases",
      desc: "Vector-backed assistants over your docs, tickets and product data.",
      icon: "Sparkles",
      bullets: ["Document ingestion pipelines", "Embeddings & vector DB setup", "Citations & answer grounding", "Continuous re-indexing"],
      outcome: "Instant answers from your own knowledge.",
    },
    {
      title: "Lead Enrichment",
      desc: "Auto-enrich, score and route inbound leads into your CRM.",
      icon: "Users",
      bullets: ["Firmographic & technographic enrichment", "AI lead scoring", "Round-robin routing", "Slack notifications for hot leads"],
      outcome: "Sales talks to the right lead first.",
    },
    {
      title: "Reporting Automation",
      desc: "Self-updating dashboards and AI-generated weekly summaries.",
      icon: "BarChart3",
      bullets: ["Looker Studio / Sheets dashboards", "Weekly AI executive summaries", "Anomaly detection alerts", "Stakeholder-ready PDFs"],
      outcome: "Stop building reports manually — ever.",
    },
    {
      title: "Content Ops",
      desc: "AI-assisted briefs, drafts and QA pipelines with human review.",
      icon: "Rocket",
      bullets: ["Brief generation from briefs", "Draft + edit loops with humans", "Brand-voice tuning", "Plagiarism / AI-detection checks"],
      outcome: "More content, same team, no quality drop.",
    },
  ],
  "cro-analytics": [
    {
      title: "GA4 & Tracking",
      desc: "Clean event taxonomy, server-side GTM and consent mode v2.",
      icon: "BarChart3",
      bullets: ["Event & parameter spec", "Server-side GTM (sGTM)", "Consent Mode v2", "Cross-domain & subdomain tracking"],
      outcome: "Numbers you can actually trust.",
    },
    {
      title: "Heatmaps & Session Replay",
      desc: "Hotjar / Clarity analysis to surface UX friction.",
      icon: "Search",
      bullets: ["Click & scroll heatmaps", "Funnel drop-off replays", "Rage-click detection", "Qualitative insight reports"],
      outcome: "See exactly where users get stuck.",
    },
    {
      title: "A/B Testing",
      desc: "Hypothesis-led experiments with statistical rigour.",
      icon: "Target",
      bullets: ["Test prioritisation (ICE / PIE)", "Sequential / Bayesian analysis", "Server-side & client-side tests", "Win-rate & uplift tracking"],
      outcome: "Compounding conversion-rate gains.",
    },
    {
      title: "Funnel Audits",
      desc: "End-to-end funnel teardowns from ad to activation.",
      icon: "TrendingUp",
      bullets: ["Stage-by-stage conversion analysis", "Friction & leakage scoring", "Quick-win backlog", "90-day roadmap"],
      outcome: "A prioritised plan to fix what's leaking.",
    },
    {
      title: "Personalisation",
      desc: "Audience-based landing variants and on-site messaging.",
      icon: "Users",
      bullets: ["Geo, source & UTM-based variants", "Returning-visitor messaging", "Account-based personalisation", "Onsite recommendations"],
      outcome: "The right message for every segment.",
    },
    {
      title: "Dashboards",
      desc: "Looker Studio + warehouse-backed reporting tied to revenue.",
      icon: "Sparkles",
      bullets: ["BigQuery / warehouse modelling", "Channel-mix dashboards", "Cohort & LTV views", "Exec-level scorecards"],
      outcome: "One source of truth for the whole team.",
    },
  ],
  "email-marketing": [
    {
      title: "Lifecycle Flows",
      desc: "Welcome, abandoned cart, post-purchase and winback automations.",
      icon: "Zap",
      bullets: ["Welcome / onboarding series", "Browse & cart abandonment", "Post-purchase & cross-sell", "Winback & churn flows"],
      outcome: "Revenue on autopilot from existing traffic.",
    },
    {
      title: "Campaigns & Calendar",
      desc: "Weekly campaign planning, copy and design direction.",
      icon: "Mail",
      bullets: ["Quarterly promo calendar", "Copy + design briefs", "Modular email templates", "QA & send checklists"],
      outcome: "Consistent campaigns, no last-minute scramble.",
    },
    {
      title: "Segmentation",
      desc: "RFM, behavioural and predictive segments for relevance at scale.",
      icon: "Users",
      bullets: ["RFM & engagement tiers", "Behavioural triggers", "Predictive churn / LTV models", "Dynamic content blocks"],
      outcome: "Every subscriber gets the right message.",
    },
    {
      title: "Deliverability",
      desc: "SPF / DKIM / DMARC, warm-up and reputation monitoring.",
      icon: "Target",
      bullets: ["DNS auth setup (SPF/DKIM/DMARC)", "IP / domain warm-up", "Inbox-placement testing", "List-hygiene workflows"],
      outcome: "Land in the inbox, not Promotions.",
    },
    {
      title: "SMS & Push",
      desc: "Cross-channel orchestration with Klaviyo / Customer.io.",
      icon: "Megaphone",
      bullets: ["SMS consent & compliance", "Cross-channel journeys", "Push notification setup", "Smart send-time optimisation"],
      outcome: "Reach customers where they actually read.",
    },
    {
      title: "A/B Testing",
      desc: "Subject lines, creative and offer testing with statistical rigour.",
      icon: "BarChart3",
      bullets: ["Subject & preview tests", "Creative & layout tests", "Offer & send-time tests", "Holdouts for incrementality"],
      outcome: "Compounding lifts across every send.",
    },
  ],
  "web-development": [
    {
      title: "Marketing Sites",
      desc: "Fast, SEO-ready sites in Next.js, Astro or Webflow.",
      icon: "Globe",
      bullets: ["Design-system implementation", "CMS-driven pages", "SEO & schema baked in", "Edge / SSR rendering"],
      outcome: "A site that ranks, converts and scales.",
    },
    {
      title: "Landing Pages",
      desc: "Conversion-focused LPs wired to your ad and analytics stack.",
      icon: "Rocket",
      bullets: ["Modular LP framework", "A/B test infrastructure", "Form & lead-routing logic", "Pixel & CAPI wiring"],
      outcome: "Ship new offers in days, not weeks.",
    },
    {
      title: "Headless CMS",
      desc: "Sanity, Contentful or Payload for content-team velocity.",
      icon: "Code2",
      bullets: ["Content modelling & roles", "Preview & draft workflows", "Localisation support", "Editor onboarding & docs"],
      outcome: "Marketing ships content without devs in the loop.",
    },
    {
      title: "Performance & Core Web Vitals",
      desc: "LCP / INP / CLS engineering for SEO and UX.",
      icon: "Zap",
      bullets: ["Image & font optimisation", "Code-splitting & lazy loading", "Edge caching strategy", "Real-user monitoring"],
      outcome: "Sub-second loads on real devices.",
    },
    {
      title: "A11y & SEO Engineering",
      desc: "Semantic HTML, schema, sitemaps and accessibility baked in.",
      icon: "Search",
      bullets: ["WCAG 2.2 AA compliance", "Schema & structured data", "Sitemaps & canonicals", "Crawl-friendly routing"],
      outcome: "Indexable, accessible — by default.",
    },
    {
      title: "Integrations",
      desc: "CRM, analytics, payments and AI features wired in cleanly.",
      icon: "Sparkles",
      bullets: ["HubSpot / Salesforce / Pipedrive", "Stripe & subscription billing", "GA4 & sGTM", "AI / chat features"],
      outcome: "One stack, no duct tape.",
    },
  ],
};

export function coreAreasFor(slug: string): CoreArea[] {
  return CORE_AREAS[slug] ?? [];
}

export type ServiceRow = {
  id: string;
  slug: string;
  title: string;
  tag: string;
  icon: string;
  short_desc: string;
  intro: string;
  ai_angle: string;
  deliverables: unknown;
  process: unknown;
  faqs: unknown;
  tiers: unknown;
  sort_order: number;
  view_count?: number | null;
};

export function mapRow(row: ServiceRow): Service {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    tag: row.tag,
    icon: row.icon,
    shortDesc: row.short_desc,
    intro: row.intro,
    aiAngle: row.ai_angle,
    deliverables: (row.deliverables as string[]) ?? [],
    process: (row.process as ProcessStep[]) ?? [],
    faqs: (row.faqs as FAQ[]) ?? [],
    tiers: (row.tiers as Tier[]) ?? [],
    sortOrder: row.sort_order,
    viewCount: row.view_count ?? 0,
  };
}