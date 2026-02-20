-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- This turns OFF Row Level Security on candidates so the form submit works.
-- No app changes or dev server restart needed — RLS is enforced in Supabase only.

ALTER TABLE public.candidates DISABLE ROW LEVEL SECURITY;
