import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, ShieldCheck, Zap, LineChart, Send, CheckCircle2, TrendingUp, Award, Star, Quote, Phone, Bot, Search, Megaphone, Target, BarChart3, Globe, Rocket, Activity, Play } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listServices } from "@/lib/services.functions";
import { createLead } from "@/lib/leads.functions";
import { iconFor } from "@/lib/services.shared";
import { useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { z } from "zod";

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
      <section className="relative overflow-hidden bg-digital border-b border-border">
        <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-20 md:pt-24 md:pb-28 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-ink/20 bg-white/70 backdrop-blur px-3 py-1 text-xs text-foreground">
              <Sparkles className="h-3 w-3" />
              AI-native freelance studio · open for projects
            </div>
            <h1 className="mt-6 text-5xl md:text-6xl font-display font-semibold leading-[1.04] tracking-tight">
              Digital marketing,<br />
              <span className="text-gradient-gold">engineered with AI.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground leading-relaxed">
              I&apos;m <span className="text-foreground font-medium">vrseoguru</span> — a freelance growth partner blending SEO, PPC,
              performance marketing and SMO with AI workflows that compound revenue.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/contact" className="group inline-flex items-center gap-2 rounded-md bg-ink px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-foreground transition-colors">
                Book a free strategy call
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/services" className="inline-flex items-center gap-2 rounded-md border border-ink/30 bg-white px-6 py-3 text-sm font-medium text-foreground hover:border-ink transition-colors">
                Explore services
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Transparent reporting</div>
              <div className="flex items-center gap-2"><Zap className="h-4 w-4" /> Ship in days, not months</div>
              <div className="flex items-center gap-2"><LineChart className="h-4 w-4" /> Profit-first metrics</div>
            </div>
          </div>

          {/* Inquiry form */}
          <div className="lg:col-span-5">
            {submitted ? (
              <div className="rounded-2xl border border-border bg-white shadow-gold p-8 text-center">
                <div className="mx-auto h-14 w-14 rounded-full bg-ink/5 grid place-items-center">
                  <CheckCircle2 className="h-8 w-8 text-ink" />
                </div>
                <h3 className="mt-5 text-2xl font-display font-semibold">Thanks, {submitted.name}!</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your inquiry has been received. I&apos;ll reply to <span className="text-foreground font-medium">{submitted.email}</span> within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(null)}
                  className="mt-6 inline-flex items-center gap-2 rounded-md border border-ink/30 bg-white px-5 py-2.5 text-sm font-medium text-foreground hover:border-ink transition-colors"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
            <form
              onSubmit={onInquiry}
              className="rounded-2xl border border-border bg-white shadow-gold p-6 md:p-7 space-y-4"
            >
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Quick inquiry</p>
                <h3 className="mt-1 text-xl font-display font-semibold">Get a free 30-day plan</h3>
              </div>

              <div>
                <input name="name" placeholder="Your name" className={`w-full rounded-md bg-secondary border px-4 py-3 text-sm focus:outline-none focus:border-ink ${errors.name ? "border-red-400" : "border-border"}`} />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
              </div>

              <div>
                <input name="email" type="email" placeholder="Email address" className={`w-full rounded-md bg-secondary border px-4 py-3 text-sm focus:outline-none focus:border-ink ${errors.email ? "border-red-400" : "border-border"}`} />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
              </div>

              <div>
                <select name="service" className={`w-full rounded-md bg-secondary border px-4 py-3 text-sm focus:outline-none focus:border-ink ${errors.service ? "border-red-400" : "border-border"}`}>
                  <option value="">Select a service</option>
                  <option>SEO</option>
                  <option>Performance Marketing</option>
                  <option>PPC</option>
                  <option>Social Media (SMO)</option>
                  <option>AI Automation</option>
                </select>
                {errors.service && <p className="mt-1 text-xs text-red-500">{errors.service}</p>}
              </div>

              <div>
                <select name="budget" className={`w-full rounded-md bg-secondary border px-4 py-3 text-sm focus:outline-none focus:border-ink ${errors.budget ? "border-red-400" : "border-border"}`}>
                  <option value="">Select budget range</option>
                  <option>Under ₹10,000</option>
                  <option>₹10,000 – ₹50,000</option>
                  <option>₹50,000 – ₹1,00,000</option>
                  <option>₹1,00,000 – ₹5,00,000</option>
                  <option>₹5,00,000+</option>
                </select>
                {errors.budget && <p className="mt-1 text-xs text-red-500">{errors.budget}</p>}
              </div>

              <div>
                <textarea name="message" rows={3} placeholder="Tell me about your goals..." className={`w-full rounded-md bg-secondary border px-4 py-3 text-sm focus:outline-none focus:border-ink resize-none ${errors.message ? "border-red-400" : "border-border"}`} />
                {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full inline-flex justify-center items-center gap-2 rounded-md bg-ink px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-foreground transition-colors disabled:opacity-60"
              >
                {sending ? "Sending..." : <>Send inquiry <Send className="h-4 w-4" /></>}
              </button>
              <p className="text-[11px] text-muted-foreground text-center">Reply within 24 hours · No spam.</p>
            </form>
            )}
          </div>
        </div>

        {/* Stats below hero */}
        <div className="relative mx-auto max-w-7xl px-6 pb-16">
          <dl className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[["7+ yrs", "Marketing craft"],["120+", "Campaigns shipped"],["4.2x", "Avg. ROAS lift"],["24h", "Reply window"]].map(([k, v]) => (
              <div key={v}>
                <dt className="text-3xl font-display font-semibold text-foreground">{k}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-12">
          <div>
            <p className="text-sm text-primary uppercase tracking-widest">What I do</p>
            <h2 className="mt-3 text-4xl md:text-5xl font-display font-semibold max-w-2xl">A full-stack growth engine for ambitious brands.</h2>
          </div>
          <Link to="/services" className="text-sm text-muted-foreground hover:text-primary inline-flex items-center gap-1">
            All services <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {services.map((s) => {
            const Icon = iconFor(s.icon);
            return (
              <Link
                key={s.slug}
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="group bg-card p-8 hover:bg-secondary transition-colors block"
              >
                <div className="h-11 w-11 rounded-lg bg-primary/10 border border-primary/30 grid place-items-center mb-5">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.shortDesc}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Who We Are */}
      <section className="mx-auto max-w-7xl px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs uppercase tracking-widest text-foreground/70 font-medium">Who I am</p>
          <h2 className="mt-4 text-4xl md:text-5xl font-display font-semibold leading-tight">A growth partner, not just another freelancer</h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            vrseoguru is a freelance digital marketing practice built around one principle: measurable results.
            Senior strategy, certified specialists, and proven frameworks — turning marketing into a predictable engine for revenue.
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {["Senior, certified marketing expertise","Transparent reporting tied to revenue","Custom strategies built for your market"].map((t) => (
              <li key={t} className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-foreground" /> {t}</li>
            ))}
          </ul>
          <Link to="/about" className="mt-8 inline-flex items-center gap-2 rounded-md bg-ink px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-foreground transition-colors">
            Learn more about me <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-5">
          {[
            { Icon: TrendingUp, title: "ROI-Focused", desc: "Every campaign optimized for return." },
            { Icon: ShieldCheck, title: "Transparent", desc: "Clear reporting, no surprises." },
            { Icon: Award, title: "Certified", desc: "Google, Meta & Amazon experts." },
            { Icon: Star, title: "Proven", desc: "120+ campaigns shipped." },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="rounded-2xl border border-border bg-white p-6">
              <div className="h-11 w-11 rounded-lg bg-ink grid place-items-center">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="mt-4 font-display font-semibold">{title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-secondary border-y border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-widest text-foreground/70 font-medium">Why work with me</p>
            <h2 className="mt-3 text-4xl md:text-5xl font-display font-semibold">Built for results, trusted for the long term</h2>
            <p className="mt-4 text-muted-foreground">Long-term partnerships through performance, transparency, and a relentless focus on your bottom line.</p>
          </div>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              ["Proven Results","A track record of measurable growth across hundreds of campaigns and industries."],
              ["Transparent Reporting","Real-time dashboards and clear monthly reports — you always know what's working."],
              ["Certified Experts","Google, Meta, and Amazon certified specialists with deep platform expertise."],
              ["Customized Strategies","No templates. Every strategy is engineered around your goals and market."],
              ["Dedicated Partnership","A single point of contact who knows your business inside and out."],
              ["ROI-Focused Campaigns","Every decision is tied to revenue and return — not vanity metrics."],
            ].map(([title, desc]) => (
              <div key={title} className="rounded-2xl border border-border bg-white p-6">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-foreground mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-display font-semibold">{title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="bg-ink text-white">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-widest text-white/60 font-medium">My process</p>
            <h2 className="mt-3 text-4xl md:text-5xl font-display font-semibold">A proven path to growth</h2>
            <p className="mt-4 text-white/70">A transparent, repeatable process that turns goals into measurable results.</p>
          </div>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-5 gap-5">
            {[
              ["01","Discovery & Audit","Analyze your business, market, competitors, and current performance to find opportunities."],
              ["02","Strategy Development","Build a custom, data-backed roadmap aligned with your growth goals."],
              ["03","Implementation","Execute campaigns with precision across every channel."],
              ["04","Optimization","Continuously test, refine, and scale what drives the best returns."],
              ["05","Reporting & Growth","Transparent reporting and strategic reviews keep growth compounding."],
            ].map(([num, title, desc]) => (
              <div key={num} className="rounded-2xl border border-white/15 bg-white/[0.04] p-6">
                <div className="text-3xl font-display font-semibold text-white">{num}</div>
                <h3 className="mt-3 font-display font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-display font-semibold">What clients say</h2>
          <p className="mt-4 text-muted-foreground">Don&apos;t take my word for it — hear from the businesses I&apos;ve helped grow.</p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {[
            ["\"Transformed our online presence. Organic traffic is up 240% and qualified leads have never been higher.\"","Sarah Mitchell","CEO, Northbridge Retail"],
            ["\"PPC management cut our cost per lead in half while doubling volume. The transparency and reporting are unmatched.\"","David Chen","Founder, Velocity SaaS"],
            ["\"We scaled from a regional player to a national brand. The strategy and execution made the difference.\"","Maria Lopez","CMO, Harborline Homes"],
          ].map(([quote, name, role]) => (
            <div key={name} className="rounded-2xl border border-border bg-white p-6">
              <Quote className="h-6 w-6 text-foreground" />
              <p className="mt-4 text-sm text-foreground leading-relaxed">{quote}</p>
              <div className="mt-5 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-foreground text-foreground" />)}
              </div>
              <div className="mt-4">
                <div className="font-semibold text-sm">{name}</div>
                <div className="text-xs text-muted-foreground">{role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Industries */}
      <section className="bg-secondary border-y border-border">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-widest text-foreground/70 font-medium">Industries I serve</p>
            <h2 className="mt-3 text-4xl md:text-5xl font-display font-semibold">Expertise across every sector</h2>
            <p className="mt-4 text-muted-foreground">Tailored strategies for the unique dynamics of your industry.</p>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {["Ecommerce & Retail","SaaS & Technology","Healthcare","Real Estate","Professional Services","Finance & Insurance","Manufacturing","Hospitality & Travel","Education","Legal","Home Services","B2B & Industrial"].map((tag) => (
              <span key={tag} className="rounded-full border border-border bg-white px-5 py-2 text-sm text-foreground">{tag}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Blog / Insights */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-foreground/70 font-medium">Insights</p>
          <h2 className="mt-3 text-4xl md:text-5xl font-display font-semibold">Latest from the blog</h2>
          <p className="mt-4 text-muted-foreground">Actionable strategies and trends to keep your marketing ahead of the curve.</p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {[
            ["SEO","10 SEO Trends That Will Define 2026","From AI-driven search to entity optimization, here's what forward-thinking brands are doing to stay ahead.","May 28, 2026 · 8 min read"],
            ["PPC","How to Maximize ROI From Google Ads in 2026","Practical strategies to lower your cost per acquisition and scale profitable campaigns.","May 14, 2026 · 6 min read"],
            ["Content Marketing","The Anatomy of Content That Actually Converts","Why most content fails — and the framework I use to create assets that drive revenue.","April 30, 2026 · 7 min read"],
          ].map(([tag, title, desc, meta]) => (
            <article key={title} className="rounded-2xl border border-border bg-white p-6 flex flex-col">
              <span className="self-start rounded-full bg-secondary border border-border px-3 py-1 text-xs font-medium">{tag}</span>
              <h3 className="mt-4 text-lg font-display font-semibold leading-snug">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">{desc}</p>
              <p className="mt-5 text-xs text-muted-foreground">{meta}</p>
            </article>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/blog" className="inline-flex items-center gap-2 rounded-md border border-ink/30 bg-white px-6 py-3 text-sm font-medium text-foreground hover:border-ink transition-colors">
            Read all articles <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-ink text-white p-12 md:p-16 text-center">
          <h2 className="text-4xl md:text-5xl font-display font-semibold">Ready to accelerate your growth?</h2>
          <p className="mt-4 max-w-2xl mx-auto text-white/70">
            Book a free, no-obligation strategy call. I&apos;ll audit your current marketing and show you exactly where the biggest opportunities are.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-md bg-white text-ink px-6 py-3 text-sm font-medium hover:bg-white/90 transition-colors">
              Get Free Strategy Call <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/services" className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3 text-sm font-medium text-white hover:border-white transition-colors">
              <Phone className="h-4 w-4" /> View Services
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
