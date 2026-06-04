export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  content: string;
  tags: string[];
  status: "draft" | "published";
  authorName: string;
  readingMinutes: number;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  metaTitle: string;
  category: string;
  categoryId: string | null;
  metaDescription: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
};

export type BlogPostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string;
  content: string;
  tags: unknown;
  status: string;
  author_name: string;
  reading_minutes: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  category?: string | null;
  category_id?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  canonical_url?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  twitter_title?: string | null;
  twitter_description?: string | null;
  twitter_image?: string | null;
};

export function mapPost(row: BlogPostRow): BlogPost {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    coverImage: row.cover_image,
    content: row.content,
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : [],
    status: (row.status === "published" ? "published" : "draft"),
    authorName: row.author_name,
    readingMinutes: row.reading_minutes,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    category: row.category ?? "",
    categoryId: row.category_id ?? null,
    metaTitle: row.meta_title ?? "",
    metaDescription: row.meta_description ?? "",
    canonicalUrl: row.canonical_url ?? "",
    ogTitle: row.og_title ?? "",
    ogDescription: row.og_description ?? "",
    ogImage: row.og_image ?? "",
    twitterTitle: row.twitter_title ?? "",
    twitterDescription: row.twitter_description ?? "",
    twitterImage: row.twitter_image ?? "",
  };
}