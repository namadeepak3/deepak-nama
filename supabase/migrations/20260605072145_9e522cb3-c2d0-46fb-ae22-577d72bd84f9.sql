CREATE TABLE public.role_audit_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid NOT NULL,
  actor_email text NOT NULL DEFAULT '',
  target_user_id uuid NOT NULL,
  target_email text NOT NULL DEFAULT '',
  role public.app_role NOT NULL,
  action text NOT NULL CHECK (action IN ('assigned','removed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.role_audit_log TO authenticated;
GRANT ALL ON public.role_audit_log TO service_role;

ALTER TABLE public.role_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read role audit log"
  ON public.role_audit_log FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE INDEX role_audit_log_created_at_idx ON public.role_audit_log (created_at DESC);
CREATE INDEX role_audit_log_target_idx ON public.role_audit_log (target_user_id);