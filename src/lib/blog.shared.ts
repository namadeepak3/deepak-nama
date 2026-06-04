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
  };
}