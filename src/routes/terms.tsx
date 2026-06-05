import { createFileRoute } from "@tanstack/react-router";
import { LegalPageView, legalPageQuery } from "@/components/LegalPageView";

export const Route = createFileRoute("/terms")({
  loader: ({ context }) => context.queryClient.ensureQueryData(legalPageQuery("terms")),
  head: () => ({
    meta: [
      { title: "Terms & Conditions — vrseoguru" },
      { name: "description", content: "Terms governing the use of vrseoguru's website and services." },
    ],
  }),
  errorComponent: ({ error }) => <div className="p-10 text-center text-muted-foreground">{error.message}</div>,
  notFoundComponent: () => <div className="p-10 text-center">Page not found.</div>,
  component: () => <LegalPageView slug="terms" fallbackTitle="Terms & Conditions" />,
});