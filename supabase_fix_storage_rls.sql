-- Run this in Supabase SQL Editor if resume upload fails with:
-- "new row violates row-level security policy" (Storage 400).
-- Removes ALL policies on storage.objects, then adds only anon upload/read for candidate-resumes.

-- 1) Remove every policy on storage.objects (avoids conflicts with Supabase defaults)
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END$$;

-- 2) Allow anon to INSERT only into candidate-resumes
CREATE POLICY "resumes_anon_upload" ON storage.objects
  FOR INSERT TO anon
  WITH CHECK (bucket_id = 'candidate-resumes');

-- 3) Allow anon to SELECT (read) only from candidate-resumes
CREATE POLICY "resumes_anon_select" ON storage.objects
  FOR SELECT TO anon
  USING (bucket_id = 'candidate-resumes');

-- 4) Optional: if admin dashboard needs to read resumes while signed in, allow authenticated too
CREATE POLICY "resumes_authenticated_select" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'candidate-resumes');
