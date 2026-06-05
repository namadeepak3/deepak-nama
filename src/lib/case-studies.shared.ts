export type CaseStudyStat = { k: string; v: string };

export type CaseStudy = {
  id: string;
  slug: string;
  title: string;
  client: string;
  tag: string;
  industry: string;
  summary: string;
  coverImage: string;
  channels: string[];
  heroStats: CaseStudyStat[];
  content: string;
  challenge: string;
  approach: string;
  results: string;
  testimonialQuote: string;
  testimonialAuthor: string;
  testimonialRole: string;
  duration: string;
  status: string;
  featured: boolean;
  publishedAt: string | null;
  metaTitle: string;
  metaDescription: string;
  ogImage: string;
};

export type CaseStudyRow = {
  id: string;
  slug: string;
  title: string;
  client: string;
  tag: string;
  industry: string;
  summary: string;
  cover_image: string;
  channels: unknown;
  hero_stats: unknown;
  content: string;
  challenge: string;
  approach: string;
  results: string;
  testimonial_quote: string;
  testimonial_author: string;
  testimonial_role: string;
  duration: string;
  status: string;
  featured: boolean;
  sort_order: number;
  published_at: string | null;
  meta_title: string;
  meta_description: string;
  og_image: string;
};

export function mapCaseStudy(row: CaseStudyRow): CaseStudy {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    client: row.client,
    tag: row.tag,
    industry: row.industry,
    summary: row.summary,
    coverImage: row.cover_image,
    channels: Array.isArray(row.channels) ? (row.channels as string[]) : [],
    heroStats: Array.isArray(row.hero_stats) ? (row.hero_stats as CaseStudyStat[]) : [],
    content: row.content,
    challenge: row.challenge,
    approach: row.approach,
    results: row.results,
    testimonialQuote: row.testimonial_quote,
    testimonialAuthor: row.testimonial_author,
    testimonialRole: row.testimonial_role,
    duration: row.duration,
    status: row.status,
    featured: row.featured,
    publishedAt: row.published_at,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    ogImage: row.og_image,
  };
}