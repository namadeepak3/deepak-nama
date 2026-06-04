
CREATE TABLE public.blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.blog_categories TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.blog_categories TO authenticated;
GRANT ALL ON public.blog_categories TO service_role;

ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are publicly readable"
ON public.blog_categories FOR SELECT
USING (true);

CREATE POLICY "Editors can insert categories"
ON public.blog_categories FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Editors can update categories"
ON public.blog_categories FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'editor'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Editors can delete categories"
ON public.blog_categories FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role) OR public.has_role(auth.uid(), 'editor'::app_role));

CREATE TRIGGER touch_blog_categories
BEFORE UPDATE ON public.blog_categories
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES public.blog_categories(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS blog_posts_category_id_idx ON public.blog_posts(category_id);
