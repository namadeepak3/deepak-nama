CREATE TABLE public.pdf_template_settings (
  id text PRIMARY KEY DEFAULT 'default',
  company_name text NOT NULL DEFAULT 'Website Audit',
  tagline text NOT NULL DEFAULT 'AI-powered preliminary audit',
  footer_text text NOT NULL DEFAULT 'This is a preliminary AI-generated preview. A senior strategist will deliver the full audit within one business day.',
  contact_line text NOT NULL DEFAULT '',
  logo_url text NOT NULL DEFAULT '',
  color_primary text NOT NULL DEFAULT '#2563eb',
  color_accent text NOT NULL DEFAULT '#0ea5e9',
  color_text text NOT NULL DEFAULT '#1f2937',
  color_muted text NOT NULL DEFAULT '#6b7280',
  show_summary boolean NOT NULL DEFAULT true,
  show_score boolean NOT NULL DEFAULT true,
  show_findings boolean NOT NULL DEFAULT true,
  show_next_actions boolean NOT NULL DEFAULT true,
  show_intro boolean NOT NULL DEFAULT false,
  show_outro boolean NOT NULL DEFAULT false,
  intro_text text NOT NULL DEFAULT '',
  outro_text text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pdf_template_settings_singleton CHECK (id = 'default')
);

GRANT SELECT ON public.pdf_template_settings TO authenticated;
GRANT ALL ON public.pdf_template_settings TO service_role;

ALTER TABLE public.pdf_template_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read template"
  ON public.pdf_template_settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins manage template"
  ON public.pdf_template_settings FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER pdf_template_settings_touch
  BEFORE UPDATE ON public.pdf_template_settings
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.pdf_template_settings (id) VALUES ('default') ON CONFLICT DO NOTHING;