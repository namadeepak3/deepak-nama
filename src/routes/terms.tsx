import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — vrseoguru" },
      { name: "description", content: "Terms governing the use of vrseoguru's website and services." },
    ],
  }),
  component: Terms,
});

function Terms() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-display tracking-tight">Terms &amp; Conditions</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-foreground">1. Acceptance</h2>
        <p>By using vrseoguru.com or engaging our services you agree to these terms. If you do not agree, please do not use the site or services.</p>
        <h2 className="text-foreground">2. Services</h2>
        <p>Scope, timeline and deliverables for engagements are defined in a separate statement of work or proposal signed by both parties.</p>
        <h2 className="text-foreground">3. Intellectual property</h2>
        <p>All site content (copy, design, code) is owned by vrseoguru unless stated otherwise. Client deliverables are transferred upon full payment.</p>
        <h2 className="text-foreground">4. Confidentiality</h2>
        <p>Both parties agree to keep non-public business information confidential and use it only for the purpose of the engagement.</p>
        <h2 className="text-foreground">5. Limitation of liability</h2>
        <p>Our total liability for any claim arising from the services is limited to the fees paid in the three months preceding the claim.</p>
        <h2 className="text-foreground">6. Governing law</h2>
        <p>These terms are governed by the laws of India. Disputes will be resolved in the courts of competent jurisdiction.</p>
        <h2 className="text-foreground">7. Contact</h2>
        <p>For questions about these terms, email <a href="mailto:hello@vrseoguru.com" className="text-primary">hello@vrseoguru.com</a>.</p>
      </div>
    </section>
  );
}