import Link from "next/link";
import { Compass, ShieldCheck, Award, HeartHandshake } from "lucide-react";
import { COUNTRIES, PROGRAMS } from "@/lib/data/masterData";
import { CountryFlag } from "@/components/ui/CountryFlag";

export function Footer() {
  return (
    <footer className="cv-auto border-t border-slate-200 bg-slate-900 text-slate-300">
      {/* Top Value Banner */}
      <div className="border-b border-slate-800 bg-slate-950 py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-[#EA5C2B]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                100% Verified Universities
              </p>
              <p className="text-[11px] text-slate-400">
                NMC, WHO & accreditation verified catalogs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-emerald-400">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                Transparent ROI & Fee Data
              </p>
              <p className="text-[11px] text-slate-400">
                Actual living costs converted to INR.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-indigo-400">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">
                DPDP Act 2023 Compliant
              </p>
              <p className="text-[11px] text-slate-400">
                Zero spam. Encrypted Indian student data privacy.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Taxonomy Directory — Brand Header + 6 Columns per Document W1 & W10 */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Brand Header & Mandate */}
        <div className="mb-12 flex flex-col items-start justify-between gap-6 border-b border-slate-800/80 pb-10 md:flex-row md:items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#102C57] to-[#091A36] text-white shadow-md border border-slate-700/50 group-hover:scale-105 transition-transform duration-200">
              <Compass className="h-6 w-6 text-[#EA5C2B]" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight text-white leading-none">
                StudyAbroad<span className="text-[#EA5C2B]">Vista</span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">
                Authoritative Discovery & Admissions Engine
              </span>
            </div>
          </Link>

          <p className="max-w-md text-xs leading-relaxed text-slate-400">
            A venture by <strong>Dnyanal Educon Pvt. Ltd.</strong> Empowering
            Indian students with zero-bias admissions intelligence across 19
            global destinations and 8 career disciplines.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {/* Column 1: Explore */}
          <div>
            <h4 className="mb-3.5 text-xs font-bold uppercase tracking-wider text-white">
              Explore
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/#destinations-grid"
                  className="text-slate-400 hover:text-white transition"
                >
                  19 Destinations
                </Link>
              </li>
              <li>
                <Link
                  href="/#programs-grid"
                  className="text-slate-400 hover:text-white transition"
                >
                  8 Disciplines
                </Link>
              </li>
              <li>
                <Link
                  href="/universities/technical-university-of-munich"
                  className="text-slate-400 hover:text-white transition"
                >
                  Verified Universities
                </Link>
              </li>
              <li>
                <Link
                  href="/cost-calculator"
                  className="text-slate-400 hover:text-white transition"
                >
                  Cost Calculator
                </Link>
              </li>
              <li>
                <Link
                  href="/compare/universities"
                  className="text-slate-400 hover:text-white transition font-semibold text-[#EA5C2B]"
                >
                  University Compare Matrix
                </Link>
              </li>
              <li>
                <Link
                  href="/compare/courses"
                  className="text-slate-400 hover:text-white transition"
                >
                  Course & Degree Compare
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-slate-400 hover:text-white transition"
                >
                  Editorial Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Popular Destinations */}
          <div>
            <h4 className="mb-3.5 text-xs font-bold uppercase tracking-wider text-white">
              Destinations
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/study-in-usa"
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition"
                >
                  <CountryFlag code="US" name="United States" size="sm" />
                  <span>Study in USA</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/study-in-uk"
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition"
                >
                  <CountryFlag code="GB" name="United Kingdom" size="sm" />
                  <span>Study in UK</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/study-in-germany"
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition"
                >
                  <CountryFlag code="DE" name="Germany" size="sm" />
                  <span>Study in Germany</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/study-in-canada"
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition"
                >
                  <CountryFlag code="CA" name="Canada" size="sm" />
                  <span>Study in Canada</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/study-in-australia"
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition"
                >
                  <CountryFlag code="AU" name="Australia" size="sm" />
                  <span>Study in Australia</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/study-in-ireland"
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition"
                >
                  <CountryFlag code="IE" name="Ireland" size="sm" />
                  <span>Study in Ireland</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/study-in-russia"
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition"
                >
                  <CountryFlag code="RU" name="Russia" size="sm" />
                  <span>MBBS in Russia</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/study-in-georgia"
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition"
                >
                  <CountryFlag code="GE" name="Georgia" size="sm" />
                  <span>MBBS in Georgia</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Programs & Degrees */}
          <div>
            <h4 className="mb-3.5 text-xs font-bold uppercase tracking-wider text-white">
              Programs
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/programs/ms"
                  className="text-slate-400 hover:text-white transition"
                >
                  MS & STEM Masters
                </Link>
              </li>
              <li>
                <Link
                  href="/programs/mba"
                  className="text-slate-400 hover:text-white transition"
                >
                  MBA & Management
                </Link>
              </li>
              <li>
                <Link
                  href="/programs/mbbs"
                  className="text-slate-400 hover:text-white transition"
                >
                  MBBS Abroad
                </Link>
              </li>
              <li>
                <Link
                  href="/programs/nursing"
                  className="text-slate-400 hover:text-white transition"
                >
                  Nursing Migration
                </Link>
              </li>
              <li>
                <Link
                  href="/programs/ausbildung"
                  className="text-slate-400 hover:text-white transition"
                >
                  Germany Ausbildung
                </Link>
              </li>
              <li>
                <Link
                  href="/programs/bachelors"
                  className="text-slate-400 hover:text-white transition"
                >
                  Bachelor&apos;s Degrees
                </Link>
              </li>
              <li>
                <Link
                  href="/programs/emba"
                  className="text-slate-400 hover:text-white transition"
                >
                  Executive MBA
                </Link>
              </li>
              <li>
                <Link
                  href="/programs/phd"
                  className="text-slate-400 hover:text-white transition"
                >
                  PhD & Research
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Test Prep & Resources */}
          <div>
            <h4 className="mb-3.5 text-xs font-bold uppercase tracking-wider text-white">
              Test Prep & Hub
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/test-prep"
                  className="font-semibold text-[#EA5C2B] hover:text-white transition"
                >
                  ★ Test Prep Hub (All 9)
                </Link>
              </li>
              <li>
                <Link
                  href="/test-prep/ielts"
                  className="text-slate-400 hover:text-white transition"
                >
                  IELTS Academic (IDP)
                </Link>
              </li>
              <li>
                <Link
                  href="/test-prep/gre"
                  className="text-slate-400 hover:text-white transition"
                >
                  GRE General Test
                </Link>
              </li>
              <li>
                <Link
                  href="/test-prep/gmat"
                  className="text-slate-400 hover:text-white transition"
                >
                  GMAT Focus Edition
                </Link>
              </li>
              <li>
                <Link
                  href="/test-prep/nclex"
                  className="text-slate-400 hover:text-white transition"
                >
                  NCLEX-RN (Nursing)
                </Link>
              </li>
              <li>
                <Link
                  href="/test-prep/plab"
                  className="text-slate-400 hover:text-white transition"
                >
                  PLAB / UKMLA (MBBS)
                </Link>
              </li>
              <li>
                <Link
                  href="/test-prep/oet"
                  className="text-slate-400 hover:text-white transition"
                >
                  OET Healthcare English
                </Link>
              </li>
              <li>
                <Link
                  href="/test-prep/pte"
                  className="text-slate-400 hover:text-white transition"
                >
                  PTE Academic
                </Link>
              </li>
              <li>
                <Link
                  href="/cost-calculator"
                  className="text-slate-400 hover:text-white transition"
                >
                  INR Tuition Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Company & Portals */}
          <div>
            <h4 className="mb-3.5 text-xs font-bold uppercase tracking-wider text-white">
              Company
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/about"
                  className="text-slate-400 hover:text-white transition"
                >
                  About StudyAbroadVista
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-400 hover:text-white transition"
                >
                  Contact Admissions Desk
                </Link>
              </li>
              <li>
                <Link
                  href="/portal/buyer"
                  className="text-slate-400 hover:text-white transition"
                >
                  B2B Consultant Portal
                </Link>
              </li>
              <li>
                <Link
                  href="/portal/university"
                  className="text-slate-400 hover:text-white transition"
                >
                  University Partners
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/student"
                  className="text-slate-400 hover:text-white transition"
                >
                  Student Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 6: Legal & Compliance */}
          <div>
            <h4 className="mb-3.5 text-xs font-bold uppercase tracking-wider text-white">
              Legal & Trust
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-slate-400 hover:text-white transition"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-slate-400 hover:text-white transition"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/refund-policy"
                  className="text-slate-400 hover:text-white transition"
                >
                  Refund & Cancellation
                </Link>
              </li>
              <li>
                <Link
                  href="/dpdp-consent"
                  className="text-slate-400 hover:text-white transition"
                >
                  DPDP Act 2023 Consent
                </Link>
              </li>
              <li>
                <Link
                  href="/sitemap"
                  className="text-slate-400 hover:text-white transition"
                >
                  HTML Sitemap
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-slate-400 hover:text-white transition"
                >
                  Authorized Sign In
                </Link>
              </li>
              <li>
                <Link
                  href="/signup"
                  className="text-slate-400 hover:text-white transition"
                >
                  Student Registration
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Parent Entity & Legal Notice */}
        <div className="mt-14 flex flex-col items-center justify-between border-t border-slate-800 pt-8 text-xs text-slate-500 sm:flex-row">
          <div className="flex flex-col gap-1 text-center sm:text-left">
            <p className="font-semibold text-slate-400">
              © 2026 StudyAbroad Vista. An authoritative brand by Dnyanal Educon
              Pvt. Ltd.
            </p>
            <p className="text-[11px] text-slate-500">
              Pune & Mumbai, India • Grievance Officer: dpo@studyabroadvista.com
              • ISO & DPDP 2023 Verified.
            </p>
          </div>
          <div className="mt-4 flex gap-6 sm:mt-0">
            <Link
              href="/privacy-policy"
              className="hover:text-slate-300 transition"
            >
              Privacy
            </Link>
            <Link
              href="/terms-of-service"
              className="hover:text-slate-300 transition"
            >
              Terms
            </Link>
            <Link
              href="/dpdp-consent"
              className="hover:text-slate-300 transition"
            >
              DPDP
            </Link>
            <Link href="/about" className="hover:text-slate-300 transition">
              About
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
