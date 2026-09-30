-- ============================================================
-- Migration: 0004_create_specialisations_table.sql
-- Description: Creates the specialisations table and populates specializations w.r.t programs per Year 1 Scope
-- ============================================================

CREATE TABLE IF NOT EXISTS specialisations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_slug VARCHAR(64) NOT NULL,
    anchor_category VARCHAR(128) NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    focus_areas TEXT[] NOT NULL DEFAULT '{}',
    target_destinations TEXT[] NOT NULL DEFAULT '{}',
    duration_formats TEXT[] NOT NULL DEFAULT '{}',
    licensing_pathways TEXT[] NOT NULL DEFAULT '{}',
    content_investment_share VARCHAR(64),
    is_year_one_anchor BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_specialisations_program_slug ON specialisations(program_slug);
CREATE INDEX IF NOT EXISTS idx_specialisations_slug ON specialisations(slug);

-- Enable RLS
ALTER TABLE specialisations ENABLE ROW LEVEL SECURITY;

-- Read-only policy for public/anonymous users
CREATE POLICY "Public Read Access for Specialisations"
ON specialisations FOR SELECT
TO public
USING (true);

-- Insert Program Specialisations from Year 1 Scope Document
INSERT INTO specialisations (
    program_slug,
    anchor_category,
    name,
    slug,
    description,
    focus_areas,
    target_destinations,
    duration_formats,
    licensing_pathways,
    content_investment_share,
    is_year_one_anchor
) VALUES
-- Anchor 1: Master's Degree (MS / MSc / MA)
(
    'ms',
    'Anchor 1 — Master''s Degree (MS / MSc / MA)',
    'Computer Science, Data Science, AI/ML & Business Analytics',
    'ms-cs-data-science-ai-ml',
    'Primary volume driver aligned to high-growth tech and analytical demand in global tech hubs.',
    ARRAY['Computer Science', 'Data Science', 'AI/ML', 'Business Analytics'],
    ARRAY['USA', 'Germany', 'UK', 'Canada', 'Australia', 'Ireland', 'Netherlands'],
    ARRAY['1 Year', '1.5 Years', '2 Years'],
    ARRAY[]::TEXT[],
    '35%',
    true
),
(
    'ms',
    'Anchor 1 — Master''s Degree (MS / MSc / MA)',
    'Core Engineering & Financial Engineering',
    'ms-engineering-disciplines',
    'Traditional and quantitative STEM disciplines across premier technical institutions.',
    ARRAY['Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering', 'Aerospace Engineering', 'Financial Engineering'],
    ARRAY['Germany', 'USA', 'UK', 'Australia', 'Canada', 'Netherlands'],
    ARRAY['1.5 Years', '2 Years'],
    ARRAY[]::TEXT[],
    '35%',
    true
),
(
    'ms',
    'Anchor 1 — Master''s Degree (MS / MSc / MA)',
    'Cybersecurity, FinTech & Software Engineering',
    'ms-cybersecurity-fintech-swe',
    'High-demand applied computing, enterprise security, and financial technology engineering tracks.',
    ARRAY['Cybersecurity', 'FinTech', 'Software Engineering'],
    ARRAY['USA', 'UK', 'Ireland', 'Singapore', 'Canada', 'Australia'],
    ARRAY['1 Year', '2 Years'],
    ARRAY[]::TEXT[],
    '35%',
    true
),
(
    'ms',
    'Anchor 1 — Master''s Degree (MS / MSc / MA)',
    'Finance, Economics & Public Health (MPH)',
    'ms-finance-economics-mph',
    'Quantitative economic policy, corporate finance, and public health epidemiology tracks.',
    ARRAY['Finance', 'Economics', 'Public Health (MPH)'],
    ARRAY['USA', 'UK', 'Canada', 'Australia', 'Netherlands', 'Germany'],
    ARRAY['1 Year', '2 Years'],
    ARRAY[]::TEXT[],
    '35%',
    true
),
(
    'ms',
    'Anchor 1 — Master''s Degree (MS / MSc / MA)',
    'Biotechnology, Biomedical Sciences & Bioinformatics',
    'ms-biotech-biomedical-bioinformatics',
    'Cutting-edge life sciences, pharmaceutical development, and computational biology programs.',
    ARRAY['Biotechnology', 'Biomedical Sciences', 'Bioinformatics'],
    ARRAY['Germany', 'USA', 'UK', 'Canada', 'Ireland', 'Australia'],
    ARRAY['2 Years'],
    ARRAY[]::TEXT[],
    '35%',
    true
),

-- Anchor 2: MBA Abroad (Full-time)
(
    'mba',
    'Anchor 2 — MBA Abroad (Full-time)',
    'Full-time MBA Management & Functional Specializations',
    'mba-fulltime-specializations',
    'Strategic management foundation across top business schools with accelerated 1-year and standard 2-year tracks.',
    ARRAY['Finance', 'Marketing', 'Human Resources (HR)', 'Operations', 'Business Analytics', 'International Business', 'Entrepreneurship', 'Strategy', 'Supply Chain Management'],
    ARRAY['USA', 'UK', 'France', 'Germany', 'Canada', 'Australia', 'Singapore', 'Spain'],
    ARRAY['1-year MBA (UK, Europe)', '2-year MBA (USA, Canada, Australia)'],
    ARRAY[]::TEXT[],
    '12%',
    true
),

-- Anchor 3: Executive MBA / Online MBA / Global MBA
(
    'emba',
    'Anchor 3 — Executive MBA / Online MBA / Global MBA',
    'Executive MBA (EMBA), Online MBA & Global Modular Programs',
    'emba-global-online-modular',
    'High-value executive programs for working professionals with leadership DNA and flexible modular formats.',
    ARRAY['Global Executive MBA (INSEAD, Kellogg, Wharton, Booth, LBS, IMD, HEC, Warwick)', 'Online MBA / Global MBA', 'Part-time Executive Formats', 'Weekend Executive Formats'],
    ARRAY['USA', 'UK', 'France', 'Switzerland', 'Singapore', 'UAE', 'Germany'],
    ARRAY['12 Months', '15 Months', '18 Months', '21 Months'],
    ARRAY[]::TEXT[],
    '13%',
    true
),

-- Anchor 4: MBA in Healthcare Management
(
    'mba',
    'Anchor 4 — MBA in Healthcare Management',
    'MBA in Healthcare Management & Hospital Administration',
    'mba-healthcare-management',
    'Natural cross-vertical bridge connecting clinical medicine/nursing with modern hospital leadership.',
    ARRAY['Healthcare Management', 'Hospital Administration', 'Health Systems Management'],
    ARRAY['UK', 'USA', 'Canada', 'Australia', 'Germany', 'Ireland', 'Singapore', 'UAE'],
    ARRAY['1 Year', '2 Years'],
    ARRAY[]::TEXT[],
    'Included in MBA + EMBA 25%',
    true
),

-- Anchor 5: MBBS / Medical Abroad
(
    'mbbs',
    'Anchor 5 — MBBS / Medical Abroad',
    'MBBS & Medical Education Abroad (NMC Approved)',
    'mbbs-medicine-abroad-pathways',
    'NMC-compliant global medical colleges with structured licensing and residency pathways for Indian aspirants.',
    ARRAY['MBBS Abroad (Primary Vertical)', 'Doctor of Medicine (MD)', 'Bachelor of Dental Surgery (BDS)'],
    ARRAY['Georgia', 'Uzbekistan', 'Russia', 'Philippines', 'Kazakhstan', 'UK', 'Nepal'],
    ARRAY['5 Years + 1 Year Internship', '6 Years'],
    ARRAY['PLAB (UK)', 'USMLE (USA)', 'AMC (Australia)', 'MCCQE (Canada)', 'NExT (India)'],
    '20%',
    true
),

-- Anchor 6: Nursing & Allied Health (Career Migration)
(
    'nursing',
    'Anchor 6 — Nursing & Allied Health (Career Migration)',
    'BSc Nursing Abroad & Global Career Migration Pathways',
    'nursing-bsc-career-migration',
    'Targeted career-migration pathway focusing on study, licensing exams, and immediate nursing workforce integration.',
    ARRAY['BSc Nursing Abroad', 'Nursing Ausbildung (Germany)', 'Career Migration Pathways (UK NHS, Ireland HSE, Australia AHPRA, US NCLEX-RN)'],
    ARRAY['UK', 'Ireland', 'Germany', 'Australia', 'USA', 'Canada', 'New Zealand'],
    ARRAY['3 Years', '4 Years'],
    ARRAY['NCLEX-RN (USA)', 'NMC UK CBT/OSCE', 'AHPRA (Australia)', 'OET (Occupational English Test)'],
    '12%',
    true
),
(
    'nursing',
    'Anchor 6 — Nursing & Allied Health (Career Migration)',
    'Allied Health Sciences & Rehabilitation',
    'allied-health-sciences',
    'High-demand paramedical and allied healthcare clinical professions worldwide.',
    ARRAY['Physiotherapy', 'Radiology', 'Occupational Therapy'],
    ARRAY['UK', 'Australia', 'Ireland', 'Canada', 'Germany'],
    ARRAY['3 Years', '4 Years'],
    ARRAY['HCPC (UK)', 'AHPRA (Australia)'],
    '12%',
    true
),

-- Anchor 7: Bachelor's Degree Abroad (Focused Niches)
(
    'bachelors',
    'Anchor 7 — Bachelor''s Degree Abroad (Focused Niches)',
    'Undergraduate Degree Tracks & High-Value Professional Niches',
    'bachelors-focused-niches',
    'Selective high-ROI undergraduate degree tracks and specialized vocational leadership niches.',
    ARRAY['BSc / BA / BBA / BEng at Reputed Universities', 'Hotel Management Abroad (+75% YoY)', 'Fashion / Interior / Product Design Abroad', 'Pilot Training / Aviation Abroad', 'Culinary Arts (Le Cordon Bleu, ICE, ICMS)'],
    ARRAY['UK', 'USA', 'Canada', 'Australia', 'Switzerland', 'France', 'Germany', 'Ireland'],
    ARRAY['3 Years (UK/Europe/Australia)', '4 Years (USA/Canada)'],
    ARRAY[]::TEXT[],
    '3%',
    true
),

-- Anchor 8: Germany Ausbildung (Vocational + Employment)
(
    'ausbildung',
    'Anchor 8 — Germany Ausbildung (Vocational + Employment)',
    'Dual Vocational Training & Guaranteed Employment (Ausbildung)',
    'ausbildung-germany-vocational',
    'Tuition-free German dual vocational training with monthly stipend (€1,000–€1,400/mo) and direct transition to permanent residency.',
    ARRAY['Nursing Ausbildung (Pflegefachkraft)', 'IT Ausbildung (Fachinformatiker)', 'Mechatronics / Automotive Ausbildung (Kraftfahrzeugmechatroniker)', 'Hospitality Ausbildung (Hotelfachmann/-frau)', 'Retail / Business Ausbildung (Kaufmann/-frau)'],
    ARRAY['Germany'],
    ARRAY['3 Years (Dual System: 50% Theory + 50% Paid Work)'],
    ARRAY['B2 German Certificate (Goethe/Telc)', 'German State Chamber Examination (IHK/HWK)'],
    '5%',
    true
)
ON CONFLICT (id) DO NOTHING;
