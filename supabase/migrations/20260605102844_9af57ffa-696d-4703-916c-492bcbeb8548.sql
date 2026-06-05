DROP FUNCTION IF EXISTS public.audit_rls_policies();

CREATE FUNCTION public.audit_rls_policies()
RETURNS TABLE (
  table_name text,
  expectation text,
  pass boolean,
  details text,
  policies jsonb
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
  pol_json jsonb;
BEGIN
  IF NOT has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Forbidden: admin only';
  END IF;

  FOREACH t IN ARRAY admin_only LOOP
    SELECT
      count(*),
      count(*) FILTER (
        WHERE NOT (coalesce(qual,'') || ' ' || coalesce(with_check,'')) ILIKE '%has_role%admin%'
      ),
      string_agg(policyname, ', ') FILTER (
        WHERE NOT (coalesce(qual,'') || ' ' || coalesce(with_check,'')) ILIKE '%has_role%admin%'
      ),
      coalesce(
        jsonb_agg(
          jsonb_build_object(
            'name', policyname,
            'cmd', cmd,
            'roles', roles,
            'using', qual,
            'with_check', with_check,
            'admin_scoped',
              (coalesce(qual,'') || ' ' || coalesce(with_check,'')) ILIKE '%has_role%admin%'
          )
          ORDER BY policyname
        ),
        '[]'::jsonb
      )
    INTO total_count, bad_count, offenders, pol_json
    FROM pg_policies
   WHERE schemaname = 'public'
     AND tablename = t
     AND cmd IN ('SELECT','UPDATE','DELETE','ALL');

    IF total_count = 0 THEN
      RETURN QUERY SELECT t, 'Has admin-scoped policies'::text, false,
        'No read/write policies found — review immediately.'::text, pol_json;
    ELSIF bad_count > 0 THEN
      RETURN QUERY SELECT t, 'All read/write policies scoped to admin'::text, false,
        ('Permissive policies: ' || offenders)::text, pol_json;
    ELSE
      RETURN QUERY SELECT t, 'All read/write policies scoped to admin'::text, true,
        (total_count || ' admin-scoped policies verified.')::text, pol_json;
    END IF;
  END LOOP;

  SELECT
    count(*) FILTER (WHERE cmd IN ('INSERT','UPDATE','DELETE','ALL')),
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'name', policyname,
          'cmd', cmd,
          'roles', roles,
          'using', qual,
          'with_check', with_check,
          'admin_scoped', false
        )
        ORDER BY policyname
      ),
      '[]'::jsonb
    )
  INTO has_mut, pol_json
  FROM pg_policies
   WHERE schemaname = 'public'
     AND tablename = 'user_roles';

  RETURN QUERY SELECT 'user_roles'::text,
    'No client INSERT/UPDATE/DELETE policies'::text,
    (has_mut = 0),
    CASE WHEN has_mut = 0
      THEN 'Locked. Role changes go through admin server functions.'
      ELSE 'Mutating policies present — privilege-escalation risk.'
    END,
    pol_json;
END;
$$;

REVOKE ALL ON FUNCTION public.audit_rls_policies() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.audit_rls_policies() TO authenticated, service_role;