-- ============================================================
-- 0002: Create student_shortlists table in public schema
-- ============================================================

CREATE TABLE IF NOT EXISTS public.student_shortlists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    user_email TEXT NOT NULL,
    university_slug TEXT NOT NULL,
    university_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_user_university UNIQUE (user_email, university_slug)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.student_shortlists ENABLE ROW LEVEL SECURITY;

-- Service Role Full Access Policy
CREATE POLICY "Service Role Full Access" ON public.student_shortlists
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Public Read Policy
CREATE POLICY "Allow Authenticated and Anon Read" ON public.student_shortlists
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Indices for fast lookups
CREATE INDEX IF NOT EXISTS idx_student_shortlists_email ON public.student_shortlists(user_email);
CREATE INDEX IF NOT EXISTS idx_student_shortlists_user_id ON public.student_shortlists(user_id);

