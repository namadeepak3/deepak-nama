import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getLegalPage } from "@/lib/cms.functions";

export const legalPageQuery = (slug: string) =>
  queryOptions({
    queryKey: ["legal-page", slug],
    queryFn: () => getLegalPage({ data: { slug } }),
  });

export function LegalPageView({ slug, fallbackTitle }: { slug: string; fallbackTitle: string }) {
  const { data } = useSuspenseQuery(legalPageQuery(slug));
  const title = data?.title || fallbackTitle;
  const updated = data?.updated_at ? new Date(data.updated_at) : new Date();
  return (
    <section className="mx-auto max-w-3xl px-5 sm:px-6 py-10 sm:py-16">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-display tracking-tight leading-tight">{title}</h1>
      <p className="mt-3 text-xs sm:text-sm text-muted-foreground">Last updated: {updated.toLocaleDateString()}</p>
      <div className="mt-8 sm:mt-10 text-[15px] sm:text-base leading-7 sm:leading-8 text-muted-foreground prose prose-sm sm:prose-base max-w-none prose-headings:text-foreground prose-headings:font-semibold prose-headings:tracking-tight prose-h2:text-lg sm:prose-h2:text-xl prose-h2:mt-8 prose-p:break-words prose-a:text-primary">
        {data?.content ? (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{data.content}</ReactMarkdown>
        ) : (
          <p>This page is being updated.</p>
        )}
      </div>
    </section>
  );
}