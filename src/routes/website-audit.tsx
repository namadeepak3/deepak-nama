import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Search, CheckCircle2, ShieldCheck, Zap, BarChart3 } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useServerFn } from "@tanstack/react-start";
import { createLead } from "@/lib/leads.functions";
import { z } from "zod";

export const Route = createFileRoute("/website-audit")({
  head: () => ({
    meta: [
      { title: "Free Website Audit — vrseoguru" },
      { name: "description", content: "Get a free expert website audit covering SEO, performance, conversion and AI search readiness — delivered within one business day." },
      { property: "og:title", content: "Free Website Audit — vrseoguru" },
      { property: "og:description", content: "Free SEO, performance & CRO audit by senior strategists." },
      { property: "og:url", content: "/website-audit" },
    ],
    links: [{ rel: "canonical", href: "/website-audit" }],
  }),
  component: WebsiteAuditPage,
});

function WebsiteAuditPage() {
  const navigate = useNavigate();
  const submitLead = useServerFn(createLead);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const schema = z.object({
    name: z.string().trim().min(2, "Enter your name").max(100),
    email: z.string().trim().email("Enter a valid email").max(255),
    phone: z.string().trim().min(6, "Enter a valid phone").max(40),
    website: z.string().trim().min(3, "Enter your website").max(255),
    message: z.string().trim().min(10, "Tell us a bit more").max(1000),
  });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const fd = new FormData(e.currentTarget);
    const raw = {
      name: (fd.get("name") as string) || "",
      email: (fd.get("email") as string) || "",
      phone: (fd.get("phone") as string) || "",
      website: (fd.get("website") as string) || "",
      message: (fd.get("message") as string) || "",
    };
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      parsed.error.issues.forEach((i) => { const k = i.path[0] as string; if (!fe[k]) fe[k] = i.message; });
      setErrors(fe);
      return;
    }
    setSending(true);
    try {
      const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      await submitLead({
        data: {
          ...parsed.data,
          service: "Website Audit",
          budget: "",
          kind: "audit",
          pageUrl: typeof window !== "undefined" ? window.location.href : "",
          referrer: typeof document !== "undefined" ? document.referrer : "",
          utmSource: params?.get("utm_source") ?? "",
          utmMedium: params?.get("utm_medium") ?? "",
          utmCampaign: params?.get("utm_campaign") ?? "",
        },
      });
      navigate({ to: "/thank-you" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit");
      setSending(false);
    }
  };

  return (
    <>
      <Toaster />
      <section className="bg-noir-grid border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <Breadcrumbs items={[{ label: "Website Audit" }]} />
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            <Search className="h-3.5 w-3.5" /> Free Website Audit
          </div>
          <h1 className="mt-4 text-4xl md:text-6xl font-display font-semibold max-w-3xl leading-tight">
            A <span className="text-gradient-gold">free expert audit</span> of your website.
          </h1>
          <p className="mt-6 max-w-2xl text-muted-foreground text-base md:text-lg">
            Senior strategists review your SEO, performance, conversion and AI-search readiness — and send you a 30-day action plan within one business day.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Manual review, no bots</div>
            <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Delivered in 24 hours</div>
            <div className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" /> Actionable, prioritised fixes</div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card shadow-gold p-6 md:p-8 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-primary font-semibold">Request audit</p>
            <h2 className="mt-1 text-2xl font-display">Tell us about your site</h2>
          </div>
          <Field name="name" placeholder="Your name" error={errors.name} />
          <Field name="website" placeholder="Your website (e.g. example.com)" error={errors.website} />
          <div className="grid md:grid-cols-2 gap-3">
            <Field name="phone" placeholder="Phone number" error={errors.phone} />
            <Field name="email" type="email" placeholder="Email address" error={errors.email} />
          </div>
          <div>
            <textarea
              name="message"
              rows={4}
              placeholder="What would you like us to focus on? (SEO, speed, conversions…)"
              className={`w-full rounded-xl bg-secondary border px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none ${errors.message ? "border-red-400" : "border-border"}`}
            />
            {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
          </div>
          <button
            type="submit"
            disabled={sending}
            className="w-full inline-flex justify-center items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition disabled:opacity-60 shadow-gold"
          >
            {sending ? "Sending..." : <>Request my free audit <Send className="h-4 w-4" /></>}
          </button>
          <p className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground"><CheckCircle2 className="h-3 w-3 text-primary" /> Your details stay private. No spam.</p>
        </form>
      </section>
    </>
  );
}

function Field({ name, placeholder, type = "text", error }: { name: string; placeholder: string; type?: string; error?: string }) {
  return (
    <div>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className={`w-full rounded-xl bg-secondary border px-4 py-3 text-sm focus:outline-none focus:border-primary ${error ? "border-red-400" : "border-border"}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}