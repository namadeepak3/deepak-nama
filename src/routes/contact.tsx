import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, MessageSquare, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — vrseoguru" },
      { name: "description", content: "Tell vrseoguru about your project and get a free AI growth blueprint within 48 hours." },
      { property: "og:title", content: "Contact — vrseoguru" },
      { property: "og:description", content: "Get in touch for AI-powered digital marketing." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sending, setSending] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Message sent — I'll reply within 24 hours.");
    }, 700);
  };

  return (
    <>
      <Toaster />
      <section className="bg-noir-grid border-b border-border">
        <div className="mx-auto max-w-5xl px-6 py-24 md:py-32">
          <p className="text-sm text-primary uppercase tracking-widest">Contact</p>
          <h1 className="mt-4 text-5xl md:text-6xl font-display font-semibold max-w-3xl">
            Tell me about your <span className="text-gradient-gold">next growth chapter.</span>
          </h1>
          <p className="mt-6 max-w-xl text-muted-foreground text-lg">
            Drop a few details below. You&apos;ll get a personal reply with a 30-day AI growth blueprint — within 48 hours.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-20 grid md:grid-cols-5 gap-10">
        <form onSubmit={onSubmit} className="md:col-span-3 space-y-5 rounded-2xl border border-border bg-card p-8">
          <Field label="Your name" name="name" placeholder="Jane Doe" required />
          <Field label="Email" name="email" type="email" placeholder="jane@brand.com" required />
          <Field label="Company / Website" name="company" placeholder="https://" />
          <div>
            <label className="block text-sm font-medium mb-2">What do you need help with?</label>
            <select name="service" className="w-full rounded-md bg-input/30 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary">
              <option>SEO</option>
              <option>Performance Marketing</option>
              <option>PPC</option>
              <option>Social Media (SMO)</option>
              <option>AI Automation</option>
              <option>Full growth retainer</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tell me more</label>
            <textarea
              name="message"
              rows={5}
              required
              placeholder="Goals, timeline, budget range..."
              className="w-full rounded-md bg-input/30 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary resize-none"
            />
          </div>
          <button
            type="submit"
            disabled={sending}
            className="w-full inline-flex justify-center items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-gold hover:bg-accent transition-colors disabled:opacity-60"
          >
            {sending ? "Sending..." : <>Send message <Send className="h-4 w-4" /></>}
          </button>
        </form>

        <aside className="md:col-span-2 space-y-4">
          <InfoCard icon={Mail} title="Email" value="hello@vrseoguru.com" />
          <InfoCard icon={MessageSquare} title="Response time" value="Within 24 hours, weekdays" />
          <InfoCard icon={Sparkles} title="Free deliverable" value="30-day AI growth blueprint with every inquiry" />
        </aside>
      </section>
    </>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input {...rest} className="w-full rounded-md bg-input/30 border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary" />
    </div>
  );
}

function InfoCard({ icon: Icon, title, value }: { icon: React.ComponentType<{ className?: string }>; title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="h-10 w-10 rounded-lg bg-primary/10 border border-primary/30 grid place-items-center mb-3">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <p className="text-xs uppercase tracking-widest text-muted-foreground">{title}</p>
      <p className="mt-1 text-foreground">{value}</p>
    </div>
  );
}