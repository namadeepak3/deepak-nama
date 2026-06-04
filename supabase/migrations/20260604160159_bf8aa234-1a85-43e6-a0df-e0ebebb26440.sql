
ALTER TABLE public.blog_posts
  ADD COLUMN IF NOT EXISTS faqs jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS view_count integer NOT NULL DEFAULT 0;

ALTER TABLE public.services
  ADD COLUMN IF NOT EXISTS view_count integer NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION public.increment_view(_target_type text, _target_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF _target_type = 'blog' THEN
    UPDATE public.blog_posts SET view_count = view_count + 1 WHERE id = _target_id;
  ELSIF _target_type = 'service' THEN
    UPDATE public.services SET view_count = view_count + 1 WHERE id = _target_id;
  ELSE
    RAISE EXCEPTION 'Unknown target_type %', _target_type;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_view(text, uuid) TO anon, authenticated;
