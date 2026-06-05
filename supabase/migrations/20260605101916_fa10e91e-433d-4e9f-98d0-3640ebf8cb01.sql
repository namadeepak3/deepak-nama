-- Restrict pdf_template_settings reads to admins only (was: any authenticated user)
DROP POLICY IF EXISTS "Authenticated can read template" ON public.pdf_template_settings;

CREATE POLICY "Admins can read template"
  ON public.pdf_template_settings
  FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));