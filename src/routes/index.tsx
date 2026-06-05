import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, ShieldCheck, Zap, LineChart, Send } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listServices } from "@/lib/services.functions";
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
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const inquirySchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
    email: z.string().trim().email("Enter a valid email address").max(255, "Email is too long"),
    service: z.string().min(1, "Select a service"),
    budget: z.string().min(1, "Select a budget range"),
    message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000, "Message is too long"),
  });

  const onInquiry = (e: React.FormEvent<HTMLFormElement>) => {
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
    setTimeout(() => {
      setSending(false);
      (e.target as HTMLFormElement).reset();
      setErrors({});
      toast.success("Inquiry sent — I'll reply within 24 hours.");
    }, 600);
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
            <form
              onSubmit={onInquiry}
              className="rounded-2xl border border-border bg-white shadow-gold p-6 md:p-7 space-y-4"
            >
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Quick inquiry</p>
                <h3 className="mt-1 text-xl font-display font-semibold">Get a free 30-day plan</h3>
              </div>
              <input required name="name" placeholder="Your name" className="w-full rounded-md bg-secondary border border-border px-4 py-3 text-sm focus:outline-none focus:border-ink" />
              <input required name="email" type="email" placeholder="Email address" className="w-full rounded-md bg-secondary border border-border px-4 py-3 text-sm focus:outline-none focus:border-ink" />
              <select name="service" className="w-full rounded-md bg-secondary border border-border px-4 py-3 text-sm focus:outline-none focus:border-ink">
                <option>SEO</option>
                <option>Performance Marketing</option>
                <option>PPC</option>
                <option>Social Media (SMO)</option>
                <option>AI Automation</option>
              </select>
              <textarea name="message" rows={3} placeholder="Tell me about your goals..." className="w-full rounded-md bg-secondary border border-border px-4 py-3 text-sm focus:outline-none focus:border-ink resize-none" />
              <button
                type="submit"
                disabled={sending}
                className="w-full inline-flex justify-center items-center gap-2 rounded-md bg-ink px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-foreground transition-colors disabled:opacity-60"
              >
                {sending ? "Sending..." : <>Send inquiry <Send className="h-4 w-4" /></>}
              </button>
              <p className="text-[11px] text-muted-foreground text-center">Reply within 24 hours · No spam.</p>
            </form>
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

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-ink text-white p-12 md:p-16">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-display font-semibold">Ready to outgrow your competitors?</h2>
            <p className="mt-4 text-white/70 text-lg">
              Tell me about your goals. I&apos;ll send back a 30-day AI growth blueprint within 48 hours — free.
            </p>
            <Link to="/contact" className="mt-8 inline-flex items-center gap-2 rounded-md bg-white text-ink px-6 py-3 text-sm font-medium hover:bg-white/90 transition-colors">
              Start the conversation <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
