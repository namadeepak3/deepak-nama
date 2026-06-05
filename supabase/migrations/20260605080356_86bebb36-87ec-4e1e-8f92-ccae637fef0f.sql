
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS ip_address text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS user_agent text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS referrer text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS page_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS utm_source text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS utm_medium text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS utm_campaign text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS assigned_to uuid,
  ADD COLUMN IF NOT EXISTS assigned_email text NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS public.lead_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL,
  actor_user_id uuid NOT NULL,
  actor_email text NOT NULL DEFAULT '',
  action text NOT NULL,
  field text NOT NULL DEFAULT '',
  old_value text NOT NULL DEFAULT '',
  new_value text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.lead_audit_log TO authenticated;
GRANT ALL ON public.lead_audit_log TO service_role;

ALTER TABLE public.lead_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read lead audit log"
  ON public.lead_audit_log FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS lead_audit_log_lead_id_idx ON public.lead_audit_log(lead_id, created_at DESC);
CREATE INDEX IF NOT EXISTS leads_assigned_to_idx ON public.leads(assigned_to);
