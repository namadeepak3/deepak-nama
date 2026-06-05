
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS phone text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS website text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS company text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'inquiry';

ALTER TABLE public.leads DROP CONSTRAINT IF EXISTS leads_kind_check;
ALTER TABLE public.leads ADD CONSTRAINT leads_kind_check CHECK (kind IN ('audit','inquiry'));
