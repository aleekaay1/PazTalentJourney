-- Add exit_questionnaire column for Post Live Career Overview Exit Questionnaire

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'candidates' AND column_name = 'exit_questionnaire'
  ) THEN
    ALTER TABLE public.candidates ADD COLUMN exit_questionnaire JSONB;
  END IF;
END$$;
