-- ============================================================
-- 0003: Create counsellor_conversations table in public schema
-- ============================================================

CREATE TABLE IF NOT EXISTS public.counsellor_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    user_id UUID,
    user_email TEXT,
    user_name TEXT,
    title TEXT,
    page_context JSONB DEFAULT '{}'::jsonb,
    messages JSONB NOT NULL DEFAULT '[]'::jsonb,
    lead_captured BOOLEAN DEFAULT FALSE,
    lead_level INTEGER DEFAULT 1, -- 1: Anon/Guest, 2: Name+Email captured, 3: Phone/Consultation booked
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.counsellor_conversations ENABLE ROW LEVEL SECURITY;

-- Service Role Full Access Policy
CREATE POLICY "Service Role Full Access" ON public.counsellor_conversations
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Public / Authenticated Read Policy
CREATE POLICY "Allow Users to Read Conversations" ON public.counsellor_conversations
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- Public / Authenticated Insert & Update Policy
CREATE POLICY "Allow Users to Insert Conversations" ON public.counsellor_conversations
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Allow Users to Update Conversations" ON public.counsellor_conversations
    FOR UPDATE
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Indices for fast lookups
CREATE INDEX IF NOT EXISTS idx_counsellor_conversations_session_id ON public.counsellor_conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_counsellor_conversations_email ON public.counsellor_conversations(user_email);
CREATE INDEX IF NOT EXISTS idx_counsellor_conversations_user_id ON public.counsellor_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_counsellor_conversations_created_at ON public.counsellor_conversations(created_at DESC);

