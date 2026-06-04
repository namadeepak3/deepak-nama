import { Search, BarChart3, Share2, Megaphone, Bot, TrendingUp, Mail, Code2, type LucideIcon } from "lucide-react";

export type Tier = {
  name: string;
  price: string;
  cadence: string;
  blurb: string;
  features: string[];
  highlighted?: boolean;
};

export type Service = {
  slug: string;
  title: string;
  tag: string;
  icon: LucideIcon;
  shortDesc: string;
  intro: string;
  aiAngle: string;
  deliverables: string[];
  process: { step: string; detail: string }[];
  faqs: { q: string; a: string }[];
  tiers: Tier[];
};

const standardTiers = (base: number, area: string): Tier[] => [
  {
    name: "Starter",
    price: `$${base}`,
    cadence: "/ month",
    blurb: `Lean ${area} for small teams shipping fast.`,
    features: [
      "1 strategy call / month",
      "Async Slack support",
      "AI-assisted reporting dashboard",
      "Monthly performance review",
    ],
  },
  {
    name: "Growth",
    price: `$${base * 2}`,
    cadence: "/ month",
    blurb: `Full-stack ${area} with weekly iteration.`,
    features: [
      "Weekly strategy & review calls",
      "Custom AI workflows for your stack",
      "Creative / content production",
      "A/B testing roadmap",
      "Quarterly business review",
    ],
    highlighted: true,
  },
  {
    name: "Scale",
    price: "Custom",
    cadence: "retainer",
    blurb: `Enterprise-grade ${area} with dedicated capacity.`,
    features: [
      "Dedicated hours each week",
      "Multi-channel orchestration",
      "Custom GPTs & automations",
      "Executive reporting",
      "Quarterly roadmap planning",
    ],
  },
];

export const services: Service[] = [
  {
    slug: "seo",
    title: "Search Engine Optimization",
    tag: "SEO",
    icon: Search,
    shortDesc: "Rank for the queries that move revenue — powered by AI topical maps.",
    intro:
      "Modern SEO is no longer a content treadmill — it is a system of topical authority, technical excellence, and intent-mapped pages that compound over months. I architect that system end-to-end and let AI handle the heavy lifting so your team ships faster than the competition can react.",
    aiAngle:
      "AI agents map your topical universe, cluster keywords by intent, draft long-form briefs that match SERP expectations, and flag content decay before it costs you rankings. You stay in control; the bots remove the busywork.",
    deliverables: [
      "Technical audit covering Core Web Vitals, crawl budget, schema and indexation",
      "AI-generated keyword universe with topical clusters and intent mapping",
      "Editorial calendar with briefs ready for writers or in-house teams",
      "Internal-linking blueprint and authority-routing strategy",
      "Programmatic SEO templates for high-volume page types",
      "Monthly ranking, traffic and pipeline reports",
    ],
    process: [
      { step: "Discover", detail: "Crawl your site, benchmark competitors and define winnable territory." },
      { step: "Architect", detail: "Build the topical map, page-type taxonomy and technical roadmap." },
      { step: "Produce", detail: "Ship briefs, on-page changes and schema with weekly velocity." },
      { step: "Compound", detail: "Refresh decaying pages, expand winners and earn links." },
    ],
    faqs: [
      { q: "How long until I see results?", a: "Most clients see early movement in 6–8 weeks and meaningful traffic compounding by month 4–6, depending on domain authority and competition." },
      { q: "Do you build links?", a: "Yes — through digital PR, partnerships and link-worthy assets. No PBNs, no spammy outreach, ever." },
      { q: "Can you work with my existing content team?", a: "Absolutely. I deliver briefs, editorial guidelines and review loops your team can plug straight into their workflow." },
      { q: "What tools do you use?", a: "Ahrefs, Semrush, Screaming Frog, GSC, GA4, plus custom AI agents built on the OpenAI and Anthropic APIs." },
    ],
    tiers: standardTiers(900, "SEO"),
  },
  {
    slug: "performance-marketing",
    title: "Performance Marketing",
    tag: "Paid social & programmatic",
    icon: BarChart3,
    shortDesc: "ROAS-obsessed paid social across Meta, TikTok, LinkedIn and programmatic.",
    intro:
      "Performance marketing today is won by creative volume, signal quality and disciplined iteration. I run a tight loop of hypothesis → creative → test → learn, powered by AI creative tools and server-side tracking so every dollar is accountable.",
    aiAngle:
      "AI generates hook variations, edits short-form video at scale and surfaces winning angles within hours instead of weeks — while I keep humans firmly in the loop on brand and offer.",
    deliverables: [
      "Full-funnel paid strategy across Meta, TikTok, LinkedIn and programmatic",
      "Server-side tracking via Conversions API and GTM server",
      "AI-assisted creative production (hooks, scripts, edits, variants)",
      "Weekly creative testing matrix and learnings doc",
      "Audience and lookalike strategy with first-party data activation",
      "Live dashboards tracking ROAS, CAC, LTV and incrementality",
    ],
    process: [
      { step: "Baseline", detail: "Audit accounts, tracking, creative library and unit economics." },
      { step: "Launch", detail: "Stand up testing structure, server-side events and creative pipeline." },
      { step: "Iterate", detail: "Weekly creative drops, hypothesis tests and bid-strategy tuning." },
      { step: "Scale", detail: "Pour budget into winning angles and expand to new channels." },
    ],
    faqs: [
      { q: "What is the minimum ad budget you work with?", a: "I recommend at least $10k / month in media for paid social to learn fast enough. Below that I focus on creative and tracking foundations." },
      { q: "Do you produce the creative?", a: "Yes — I orchestrate AI tools and a network of editors to ship 20–40 creative concepts per month." },
      { q: "Which platforms do you cover?", a: "Meta, TikTok, LinkedIn, YouTube and programmatic DSPs like DV360 and StackAdapt." },
      { q: "Do you handle tracking setup?", a: "Server-side tracking, CAPI, enhanced conversions and consent mode are part of every engagement." },
    ],
    tiers: standardTiers(1500, "performance marketing"),
  },
  {
    slug: "ppc",
    title: "Pay-Per-Click",
    tag: "PPC",
    icon: Megaphone,
    shortDesc: "Google Search, Shopping and YouTube ads engineered for profitable demand capture.",
    intro:
      "PPC is a precision game — the right query, the right offer, the right landing page. I structure accounts for clean signal, write AI-assisted ad copy that beats Google's defaults and tune bids weekly so you pay for intent, not impressions.",
    aiAngle:
      "Custom GPTs draft RSAs, sitelinks and negative keyword lists from your transcripts and product feed. Bid scripts watch the account 24/7 and flag anomalies before they burn budget.",
    deliverables: [
      "Account restructure with proper match types, themes and naming",
      "AI-written ad copy variants for every ad group",
      "Shopping feed optimization and merchant-center hygiene",
      "YouTube and Demand Gen video campaigns",
      "Conversion tracking, offline imports and enhanced conversions",
      "Weekly bid management plus monthly executive reporting",
    ],
    process: [
      { step: "Audit", detail: "Surface wasted spend, broken tracking and structural debt." },
      { step: "Rebuild", detail: "Restructure accounts, write copy, set up conversion tracking." },
      { step: "Optimize", detail: "Weekly bid, copy and negative-keyword iterations." },
      { step: "Expand", detail: "Layer in YouTube, Performance Max and Demand Gen." },
    ],
    faqs: [
      { q: "Do you only run Google Ads?", a: "Google is the core, but I also run Microsoft Ads, Apple Search Ads and Reddit when they make sense for your funnel." },
      { q: "How is success measured?", a: "Profit-aware metrics: blended CAC, contribution margin and assisted revenue — not vanity clicks." },
      { q: "Will you manage Performance Max?", a: "Yes, with proper asset groups, audience signals and search-term sculpting." },
      { q: "Do you handle landing pages?", a: "I can audit and recommend changes, or build them via my Web & Landing Page service." },
    ],
    tiers: standardTiers(1200, "PPC"),
  },
  {
    slug: "smo",
    title: "Social Media Optimization",
    tag: "SMO",
    icon: Share2,
    shortDesc: "Brand-first social systems — content engines, community and growth loops.",
    intro:
      "Social is where brand and demand collide. I build content engines that publish with rhythm, voice and taste — turning your founder, product and customers into a flywheel of attention.",
    aiAngle:
      "AI handles ideation, hook libraries, caption variants and trend monitoring. Humans handle taste, voice and the moments that actually matter.",
    deliverables: [
      "Brand voice, tone and visual system documented for repeatability",
      "Content engine across Instagram, TikTok, LinkedIn, X and YouTube Shorts",
      "Short-form video strategy with hook libraries and editing templates",
      "Community management playbook and DM-to-deal workflows",
      "Influencer and creator partnership program",
      "Monthly content calendar with AI-generated drafts",
    ],
    process: [
      { step: "Position", detail: "Define voice, pillars and platforms that match your audience." },
      { step: "Produce", detail: "Stand up the content engine and weekly publishing cadence." },
      { step: "Engage", detail: "Community management, DMs, comments and creator outreach." },
      { step: "Amplify", detail: "Boost winners with paid social and influencer collabs." },
    ],
    faqs: [
      { q: "Do you film or edit content?", a: "I produce remote-friendly content with you and your team, and run a network of editors to ship short-form video weekly." },
      { q: "Which platforms should I be on?", a: "Usually two or three — picked based on where your audience actually buys, not where it is loudest." },
      { q: "Can you manage community and DMs?", a: "Yes — with a documented voice guide and clear escalation rules so nothing slips." },
      { q: "Do you run influencer campaigns?", a: "Yes — from sourcing to briefing, contracts and performance tracking." },
    ],
    tiers: standardTiers(1100, "SMO"),
  },
  {
    slug: "ai-automation",
    title: "AI Automation",
    tag: "Workflows & GPTs",
    icon: Bot,
    shortDesc: "Custom GPTs, n8n workflows and AI ops that 10× your team's leverage.",
    intro:
      "Most marketing teams are buried in repetitive work — research, reporting, drafting, outreach. I design AI workflows that absorb that work so your humans focus on strategy, taste and judgement.",
    aiAngle:
      "From custom GPTs on your brand voice to n8n flows that score leads, draft outreach and ping Slack — everything is observable, version-controlled and built to scale.",
    deliverables: [
      "Audit of repetitive workflows and AI-leverage opportunities",
      "Custom GPTs trained on your brand voice and SOPs",
      "n8n / Zapier / Make workflows for marketing ops",
      "AI content production lines (briefs → drafts → QA)",
      "Lead scoring and outreach automations",
      "Internal docs and Loom walkthroughs for the team",
    ],
    process: [
      { step: "Map", detail: "Document the workflows, the inputs and the costs of each task." },
      { step: "Design", detail: "Choose the right model, tool and human-in-the-loop checkpoints." },
      { step: "Build", detail: "Ship the automation, monitor outputs and tune prompts." },
      { step: "Train", detail: "Document SOPs and onboard your team to own it." },
    ],
    faqs: [
      { q: "Which AI models do you use?", a: "Whichever fits the job — OpenAI, Anthropic, Gemini, plus open-source models when latency or privacy matters." },
      { q: "Is my data safe?", a: "I default to enterprise APIs with zero-retention settings and document data flows clearly." },
      { q: "Will this replace my team?", a: "No — it removes the busywork so they spend time on the work only humans can do." },
      { q: "Can you maintain it?", a: "Yes — through a small monthly retainer or a clean handoff with docs and Loom walkthroughs." },
    ],
    tiers: standardTiers(1400, "AI automation"),
  },
  {
    slug: "cro-analytics",
    title: "CRO & Analytics",
    tag: "Optimization",
    icon: TrendingUp,
    shortDesc: "GA4, funnels, A/B tests and attribution that turn traffic into revenue.",
    intro:
      "You don't have a traffic problem — you have a conversion problem. I instrument the funnel, find the leaks and run a disciplined A/B testing program so every visitor is worth more than the last.",
    aiAngle:
      "AI summarises session replays, clusters user friction patterns and proposes test hypotheses ranked by expected lift — so your roadmap is data-driven, not vibes-driven.",
    deliverables: [
      "GA4 + Looker Studio dashboards configured around revenue",
      "Funnel and event-tracking audit with fixes",
      "Heatmap and session-replay review with AI summaries",
      "Quarterly A/B testing roadmap with hypothesis docs",
      "Attribution model setup (data-driven or MMM-lite)",
      "Monthly insight reports with prioritised actions",
    ],
    process: [
      { step: "Instrument", detail: "Get tracking, events and consent mode rock-solid." },
      { step: "Diagnose", detail: "Find the leaks via funnels, replays and qual research." },
      { step: "Test", detail: "Run a disciplined A/B program with clear win criteria." },
      { step: "Learn", detail: "Document wins, losses and insights into a living playbook." },
    ],
    faqs: [
      { q: "Do I need a lot of traffic for A/B testing?", a: "Ideally 20k+ monthly sessions per variant. Below that, qualitative research drives more lift than tests." },
      { q: "Which testing tools do you use?", a: "VWO, Convert, GrowthBook or Statsig depending on stack and budget." },
      { q: "Can you fix my GA4?", a: "Yes — broken GA4 is one of the most common issues I find. Audit and fix is usually a 2-week sprint." },
      { q: "Do you do MMM?", a: "Lightweight MMM via Robyn or Meridian for clients spending $100k+ / month in media." },
    ],
    tiers: standardTiers(1100, "CRO & analytics"),
  },
  {
    slug: "email-marketing",
    title: "Email & Lifecycle",
    tag: "Retention",
    icon: Mail,
    shortDesc: "Klaviyo, Mailchimp and CRM journeys that turn one purchase into a relationship.",
    intro:
      "Email and SMS are still the highest-ROI channels you own. I build lifecycle programs that welcome, nurture, convert and win back — with AI personalisation that respects the inbox.",
    aiAngle:
      "AI writes subject lines, segments your list and personalises modules at scale — while strict QA keeps the brand voice intact and the spam folder empty.",
    deliverables: [
      "Klaviyo / Mailchimp / HubSpot account setup and hygiene",
      "Welcome, abandoned cart, browse-abandon, post-purchase and win-back flows",
      "Segmentation strategy and dynamic content blocks",
      "Campaign calendar with AI-assisted copy variants",
      "Deliverability monitoring and list-hygiene playbooks",
      "Monthly performance reports with revenue attribution",
    ],
    process: [
      { step: "Audit", detail: "Review flows, segments, deliverability and revenue attribution." },
      { step: "Build", detail: "Ship core flows and a segmentation strategy." },
      { step: "Send", detail: "Weekly campaigns with A/B-tested subject lines and modules." },
      { step: "Retain", detail: "Loyalty, win-back and VIP programs to maximise LTV." },
    ],
    faqs: [
      { q: "Which ESPs do you support?", a: "Klaviyo, Mailchimp, HubSpot, Customer.io and Braze." },
      { q: "Do you write the copy?", a: "Yes — AI drafts, I edit, you approve. We hit a fast cadence without sacrificing voice." },
      { q: "Can you fix deliverability?", a: "Yes — SPF, DKIM, DMARC, BIMI and list-hygiene programs are part of every engagement." },
      { q: "Do you handle SMS?", a: "Yes — via Klaviyo SMS, Postscript or Attentive." },
    ],
    tiers: standardTiers(900, "lifecycle marketing"),
  },
  {
    slug: "web-development",
    title: "Web & Landing Pages",
    tag: "Build",
    icon: Code2,
    shortDesc: "Conversion-first landing pages and websites built on a modern stack.",
    intro:
      "Your site is the only ad that never sleeps. I design and build pages that load fast, convert hard and let you iterate weekly — on Webflow, Framer or a headless Next.js stack.",
    aiAngle:
      "AI accelerates copy, image generation and component scaffolding — but every page ships with hand-tuned design, performance and accessibility.",
    deliverables: [
      "Conversion-first landing pages built in days, not months",
      "Headless / Webflow / Framer / Next.js builds",
      "Core Web Vitals tuning and Lighthouse 95+ scores",
      "On-page SEO and schema baked in",
      "A/B testing infrastructure ready out of the box",
      "CMS handoff and Loom walkthroughs for your team",
    ],
    process: [
      { step: "Brief", detail: "Define the offer, audience and conversion goal." },
      { step: "Design", detail: "Wireframes, copy and visual design with rapid iteration." },
      { step: "Build", detail: "Production-grade build with tracking and CMS." },
      { step: "Iterate", detail: "Post-launch experimentation to lift conversion." },
    ],
    faqs: [
      { q: "What stacks do you build on?", a: "Webflow, Framer and Next.js (TanStack Start) are my defaults. I'll match what your team can maintain." },
      { q: "How fast can you ship a landing page?", a: "A single high-conversion landing page typically ships in 7–10 days." },
      { q: "Do you provide copy?", a: "Yes — copy is part of every build, with AI drafts plus human editing." },
      { q: "Will it be SEO-friendly?", a: "Always. Schema, semantic HTML, Core Web Vitals and on-page SEO are non-negotiable." },
    ],
    tiers: standardTiers(1800, "web build"),
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);