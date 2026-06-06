
-- 1. Services: show_on_home flag
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS show_on_home boolean NOT NULL DEFAULT true;

-- 2. Home sections table
CREATE TABLE IF NOT EXISTS public.home_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  enabled boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  eyebrow text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  cta_label text NOT NULL DEFAULT '',
  cta_href text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.home_sections TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.home_sections TO authenticated;
GRANT ALL ON public.home_sections TO service_role;

ALTER TABLE public.home_sections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view home sections"
  ON public.home_sections FOR SELECT
  USING (true);

CREATE POLICY "Editors can insert home sections"
  ON public.home_sections FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Editors can update home sections"
  ON public.home_sections FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Editors can delete home sections"
  ON public.home_sections FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE TRIGGER home_sections_set_updated_at
  BEFORE UPDATE ON public.home_sections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. Seed sections in current home page order
INSERT INTO public.home_sections (key, sort_order, eyebrow, title, subtitle, cta_label, cta_href) VALUES
  ('hero', 0, '', 'AI-Powered Digital Marketing Services', 'Engineered for revenue.', 'Get a free audit', '/contact'),
  ('channels', 1, 'AI-powered channels we run', 'Every channel your brand needs to grow.', 'A unified operating system for paid, organic, lifecycle and creative — all driven by AI.', '', ''),
  ('ai_stack', 2, 'Your growth engine, always on', 'AI agents that run your marketing 24/7', 'Always-on agents researching, creating, optimising and reporting — across every channel.', '', ''),
  ('services', 3, 'Digital marketing services', 'Every channel your brand needs to grow.', 'Pick a service to see how AI powers our delivery.', 'See all services', '/services'),
  ('platforms', 4, 'Marketing platforms', 'Built on the platforms that matter.', 'GA4, GTM, HubSpot, Klaviyo, Shopify and 60+ tools — instrumented, integrated, automated.', '', ''),
  ('whatsapp', 5, 'Instant lead routing', 'Capture leads on WhatsApp & SMS — instantly.', 'Two-way conversational lead capture with AI qualification and CRM sync in under 30 seconds.', '', ''),
  ('process', 6, 'How we work', 'Our AI agentic process', 'Six steps from kick-off to compounding growth — instrumented end-to-end.', '', ''),
  ('about', 7, 'About the agency', 'Who I am', 'I''m a senior digital marketer building AI-first growth systems for ambitious brands.', '', ''),
  ('industries', 8, 'Industries we serve', 'Industries we serve', 'D2C, SaaS, fintech, healthcare, real estate, education and B2B services.', '', ''),
  ('tech_stack', 9, 'Tooling', 'Our AI + Marketing Stack', 'The exact stack we use to build, run and report growth — for every client.', '', ''),
  ('workflow', 10, 'End-to-end AI workflow', 'How AI agents run your marketing', 'From signal capture to creative testing to reporting — instrumented end-to-end.', '', ''),
  ('results', 11, 'Outcomes', 'Outcomes that compound', 'Numbers from live engagements across SEO, paid, lifecycle and creative.', '', ''),
  ('case_studies', 12, 'Case studies', 'Proof, not promises.', 'See how we''ve grown brands across SEO, paid, lifecycle and creative.', 'See all case studies', '/case-studies'),
  ('insights', 13, 'Insights', 'Latest from our blog', 'Frameworks, teardowns and playbooks on AI-led growth.', 'Read the blog', '/blog'),
  ('testimonials', 14, 'Testimonials', 'What founders & marketers say', 'Trusted by ambitious brands building AI-powered growth engines.', '', ''),
  ('final_cta', 15, '', 'Ready to grow with an AI-first agency?', 'Get a free strategy call and a custom AI growth blueprint within 48 hours.', 'Book a strategy call', '/contact')
ON CONFLICT (key) DO NOTHING;
