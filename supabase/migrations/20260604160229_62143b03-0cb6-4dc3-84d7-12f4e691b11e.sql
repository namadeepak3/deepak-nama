
REVOKE EXECUTE ON FUNCTION public.increment_view(text, uuid) FROM anon, authenticated, public;
DROP FUNCTION IF EXISTS public.increment_view(text, uuid);
