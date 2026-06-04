
CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text NOT NULL DEFAULT '',
  cover_image text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  tags jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  author_name text NOT NULL DEFAULT '',
  reading_minutes integer NOT NULL DEFAULT 5,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published posts are publicly readable"
  ON public.blog_posts FOR SELECT
  USING (status = 'published' OR has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));

CREATE POLICY "Editors can insert posts"
  ON public.blog_posts FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));

CREATE POLICY "Editors can update posts"
  ON public.blog_posts FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'))
  WITH CHECK (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));

CREATE POLICY "Editors can delete posts"
  ON public.blog_posts FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'editor'));

CREATE TRIGGER blog_posts_touch_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.blog_posts (slug, title, excerpt, cover_image, content, tags, status, author_name, reading_minutes, published_at) VALUES
('ai-seo-2026','AI SEO in 2026: How AIO and GEO actually move rankings','A practical look at optimising for AI Overviews, ChatGPT and Perplexity without abandoning classic SEO fundamentals.','https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80','# AI SEO in 2026\n\nAIO (AI Optimisation) and GEO (Generative Engine Optimisation) are not replacements for SEO — they are extensions of it.\n\n## What changed\n- AI Overviews now appear on ~40% of commercial queries\n- ChatGPT Search and Perplexity drive a new "answer-first" referral pattern\n- Entity-first content beats keyword-first content\n\n## Practical playbook\n1. Audit your top 50 URLs for entity coverage\n2. Add structured Q&A blocks and tables\n3. Build citations on the sources LLMs actually quote\n\n## The bottom line\nClassic SEO still wins the ranking. AIO and GEO win the citation.','["SEO","AIO","GEO"]'::jsonb,'published','vrseoguru',6, now() - interval '3 days'),
('performance-creative-loop','The performance creative loop that 10x''d our ROAS','How a weekly hook-test cadence and a simple creative scorecard unlocked compounding ad efficiency.','https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=80','# The performance creative loop\n\nCreative is the new targeting. Here is the exact weekly cadence we run.\n\n## Monday — Hook ideation\nWrite 10 hooks per offer, score for clarity and tension.\n\n## Tuesday — Production\nShoot 3 UGC variants per winning hook.\n\n## Thursday — Launch\nABO test at $20/day per ad set.\n\n## Sunday — Score\nKill anything under 1.5x ROAS at 3-day mark.\n\nRinse, repeat, compound.','["Paid Social","Creative","Performance"]'::jsonb,'published','vrseoguru',5, now() - interval '10 days'),
('ga4-server-side-gtm','Why you should move to server-side GTM this quarter','Signal loss is real. Here is the case for sGTM and a 30-day migration plan.','https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1600&q=80','# Server-side GTM\n\niOS, ITP and consent banners are eating your conversion signal. Server-side GTM gets it back.\n\n## Benefits\n- Longer cookie lifetimes\n- Cleaner CAPI and offline imports\n- Faster page loads (fewer client tags)\n\n## 30-day plan\n- Week 1: stand up sGTM container\n- Week 2: migrate GA4 + Meta CAPI\n- Week 3: enhanced conversions for Google Ads\n- Week 4: QA and cut over','["Analytics","GA4","Tracking"]'::jsonb,'published','vrseoguru',4, now() - interval '20 days');
