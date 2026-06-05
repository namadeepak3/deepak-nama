import { createFileRoute } from "@tanstack/react-router";
import { LegalPageView, legalPageQuery } from "@/components/LegalPageView";

export const Route = createFileRoute("/refund-policy")({
  loader: ({ context }) => context.queryClient.ensureQueryData(legalPageQuery("refund-policy")),
  head: () => ({
    meta: [
      { title: "Refund Policy — vrseoguru" },
      { name: "description", content: "Refund terms for vrseoguru services and retainers." },
    ],
  }),
  errorComponent: ({ error }) => <div className="p-10 text-center text-muted-foreground">{error.message}</div>,
  notFoundComponent: () => <div className="p-10 text-center">Page not found.</div>,
  component: () => <LegalPageView slug="refund-policy" fallbackTitle="Refund Policy" />,
});