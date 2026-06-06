
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE public.announcement_bar (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enabled BOOLEAN NOT NULL DEFAULT true,
  message TEXT NOT NULL DEFAULT '',
  cta_label TEXT NOT NULL DEFAULT '',
  cta_href TEXT NOT NULL DEFAULT '',
  singleton BOOLEAN NOT NULL DEFAULT true UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.announcement_bar TO anon, authenticated;
GRANT ALL ON public.announcement_bar TO service_role;

ALTER TABLE public.announcement_bar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view announcement"
  ON public.announcement_bar FOR SELECT
  USING (true);

CREATE POLICY "Admins/editors can update announcement"
  ON public.announcement_bar FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor'));

CREATE TRIGGER update_announcement_bar_updated_at
  BEFORE UPDATE ON public.announcement_bar
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.announcement_bar (enabled, message, cta_label, cta_href)
VALUES (
  true,
  'vrseoguru AI Ops is live. Build automations with ChatGPT, Claude, n8n, Zapier & more.',
  'Explore plan',
  '/services'
);
