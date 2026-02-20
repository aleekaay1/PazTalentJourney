-- Run this in Supabase SQL Editor if you get:
-- 403 Forbidden / "new row violates row-level security policy for table 'candidates'"
-- This ensures the anon role can INSERT, SELECT, UPDATE, and DELETE on candidates.

-- OPTIONAL: To confirm the failure is RLS, first run only this and submit the form again:
--   ALTER TABLE public.candidates DISABLE ROW LEVEL SECURITY;
-- If the form works, run the rest of this file (re-enable RLS + policies below).

-- Ensure RLS is enabled (in case you disabled it for testing)
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

-- Remove any existing policies on public.candidates (including old-named ones)
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'candidates'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.candidates', pol.policyname);
  END LOOP;
END$$;

-- Recreate anon policies
CREATE POLICY "candidates_anon_insert" ON public.candidates
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "candidates_anon_select" ON public.candidates
  FOR SELECT TO anon USING (true);

CREATE POLICY "candidates_anon_update" ON public.candidates
  FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "candidates_anon_delete" ON public.candidates
  FOR DELETE TO anon USING (true);
