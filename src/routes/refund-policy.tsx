import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/refund-policy")({
  head: () => ({
    meta: [
      { title: "Refund Policy — vrseoguru" },
      { name: "description", content: "Refund terms for vrseoguru services and retainers." },
    ],
  }),
  component: RefundPolicy,
});

function RefundPolicy() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-display tracking-tight">Refund Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-foreground">1. Service-based engagements</h2>
        <p>Because our work involves senior strategist time and tooling allocated to your account from day one, fees for completed work are non-refundable.</p>
        <h2 className="text-foreground">2. Monthly retainers</h2>
        <p>You may cancel a monthly retainer at any time with 15 days' written notice. Pre-paid fees for the unused portion of the next billing cycle will be refunded on a pro-rata basis.</p>
        <h2 className="text-foreground">3. Project deposits</h2>
        <p>Project deposits are refundable within 7 days of payment, provided work has not started. Once kickoff has occurred, deposits are non-refundable.</p>
        <h2 className="text-foreground">4. Disputes</h2>
        <p>If you're unhappy with the work, contact us at <a href="mailto:hello@vrseoguru.com" className="text-primary">hello@vrseoguru.com</a> within 7 days and we'll work to resolve it.</p>
        <h2 className="text-foreground">5. Processing</h2>
        <p>Approved refunds are processed within 7–10 business days to the original payment method.</p>
      </div>
    </section>
  );
}