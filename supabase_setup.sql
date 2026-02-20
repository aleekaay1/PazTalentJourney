-- Create the candidates table for Paz Organization Hiring Portal
CREATE TABLE IF NOT EXISTS public.candidates (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL DEFAULT '',
  timestamp TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('new', 'interview_complete', 'assessment_started', 'assessment_complete')),
  applicant_questionnaire JSONB,
  admin_data JSONB,
  post_interview JSONB,
  assessment JSONB,
  score NUMERIC,
  fit_category TEXT CHECK (fit_category IN ('High Fit', 'Review', 'Not Aligned'))
);

-- Add columns if table already existed without them
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'candidates' AND column_name = 'applicant_questionnaire') THEN
    ALTER TABLE public.candidates ADD COLUMN applicant_questionnaire JSONB;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'candidates' AND column_name = 'admin_data') THEN
    ALTER TABLE public.candidates ADD COLUMN admin_data JSONB;
  END IF;
END$$;

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_candidates_email ON public.candidates(email);
CREATE INDEX IF NOT EXISTS idx_candidates_phone ON public.candidates(phone);
CREATE INDEX IF NOT EXISTS idx_candidates_timestamp ON public.candidates(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_candidates_status ON public.candidates(status);

-- Enable Row Level Security (RLS)
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

-- Policies for anonymous access (public forms)
DROP POLICY IF EXISTS "candidates_anon_insert" ON public.candidates;
DROP POLICY IF EXISTS "candidates_anon_select" ON public.candidates;
DROP POLICY IF EXISTS "candidates_anon_update" ON public.candidates;
DROP POLICY IF EXISTS "candidates_anon_delete" ON public.candidates;
CREATE POLICY "candidates_anon_insert" ON public.candidates FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "candidates_anon_select" ON public.candidates FOR SELECT TO anon USING (true);
CREATE POLICY "candidates_anon_update" ON public.candidates FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "candidates_anon_delete" ON public.candidates FOR DELETE TO anon USING (true);

-- Storage: Create bucket "candidate-resumes" in Dashboard (Storage -> New bucket, Public ON, 10 MB limit).
DROP POLICY IF EXISTS "resumes_anon_upload" ON storage.objects;
DROP POLICY IF EXISTS "resumes_anon_select" ON storage.objects;
CREATE POLICY "resumes_anon_upload" ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'candidate-resumes');
CREATE POLICY "resumes_anon_select" ON storage.objects FOR SELECT TO anon USING (bucket_id = 'candidate-resumes');

COMMENT ON TABLE public.candidates IS 'Stores candidate information, applicant questionnaire, and assessment data for Paz Organization hiring portal';
