export type HomeSectionContent = Record<string, any>;

export type HomeSectionRecord = {
  id: string;
  key: string;
  enabled: boolean;
  sort_order: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  cta_label: string;
  cta_href: string;
  image_url: string;
  content: HomeSectionContent;
};

type SectionSeed = Omit<HomeSectionRecord, "id">;

export const BUILT_IN_HOME_SECTION_KEYS = [
  "hero",
  "channels",
  "ai_stack",
  "services",
  "platforms",
  "whatsapp",
  "process",
  "about",
  "industries",
  "tech_stack",
  "workflow",
  "results",
  "case_studies",
  "insights",
  "testimonials",
  "final_cta",
] as const;

export const HOME_SECTION_DEFAULTS: Record<string, SectionSeed> = {
  hero: {
    key: "hero",
    enabled: true,
    sort_order: 0,
    eyebrow: "",
    title: "The AI-powered growth partner for ambitious modern brands.",
    subtitle:
      "We're vrseoguru — an AI-powered digital marketing agency. AI agents, predictive media buying, generative creative, AI search (GEO) and intelligent lifecycle — unified into one revenue engine, run by senior strategists.",
    cta_label: "Free Website Audit",
    cta_href: "",
    image_url: "",
    content: {
      badge: "AI-powered digital marketing services",
      secondary_cta_label: "Send Inquiry",
      secondary_cta_href: "#inquiry",
      tertiary_cta_label: "Our services",
      tertiary_cta_href: "/services",
      stats: [
        { value: "4.2x", label: "Avg client ROAS" },
        { value: "120+", label: "Campaigns shipped" },
        { value: "98%", label: "Client retention" },
      ],
      trust_items: [
        { label: "Senior team, no juniors", icon: "ShieldCheck" },
        { label: "Onboard in 14 days", icon: "Zap" },
        { label: "Revenue-first reporting", icon: "LineChart" },
      ],
      inquiry_eyebrow: "Start a project",
      inquiry_title: "Request a free growth audit",
      inquiry_description:
        "Tell us a bit about your brand — a senior strategist replies in 1 business day.",
      inquiry_privacy: "🔒 Your details stay private. No spam, ever.",
      name_placeholder: "Your name",
      phone_placeholder: "Phone (optional)",
      email_placeholder: "Email address",
      company_placeholder: "Company / Brand",
      website_placeholder: "Website (optional)",
      service_placeholder: "Service",
      budget_placeholder: "Budget",
      timeline_placeholder: "When do you want to start?",
      message_placeholder:
        "Tell us about your goals, current marketing & biggest challenge...",
      submit_label: "Send inquiry",
      service_options: [
        "SEO",
        "Performance Marketing",
        "PPC",
        "Social Media (SMO)",
        "AI Automation",
        "Content Marketing",
        "WhatsApp & SMS Marketing",
        "Web & CRO",
      ],
      budget_options: [
        "Under ₹10,000",
        "₹10,000 – ₹50,000",
        "₹50,000 – ₹1,00,000",
        "₹1,00,000 – ₹5,00,000",
        "₹5,00,000+",
      ],
      timeline_options: [
        "ASAP (within 2 weeks)",
        "Within 1 month",
        "1–3 months",
        "Just exploring",
      ],
    },
  },
  channels: {
    key: "channels",
    enabled: true,
    sort_order: 1,
    eyebrow: "AI-powered channels we run",
    title: "Every channel your brand needs to grow.",
    subtitle:
      "A unified operating system for paid, organic, lifecycle and creative — all driven by AI.",
    cta_label: "",
    cta_href: "",
    image_url: "",
    content: {
      items: [
        { label: "AI Agents", icon: "Bot" },
        { label: "GenAI Creative", icon: "Sparkles" },
        { label: "Predictive Ads", icon: "Target" },
        { label: "AI Search / GEO", icon: "Search" },
        { label: "ML Attribution", icon: "BarChart3" },
        { label: "AI Lifecycle", icon: "Mail" },
      ],
    },
  },
  ai_stack: {
    key: "ai_stack",
    enabled: true,
    sort_order: 2,
    eyebrow: "Your growth engine, always on",
    title: "Your growth engine, always on.",
    subtitle:
      "One AI core wired into every channel — bidding, creative, SEO and analytics — so your campaigns improve every hour, not every quarter.",
    cta_label: "Free Website Audit",
    cta_href: "",
    image_url: "",
    content: {
      secondary_cta_label: "See how it works",
      secondary_cta_href: "/services",
      live_badge: "Live · 24/7",
      stats: [
        { value: "10x", label: "Faster creative" },
        { value: "24/7", label: "Live optimization" },
        { value: "-32%", label: "Lower CPA" },
        { value: "+58%", label: "More revenue" },
      ],
      capabilities: [
        { label: "Semantic SEO", meta: "+38% CTR", icon: "Search" },
        { label: "Predictive bids", meta: "-27% CPA", icon: "Target" },
        { label: "GenAI creative", meta: "10x output", icon: "Megaphone" },
        { label: "Live attribution", meta: "1st-party", icon: "BarChart3" },
        { label: "GEO answers", meta: "AI search", icon: "MousePointerClick" },
        { label: "Anomaly alerts", meta: "<60s", icon: "Activity" },
        { label: "Auto reports", meta: "Daily", icon: "Bot" },
        { label: "Creative tests", meta: "A/B/n", icon: "Sparkles" },
      ],
      bottom_stats: [
        { value: "12k+", label: "Decisions / day" },
        { value: "<60s", label: "Anomaly response" },
        { value: "48", label: "Data sources" },
      ],
    },
  },
  services: {
    key: "services",
    enabled: true,
    sort_order: 3,
    eyebrow: "Digital marketing services",
    title: "Every channel your brand needs to grow.",
    subtitle:
      "Pick a discipline. See what we ship, the proof and the agents behind it — orchestrated under one AI ops layer.",
    cta_label: "Start free trial",
    cta_href: "/services",
    image_url: "",
    content: {
      secondary_cta_label: "Learn more",
      secondary_cta_href: "/services",
      tabs: [
        {
          label: "SEO",
          icon: "Search",
          accent: "bg-amber-200",
          eyebrow: "Technical • Content • GEO",
          title: "Own every search — Google and AI Overviews.",
          desc: "Technical SEO, topical authority and answer-engine optimisation that compounds organic revenue. We win featured snippets and LLM citations across ChatGPT, Gemini and Perplexity.",
          bullets: [
            "Tech audits, content clusters & internal linking",
            "Programmatic SEO & topical authority maps",
            "GEO — get cited in ChatGPT, Gemini & Perplexity",
          ],
          metric_primary: "+312%",
          metric_primary_label: "Organic traffic",
          metric_a_label: "Tracked queries",
          metric_a_value: "12.4k",
          metric_b_label: "AI citations",
          metric_b_value: "284",
        },
        {
          label: "Local SEO",
          icon: "Compass",
          accent: "bg-lime-200",
          eyebrow: "GBP • Map Pack • Citations",
          title: "Dominate the Map Pack in every city you serve.",
          desc: "Google Business Profile optimisation, location pages, review velocity and citation building that put you in the top-3 local pack for high-intent searches.",
          bullets: [
            "GBP optimisation + weekly posts and Q&A",
            "Location landing pages at scale",
            "Review generation & reputation flywheel",
          ],
          metric_primary: "Top 3",
          metric_primary_label: "Map Pack rank",
          metric_a_label: "GBP calls",
          metric_a_value: "+184%",
          metric_b_label: "Locations",
          metric_b_value: "42",
        },
        {
          label: "Performance Marketing",
          icon: "TrendingUp",
          accent: "bg-orange-200",
          eyebrow: "Full-funnel • Attribution • Profit",
          title: "Full-funnel performance modeled on real margin.",
          desc: "Cross-channel performance marketing instrumented with server-side CAPI, MMM and incrementality tests — every rupee tied to contribution profit, not vanity ROAS.",
          bullets: [
            "Server-side CAPI & GA4 attribution",
            "Media mix modelling + incrementality",
            "Profit-first dashboards in Looker",
          ],
          metric_primary: "4.2x",
          metric_primary_label: "Blended ROAS",
          metric_a_label: "CPA reduced",
          metric_a_value: "−41%",
          metric_b_label: "Channels live",
          metric_b_value: "8",
        },
        {
          label: "Pay-Per-Click",
          icon: "Target",
          accent: "bg-rose-200",
          eyebrow: "Google • Meta • LinkedIn • Amazon",
          title: "PPC engineered for pipeline, not impressions.",
          desc: "ML-bid Search, PMax, Shopping, Meta, LinkedIn ABM and Amazon DSP — built around offline conversions and contribution margin.",
          bullets: [
            "Search, PMax, Shopping & YouTube — profit-modeled",
            "Meta + TikTok creative testing on UGC engines",
            "LinkedIn ABM and Amazon Sponsored / DSP",
          ],
          metric_primary: "−52%",
          metric_primary_label: "Cost per lead",
          metric_a_label: "ROAS",
          metric_a_value: "5.8x",
          metric_b_label: "Channels",
          metric_b_value: "8",
        },
        {
          label: "SMO",
          icon: "Share2",
          accent: "bg-violet-200",
          eyebrow: "Reels • UGC • Community • YouTube",
          title: "Social media optimisation that scales reach.",
          desc: "Brand-trained creative pods generate Reels, Shorts and UGC variants at velocity — paired with community management and influencer programs that compound organic reach.",
          bullets: [
            "Content calendars & short-form video at scale",
            "Influencer + UGC sourcing, briefing and rights",
            "Performance video & YouTube media buying",
          ],
          metric_primary: "9.1M",
          metric_primary_label: "Monthly reach",
          metric_a_label: "Reels shipped",
          metric_a_value: "180/mo",
          metric_b_label: "Engagement",
          metric_b_value: "+62%",
        },
        {
          label: "AI Automation",
          icon: "Bot",
          accent: "bg-emerald-200",
          eyebrow: "Agents • n8n • Zapier • LLMs",
          title: "AI agents that run your marketing ops 24/7.",
          desc: "Custom GPT-class agents wired across CRM, ads, content and support — automating research, briefs, reporting, lead routing and lifecycle messaging on n8n and Zapier.",
          bullets: [
            "AI sales & support agents on WhatsApp + web",
            "n8n / Zapier workflows across your stack",
            "Auto research, briefs and weekly reports",
          ],
          metric_primary: "24/7",
          metric_primary_label: "Always-on agents",
          metric_a_label: "Hours saved",
          metric_a_value: "180/mo",
          metric_b_label: "Workflows",
          metric_b_value: "62",
        },
        {
          label: "Web Design & Dev",
          icon: "Code2",
          accent: "bg-sky-200",
          eyebrow: "Websites • Shopify • Webflow • CRO",
          title: "Fast, conversion-built websites — designed to rank.",
          desc: "Custom websites, Shopify and Webflow builds engineered for Core Web Vitals, SEO and conversion — with built-in A/B testing and analytics from day one.",
          bullets: [
            "Custom websites, Shopify & Webflow builds",
            "Core Web Vitals, SEO & accessibility baked in",
            "Landing pages with built-in A/B testing",
          ],
          metric_primary: "98",
          metric_primary_label: "PageSpeed score",
          metric_a_label: "CRO lift",
          metric_a_value: "+28%",
          metric_b_label: "Builds live",
          metric_b_value: "120+",
        },
      ],
    },
  },
  platforms: {
    key: "platforms",
    enabled: true,
    sort_order: 4,
    eyebrow: "Marketing Platforms",
    title: "The stack we orchestrate",
    subtitle: "",
    cta_label: "",
    cta_href: "",
    image_url: "",
    content: {
      items: [
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
      ],
    },
  },
  whatsapp: {
    key: "whatsapp",
    enabled: true,
    sort_order: 5,
    eyebrow: "Instant lead routing",
    title: "Talk on WhatsApp or SMS — now.",
    subtitle:
      "Skip the inbox. Send a message and a senior strategist will reply within minutes during business hours.",
    cta_label: "",
    cta_href: "",
    image_url: "",
    content: {
      bullets: [
        "Average reply in < 15 min",
        "Free 20-min growth call",
        "100% confidential",
      ],
      toggle_whatsapp_label: "WhatsApp",
      toggle_sms_label: "SMS",
      name_placeholder: "Your name",
      phone_placeholder: "Phone (with country code)",
      message_placeholder: "What do you need help with?",
      whatsapp_button_label: "Send on WhatsApp",
      sms_button_label: "Send via SMS",
      footnote: "Opens your WhatsApp or SMS app with your message pre-filled.",
    },
  },
  process: {
    key: "process",
    enabled: true,
    sort_order: 6,
    eyebrow: "Our AI agentic process",
    title: "Our Digital Marketing Process",
    subtitle:
      "Click any step to expand details and examples — autonomous agents working alongside senior marketers.",
    cta_label: "",
    cta_href: "",
    image_url: "",
    content: {
      steps: [
        {
          number: "1",
          title: "Analyze Business Landscape",
          desc: "AI audits market, competitors and your data signals.",
          details:
            "We ingest GA4, GSC, CRM and competitor data. AI agents identify positioning gaps, demand signals and revenue leaks.",
          examples: [
            "50-point SEO + UX audit",
            "Competitor share-of-search",
            "ICP & jobs-to-be-done synthesis",
          ],
          icon: "LineChart",
        },
        {
          number: "2",
          title: "Build Smart Strategies",
          desc: "Agent-generated channel mix, hypotheses and roadmap.",
          details:
            "GPT-class models propose channel mix, KPIs and a 90-day roadmap. Senior strategists approve before launch.",
          examples: [
            "Channel mix model",
            "Quarterly OKRs & KPIs",
            "Budget pacing plan",
          ],
          icon: "Lightbulb",
        },
        {
          number: "3",
          title: "Create Compelling Content",
          desc: "GenAI creative, copy and assets — at brand and at scale.",
          details:
            "Brand-trained models produce on-message copy, statics, motion and UGC briefs — reviewed by editors.",
          examples: [
            "SEO articles & landing pages",
            "Ad creative + variants",
            "Short-form video scripts",
          ],
          icon: "PenTool",
        },
        {
          number: "4",
          title: "Derive Meaningful Insights",
          desc: "Live attribution, anomaly alerts and predictive next steps.",
          details:
            "Warehouse-grade attribution with anomaly detection. AI summarises wins, losses and the next best action — daily.",
          examples: [
            "GA4 + server-side CAPI",
            "Daily Slack digests",
            "Predictive LTV & churn",
          ],
          icon: "Brain",
        },
        {
          number: "5",
          title: "Enrich Customer Experiences",
          desc: "Personalised journeys, lifecycle and CX automation.",
          details:
            "Lifecycle automations across WhatsApp, SMS, email and on-site — personalised by AI segments.",
          examples: [
            "WhatsApp & SMS journeys",
            "On-site personalisation",
            "Win-back & loyalty flows",
          ],
          icon: "Award",
        },
      ],
    },
  },
  about: {
    key: "about",
    enabled: true,
    sort_order: 7,
    eyebrow: "About the agency",
    title: "vrseoguru — an AI-powered digital marketing services agency.",
    subtitle:
      "For over seven years our team has built revenue systems for ecommerce, SaaS and D2C brands across India and abroad — pairing senior strategists and a proprietary AI stack with paid-media, SEO, creative and lifecycle specialists. Every engagement is engineered around your bottom line, not vanity metrics.",
    cta_label: "Meet the agency",
    cta_href: "/about",
    image_url: "",
    content: {
      badge: "Headquartered in Mumbai, IN",
      secondary_cta_label: "Start a project",
      secondary_cta_href: "/contact",
      certifications: [
        "Google Ads Certified",
        "Meta Blueprint",
        "GA4 Certified",
        "Amazon Ads",
        "HubSpot",
        "SEMrush Pro",
      ],
      pillars: [
        { title: "ROI-Focused", desc: "Every rupee tied to revenue.", icon: "TrendingUp" },
        { title: "Transparent", desc: "Live dashboards, no jargon.", icon: "ShieldCheck" },
        { title: "Certified", desc: "Google · Meta · Amazon.", icon: "Award" },
        { title: "Fast", desc: "Live in under 14 days.", icon: "Rocket" },
      ],
    },
  },
  industries: {
    key: "industries",
    enabled: true,
    sort_order: 8,
    eyebrow: "Industries we serve",
    title: "AI-powered growth, tuned to your sector.",
    subtitle:
      "18+ industries shipped — every model, funnel and dashboard adapted to how your buyers actually convert.",
    cta_label: "Talk to a strategist",
    cta_href: "/contact",
    image_url: "",
    content: {
      items: [
        { name: "Ecommerce & D2C", note: "Shopify, Amazon, marketplaces", icon: "ShoppingCart" },
        { name: "SaaS & B2B", note: "Demand-gen & ABM pipelines", icon: "Bot" },
        { name: "Fintech", note: "Compliance-aware acquisition", icon: "LineChart" },
        { name: "Healthcare", note: "HIPAA-safe campaigns", icon: "ShieldCheck" },
        { name: "Real Estate", note: "Geo-targeted lead funnels", icon: "Globe" },
        { name: "Education & EdTech", note: "Enrollment & retention", icon: "Award" },
        { name: "Beauty & Lifestyle", note: "Influencer + UGC engines", icon: "Sparkles" },
        { name: "Travel & Hospitality", note: "Seasonal demand modeling", icon: "Rocket" },
        { name: "Automotive", note: "Local + national hybrid", icon: "Target" },
        { name: "Media & Publishing", note: "Audience growth + retention", icon: "Megaphone" },
        { name: "Manufacturing & B2B", note: "Long-cycle attribution", icon: "BarChart3" },
        { name: "Professional Services", note: "Authority + lead capture", icon: "Mail" },
      ],
    },
  },
  tech_stack: {
    key: "tech_stack",
    enabled: true,
    sort_order: 9,
    eyebrow: "Our AI + Marketing Stack",
    title: "Tools We Use",
    subtitle:
      "Frontier AI models and best-in-class marketing platforms — orchestrated by custom agents.",
    cta_label: "",
    cta_href: "",
    image_url: "",
    content: {
      group_label: "AI Models & Agents",
      tools: [
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
      ],
    },
  },
  workflow: {
    key: "workflow",
    enabled: true,
    sort_order: 10,
    eyebrow: "End-to-end AI workflow",
    title: "Plan. Build. Launch. Optimize. Report.",
    subtitle:
      "A repeatable AI-augmented system that moves from brief to booked revenue — with humans in the loop at every step.",
    cta_label: "",
    cta_href: "",
    image_url: "",
    content: {
      steps: [
        {
          num: "01",
          title: "Plan",
          desc: "LLM-powered audit of your market, competitors, funnel and account data. Output: a 90-day revenue roadmap.",
          cta: "Book a free audit",
          href: "/contact",
          icon: "Compass",
        },
        {
          num: "02",
          title: "Build",
          desc: "GenAI creative, GEO-ready content, tracking, dashboards and agent workflows — built and brand-tuned.",
          cta: "See deliverables",
          href: "/services",
          icon: "Hammer",
        },
        {
          num: "03",
          title: "Launch",
          desc: "Multi-channel rollout across Google, Meta, LinkedIn, Amazon and AI search — live in under 14 days.",
          cta: "Start a project",
          href: "/contact",
          icon: "Rocket",
        },
        {
          num: "04",
          title: "Optimize",
          desc: "ML bidding, predictive creative rotation and 24/7 anomaly agents tuning campaigns to your real margin.",
          cta: "Our AI stack",
          href: "/services",
          icon: "FlaskConical",
        },
        {
          num: "05",
          title: "Report",
          desc: "Live executive dashboards plus a monthly strategic review from your senior account lead.",
          cta: "View sample report",
          href: "/blog",
          icon: "FileBarChart",
        },
      ],
    },
  },
  results: {
    key: "results",
    enabled: true,
    sort_order: 11,
    eyebrow: "Numbers do the talking",
    title: "Impact across 120+ engagements",
    subtitle: "",
    cta_label: "",
    cta_href: "",
    image_url: "",
    content: {
      stats: [
        { value: "₹84Cr+", label: "Revenue driven", icon: "TrendingUp" },
        { value: "4.2x", label: "Average ROAS", icon: "Activity" },
        { value: "-47%", label: "Avg CPA reduction", icon: "Target" },
        { value: "+240%", label: "Organic traffic", icon: "Search" },
      ],
    },
  },
  case_studies: {
    key: "case_studies",
    enabled: true,
    sort_order: 12,
    eyebrow: "Case studies",
    title: "Brands we've scaled.",
    subtitle: "",
    cta_label: "View all",
    cta_href: "/case-studies",
    image_url: "",
    content: {
      limit: "3",
    },
  },
  insights: {
    key: "insights",
    enabled: true,
    sort_order: 13,
    eyebrow: "Insights",
    title: "Fresh from the blog",
    subtitle: "The latest playbooks, frameworks and field notes from our team.",
    cta_label: "All articles",
    cta_href: "/blog",
    image_url: "",
    content: {
      limit: "3",
    },
  },
  testimonials: {
    key: "testimonials",
    enabled: true,
    sort_order: 14,
    eyebrow: "Receipts",
    title: "What our customers say",
    subtitle: "Real results from real brands — across SEO, paid media, social and lifecycle.",
    cta_label: "",
    cta_href: "",
    image_url: "",
    content: {
      items: [
        { quote: "Organic traffic up 240% and qualified leads have never been higher. The technical SEO playbook is the real deal.", name: "Sarah Mitchell", role: "CEO at Northbridge Retail", initials: "SM", color: "bg-amber-300" },
        { quote: "PPC cut our CPL in half while doubling lead volume. Reporting is unmatched — every rupee tied to pipeline.", name: "David Chen", role: "Founder at Velocity SaaS", initials: "DC", color: "bg-rose-300" },
        { quote: "We scaled from a regional player to a national brand. Strategy and execution made the difference.", name: "Maria Lopez", role: "CMO at Harborline Homes", initials: "ML", color: "bg-emerald-300" },
        { quote: "Meta and Google funnels now print revenue. Best marketing hire we've made this year.", name: "Aarav Khanna", role: "Founder at Lumen D2C", initials: "AK", color: "bg-violet-300" },
        { quote: "Content and technical SEO finally clicked. We rank #1 on every one of our money keywords.", name: "Priya Raman", role: "Head of Growth at Finovate", initials: "PR", color: "bg-sky-300" },
        { quote: "The AI agents handle reporting and lead routing 24/7. It feels like we hired a 10-person ops team.", name: "Thomas Smith", role: "Digital Marketing Specialist", initials: "TS", color: "bg-orange-300" },
        { quote: "Local SEO put us in the Map Pack across 30+ cities. Calls from Google jumped almost overnight.", name: "Neal Schaffer", role: "Marketing Director at LocalCo", initials: "NS", color: "bg-lime-300" },
        { quote: "The new website looks beautiful and converts. Page speed and SEO baked-in from day one.", name: "Gareth O'Sullivan", role: "Content Manager at Creatify", initials: "GO", color: "bg-pink-300" },
        { quote: "Lifecycle on WhatsApp and email lifted repeat revenue by 38%. The journeys are surgical.", name: "Abbie D", role: "Senior Engineer at Laywers", initials: "AD", color: "bg-cyan-300" },
        { quote: "Easily the most transparent agency I've worked with. Weekly insights, no fluff, all numbers.", name: "Dennis Lewis", role: "Advisor at Image Protect", initials: "DL", color: "bg-fuchsia-300" },
      ],
    },
  },
  final_cta: {
    key: "final_cta",
    enabled: true,
    sort_order: 15,
    eyebrow: "Let's build",
    title: "Ready to accelerate your growth?",
    subtitle:
      "Book a free, no-obligation strategy call. Our team will audit your marketing and show you the biggest opportunities.",
    cta_label: "Book free strategy call",
    cta_href: "/contact",
    image_url: "",
    content: {
      secondary_cta_label: "View services",
      secondary_cta_href: "/services",
    },
  },
};

export function getDefaultHomeSection(key: string): HomeSectionRecord {
  const fallback = HOME_SECTION_DEFAULTS[key] ?? {
    key,
    enabled: true,
    sort_order: 999,
    eyebrow: "",
    title: "",
    subtitle: "",
    cta_label: "",
    cta_href: "",
    image_url: "",
    content: {},
  };

  return {
    id: key,
    ...fallback,
    content: { ...(fallback.content ?? {}) },
  };
}

export function mergeHomeSection(section?: Partial<HomeSectionRecord> | null): HomeSectionRecord {
  const fallback = getDefaultHomeSection(section?.key ?? "custom");

  return {
    ...fallback,
    ...section,
    id: section?.id ?? fallback.id,
    key: section?.key ?? fallback.key,
    enabled: section?.enabled ?? fallback.enabled,
    sort_order: section?.sort_order ?? fallback.sort_order,
    eyebrow: section?.eyebrow?.length ? section.eyebrow : fallback.eyebrow,
    title: section?.title?.length ? section.title : fallback.title,
    subtitle: section?.subtitle?.length ? section.subtitle : fallback.subtitle,
    cta_label: section?.cta_label?.length ? section.cta_label : fallback.cta_label,
    cta_href: section?.cta_href?.length ? section.cta_href : fallback.cta_href,
    image_url: section?.image_url?.length ? section.image_url : fallback.image_url,
    content: {
      ...(fallback.content ?? {}),
      ...((section?.content as HomeSectionContent | undefined) ?? {}),
    },
  };
}

export function mergeHomeSections(sections: Array<Partial<HomeSectionRecord>>): HomeSectionRecord[] {
  const mergedBuiltIns = BUILT_IN_HOME_SECTION_KEYS.map((key) => {
    const existing = sections.find((section) => section.key === key);
    return mergeHomeSection(existing as Partial<HomeSectionRecord> | undefined);
  });

  const customSections = sections
    .filter((section) => section.key && !BUILT_IN_HOME_SECTION_KEYS.includes(section.key as (typeof BUILT_IN_HOME_SECTION_KEYS)[number]))
    .map((section) => mergeHomeSection(section));

  return [...mergedBuiltIns, ...customSections].sort((a, b) => a.sort_order - b.sort_order);
}