import { createFileRoute } from "@tanstack/react-router";
import { LegalPageView, legalPageQuery } from "@/components/LegalPageView";

export const Route = createFileRoute("/privacy-policy")({
  loader: ({ context }) => context.queryClient.ensureQueryData(legalPageQuery("privacy-policy")),
  head: () => ({
    meta: [
      { title: "Privacy Policy — vrseoguru" },
      { name: "description", content: "How vrseoguru collects, uses and protects your personal information." },
    ],
  }),
  errorComponent: ({ error }) => <div className="p-10 text-center text-muted-foreground">{error.message}</div>,
  notFoundComponent: () => <div className="p-10 text-center">Page not found.</div>,
  component: () => <LegalPageView slug="privacy-policy" fallbackTitle="Privacy Policy" />,
});