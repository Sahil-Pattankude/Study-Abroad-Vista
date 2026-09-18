# StudyAbroad Vista: Master Engineering Handoff Document

> **NOTE FOR ANY AI AGENT / DEVELOPER RESUMING THIS TASK:**  
> Read this document completely before taking any action. This is the **single source of truth** for project context, architectural decisions, completed work, environment setup, and immediate next steps. Maintain and append to this document at the end of every session.

---

## 1. Project Overview & Context

- **Project Name:** StudyAbroad Vista
- **Parent Entity:** Dnyanal Educon Pvt. Ltd. (Founder Director: Nikhita Deshmukh)
- **Primary Target Audience:** Indian Students, Parents, and Working Professionals seeking international education.
- **Core Business Model:** Authoritative programmatic discovery portal (1,080+ to 1,290+ SEO pages) driving high-intent, OTP-verified student leads to B2B admission consultants and university partners.
- **Scope:**
  - **19 Launch Destinations:**
    - _Tier 1:_ USA, UK, Canada, Australia, Ireland, New Zealand
    - _Tier 2:_ Germany, France, Italy, Netherlands, Singapore, Malaysia, UAE
    - _Tier 3:_ Russia, Uzbekistan, Kazakhstan, Kyrgyzstan, Georgia, Philippines
  - **6 Core Study Streams:**
    1. Master’s (MS/MSc) - STEM, Data Science, Core Engineering
    2. MBA & Management - Full-time, MIM, Executive MBA
    3. MBBS / Medicine - NMC/WHO compliant global medical programs
    4. Bachelor’s / UG - Undergrad degrees after 12th
    5. Nursing - BSc/MSc with registration pathways (UK, Ireland, Germany, Australia)
    6. Germany Ausbildung - Dual vocational training with €1,000–€1,400 monthly stipends & 0 tuition

---

## 2. Directory & Path Mapping

- **Codebase Root:** `D:\MAGIC-WORKS\PROJECTS\Study-Abroad\Study-Abroad-Vista`
- **Original Project Documents:** `D:\MAGIC-WORKS\PROJECTS\Study-Abroad\Docx`
  - `1_Program_Country_Scope_Decision_Log_v2-4.docx`
  - `2_Abroad Study-keyword Research.xlsx`
  - `W1-Information_Architecture_StudyAbroadVista_v1.docx`
  - `W2-Sitemap_StudyAbroadVista_v1.docx`
  - `W3-User_Journeys_StudyAbroadVista_v1.docx`
  - `W4-FRD_TRD_StudyAbroadVista_v1.docx` _(Note: Restructured in v2)_
  - `W6-Data_Schema_StudyAbroadVista_v1.docx`
  - `W7-Integration_API_StudyAbroadVista_v1.docx`
  - `W8-NFR_StudyAbroadVista_v1.docx`
  - `W9-SEO_Technical_StudyAbroadVista_v1.docx`
  - `W10-HTML_Templates_StudyAbroadVista_v1.docx`
  - `W11-Website_Content_Plan_StudyAbroadVista_v1.docx`
- **Implementation Plan Document (Word .docx):** `D:\MAGIC-WORKS\PROJECTS\Study-Abroad\Docx\StudyAbroadVista_Implementation_Plan_v2.docx`

---

## 3. Approved Lean MVP Architecture & Tech Decisions

The project explicitly **rejected** enterprise over-engineering in Document W4 (Kubernetes, MongoDB, Redis, Elasticsearch, Pinecone) in favor of the **Lean High-Velocity Stack**:

| Layer                   | Approved Technology                   | Decision Rationale & Status                                                                                                  |
| :---------------------- | :------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**            | **Next.js 15 (React 19, TypeScript)** | App Router, Server Components, SSR/ISR for SEO. Mobile-responsive first. _(PWA rejected; React Native planned for Phase 2)._ |
| **Styling**             | **Tailwind CSS v3.4 + PostCSS**       | Uses custom brand tokens: Trust Navy (`#102C57`), Accent Coral (`#EA5C2B`), Green (`#17B978`).                               |
| **Primary Database**    | **Supabase (PostgreSQL 15+)**         | Handles relational tables + JSONB for unstructured data. _(MongoDB completely eliminated)._                                  |
| **Vector DB (RAG)**     | **Supabase `pgvector`**               | 768-dim embeddings via `HNSW` index. _(Pinecone eliminated, saving $100/mo)._                                                |
| **Search Engine**       | **Postgres FTS + `pg_trgm`**          | Native full-text search with trigrams (<10ms latency). _(Elasticsearch 8+ eliminated)._                                      |
| **Cache & Sessions**    | **Next.js Cache + Supabase Auth**     | Stateless JWT in HTTP-only cookies. Edge caching. _(Redis 7.0 eliminated)._                                                  |
| **Object Storage**      | **Supabase Storage**                  | S3-compatible storage with CDN & RLS. _(Cloudflare R2 optional backup)._                                                     |
| **Content CMS**         | **Sanity.io**                         | Headless Content Lake for editorial blogs, guides, and articles with live preview & ISR.                                     |
| **AI LLM**              | **Google Gemini 3.8 Flash**           | Primary model (`gemini-3.8-flash`) for 24/7 AI Counsellor (<300ms streaming) + `text-embedding-004` for vectors.             |
| **Hosting & CI/CD**     | **Vercel + GitHub**                   | Serverless Edge Network, zero DevOps/Kubernetes.                                                                             |
| **Indian Integrations** | **Razorpay, MSG91, Resend**           | Razorpay for B2B wallet, MSG91 for Indian mobile SMS OTP (+91), Resend for transactional email.                              |

---

## 4. Current Implementation Status

### ✅ Completed Deliverables:

1. **Next.js 15 App Initialized:** Fully functional in `D:\MAGIC-WORKS\PROJECTS\Study-Abroad\Study-Abroad-Vista`.
2. **Unified Portal Login Hub (`/login`):**
   - Multi-role switchboard allowing instant login into all 4 portals:
     - **Student Login** $\rightarrow$ `/dashboard/student`
     - **B2B Consultant / Buyer Login** $\rightarrow$ `/portal/buyer`
     - **University Partner Login** $\rightarrow$ `/portal/university`
     - **Internal Admin Login** $\rightarrow$ `/admin`
3. **4 Authenticated Portal Dashboards Implemented & Verified:**
   - `/dashboard/student`: Student saved shortlists, comparison table, AI chat history.
   - `/portal/buyer`: B2B Consultant lead marketplace, prepaid Razorpay wallet (INR), real-time matching.
   - `/portal/university`: University profile verification, program/tuition manager, student inquiry feed.
   - `/admin`: Master catalog editor (19 countries, 6 programs), lead distribution engine stats, DPDP audit.
4. **Homepage Built to Document W10 Template T-01 Specification:**
   - **Hero Section (Split 2-Column):** Left column contains Playfair Display H1, destination/program search filters, and twin CTAs (`Get Free Counselling` + `Talk to AI Counsellor`). Right column features an interactive live AI chat mockup with Gemini 3.8 Flash streaming dialogue and trust pills.
   - **Anchor Six & 19 Countries Grid:** Dedicated Anchor Six tab (USA, UK, Canada, Australia, Germany, Ireland) + Tier 1/2/3 filters with live INR tuition & post-study visa rights.
   - **Academic Streams Grid (8 Disciplines):** Upgraded to all 8 programs from Doc 1 v2.0 (MS, MBA, MBBS, Undergrad, Executive MBA, Nursing, PhD, Germany Ausbildung) in a clean 4-column responsive grid.
   - **Featured Universities Section:** Partner & accredited institutions with QS World Ranks, minimum IELTS cutoffs, and INR tuition structures.
   - **AI Counsellor Showcase:** Full-width Gold/Navy section featuring interactive Q&A mockup, Gemini 3.8 Flash model pill, and 10K+ conversation trust badges.
   - **Interactive Tools Grid (6 Decision Tools):** Cost Calculator, University Comparator, EMBA ROI Calculator, Eligibility Checker, Loan Pre-Approval, and Deadline Tracker in a 3-column layout (`grid-3`).
   - **Latest Content Freshness (4 Cards):** Editorial guides covering Germany Ausbildung, NMC Medical Regulations, UK vs Canada work visas, and SOP admissions strategies.
   - **Student Story Testimonial:** Dark navy quote card highlighting family cost transparency and shortlist evaluation before talking to counsellors.
   - **Sticky Mobile CTA Bar:** Fixed bottom bar on mobile (`Get Free Counselling →`) triggering the verified lead modal (Pattern RP-001).
5. **Database Blueprint (`supabase/schema.sql`):**
   - Enables `pgvector`, `pg_trgm`, `uuid-ossp`.
   - Complete tables for all 4 user roles, leads, wallets, universities, and RAG vector store.
6. **Branding & Visual Identity:**
   - Playfair Display font imported and configured in Tailwind.
   - Browser tab title configured to `"StudyAbroad Vista | Authoritative International Education Discovery Portal"`.
   - Custom brand icon created at `public/favicon.svg` matching Trust Navy (`#102C57`) squircle frame with Vibrant Coral (`#EA5C2B`) compass needle.
7. **Build & Programmatic SSG Verification:**
   - Full static site generation for 102 pages passing with **0 errors**.
   - Routes include 19 destinations, 8 programs, 54 destination+program pages, and university profiles.
8. **Supabase Direct DB & Admin Auth Integration:**
   - Automated user creation via Supabase Service Role Admin API (`/api/auth/register`) with `email_confirm: true` so newly registered users instantly appear in the **Supabase Dashboard > Authentication > Users** table.
9. **Mobile-First Lighthouse Performance Optimization (Targeting 90%+ per W8 NFRs):**
   - **Next.js Dynamic Imports (`ssr: false`):** Heavy overlays (`AICounsellorDrawer`, `LeadModal`, `SearchDialog`, `AuthRequiredModal`) deferred from initial mobile execution bundle.
   - **Package Tree Shaking:** Enabled `optimizePackageImports: ["lucide-react"]` in `next.config.ts`, reducing icon JS footprint.
   - **CSS Rendering Deferral (`content-visibility: auto`):** Below-the-fold sections (`CountryGrid`, `ProgramStreamGrid`, `CostCalculatorWidget`, `AI Showcase`, `Tools Grid`, `Guides`, `Footer`) tagged with `.cv-auto` and `contain-intrinsic-size`, skipping layout/paint for offscreen content on mobile.
   - **Mobile GPU Compositing Relief:** Removed expensive `blur-3xl` and multi-layer `backdrop-blur-xl` on mobile viewports, eliminating composite layer recalculation and scroll jank.
   - **Font & Viewport Optimization:** Cleaned font preloads in `layout.tsx` (removed unused `Geist_Mono`, added `display: "swap"`), and added optimal `viewport` metadata with `width: "device-width"` and `themeColor: "#102C57"`.
10. **Embedded Sanity Studio & Editorial Content Engine (`/studio`):**
    - **Embedded NextStudio:** Mounted visual Sanity Studio v4 at `/studio` with isolated full-bleed viewport layout.
    - **Strict Architectural Scope:** Streamlined Sanity Studio schemas to focus strictly on editorial articles and author profiles (`article`, `author`). All country destination guides, universities, and program data are owned exclusively by Supabase PostgreSQL.
    - **Resilient Fetchers:** Built `src/lib/sanity/fetchers.ts` with Next.js 15 ISR (`next: { revalidate: 60 }`) and automatic fallbacks (`FALLBACK_ARTICLES`).
    - **Article Reader Routes (`/articles/[slug]`):** Dedicated dynamic reader pages for admissions guides and regulatory updates.
    - **Build Verification:** 107 total static pages prerendered with 0 errors.
11. **University Profile Claiming & Editing Engine:**
    - Public claim flow (`ClaimProfileModal.tsx` ➔ `/api/claims/submit` ➔ `/admin` Approval Queue ➔ `/portal/university` live editor).
    - Dynamic Supabase PostgreSQL database hydration for verified institutional profiles.
12. **Course & Program Comparison Matrix (Template T-09):**
    - Dual-tab `/compare` interface featuring University Comparison & Course/Program Comparison across 10 academic parameters with difference highlighting.
    - **Dynamic Supabase Database Fetching:** Created `/api/courses` endpoint and `fetchLiveCourses()` in `dataFetchers.ts` to dynamically fetch all academic programs, tuition fees, and admission criteria from Supabase PostgreSQL database in real-time.
13. **React Duplicate Key & Navbar Layout Fixes:**
    - Deduplicated `stanford` university entry in `masterData.ts`.
    - Added `shrink-0` & `whitespace-nowrap` to layout Header to prevent collapse on multi-role authentication.
14. **Production Build Verification (`npm run build`):**
    - **100% Clean Compilation:** Resolved type errors in `admin/page.tsx`, `buyer/page.tsx`, and `types/index.ts`.
    - **187 Static Pages Prerendered:** Next.js 15 App Router production build succeeded with **code 0 and 0 errors** across all 187 routes (destinations, programs, articles, test prep, portals, and university profiles).
15. **Navbar Dropdown Count Tags Added:**
    - Standardized count badges across top navigation header in `Header.tsx`: `Destinations (19)`, `Programs (8)`, `Universities (18)`, `Test Prep (9)`, `Tools (6)`.
16. **Admin Profile Claims Queue Live Hydration (`/api/claims`):**
    - Created `/api/claims/route.ts` using `supabaseAdmin` service role to query all pending and approved institutional profile claims without client-side RLS blocking.
    - Updated `fetchLiveClaims()` in `dataFetchers.ts` to call `/api/claims`, populating submitted claims (e.g. University of Toronto claim `e1665541-22c2-43d6-95bc-749743d6184e` submitted by Dr. ABC XYZ) live in the `/admin` queue.
17. **Master Catalog Supabase PostgreSQL Database Sync (`/api/admin/sync-universities`):**
    - Updated `official_email_domain` to store strictly clean domain names (e.g. `tum.de`, `gatech.edu`, `utoronto.ca`, removing `admissions@`).
    - Adapted claim verification in `/api/claims/submit` to extract applicant email domain and perform exact institutional domain matching against `official_email_domain`.
    - Constrained `programs_offered` to PostgreSQL `program_category` enum values (`['ms', 'mba', 'mbbs', 'bachelors', 'nursing', 'ausbildung']`).
    - Updated `supabase/seed_all_universities.sql` and `supabase/schema.sql` with `official_email_domain` and clean domain definitions.
    - Verified sync endpoint `GET /api/admin/sync-universities`: all **18 global universities** successfully synced and populated in Supabase PostgreSQL database with pure domain strings.
18. **Real-Time Admin Claims Queue & Live Sync:**
    - Configured `/api/claims` with `export const dynamic = 'force-dynamic'` and `cache: 'no-store'` to eliminate browser caching.
    - Added auto-polling (every 5 seconds) and a manual **"Refresh Queue"** button in `/admin` for instant live updates.
    - Upgraded `/api/claims/approve` with normalized slug alias mapping, slug matching, UUID verification, and name matching, successfully updating `universities.claimed_status` to `'verified'` upon approval in Supabase.
    - Configured `/universities/[slug]` with `export const dynamic = 'force-dynamic'` to immediately display the **`✓ Verified Institution`** badge.
19. **Unified Multi-Role Portal Switchboard (`/login`):**
    - Added 4 interactive role switcher tabs (`Student`, `B2B Consultant`, `University Partner`, `Super Admin`).
    - Selecting `University Partner` presets `toronto@utoronto.ca` and enforces guaranteed redirect to `/portal/university` with verified University of Toronto metadata.

---

## 5. How to Run Locally

```powershell
cd D:\MAGIC-WORKS\PROJECTS\Study-Abroad\Study-Abroad-Vista
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
To access the 4 portals directly, click **"Portals (4)"** in the header or go to [http://localhost:3000/login](http://localhost:3000/login).
