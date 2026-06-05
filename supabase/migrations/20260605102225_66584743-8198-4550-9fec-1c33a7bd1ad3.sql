CREATE OR REPLACE FUNCTION public.audit_rls_policies()
RETURNS TABLE (
  table_name text,
  expectation text,
  pass boolean,
  details text
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
  t text;
  admin_only constant text[] := ARRAY['leads','lead_audit_log','role_audit_log','pdf_template_settings'];
  bad_count int;
  total_count int;
  offenders text;
  has_mut int;
BEGIN
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Forbidden: admin only';
  END IF;

  FOREACH t IN ARRAY admin_only LOOP
    SELECT count(*),
           count(*) FILTER (
             WHERE NOT (coalesce(qual,'') || ' ' || coalesce(with_check,'')) ILIKE '%has_role%admin%'
           ),
           string_agg(policyname, ', ') FILTER (
             WHERE NOT (coalesce(qual,'') || ' ' || coalesce(with_check,'')) ILIKE '%has_role%admin%'
           )
      INTO total_count, bad_count, offenders
      FROM pg_policies
     WHERE schemaname = 'public'
       AND tablename = t
       AND cmd IN ('SELECT','UPDATE','DELETE','ALL');

    IF total_count = 0 THEN
      RETURN QUERY SELECT t, 'Has admin-scoped policies'::text, false,
        'No read/write policies found — review immediately.'::text;
    ELSIF bad_count > 0 THEN
      RETURN QUERY SELECT t, 'All read/write policies scoped to admin'::text, false,
        ('Permissive policies: ' || offenders)::text;
    ELSE
      RETURN QUERY SELECT t, 'All read/write policies scoped to admin'::text, true,
        (total_count || ' admin-scoped policies verified.')::text;
    END IF;
  END LOOP;

  -- user_roles must not have client-mutating policies (privilege-escalation guard)
  SELECT count(*) INTO has_mut
    FROM pg_policies
   WHERE schemaname = 'public'
     AND tablename = 'user_roles'
     AND cmd IN ('INSERT','UPDATE','DELETE','ALL');

  RETURN QUERY SELECT 'user_roles'::text,
    'No client INSERT/UPDATE/DELETE policies'::text,
    (has_mut = 0),
    CASE WHEN has_mut = 0
      THEN 'Locked. Role changes go through admin server functions.'
      ELSE 'Mutating policies present — privilege-escalation risk.'
    END;
END;
$$;

REVOKE ALL ON FUNCTION public.audit_rls_policies() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.audit_rls_policies() TO authenticated, service_role;