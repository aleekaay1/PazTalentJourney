-- Run this in Supabase SQL Editor if you get:
-- "Could not find the 'admin_data' column of 'candidates' in the schema cache"

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'candidates' AND column_name = 'admin_data'
  ) THEN
    ALTER TABLE public.candidates ADD COLUMN admin_data JSONB;
  END IF;
END$$;
