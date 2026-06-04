import { Link } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";

export type Crumb = { label: string; to?: string };

const SITE_URL = "https://clever-reach-pro.lovable.app";

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const full: Crumb[] = [{ label: "Home", to: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: full.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      ...(c.to ? { item: `${SITE_URL}${c.to}` } : {}),
    })),
  };

  return (
    <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1.5">
        {full.map((c, i) => {
          const isLast = i === full.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="h-3 w-3 opacity-60" aria-hidden />}
              {c.to && !isLast ? (
                <Link
                  to={c.to}
                  className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  {i === 0 && <Home className="h-3 w-3" aria-hidden />}
                  <span>{c.label}</span>
                </Link>
              ) : (
                <span
                  aria-current={isLast ? "page" : undefined}
                  className={isLast ? "text-foreground" : ""}
                >
                  {c.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </nav>
  );
}