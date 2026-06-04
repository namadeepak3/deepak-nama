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

export type CoreArea = { title: string; desc: string; icon: string };

export const CORE_AREAS: Record<string, CoreArea[]> = {
  seo: [
    { title: "On-Page SEO", desc: "Title tags, meta, headings, internal links, schema and content optimisation per URL.", icon: "Search" },
    { title: "Off-Page SEO", desc: "Authority building through digital PR, niche edits and ethical link acquisition.", icon: "Share2" },
    { title: "Technical SEO", desc: "Core Web Vitals, crawl, indexation, JS rendering, sitemaps and site architecture.", icon: "Code2" },
    { title: "Local SEO", desc: "Google Business Profile, local citations, reviews and geo-targeted landing pages.", icon: "Globe" },
    { title: "AIO — AI Optimisation", desc: "Optimising content for ChatGPT, Perplexity and AI Overviews with entity-first structure.", icon: "Bot" },
    { title: "GEO — Generative Engine Optimisation", desc: "Citations, structured data and brand entity work to surface in generative answers.", icon: "Sparkles" },
  ],
  "performance-marketing": [
    { title: "Paid Search", desc: "Google & Bing search campaigns tuned for blended CAC and incrementality.", icon: "Search" },
    { title: "Paid Social", desc: "Meta, TikTok, LinkedIn and X — creative-led testing frameworks.", icon: "Share2" },
    { title: "Programmatic & Display", desc: "Awareness and retargeting via DV360, StackAdapt and native networks.", icon: "Megaphone" },
    { title: "Creative Strategy", desc: "Hook-led ad creative, UGC briefs and rapid iteration loops.", icon: "Sparkles" },
    { title: "Tracking & Attribution", desc: "GA4, server-side GTM, CAPI and MMM-lite for clean signal.", icon: "BarChart3" },
    { title: "Landing Page CRO", desc: "Dedicated LPs and offer testing to lift conversion rate of paid traffic.", icon: "Target" },
  ],
  ppc: [
    { title: "Search Ads", desc: "Intent-led keyword strategy, SKAGs vs. broad+smart bidding, negative hygiene.", icon: "Search" },
    { title: "Shopping & PMax", desc: "Feed optimisation, asset groups, search-term sculpting and PMax steering.", icon: "TrendingUp" },
    { title: "YouTube Ads", desc: "Demand-gen, in-stream and Shorts campaigns with creative testing.", icon: "Megaphone" },
    { title: "Remarketing", desc: "Audience segmentation, RLSA and dynamic remarketing across the funnel.", icon: "Users" },
    { title: "Conversion Tracking", desc: "Enhanced conversions, offline imports and value-based bidding setup.", icon: "BarChart3" },
    { title: "Bid & Budget Mgmt", desc: "Portfolio bid strategies, pacing and geo/device modifier tuning.", icon: "Zap" },
  ],
  smo: [
    { title: "Content Strategy", desc: "Pillar/cluster planning per platform with hook libraries.", icon: "Sparkles" },
    { title: "Short-Form Video", desc: "Reels, Shorts and TikTok production briefs and editing direction.", icon: "Megaphone" },
    { title: "Community Mgmt", desc: "Replies, DMs and engagement loops to build owned audience.", icon: "Users" },
    { title: "Influencer & UGC", desc: "Sourcing, briefs and whitelisting for paid amplification.", icon: "Share2" },
    { title: "Analytics & Listening", desc: "Reach, saves, watch-time and share-of-voice reporting.", icon: "BarChart3" },
    { title: "LinkedIn Growth", desc: "Founder-led thought leadership systems for B2B pipeline.", icon: "TrendingUp" },
  ],
  "ai-automation": [
    { title: "Workflow Automation", desc: "n8n, Make and Zapier flows connecting CRM, ads and ops tools.", icon: "Zap" },
    { title: "AI Agents", desc: "Custom GPTs and agents for research, outreach and reporting.", icon: "Bot" },
    { title: "RAG & Knowledge Bases", desc: "Vector-backed assistants over your docs, tickets and product data.", icon: "Sparkles" },
    { title: "Lead Enrichment", desc: "Auto-enrichment, scoring and routing into your CRM.", icon: "Users" },
    { title: "Reporting Automation", desc: "Self-updating dashboards and AI-generated weekly summaries.", icon: "BarChart3" },
    { title: "Content Ops", desc: "AI-assisted briefs, drafts and QA pipelines with human review.", icon: "Rocket" },
  ],
  "cro-analytics": [
    { title: "GA4 & Tracking", desc: "Clean event taxonomy, server-side GTM and consent mode v2.", icon: "BarChart3" },
    { title: "Heatmaps & Session Replay", desc: "Hotjar/Clarity analysis to surface UX friction.", icon: "Search" },
    { title: "A/B Testing", desc: "Hypothesis-led experiments with sequential testing rigour.", icon: "Target" },
    { title: "Funnel Audits", desc: "End-to-end funnel teardowns from ad to activation.", icon: "TrendingUp" },
    { title: "Personalisation", desc: "Audience-based landing variants and on-site messaging.", icon: "Users" },
    { title: "Dashboards", desc: "Looker Studio + warehouse-backed reporting that ties to revenue.", icon: "Sparkles" },
  ],
  "email-marketing": [
    { title: "Lifecycle Flows", desc: "Welcome, abandoned cart, post-purchase and winback automations.", icon: "Zap" },
    { title: "Campaigns & Calendar", desc: "Weekly campaign planning, copy and design direction.", icon: "Mail" },
    { title: "Segmentation", desc: "RFM, behavioural and predictive segments for relevance at scale.", icon: "Users" },
    { title: "Deliverability", desc: "SPF/DKIM/DMARC, warm-up and reputation monitoring.", icon: "Target" },
    { title: "SMS & Push", desc: "Cross-channel orchestration with Klaviyo / Customer.io.", icon: "Megaphone" },
    { title: "A/B Testing", desc: "Subject lines, creative and offer testing with statistical rigour.", icon: "BarChart3" },
  ],
  "web-development": [
    { title: "Marketing Sites", desc: "Fast, SEO-ready sites in Next.js, Astro or Webflow.", icon: "Globe" },
    { title: "Landing Pages", desc: "Conversion-focused LPs wired to your ad and analytics stack.", icon: "Rocket" },
    { title: "Headless CMS", desc: "Sanity, Contentful or Payload for content-team velocity.", icon: "Code2" },
    { title: "Performance & Core Web Vitals", desc: "LCP/INP/CLS engineering for SEO and UX.", icon: "Zap" },
    { title: "A11y & SEO Engineering", desc: "Semantic HTML, schema, sitemaps and accessibility baked in.", icon: "Search" },
    { title: "Integrations", desc: "CRM, analytics, payments and AI features wired in cleanly.", icon: "Sparkles" },
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
  };
}