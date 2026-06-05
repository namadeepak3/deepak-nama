CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TABLE public.case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  client text NOT NULL DEFAULT '',
  tag text NOT NULL DEFAULT '',
  industry text NOT NULL DEFAULT '',
  summary text NOT NULL DEFAULT '',
  cover_image text NOT NULL DEFAULT '',
  channels jsonb NOT NULL DEFAULT '[]'::jsonb,
  hero_stats jsonb NOT NULL DEFAULT '[]'::jsonb,
  content text NOT NULL DEFAULT '',
  challenge text NOT NULL DEFAULT '',
  approach text NOT NULL DEFAULT '',
  results text NOT NULL DEFAULT '',
  testimonial_quote text NOT NULL DEFAULT '',
  testimonial_author text NOT NULL DEFAULT '',
  testimonial_role text NOT NULL DEFAULT '',
  duration text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'draft',
  featured boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  published_at timestamptz,
  meta_title text NOT NULL DEFAULT '',
  meta_description text NOT NULL DEFAULT '',
  og_image text NOT NULL DEFAULT '',
  view_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.case_studies TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.case_studies TO authenticated;
GRANT ALL ON public.case_studies TO service_role;

ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published case studies are publicly readable"
  ON public.case_studies FOR SELECT
  USING (status = 'published' OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Editors can insert case studies"
  ON public.case_studies FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Editors can update case studies"
  ON public.case_studies FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Editors can delete case studies"
  ON public.case_studies FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE TRIGGER case_studies_updated_at
  BEFORE UPDATE ON public.case_studies
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX case_studies_status_sort_idx ON public.case_studies (status, sort_order DESC, published_at DESC);

INSERT INTO public.case_studies (slug, title, client, tag, industry, summary, channels, hero_stats, challenge, approach, results, testimonial_quote, testimonial_author, testimonial_role, duration, status, featured, sort_order, published_at, meta_title, meta_description) VALUES
('lumen-skincare', 'Lumen Skincare — From ₹40L to ₹3.2Cr/mo in 9 months', 'Lumen Skincare', 'D2C · Ecommerce', 'Beauty & D2C', 'Rebuilt the Meta + Google funnel with creative iteration loops and server-side tracking. Profit-first scaling, not blended ROAS theatre.', '["Meta","Google","Email"]'::jsonb, '[{"k":"8.1x","v":"Peak ROAS"},{"k":"+312%","v":"Revenue"},{"k":"-44%","v":"CAC"}]'::jsonb, 'Plateaued at ₹40L/mo with rising CAC and broken attribution.', 'Server-side CAPI, weekly creative sprints, profit-true bid models on Meta + Google.', 'Scaled to ₹3.2Cr/mo at an 8.1x peak ROAS in 9 months with CAC down 44%.', 'They turned our paid funnel into a real growth engine — revenue 4x in under a year.', 'Aarav Khanna', 'Founder, Lumen D2C', '9 months', 'published', true, 100, now(), 'Lumen Skincare Case Study — 8.1x ROAS', 'How we scaled Lumen Skincare from ₹40L to ₹3.2Cr/mo with AI-powered Meta + Google funnels.'),
('velocity-saas', 'Velocity SaaS — CPL cut by 52% in 4 months', 'Velocity SaaS', 'B2B SaaS', 'B2B SaaS', 'Restructured Google Ads accounts, layered intent + LinkedIn retargeting, and built a content-led demo funnel.', '["Google","LinkedIn"]'::jsonb, '[{"k":"-52%","v":"CPL"},{"k":"2.1x","v":"MQLs"}]'::jsonb, 'High CPL and unqualified demo requests blocking pipeline growth.', 'Account restructure, intent-layered LinkedIn retargeting, content-led demo funnel.', 'CPL down 52%, MQLs doubled, sales-qualified pipeline up 1.8x in 4 months.', 'Our AI core rebuilt our paid funnel in 6 weeks. CPL dropped 52% and MQLs doubled.', 'David Chen', 'Founder, Velocity SaaS', '4 months', 'published', true, 90, now(), 'Velocity SaaS Case Study — CPL down 52%', 'How we cut Velocity SaaS CPL by 52% and doubled MQLs with restructured Google + LinkedIn campaigns.'),
('finovate', 'Finovate — #1 ranking on 14 money keywords', 'Finovate', 'Fintech', 'Fintech', 'Technical SEO overhaul + topical authority programme. AI-search optimization (GEO) baked in from day one.', '["SEO","Content"]'::jsonb, '[{"k":"+240%","v":"Organic"},{"k":"#1","v":"SERP"}]'::jsonb, 'Stagnant organic traffic and zero presence in AI search results.', 'Technical SEO audit, topical authority clusters, GEO/AI Overview optimization.', '+240% organic traffic, #1 rankings on 14 money keywords, cited in Perplexity + Google AI.', 'They put us on page one — and inside ChatGPT answers. Game changer for fintech discoverability.', 'Priya Raman', 'Head of Growth, Finovate', '8 months', 'published', true, 80, now(), 'Finovate Case Study — +240% Organic Traffic', 'How Finovate hit #1 SERP rankings and grew organic traffic 240% with AI-powered SEO and GEO.'),
('harborline-homes', 'Harborline Homes — Regional to national in 12 months', 'Harborline Homes', 'Real Estate', 'Real Estate', 'Geo-expansion playbook with localized landing pages, performance creative testing, and a lifecycle engine.', '["Google","Meta","SEO"]'::jsonb, '[{"k":"5.8x","v":"ROAS"},{"k":"+186%","v":"Site visits"},{"k":"3.4x","v":"Bookings"}]'::jsonb, 'Regional brand needing national-scale demand without inflating CAC.', 'Localized landing pages, creative testing engine, lifecycle nurture from cold lead to booked tour.', '5.8x ROAS, +186% visits, 3.4x property bookings inside 12 months.', 'We went from a regional player to a national brand. Strategy made the difference.', 'Maria Lopez', 'CMO, Harborline Homes', '12 months', 'published', false, 70, now(), 'Harborline Homes Case Study — 5.8x ROAS', 'How we scaled Harborline Homes from regional to national with 5.8x ROAS and 3.4x bookings.');