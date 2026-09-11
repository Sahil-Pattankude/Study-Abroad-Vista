"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Compass, 
  Search, 
  Bot, 
  ChevronDown, 
  Menu, 
  X, 
  Lock, 
  User, 
  LogOut, 
  Calculator, 
  Briefcase,
  Building2,
  ArrowRight
} from "lucide-react";
import { COUNTRIES, PROGRAMS, FEATURED_UNIVERSITIES } from "@/lib/data/masterData";
import { useAuth } from "@/lib/auth/AuthContext";
import { useHomeModals } from "@/components/home/HomeClientContext";

const TIER_1_COUNTRIES = COUNTRIES.filter(c => c.tier === "Tier 1");
const TIER_2_COUNTRIES = COUNTRIES.filter(c => c.tier === "Tier 2");
const TIER_3_COUNTRIES = COUNTRIES.filter(c => c.tier === "Tier 3");

interface HeaderProps {
  onOpenSearch?: () => void;
  onOpenAICounsellor?: () => void;
  onOpenLeadModal?: () => void;
}

export function Header({ onOpenSearch, onOpenAICounsellor, onOpenLeadModal }: HeaderProps) {
  const { user, isLoggedIn, logout } = useAuth();
  const homeModals = useHomeModals();

  const handleSearch = onOpenSearch || homeModals.openSearch;
  const handleAI = onOpenAICounsellor || homeModals.openAICounsellor;
  const handleLead = onOpenLeadModal || homeModals.openLeadModal;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [destinationsOpen, setDestinationsOpen] = useState(false);
  const [programsOpen, setProgramsOpen] = useState(false);
  const [universitiesOpen, setUniversitiesOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [testPrepOpen, setTestPrepOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#102C57] to-[#0d2346] text-white shadow-sm group-hover:shadow transition">
            <Compass className="h-5 w-5 text-[#EA5C2B]" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-[#102C57] leading-none">
              StudyAbroad<span className="text-[#EA5C2B]">Vista</span>
            </span>
            <span className="hidden text-[9px] font-bold uppercase tracking-wider text-slate-400 sm:block mt-0.5">
              Authoritative Portal
            </span>
          </div>
        </Link>

        {/* Desktop Global Navigation - Clean & Refined */}
        <nav className="hidden items-center gap-6 lg:flex">
          {/* Destinations Mega Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setDestinationsOpen(true)}
            onMouseLeave={() => setDestinationsOpen(false)}
          >
            <button aria-label="Open destinations menu" aria-expanded={destinationsOpen} className="group flex items-center gap-1 py-1.5 text-[13px] font-semibold text-slate-600 hover:text-[#102C57] transition">
              <span>Destinations</span>
              <span className="text-[10px] text-slate-400 font-normal">(19)</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-700 transition duration-150" />
            </button>

            {destinationsOpen && (
              <div className="absolute -left-20 top-full pt-2">
                <div className="w-[620px] rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-[#102C57]">
                        Tier 1 (High Demand)
                      </p>
                      <ul className="space-y-1.5 text-xs">
                        {TIER_1_COUNTRIES.map(c => (
                          <li key={c.id}>
                            <Link href={`/study-in-${c.slug}`} className="flex items-center gap-2 text-slate-600 hover:text-[#EA5C2B]">
                              <span>{c.flagEmoji}</span>
                              <span className="font-medium">{c.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-[#102C57]">
                        Tier 2 (Affordable / Low-Fee)
                      </p>
                      <ul className="space-y-1.5 text-xs">
                        {TIER_2_COUNTRIES.map(c => (
                          <li key={c.id}>
                            <Link href={`/study-in-${c.slug}`} className="flex items-center gap-2 text-slate-600 hover:text-[#EA5C2B]">
                              <span>{c.flagEmoji}</span>
                              <span className="font-medium">{c.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="mb-2.5 text-[11px] font-bold uppercase tracking-wider text-[#102C57]">
                        Tier 3 (Medical / Low-Cost)
                      </p>
                      <ul className="space-y-1.5 text-xs">
                        {TIER_3_COUNTRIES.map(c => (
                          <li key={c.id}>
                            <Link href={`/study-in-${c.slug}`} className="flex items-center gap-2 text-slate-600 hover:text-[#EA5C2B]">
                              <span>{c.flagEmoji}</span>
                              <span className="font-medium">{c.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Programs Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setProgramsOpen(true)}
            onMouseLeave={() => setProgramsOpen(false)}
          >
            <button aria-label="Open programs menu" aria-expanded={programsOpen} className="group flex items-center gap-1 py-1.5 text-[13px] font-semibold text-slate-600 hover:text-[#102C57] transition">
              <span>Programs</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-700 transition duration-150" />
            </button>

            {programsOpen && (
              <div className="absolute left-0 top-full pt-2">
                <div className="w-72 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl">
                  <ul className="space-y-1.5">
                    {PROGRAMS.map(p => (
                      <li key={p.id}>
                        <Link href={`/programs/${p.slug}`} className="block rounded-xl p-2 hover:bg-slate-50 transition">
                          <p className="text-xs font-bold text-[#102C57]">{p.name}</p>
                          <p className="text-[11px] text-slate-500">{p.duration} • Top: {p.topDestinations.slice(0, 3).join(", ")}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* 3. Universities Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setUniversitiesOpen(true)}
            onMouseLeave={() => setUniversitiesOpen(false)}
          >
            <button aria-label="Open universities menu" aria-expanded={universitiesOpen} className="group flex items-center gap-1 py-1.5 text-[13px] font-semibold text-slate-600 hover:text-[#102C57] transition">
              <span>Universities</span>
              <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-150 ${universitiesOpen ? 'rotate-180 text-slate-700' : ''}`} />
            </button>

            {universitiesOpen && (
              <div className="absolute -left-10 top-full pt-2">
                <div className="w-80 rounded-2xl border border-slate-100 bg-white p-4 shadow-2xl ring-1 ring-slate-900/5">
                  <div className="mb-2 px-2 pb-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#102C57]">Featured Institutions</span>
                    <span className="text-[10px] font-medium text-slate-400">QS Verified</span>
                  </div>
                  <ul className="space-y-1">
                    {FEATURED_UNIVERSITIES.map(u => (
                      <li key={u.id}>
                        <Link href={`/universities/${u.slug}`} className="block rounded-xl p-2 hover:bg-slate-50 transition group/uni">
                          <p className="text-xs font-bold text-[#102C57] group-hover/uni:text-[#EA5C2B] transition">{u.name}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">#{u.rankingGlobal} Global • {u.country}</p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* 4. Test Prep Mega Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setTestPrepOpen(true)}
            onMouseLeave={() => setTestPrepOpen(false)}
          >
            <button aria-label="Open test prep menu" aria-expanded={testPrepOpen} className="group flex items-center gap-1 py-1.5 text-[13px] font-semibold text-slate-600 hover:text-[#102C57] transition">
              <span>Test Prep</span>
              <span className="text-[10px] text-slate-400 font-normal">(9)</span>
              <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-150 ${testPrepOpen ? 'rotate-180 text-slate-700' : ''}`} />
            </button>

            {testPrepOpen && (
              <div className="absolute -left-20 top-full pt-2">
                <div className="w-[520px] rounded-2xl border border-slate-100 bg-white p-5 shadow-2xl ring-1 ring-slate-900/5">
                  <div className="grid grid-cols-3 gap-4">
                    {/* English */}
                    <div>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-blue-700">
                        English (4)
                      </p>
                      <ul className="space-y-1 text-xs">
                        <li>
                          <Link href="/test-prep/ielts" className="block rounded-lg p-1.5 hover:bg-slate-50 font-medium text-slate-700 hover:text-[#EA5C2B]">
                            IELTS Academic
                          </Link>
                        </li>
                        <li>
                          <Link href="/test-prep/toefl" className="block rounded-lg p-1.5 hover:bg-slate-50 font-medium text-slate-700 hover:text-[#EA5C2B]">
                            TOEFL iBT
                          </Link>
                        </li>
                        <li>
                          <Link href="/test-prep/pte" className="block rounded-lg p-1.5 hover:bg-slate-50 font-medium text-slate-700 hover:text-[#EA5C2B]">
                            PTE Academic
                          </Link>
                        </li>
                        <li>
                          <Link href="/test-prep/duolingo" className="block rounded-lg p-1.5 hover:bg-slate-50 font-medium text-slate-700 hover:text-[#EA5C2B]">
                            Duolingo DET
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* Graduate */}
                    <div>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                        Graduate & MBA (2)
                      </p>
                      <ul className="space-y-1 text-xs">
                        <li>
                          <Link href="/test-prep/gre" className="block rounded-lg p-1.5 hover:bg-slate-50 font-medium text-slate-700 hover:text-[#EA5C2B]">
                            GRE General
                          </Link>
                        </li>
                        <li>
                          <Link href="/test-prep/gmat" className="block rounded-lg p-1.5 hover:bg-slate-50 font-medium text-slate-700 hover:text-[#EA5C2B]">
                            GMAT Focus
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* Medical */}
                    <div>
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        Medical & Healthcare (3)
                      </p>
                      <ul className="space-y-1 text-xs">
                        <li>
                          <Link href="/test-prep/nclex" className="block rounded-lg p-1.5 hover:bg-slate-50 font-medium text-slate-700 hover:text-[#EA5C2B]">
                            NCLEX-RN
                          </Link>
                        </li>
                        <li>
                          <Link href="/test-prep/plab" className="block rounded-lg p-1.5 hover:bg-slate-50 font-medium text-slate-700 hover:text-[#EA5C2B]">
                            PLAB / UKMLA
                          </Link>
                        </li>
                        <li>
                          <Link href="/test-prep/oet" className="block rounded-lg p-1.5 hover:bg-slate-50 font-medium text-slate-700 hover:text-[#EA5C2B]">
                            OET Healthcare
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-400">All fees in INR & 8-week roadmaps</span>
                    <Link href="/test-prep" className="font-bold text-[#EA5C2B] hover:underline flex items-center gap-1">
                      <span>Explore Test Prep Hub →</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 5. Tools Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setToolsOpen(true)}
            onMouseLeave={() => setToolsOpen(false)}
          >
            <button aria-label="Open tools menu" aria-expanded={toolsOpen} className="group flex items-center gap-1 py-1.5 text-[13px] font-semibold text-slate-600 hover:text-[#102C57] transition">
              <span>Tools</span>
              <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-150 ${toolsOpen ? 'rotate-180 text-slate-700' : ''}`} />
            </button>

            {toolsOpen && (
              <div className="absolute -left-8 top-full pt-2">
                <div className="w-72 rounded-2xl border border-slate-100 bg-white p-3 shadow-2xl ring-1 ring-slate-900/5">
                  <div className="mb-2 px-2 pb-2 border-b border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#102C57]">Student Utilities</span>
                  </div>
                  <ul className="space-y-1">
                    <li>
                      <Link href="/cost-calculator" className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50 transition group/tool">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-[#EA5C2B]">
                          <Calculator className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#102C57] group-hover/tool:text-[#EA5C2B]">Cost Calculator</p>
                          <p className="text-[10px] text-slate-400">Living + Tuition in INR</p>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <button 
                        onClick={() => { handleAI(); }}
                        className="flex w-full items-center gap-3 rounded-xl p-2 hover:bg-slate-50 transition group/tool text-left"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                          <Bot className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#102C57] group-hover/tool:text-indigo-600">AI Counsellor</p>
                          <p className="text-[10px] text-slate-400">24/7 Admissions Guidance</p>
                        </div>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* 6. Blog & Guides */}
          <Link href="/blog" className="py-1.5 text-[13px] font-semibold text-slate-600 hover:text-[#102C57] transition">
            Blog & Guides
          </Link>
        </nav>

        {/* Right CTA Actions - Cleaned & Streamlined */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Search Icon Button */}
          <button 
            onClick={handleSearch}
            aria-label="Search universities, programs and destinations"
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 transition"
            title="Search universities, programs and destinations"
          >
            <Search className="h-4 w-4" />
          </button>

          {/* User Auth state & 4 Portals Dropdown */}
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Link
                href={
                  user?.role === "buyer"
                    ? "/portal/buyer"
                    : user?.role === "university"
                    ? "/portal/university"
                    : user?.role === "admin"
                    ? "/admin"
                    : "/dashboard/student"
                }
                className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-[#102C57] hover:bg-slate-100 transition"
              >
                <User className="h-3.5 w-3.5 text-[#EA5C2B]" />
                <span className="hidden sm:inline">My Portal</span>
                <span className="text-[10px] text-slate-500 capitalize">({user?.role === "buyer" ? "B2B" : user?.role})</span>
              </Link>
              <button
                onClick={logout}
                aria-label="Sign out"
                className="rounded-full p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                title="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <div 
              className="relative hidden sm:block"
              onMouseEnter={() => setAuthOpen(true)}
              onMouseLeave={() => setAuthOpen(false)}
            >
              <button aria-label="Open portals and login menu" aria-expanded={authOpen} className="flex items-center gap-1 rounded-full border border-slate-200/90 bg-slate-50/80 px-3 py-1.5 text-xs font-bold text-[#102C57] hover:bg-slate-100 hover:border-slate-300 transition">
                <User className="h-3.5 w-3.5 text-[#EA5C2B]" />
                <span>Portals & Login</span>
                <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-150 ${authOpen ? 'rotate-180 text-slate-700' : ''}`} />
              </button>

              {authOpen && (
                <div className="absolute right-0 top-full pt-2">
                  <div className="w-80 rounded-2xl border border-slate-100 bg-white p-3 shadow-2xl ring-1 ring-slate-900/5">
                    <div className="mb-2 px-2 pb-2 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#102C57]">Portals & Sign In</span>
                      <Link href="/signup" className="text-[10px] font-bold text-[#EA5C2B] hover:underline">
                        Register Free →
                      </Link>
                    </div>

                    <div className="space-y-1">
                      {/* Portal 1: Student Dashboard */}
                      <Link
                        href="/login"
                        className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-slate-50 transition group/item"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-[#EA5C2B] mt-0.5">
                          <User className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-[#102C57] group-hover/item:text-[#EA5C2B]">Student Dashboard</span>
                            <span className="rounded bg-orange-100 px-1 py-0.2 text-[9px] font-bold text-[#EA5C2B]">Aspirants</span>
                          </div>
                          <p className="text-[10px] text-slate-400">Shortlists, applications & AI chat history</p>
                        </div>
                      </Link>

                      {/* Portal 2: B2B Consultant Portal */}
                      <Link
                        href="/portal/buyer"
                        className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-slate-50 transition group/item"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 mt-0.5">
                          <Briefcase className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-[#102C57] group-hover/item:text-blue-700">B2B Consultant Portal</span>
                            <span className="rounded bg-blue-100 px-1 py-0.2 text-[9px] font-bold text-blue-700">Consultants</span>
                          </div>
                          <p className="text-[10px] text-slate-400">Lead marketplace feed & wallet top-up</p>
                        </div>
                      </Link>

                      {/* Portal 3: University Partner Portal */}
                      <Link
                        href="/portal/university"
                        className="flex items-start gap-2.5 rounded-xl p-2 hover:bg-slate-50 transition group/item"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 mt-0.5">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-[#102C57] group-hover/item:text-emerald-700">University Portal</span>
                            <span className="rounded bg-emerald-100 px-1 py-0.2 text-[9px] font-bold text-emerald-700">Partners</span>
                          </div>
                          <p className="text-[10px] text-slate-400">Manage listings, programs & analytics</p>
                        </div>
                      </Link>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs px-2">
                      <Link href="/login" className="font-bold text-[#102C57] hover:underline">
                        Standard Sign In →
                      </Link>
                      <Link href="/signup" className="font-bold text-[#EA5C2B] hover:underline">
                        Create Account
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Primary Action Button */}
          <button
            onClick={onOpenLeadModal}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#EA5C2B] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#ff7240] hover:shadow active:scale-98"
          >
            <span>Free Consultation</span>
            <ArrowRight className="h-3 w-3" />
          </button>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-700 lg:hidden"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-6 lg:hidden">
          <div className="space-y-4">
            <button 
              onClick={() => { setMobileMenuOpen(false); handleAI(); }}
              className="flex w-full items-center justify-between rounded-xl bg-indigo-50 p-3 text-sm font-bold text-indigo-900"
            >
              <span className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-[#EA5C2B]" />
                Talk to AI Counsellor (24/7)
                {!isLoggedIn && <Lock className="h-3.5 w-3.5 text-amber-600 ml-1" />}
              </span>
              <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] text-white">
                {isLoggedIn ? "Live" : "Login Req"}
              </span>
            </button>

            <Link 
              href="/#destinations-grid" 
              onClick={() => setMobileMenuOpen(false)}
              className="block font-semibold text-slate-700 hover:text-[#102C57]"
            >
              All 19 Destinations
            </Link>

            <Link 
              href="/#programs-grid" 
              onClick={() => setMobileMenuOpen(false)}
              className="block font-semibold text-slate-700 hover:text-[#102C57]"
            >
              All 8 Disciplines & Programs
            </Link>

            <Link 
              href="/universities/technical-university-of-munich" 
              onClick={() => setMobileMenuOpen(false)}
              className="block font-semibold text-slate-700 hover:text-[#102C57]"
            >
              Featured Universities
            </Link>

            <Link 
              href="/cost-calculator" 
              onClick={() => setMobileMenuOpen(false)}
              className="block font-semibold text-slate-700 hover:text-[#102C57]"
            >
              Study Cost Calculator
            </Link>

            <Link 
              href="/test-prep" 
              onClick={() => setMobileMenuOpen(false)}
              className="block font-semibold text-slate-700 hover:text-[#102C57]"
            >
              Test Prep & Licensing (9 Exams)
            </Link>

            <Link 
              href="/blog" 
              onClick={() => setMobileMenuOpen(false)}
              className="block font-semibold text-slate-700 hover:text-[#102C57]"
            >
              Blog & Admissions Guides
            </Link>

            <button
              onClick={() => { setMobileMenuOpen(false); handleLead(); }}
              className="w-full rounded-xl bg-[#EA5C2B] py-3 text-center text-sm font-bold text-white shadow-sm"
            >
              Book Free Consultation Call
            </button>

            {/* Mobile Auth Portals — 4 Portals */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                4 Ecosystem Portals & Access
              </p>
              {isLoggedIn ? (
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-[#EA5C2B]" />
                    <span className="text-xs font-bold text-[#102C57]">
                      {user?.name || user?.email} <span className="text-[10px] text-slate-500 font-normal">({user?.role})</span>
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-xs font-bold text-rose-600 hover:underline"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 text-center"
                  >
                    <User className="h-3.5 w-3.5 text-[#EA5C2B]" />
                    <span>Student Login</span>
                  </Link>

                  <Link
                    href="/portal/buyer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 text-center"
                  >
                    <Briefcase className="h-3.5 w-3.5 text-blue-700" />
                    <span>B2B Consultant</span>
                  </Link>

                  <Link
                    href="/portal/university"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl border border-slate-200 font-bold text-slate-700 hover:bg-slate-50 text-center"
                  >
                    <Building2 className="h-3.5 w-3.5 text-emerald-700" />
                    <span>University Portal</span>
                  </Link>

                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="sm:col-span-3 text-center py-2.5 rounded-xl bg-slate-900 text-xs font-bold text-white hover:bg-slate-800"
                  >
                    Create Free Student Account / Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
