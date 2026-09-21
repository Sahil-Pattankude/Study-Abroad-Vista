-- ============================================================
-- Programs: align the schema with masterData before seeding.
--
-- Two gaps block seeding the 8 disciplines from masterData:
--
--   1. program_category is missing 'emba' and 'phd', so inserting
--      those two rows fails on the enum constraint.
--   2. programs has no top_destinations column, but the homepage
--      programs grid renders program.topDestinations.
--
-- Postgres will not let a newly added enum value be used inside the
-- same transaction that added it, so run this migration on its own
-- and commit it BEFORE running scripts/seed-programs.mjs.
-- ============================================================

ALTER TYPE program_category ADD VALUE IF NOT EXISTS 'emba';
ALTER TYPE program_category ADD VALUE IF NOT EXISTS 'phd';

ALTER TABLE programs ADD COLUMN IF NOT EXISTS top_destinations TEXT[];
