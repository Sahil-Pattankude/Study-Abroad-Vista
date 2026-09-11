import { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  Compass, 
  ChevronRight, 
  Globe2, 
  GraduationCap, 
  BookOpen, 
  Calculator, 
  Building2, 
  ShieldCheck, 
  FileText, 
  ArrowRight,
  Sparkles,
  Layers,
  Award
} from "lucide-react";
import { COUNTRIES, PROGRAMS, FEATURED_UNIVERSITIES } from "@/lib/data/masterData";
import { TEST_PREP_EXAMS } from "@/lib/data/testPrepData";

export const metadata: Metadata = {
  title: "HTML Sitemap & Complete URL Directory | StudyAbroad Vista",
  description: "Comprehensive navigational sitemap and directory of all 19 country guides, 8 academic programs, 9 test prep blueprints, verified universities, and decision tools.",
  openGraph: {
    title: "Complete Website Sitemap | StudyAbroad Vista",
    description: "Discover all pages, destination hubs, degree syllabi, test prep blueprints, and student tools across the StudyAbroad Vista portal.",
    url: "https://studyabroadvista.com/sitemap",
    type: "website",
  },
};

export default function SitemapPage() {
  const tier1Countries = COUNTRIES.filter(c => c.tier === "Tier 1");
  const tier2Countries = COUNTRIES.filter(c => c.tier === "Tier 2");
  const tier3Countries = COUNTRIES.filter(c => c.tier === "Tier 3");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      <Header />

      <main className="flex-1 pb-20 pt-6 sm:pt-10">
        {/* Breadcrumbs */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href="/" className="hover:text-[#102C57] transition">Home</Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[#102C57] font-bold">HTML Sitemap</span>
          </div>
        </div>

        {/* Hero Header */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-[#102C57] to-[#091A36] p-8 sm:p-12 text-white shadow-md">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-[#EA5C2B]">
              <Compass className="h-3.5 w-3.5" />
              <span>Complete Portal Directory</span>
            </div>
            <h1 className="mt-4 font-serif text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              StudyAbroad Vista Sitemap
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Explore the complete structured index of all 19 global destination guides, 8 academic degree disciplines, 9 standardized test blueprints, decision tools, and institutional portals.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-300">
              <span className="flex items-center gap-1.5">
                <Globe2 className="h-4 w-4 text-[#EA5C2B]" /> 19 Destinations
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="h-4 w-4 text-emerald-400" /> 8 Disciplines
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-amber-300" /> 9 Test Preps
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-blue-300" /> Top Universities
              </span>
            </div>
          </div>
        </div>

        {/* Sitemap Directory Sections */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 space-y-10">
          {/* Section 1: Main Platform & Discovery Hubs */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-[#102C57] flex items-center gap-2 border-b border-slate-100 pb-4">
              <Compass className="h-5 w-5 text-[#EA5C2B]" />
              <span>Core Portals & Admissions Hubs</span>
            </h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <Link href="/" className="rounded-xl border border-slate-100 bg-slate-50 p-4 hover:border-[#102C57] hover:bg-slate-100 transition group">
                <p className="font-bold text-[#102C57] group-hover:text-[#EA5C2B]">Home Page</p>
                <p className="text-slate-500 mt-1 text-[11px]">Main Discovery & AI Admissions Engine</p>
              </Link>
              <Link href="/cost-calculator" className="rounded-xl border border-slate-100 bg-slate-50 p-4 hover:border-[#102C57] hover:bg-slate-100 transition group">
                <p className="font-bold text-[#102C57] group-hover:text-[#EA5C2B]">Cost Calculator</p>
                <p className="text-slate-500 mt-1 text-[11px]">Living Expenses & Tuition in INR</p>
              </Link>
              <Link href="/test-prep" className="rounded-xl border border-slate-100 bg-slate-50 p-4 hover:border-[#102C57] hover:bg-slate-100 transition group">
                <p className="font-bold text-[#102C57] group-hover:text-[#EA5C2B]">Test Prep Hub</p>
                <p className="text-slate-500 mt-1 text-[11px]">9 Exams, Cutoffs & 8-Week Roadmaps</p>
              </Link>
              <Link href="/blog" className="rounded-xl border border-slate-100 bg-slate-50 p-4 hover:border-[#102C57] hover:bg-slate-100 transition group">
                <p className="font-bold text-[#102C57] group-hover:text-[#EA5C2B]">Admissions Blog</p>
                <p className="text-slate-500 mt-1 text-[11px]">Editorial Guides & Visa Insights</p>
              </Link>
            </div>
          </div>

          {/* Section 2: 19 Destination Guides */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-2">
              <h2 className="text-lg font-bold text-[#102C57] flex items-center gap-2">
                <Globe2 className="h-5 w-5 text-[#EA5C2B]" />
                <span>Global Country Hubs (19 Destinations)</span>
              </h2>
              <span className="text-xs font-semibold text-slate-400">All 19 Destinations in Phase 1</span>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs">
              {/* Tier 1 */}
              <div>
                <p className="font-bold text-[#102C57] uppercase tracking-wider text-[11px] mb-3 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-orange-500"></span>
                  <span>Tier 1 (High Demand & PR Pathways)</span>
                </p>
                <ul className="space-y-2">
                  {tier1Countries.map((c) => (
                    <li key={c.id}>
                      <Link href={`/study-in-${c.slug}`} className="flex items-center justify-between rounded-lg p-2 hover:bg-slate-50 text-slate-700 hover:text-[#EA5C2B] transition">
                        <span className="font-semibold">{c.flagEmoji} Study in {c.name}</span>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tier 2 */}
              <div>
                <p className="font-bold text-[#102C57] uppercase tracking-wider text-[11px] mb-3 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                  <span>Tier 2 (Affordable / Low-Fee Europe & Asia)</span>
                </p>
                <ul className="space-y-2">
                  {tier2Countries.map((c) => (
                    <li key={c.id}>
                      <Link href={`/study-in-${c.slug}`} className="flex items-center justify-between rounded-lg p-2 hover:bg-slate-50 text-slate-700 hover:text-[#EA5C2B] transition">
                        <span className="font-semibold">{c.flagEmoji} Study in {c.name}</span>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tier 3 */}
              <div>
                <p className="font-bold text-[#102C57] uppercase tracking-wider text-[11px] mb-3 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  <span>Tier 3 (Budget MBBS & Medical)</span>
                </p>
                <ul className="space-y-2">
                  {tier3Countries.map((c) => (
                    <li key={c.id}>
                      <Link href={`/study-in-${c.slug}`} className="flex items-center justify-between rounded-lg p-2 hover:bg-slate-50 text-slate-700 hover:text-[#EA5C2B] transition">
                        <span className="font-semibold">{c.flagEmoji} MBBS in {c.name}</span>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: 8 Program Disciplines */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-[#102C57] flex items-center gap-2 border-b border-slate-100 pb-4">
              <GraduationCap className="h-5 w-5 text-[#EA5C2B]" />
              <span>Academic Degree Programs (8 Disciplines)</span>
            </h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              {PROGRAMS.map((p) => (
                <Link
                  key={p.id}
                  href={`/programs/${p.slug}`}
                  className="rounded-2xl border border-slate-100 bg-slate-50 p-4 hover:border-[#102C57] hover:bg-white hover:shadow-xs transition group"
                >
                  <span className="rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    {p.level}
                  </span>
                  <h3 className="mt-2.5 font-bold text-slate-900 group-hover:text-[#EA5C2B] transition">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Duration: {p.duration}
                  </p>
                  <p className="mt-2 text-[10px] font-medium text-[#102C57]">
                    Top: {p.topDestinations.slice(0, 3).join(", ")}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* Section 4: 9 Test Preparation & Licensing Guides */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-[#102C57] flex items-center gap-2 border-b border-slate-100 pb-4">
              <BookOpen className="h-5 w-5 text-[#EA5C2B]" />
              <span>Test Prep & Licensing Blueprints (9 Global Exams)</span>
            </h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
              {/* English */}
              <div>
                <p className="font-bold text-blue-700 uppercase tracking-wider text-[11px] mb-2.5">
                  English Language Tests
                </p>
                <ul className="space-y-2">
                  <li>
                    <Link href="/test-prep/ielts" className="block rounded-xl p-2.5 bg-slate-50 hover:bg-blue-50/70 border border-slate-100 transition">
                      <p className="font-bold text-slate-900">IELTS Academic</p>
                      <p className="text-[10px] text-slate-500">IDP India • ₹17,000</p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/test-prep/toefl" className="block rounded-xl p-2.5 bg-slate-50 hover:bg-blue-50/70 border border-slate-100 transition">
                      <p className="font-bold text-slate-900">TOEFL iBT</p>
                      <p className="text-[10px] text-slate-500">ETS • ₹16,900</p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/test-prep/pte" className="block rounded-xl p-2.5 bg-slate-50 hover:bg-blue-50/70 border border-slate-100 transition">
                      <p className="font-bold text-slate-900">PTE Academic</p>
                      <p className="text-[10px] text-slate-500">Pearson • ₹17,000</p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/test-prep/duolingo" className="block rounded-xl p-2.5 bg-slate-50 hover:bg-blue-50/70 border border-slate-100 transition">
                      <p className="font-bold text-slate-900">Duolingo DET</p>
                      <p className="text-[10px] text-slate-500">Duolingo • ₹5,400</p>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Graduate */}
              <div>
                <p className="font-bold text-amber-800 uppercase tracking-wider text-[11px] mb-2.5">
                  Graduate & Business Admissions
                </p>
                <ul className="space-y-2">
                  <li>
                    <Link href="/test-prep/gre" className="block rounded-xl p-2.5 bg-slate-50 hover:bg-amber-50/70 border border-slate-100 transition">
                      <p className="font-bold text-slate-900">GRE General Test</p>
                      <p className="text-[10px] text-slate-500">ETS • ₹22,550</p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/test-prep/gmat" className="block rounded-xl p-2.5 bg-slate-50 hover:bg-amber-50/70 border border-slate-100 transition">
                      <p className="font-bold text-slate-900">GMAT Focus Edition</p>
                      <p className="text-[10px] text-slate-500">GMAC • ₹24,000</p>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Medical */}
              <div>
                <p className="font-bold text-emerald-800 uppercase tracking-wider text-[11px] mb-2.5">
                  Medical & Healthcare Licensing
                </p>
                <ul className="space-y-2">
                  <li>
                    <Link href="/test-prep/nclex" className="block rounded-xl p-2.5 bg-slate-50 hover:bg-emerald-50/70 border border-slate-100 transition">
                      <p className="font-bold text-slate-900">NCLEX-RN (Nursing)</p>
                      <p className="text-[10px] text-slate-500">NCSBN • ₹16,600</p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/test-prep/plab" className="block rounded-xl p-2.5 bg-slate-50 hover:bg-emerald-50/70 border border-slate-100 transition">
                      <p className="font-bold text-slate-900">PLAB / UKMLA (MBBS)</p>
                      <p className="text-[10px] text-slate-500">GMC UK • Part 1 & Part 2</p>
                    </Link>
                  </li>
                  <li>
                    <Link href="/test-prep/oet" className="block rounded-xl p-2.5 bg-slate-50 hover:bg-emerald-50/70 border border-slate-100 transition">
                      <p className="font-bold text-slate-900">OET (Healthcare English)</p>
                      <p className="text-[10px] text-slate-500">CBLA • ₹33,000</p>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 5: Featured Universities */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-[#102C57] flex items-center gap-2 border-b border-slate-100 pb-4">
              <Building2 className="h-5 w-5 text-[#EA5C2B]" />
              <span>Featured Global Universities</span>
            </h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              {FEATURED_UNIVERSITIES.map((u) => (
                <Link
                  key={u.id}
                  href={`/universities/${u.slug}`}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3.5 hover:border-[#102C57] hover:bg-white transition group"
                >
                  <div>
                    <p className="font-bold text-slate-900 group-hover:text-[#EA5C2B] transition">{u.name}</p>
                    <p className="text-[11px] text-slate-500">{u.city}, {u.country} • Rank #{u.rankingGlobal}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-[#EA5C2B] transition" />
                </Link>
              ))}
            </div>
          </div>

          {/* Section 6: Ecosystem Portals & User Accounts */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-[#102C57] flex items-center gap-2 border-b border-slate-100 pb-4">
              <Layers className="h-5 w-5 text-[#EA5C2B]" />
              <span>Ecosystem Portals & User Access</span>
            </h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <Link href="/portal/buyer" className="rounded-xl border border-slate-100 bg-slate-50 p-4 hover:border-[#102C57] transition group">
                <p className="font-bold text-orange-700">B2B Consultant Portal</p>
                <p className="text-slate-500 mt-1 text-[11px]">Lead Marketplace & Wallet Recharge</p>
              </Link>
              <Link href="/portal/university" className="rounded-xl border border-slate-100 bg-slate-50 p-4 hover:border-[#102C57] transition group">
                <p className="font-bold text-emerald-700">University Partner Portal</p>
                <p className="text-slate-500 mt-1 text-[11px]">Institution Catalog & Analytics</p>
              </Link>
              <Link href="/dashboard/student" className="rounded-xl border border-slate-100 bg-slate-50 p-4 hover:border-[#102C57] transition group">
                <p className="font-bold text-blue-700">Student Dashboard</p>
                <p className="text-slate-500 mt-1 text-[11px]">Saved Colleges, Shortlists & Profile</p>
              </Link>
              <Link href="/login" className="rounded-xl border border-slate-100 bg-slate-50 p-4 hover:border-[#102C57] transition group">
                <p className="font-bold text-[#102C57]">Account Access</p>
                <p className="text-slate-500 mt-1 text-[11px]">Secure Login, Signup & Reset</p>
              </Link>
            </div>
          </div>

          {/* Section 7: Company, Trust & Legal Compliance */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-[#102C57] flex items-center gap-2 border-b border-slate-100 pb-4">
              <ShieldCheck className="h-5 w-5 text-emerald-600" />
              <span>Company, Trust & Legal Compliance</span>
            </h2>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 text-xs">
              <Link href="/about" className="rounded-xl border border-slate-100 bg-slate-50 p-3 hover:bg-slate-100 font-semibold text-slate-700 hover:text-[#EA5C2B] transition">
                About Us
              </Link>
              <Link href="/contact" className="rounded-xl border border-slate-100 bg-slate-50 p-3 hover:bg-slate-100 font-semibold text-slate-700 hover:text-[#EA5C2B] transition">
                Contact Desk
              </Link>
              <Link href="/privacy-policy" className="rounded-xl border border-slate-100 bg-slate-50 p-3 hover:bg-slate-100 font-semibold text-slate-700 hover:text-[#EA5C2B] transition">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="rounded-xl border border-slate-100 bg-slate-50 p-3 hover:bg-slate-100 font-semibold text-slate-700 hover:text-[#EA5C2B] transition">
                Terms of Service
              </Link>
              <Link href="/refund-policy" className="rounded-xl border border-slate-100 bg-slate-50 p-3 hover:bg-slate-100 font-semibold text-slate-700 hover:text-[#EA5C2B] transition">
                Refund Policy
              </Link>
              <Link href="/dpdp-consent" className="rounded-xl border border-slate-100 bg-slate-50 p-3 hover:bg-slate-100 font-semibold text-slate-700 hover:text-[#EA5C2B] transition">
                DPDP Consent
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
