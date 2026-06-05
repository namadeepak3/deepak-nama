import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — vrseoguru" },
      { name: "description", content: "How vrseoguru collects, uses and protects your personal information." },
    ],
  }),
  component: PrivacyPolicy,
});

function PrivacyPolicy() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-4xl font-display tracking-tight">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none text-sm leading-relaxed text-muted-foreground">
        <h2 className="text-foreground">1. Information we collect</h2>
        <p>We collect information you provide directly — name, email, phone, company and website — when you submit a contact form, request an audit, or sign up for our services.</p>
        <h2 className="text-foreground">2. How we use your information</h2>
        <p>To respond to your inquiry, deliver requested services, send service-related communications, and improve our offerings. We never sell your personal data.</p>
        <h2 className="text-foreground">3. Cookies & analytics</h2>
        <p>We use first-party analytics to understand how visitors use the site. You can disable cookies in your browser settings.</p>
        <h2 className="text-foreground">4. Data sharing</h2>
        <p>We share data only with vetted processors (hosting, email, analytics) required to operate the service, under appropriate confidentiality terms.</p>
        <h2 className="text-foreground">5. Your rights</h2>
        <p>You can request access, correction or deletion of your data at any time by emailing <a href="mailto:hello@vrseoguru.com" className="text-primary">hello@vrseoguru.com</a>.</p>
        <h2 className="text-foreground">6. Contact</h2>
        <p>Questions? Reach us at <a href="mailto:hello@vrseoguru.com" className="text-primary">hello@vrseoguru.com</a>.</p>
      </div>
    </section>
  );
}