import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPostBySlug, listPublishedPosts } from "@/lib/blog.functions";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: "Article — vrseoguru" },
      { name: "description", content: "Insights on AI-driven SEO, performance marketing and automation." },
      { property: "og:url", content: `/blog/${params?.slug ?? ""}` },
    ],
    links: [{ rel: "canonical", href: `/blog/${params?.slug ?? ""}` }],
  }),
  component: BlogDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-32 text-center">
      <h1 className="text-4xl font-display font-semibold">Post not found</h1>
      <Link to="/blog" className="mt-6 inline-flex items-center gap-2 text-primary hover:text-accent">
        <ArrowLeft className="h-4 w-4" /> Back to blog
      </Link>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="mx-auto max-w-3xl px-6 py-32 text-center">
      <h1 className="text-2xl font-display font-semibold">Something went wrong</h1>
      <button onClick={reset} className="mt-6 rounded-md bg-primary px-4 py-2 text-primary-foreground">Try again</button>
    </div>
  ),
});

function BlogDetail() {
  const { slug } = Route.useParams();
  const fetchOne = useServerFn(getPostBySlug);
  const fetchAll = useServerFn(listPublishedPosts);
  const { data: post, isLoading } = useQuery({ queryKey: ["blog", "post", slug], queryFn: () => fetchOne({ data: { slug } }) });
  const { data: all = [] } = useQuery({ queryKey: ["blog", "published"], queryFn: () => fetchAll() });

  if (isLoading) return <p className="px-6 py-20 text-center text-muted-foreground">Loading…</p>;
  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-32 text-center">
        <h1 className="text-4xl font-display font-semibold">Post not found</h1>
        <Link to="/blog" className="mt-6 inline-flex items-center gap-2 text-primary hover:text-accent">
          <ArrowLeft className="h-4 w-4" /> Back to blog
        </Link>
      </div>
    );
  }

  const related = all.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <>
      <section className="bg-noir-grid border-b border-border">
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to blog
          </Link>
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span key={t} className="rounded-full border border-primary/30 bg-primary/5 px-2.5 py-0.5 text-[11px] uppercase tracking-widest text-primary">
                {t}
              </span>
            ))}
          </div>
          <h1 className="mt-5 text-4xl md:text-5xl font-display font-semibold leading-tight">{post.title}</h1>
          <p className="mt-5 text-lg text-muted-foreground">{post.excerpt}</p>
          <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
            {post.authorName && <span>By {post.authorName}</span>}
            <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" }) : ""}</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readingMinutes} min read</span>
          </div>
        </div>
      </section>

      {post.coverImage && (
        <div className="mx-auto max-w-5xl px-6 -mt-6 md:-mt-10">
          <div className="aspect-[16/8] overflow-hidden rounded-2xl border border-border bg-muted">
            <img src={post.coverImage} alt={post.title} className="h-full w-full object-cover" />
          </div>
        </div>
      )}

      <article className="mx-auto max-w-3xl px-6 py-16 prose prose-invert prose-headings:font-display prose-headings:font-semibold prose-a:text-primary prose-strong:text-foreground prose-code:text-primary max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </article>

      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <h2 className="text-2xl font-display font-semibold">Keep reading</h2>
          <div className="mt-6 grid md:grid-cols-3 gap-5">
            {related.map((r) => (
              <Link
                key={r.id}
                to="/blog/$slug"
                params={{ slug: r.slug }}
                className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/60 transition-colors"
              >
                <h3 className="text-lg font-display font-semibold">{r.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{r.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm text-primary group-hover:gap-2 transition-all">
                  Read <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}