INSERT INTO public.user_roles (user_id, role)
VALUES ('2d609bd5-dc11-4364-9772-26a4619d1c09', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;