import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "FAQs — vrseoguru" },
      { name: "description", content: "Frequently asked questions about vrseoguru's AI-powered digital marketing services." },
    ],
  }),
  component: FaqsPage,
});

const faqs = [
  {
    q: "What services do you offer?",
    a: "SEO, performance marketing (Google & Meta Ads), social media optimization, WhatsApp & SMS marketing, CRO, analytics, and AI-led lifecycle automation.",
  },
  {
    q: "How is your work different from a traditional agency?",
    a: "An AI core sits across every channel — bidding, creative, SEO and analytics — so campaigns improve every hour, not every quarter. You also work directly with a senior strategist, never a junior.",
  },
  {
    q: "What does a typical engagement look like?",
    a: "Most clients start with a free audit, followed by a 30/60/90-day plan. Retainers are monthly, billed in advance, and cancellable with 15 days' notice.",
  },
  {
    q: "How quickly do you respond?",
    a: "Within 1 business day for all inquiries. Existing clients get same-day responses on weekdays.",
  },
  {
    q: "Do you work with startups or only enterprise?",
    a: "Both. We're set up to serve ambitious modern brands at any scale — from seed-stage to post-IPO.",
  },
  {
    q: "Where are you based?",
    a: "India, working with clients globally across India, the US, the UK, the UAE and APAC.",
  },
];

function FaqsPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mx-auto max-w-3xl px-5 sm:px-6 py-10 sm:py-16">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-display tracking-tight leading-tight">Frequently asked questions</h1>
      <p className="mt-3 text-sm sm:text-base text-muted-foreground">Quick answers to what most people ask before getting started.</p>
      <ul className="mt-8 sm:mt-10 divide-y divide-border rounded-2xl border border-border bg-card">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <li key={f.q}>
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full flex items-start gap-4 px-5 sm:px-6 py-5 text-left transition-colors hover:bg-secondary/50"
                aria-expanded={isOpen}
              >
                <span className="flex-1 text-base sm:text-lg font-medium text-foreground leading-snug">{f.q}</span>
                <ChevronDown className={`h-5 w-5 shrink-0 mt-1 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="px-5 sm:px-6 pb-5 -mt-1 text-sm sm:text-base leading-7 text-muted-foreground">
                  {f.a}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}