-- You cannot disable RLS on storage.objects from the SQL Editor.
-- Supabase owns that table, so you get: "must be owner of table objects".
-- Do not run ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY.

-- Instead, use one of these:

-- Option A) Add the policy in the Dashboard (recommended):
--   1. Supabase Dashboard → Storage → Policies (or Storage → select bucket → Policies).
--   2. Add policy on "objects":
--      - Name: resumes_anon_upload
--      - Allowed operation: INSERT
--      - Target roles: anon
--      - WITH CHECK expression: (bucket_id = 'candidate-resumes')
--   3. Add policy for read:
--      - Name: resumes_anon_select
--      - Operation: SELECT, Role: anon
--      - USING: (bucket_id = 'candidate-resumes')

-- Option B) Use the Edge Function for uploads (no Storage RLS needed for anon):
--   See README in supabase/functions/upload-resume or the project README.
--   Deploy: supabase functions deploy upload-resume
--   Set secret: Project Settings → Edge Functions → SUPABASE_SERVICE_ROLE_KEY
