import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/thank-you")({
  head: () => ({
    meta: [
      { title: "Thank you — vrseoguru" },
      { name: "description", content: "Your request has been received. A senior strategist will reply within one business day." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ThankYouPage,
});

function ThankYouPage() {
  return (
    <section className="mx-auto max-w-2xl px-6 py-24 text-center">
      <div className="mx-auto h-16 w-16 rounded-full bg-primary/15 grid place-items-center">
        <CheckCircle2 className="h-9 w-9 text-primary" />
      </div>
      <h1 className="mt-6 text-3xl md:text-4xl font-display">Thank you — your request is in.</h1>
      <p className="mt-4 text-muted-foreground">
        A senior strategist will review your website and reply within <span className="text-foreground font-medium">one business day</span>.
        Meanwhile, explore how we work.
      </p>
      <div className="mt-8 flex justify-center gap-3 flex-wrap">
        <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm hover:border-primary">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <Link to="/services" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
          See our services
        </Link>
      </div>
    </section>
  );
}