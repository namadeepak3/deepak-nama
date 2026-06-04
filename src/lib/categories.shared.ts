export type BlogCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  sortOrder: number;
};

export type BlogCategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  sort_order: number;
};

export function mapCategory(row: BlogCategoryRow): BlogCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? "",
    sortOrder: row.sort_order ?? 0,
  };
}
