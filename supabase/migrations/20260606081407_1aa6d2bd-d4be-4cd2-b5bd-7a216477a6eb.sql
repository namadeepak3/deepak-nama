-- Add content JSONB to home_sections for structured per-section data
ALTER TABLE public.home_sections
  ADD COLUMN IF NOT EXISTS content jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS image_url text NOT NULL DEFAULT '';

-- Storage policies for site-images bucket (private bucket, RLS-gated)
-- Public read via app route (uses service role), so only editors/admins write/update/delete directly.

DROP POLICY IF EXISTS "Editors can upload site-images" ON storage.objects;
CREATE POLICY "Editors can upload site-images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'site-images'
  AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role))
);

DROP POLICY IF EXISTS "Editors can update site-images" ON storage.objects;
CREATE POLICY "Editors can update site-images"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'site-images'
  AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role))
)
WITH CHECK (
  bucket_id = 'site-images'
  AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role))
);

DROP POLICY IF EXISTS "Editors can delete site-images" ON storage.objects;
CREATE POLICY "Editors can delete site-images"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'site-images'
  AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role))
);

DROP POLICY IF EXISTS "Editors can list site-images" ON storage.objects;
CREATE POLICY "Editors can list site-images"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'site-images'
  AND (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role))
);