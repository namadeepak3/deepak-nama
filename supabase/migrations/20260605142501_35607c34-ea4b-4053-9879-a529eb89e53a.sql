
-- legal_pages
CREATE TABLE public.legal_pages (
  slug text PRIMARY KEY,
  title text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'published',
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.legal_pages TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.legal_pages TO authenticated;
GRANT ALL ON public.legal_pages TO service_role;
ALTER TABLE public.legal_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published legal pages are publicly readable"
  ON public.legal_pages FOR SELECT
  USING (status = 'published' OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Editors can insert legal pages"
  ON public.legal_pages FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Editors can update legal pages"
  ON public.legal_pages FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Editors can delete legal pages"
  ON public.legal_pages FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE TRIGGER legal_pages_touch_updated_at
  BEFORE UPDATE ON public.legal_pages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.legal_pages (slug, title, content, status) VALUES
('privacy-policy', 'Privacy Policy',
'<h2>1. Information we collect</h2><p>We collect information you provide directly — name, email, phone, company and website — when you submit a contact form, request an audit, or sign up for our services.</p><h2>2. How we use your information</h2><p>To respond to your inquiry, deliver requested services, send service-related communications, and improve our offerings. We never sell your personal data.</p><h2>3. Cookies &amp; analytics</h2><p>We use first-party analytics to understand how visitors use the site. You can disable cookies in your browser settings.</p><h2>4. Data sharing</h2><p>We share data only with vetted processors (hosting, email, analytics) required to operate the service, under appropriate confidentiality terms.</p><h2>5. Your rights</h2><p>You can request access, correction or deletion of your data at any time by emailing <a href="mailto:hello@vrseoguru.com">hello@vrseoguru.com</a>.</p><h2>6. Contact</h2><p>Questions? Reach us at <a href="mailto:hello@vrseoguru.com">hello@vrseoguru.com</a>.</p>',
'published'),
('refund-policy', 'Refund Policy',
'<h2>1. Service-based engagements</h2><p>Strategy, audit and creative engagements are billed against scoped deliverables. Once work has begun, fees are non-refundable; unstarted milestones can be cancelled with written notice.</p><h2>2. Media spend</h2><p>Ad budget paid into platforms (Google, Meta, LinkedIn, etc.) is refunded directly by the platform per their policies. Management fees are non-refundable once the billing cycle has started.</p><h2>3. Subscription / retainer</h2><p>Cancel any time with 30 days written notice. No prorated refunds for the current month.</p><h2>4. How to request</h2><p>Email <a href="mailto:hello@vrseoguru.com">hello@vrseoguru.com</a> with your invoice number and reason. We respond within 2 business days.</p>',
'published'),
('terms', 'Terms & Conditions',
'<h2>1. Acceptance</h2><p>By accessing this site or engaging vrseoguru, you agree to these terms.</p><h2>2. Services</h2><p>Scope, deliverables, timelines and fees are defined in a signed Statement of Work or accepted proposal. Either party may terminate with 30 days written notice.</p><h2>3. Intellectual property</h2><p>Deliverables become client property upon full payment. vrseoguru retains rights to underlying tools, frameworks and anonymised performance data.</p><h2>4. Confidentiality</h2><p>Each party agrees to protect the other''s non-public information disclosed during the engagement.</p><h2>5. Liability</h2><p>Aggregate liability is limited to fees paid in the 3 months preceding the claim. Neither party is liable for indirect or consequential damages.</p><h2>6. Governing law</h2><p>These terms are governed by the laws of India. Disputes go to the courts of Mumbai.</p>',
'published');

-- faq_items
CREATE TABLE public.faq_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL DEFAULT '',
  answer text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'General',
  sort_order int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'published',
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.faq_items TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.faq_items TO authenticated;
GRANT ALL ON public.faq_items TO service_role;
ALTER TABLE public.faq_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published faqs are publicly readable"
  ON public.faq_items FOR SELECT
  USING (status = 'published' OR has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Editors can insert faqs"
  ON public.faq_items FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Editors can update faqs"
  ON public.faq_items FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE POLICY "Editors can delete faqs"
  ON public.faq_items FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE TRIGGER faq_items_touch_updated_at
  BEFORE UPDATE ON public.faq_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.faq_items (question, answer, category, sort_order, status) VALUES
('What services do you offer?', '<p>End-to-end digital marketing: SEO &amp; GEO, Google &amp; Meta Ads, content, social, analytics, AI automation and conversion-rate optimisation.</p>', 'General', 10, 'published'),
('How long until I see results?', '<p>Paid campaigns can show signal within 2–4 weeks. SEO compounds over 3–6 months. We agree on KPIs and milestones up front so progress is measurable.</p>', 'General', 20, 'published'),
('Do you work with our industry?', '<p>We''ve shipped campaigns across 18+ industries — ecommerce, SaaS, fintech, healthcare, real estate, education, D2C and B2B.</p>', 'General', 30, 'published'),
('How do you use AI?', '<p>AI sits across our workflow — research, creative variants, bid optimisation, anomaly alerts, reporting — with senior strategists reviewing every output.</p>', 'AI', 40, 'published'),
('What does pricing look like?', '<p>Engagements start around $1.5k/month for focused channels and scale based on scope, media spend and deliverables. Audits are free.</p>', 'Pricing', 50, 'published'),
('Can I cancel any time?', '<p>Yes — retainers run month-to-month with 30 days notice. No long-term lock-in.</p>', 'Pricing', 60, 'published');
