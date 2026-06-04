import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Clock } from "lucide-react";
import { listPublishedPosts } from "@/lib/blog.functions";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog — vrseoguru" },
      { name: "description", content: "Insights on AI-driven SEO, performance marketing, automation and CRO." },
      { property: "og:title", content: "Blog — vrseoguru" },
      { property: "og:description", content: "Insights on AI-driven SEO, performance marketing, automation and CRO." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const fetchPosts = useServerFn(listPublishedPosts);
  const { data: posts = [], isLoading } = useQuery({ queryKey: ["blog", "published"], queryFn: () => fetchPosts() });

  const [featured, ...rest] = posts;

  return (
    <>
      <section className="bg-noir-grid border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-24 md:py-32">
          <Breadcrumbs items={[{ label: "Blog" }]} />
          <p className="mt-6 text-sm text-primary uppercase tracking-widest">Journal</p>
          <h1 className="mt-4 text-5xl md:text-6xl font-display font-semibold max-w-3xl">
            Tactical writing on <span className="text-gradient-gold">growth, AI and SEO.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            Field-tested ideas from real client work — no recycled hot takes.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        {isLoading && <p className="text-center text-muted-foreground">Loading…</p>}
        {!isLoading && posts.length === 0 && (
          <p className="text-center text-muted-foreground">No posts published yet.</p>
        )}

        {featured && (
          <Link
            to="/blog/$slug"
            params={{ slug: featured.slug }}
            className="group block rounded-3xl border border-border bg-card overflow-hidden hover:border-primary/60 transition-colors"
          >
            <div className="grid md:grid-cols-2 gap-0">
              <div className="aspect-[16/10] md:aspect-auto overflow-hidden bg-muted">
                {featured.coverImage ? (
                  <img
                    src={featured.coverImage}
                    alt={featured.title}
                    loading="lazy"
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : null}
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex flex-wrap gap-2">
                  {featured.tags.slice(0, 3).map((t) => (
                    <span key={t} className="rounded-full border border-primary/30 bg-primary/5 px-2.5 py-0.5 text-[11px] uppercase tracking-widest text-primary">
                      {t}
                    </span>
                  ))}
                </div>
                <h2 className="mt-5 text-3xl md:text-4xl font-display font-semibold leading-tight">
                  {featured.title}
                </h2>
                <p className="mt-4 text-muted-foreground leading-relaxed">{featured.excerpt}</p>
                <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{featured.publishedAt ? new Date(featured.publishedAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : ""}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {featured.readingMinutes} min</span>
                </div>
                <span className="mt-6 inline-flex items-center gap-1 text-sm text-primary group-hover:gap-2 transition-all">
                  Read article <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        )}

        {rest.length > 0 && (
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((p) => (
              <Link
                key={p.id}
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/60 transition-colors"
              >
                <div className="aspect-[16/10] overflow-hidden bg-muted">
                  {p.coverImage ? (
                    <img
                      src={p.coverImage}
                      alt={p.title}
                      loading="lazy"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : null}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex flex-wrap gap-2">
                    {p.tags.slice(0, 2).map((t) => (
                      <span key={t} className="rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5 text-[10px] uppercase tracking-widest text-primary">
                        {t}
                      </span>
                    ))}
                  </div>
                  <h3 className="mt-4 text-xl font-display font-semibold leading-snug">{p.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>
                  <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }) : ""}</span>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {p.readingMinutes} min</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}