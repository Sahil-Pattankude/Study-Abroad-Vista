"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Check,
  X,
  Plus,
  Trash2,
  DollarSign,
  Award,
  Globe,
  BookOpen,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Search,
  Calendar,
  Layers,
  Building2,
  SlidersHorizontal,
} from "lucide-react";
import { useHomeModals } from "@/components/home/HomeClientContext";

export interface CourseItem {
  id: string;
  slug: string;
  name: string;
  universityName: string;
  universitySlug: string;
  city: string;
  country: string;
  flagEmoji: string;
  level: string;
  duration: string;
  tuitionFeeINR: string;
  tuitionFeeLocal: string;
  ieltsMinScore: number | string;
  greGmatRequired: boolean;
  postStudyWorkMonths: number;
  intakeDeadline: string;
  roiScore: number;
  coreModules: string[];
}

export const SAMPLE_COURSES: CourseItem[] = [
  {
    id: "tum-data-eng",
    slug: "msc-data-engineering",
    name: "M.Sc. in Data Engineering and Analytics",
    universityName: "Technical University of Munich (TUM)",
    universitySlug: "technical-university-of-munich",
    city: "Munich",
    country: "Germany",
    flagEmoji: "🇩🇪",
    level: "Postgraduate (Master's)",
    duration: "2 Years (4 Semesters)",
    tuitionFeeINR: "€0 (Public University)",
    tuitionFeeLocal: "€0 / yr (Semester Fee ~€150)",
    ieltsMinScore: 6.5,
    greGmatRequired: false,
    postStudyWorkMonths: 18,
    intakeDeadline: "May 31, 2026 (Winter Intake)",
    roiScore: 98,
    coreModules: [
      "Distributed Systems",
      "Big Data Analytics",
      "Machine Learning",
      "Database Internals",
      "Cloud Infrastructure",
    ],
  },
  {
    id: "tum-robotics",
    slug: "msc-robotics-cognition",
    name: "M.Sc. in Robotics, Cognition, Intelligence",
    universityName: "Technical University of Munich (TUM)",
    universitySlug: "technical-university-of-munich",
    city: "Munich",
    country: "Germany",
    flagEmoji: "🇩🇪",
    level: "Postgraduate (Master's)",
    duration: "2 Years (4 Semesters)",
    tuitionFeeINR: "€0 (Public University)",
    tuitionFeeLocal: "€0 / yr (Semester Fee ~€150)",
    ieltsMinScore: 6.5,
    greGmatRequired: false,
    postStudyWorkMonths: 18,
    intakeDeadline: "May 31, 2026 (Winter Intake)",
    roiScore: 96,
    coreModules: [
      "Autonomous Systems",
      "Computer Vision",
      "Cognitive Systems",
      "Control Theory",
      "Embedded Systems",
    ],
  },
  {
    id: "stanford-cs",
    slug: "ms-computer-science",
    name: "MS in Computer Science",
    universityName: "Stanford University",
    universitySlug: "stanford-university",
    city: "Stanford, CA",
    country: "USA",
    flagEmoji: "🇺🇸",
    level: "Postgraduate (Master's)",
    duration: "2 Years",
    tuitionFeeINR: "₹48 - 58 Lakhs / yr",
    tuitionFeeLocal: "$58,746 / yr",
    ieltsMinScore: 7.5,
    greGmatRequired: true,
    postStudyWorkMonths: 36,
    intakeDeadline: "December 15, 2025 (Fall Intake)",
    roiScore: 99,
    coreModules: [
      "Artificial Intelligence",
      "Deep Learning",
      "Systems Architecture",
      "Cybersecurity",
      "Quantum Computing",
    ],
  },
  {
    id: "oxford-cs",
    slug: "msc-advanced-cs",
    name: "M.Sc. in Advanced Computer Science",
    universityName: "University of Oxford",
    universitySlug: "university-of-oxford",
    city: "Oxford",
    country: "United Kingdom",
    flagEmoji: "🇬🇧",
    level: "Postgraduate (Master's)",
    duration: "1 Year (Full-time)",
    tuitionFeeINR: "₹34 - 42 Lakhs / yr",
    tuitionFeeLocal: "£33,970 / yr",
    ieltsMinScore: 7.5,
    greGmatRequired: false,
    postStudyWorkMonths: 24,
    intakeDeadline: "January 8, 2026 (Fall Intake)",
    roiScore: 97,
    coreModules: [
      "Advanced Machine Learning",
      "Quantum Information",
      "Formal Verification",
      "Computational Complexity",
      "Algorithms",
    ],
  },
  {
    id: "tum-mgmt",
    slug: "msc-management-technology",
    name: "M.Sc. in Management & Technology",
    universityName: "Technical University of Munich (TUM)",
    universitySlug: "technical-university-of-munich",
    city: "Munich",
    country: "Germany",
    flagEmoji: "🇩🇪",
    level: "Postgraduate (Master's)",
    duration: "2 Years (4 Semesters)",
    tuitionFeeINR: "€0 (Public University)",
    tuitionFeeLocal: "€0 / yr (Semester Fee ~€150)",
    ieltsMinScore: 6.5,
    greGmatRequired: false,
    postStudyWorkMonths: 18,
    intakeDeadline: "May 31, 2026 (Winter Intake)",
    roiScore: 94,
    coreModules: [
      "Technology Strategy",
      "Corporate Finance",
      "Innovation Management",
      "Entrepreneurship",
      "Digital Transformation",
    ],
  },
  {
    id: "gatech-cs",
    slug: "ms-cs-georgia-tech",
    name: "MS in Computer Science",
    universityName: "Georgia Institute of Technology",
    universitySlug: "georgia-tech",
    city: "Atlanta, GA",
    country: "USA",
    flagEmoji: "🇺🇸",
    level: "Postgraduate (Master's)",
    duration: "2 Years",
    tuitionFeeINR: "₹28 - 38 Lakhs / yr",
    tuitionFeeLocal: "$31,370 / yr",
    ieltsMinScore: 7.0,
    greGmatRequired: true,
    postStudyWorkMonths: 36,
    intakeDeadline: "February 1, 2026 (Fall Intake)",
    roiScore: 95,
    coreModules: [
      "High Performance Computing",
      "Machine Learning Systems",
      "Operating Systems",
      "Networking",
      "Compiler Design",
    ],
  },
  {
    id: "hec-mba",
    slug: "full-time-mba-hec",
    name: "Full-time MBA",
    universityName: "HEC Paris",
    universitySlug: "hec-paris",
    city: "Paris",
    country: "France",
    flagEmoji: "🇫🇷",
    level: "Postgraduate (MBA)",
    duration: "16 Months",
    tuitionFeeINR: "₹72 - 82 Lakhs (Total Program)",
    tuitionFeeLocal: "€87,000 Total",
    ieltsMinScore: 7.0,
    greGmatRequired: true,
    postStudyWorkMonths: 24,
    intakeDeadline: "March 15, 2026 (September Intake)",
    roiScore: 96,
    coreModules: [
      "Global Leadership",
      "Strategic Management",
      "Venture Capital",
      "Financial Markets",
      "Sustainability",
    ],
  },
  {
    id: "tcd-datasci",
    slug: "msc-cs-data-science-tcd",
    name: "M.Sc. in Computer Science - Data Science",
    universityName: "Trinity College Dublin",
    universitySlug: "trinity-college-dublin",
    city: "Dublin",
    country: "Ireland",
    flagEmoji: "🇮🇪",
    level: "Postgraduate (Master's)",
    duration: "1 Year",
    tuitionFeeINR: "₹21 - 25 Lakhs / yr",
    tuitionFeeLocal: "€24,669 / yr",
    ieltsMinScore: 6.5,
    greGmatRequired: false,
    postStudyWorkMonths: 24,
    intakeDeadline: "June 30, 2026 (Autumn Intake)",
    roiScore: 92,
    coreModules: [
      "Information Retrieval & Web Search",
      "Scalable Computing",
      "Machine Learning",
      "Data Visualisation",
      "Security",
    ],
  },
  {
    id: "unimelb-it",
    slug: "master-of-information-technology",
    name: "Master of Information Technology",
    universityName: "University of Melbourne",
    universitySlug: "university-of-melbourne",
    city: "Melbourne",
    country: "Australia",
    flagEmoji: "🇦🇺",
    level: "Postgraduate (Master's)",
    duration: "2 Years",
    tuitionFeeINR: "₹26 - 32 Lakhs / yr",
    tuitionFeeLocal: "AUD $48,320 / yr",
    ieltsMinScore: 6.5,
    greGmatRequired: false,
    postStudyWorkMonths: 36,
    intakeDeadline: "November 30, 2025 (February Intake)",
    roiScore: 91,
    coreModules: [
      "Software Architecture",
      "Distributed Systems",
      "Cloud Computing",
      "Human-Computer Interaction",
      "Project Management",
    ],
  },
  {
    id: "utoronto-applied-cs",
    slug: "msc-applied-computing-utoronto",
    name: "M.Sc. in Applied Computing (MScAC)",
    universityName: "University of Toronto",
    universitySlug: "university-of-toronto",
    city: "Toronto",
    country: "Canada",
    flagEmoji: "🇨🇦",
    level: "Postgraduate (Master's)",
    duration: "16 Months (Includes 8-mo Internship)",
    tuitionFeeINR: "₹28 - 34 Lakhs / yr",
    tuitionFeeLocal: "CAD $42,500 / yr",
    ieltsMinScore: 7.0,
    greGmatRequired: false,
    postStudyWorkMonths: 36,
    intakeDeadline: "December 1, 2025 (Fall Intake)",
    roiScore: 95,
    coreModules: [
      "Applied Machine Learning",
      "Communication Skills for CS",
      "Industrial Internship",
      "Software Engineering",
      "Neural Networks",
    ],
  },
  {
    id: "tashkent-mbbs",
    slug: "mbbs-general-medicine-tashkent",
    name: "Doctor of Medicine (MD / MBBS - NMC Compliant)",
    universityName: "Tashkent Medical Academy",
    universitySlug: "tashkent-medical-academy",
    city: "Tashkent",
    country: "Uzbekistan",
    flagEmoji: "🇺🇿",
    level: "Undergraduate (Professional Medicine)",
    duration: "6 Years (5 Yrs Academic + 1 Yr Internship)",
    tuitionFeeINR: "₹3.2 Lakhs / yr (₹19.2L Total)",
    tuitionFeeLocal: "$3,800 / yr",
    ieltsMinScore: 5.5,
    greGmatRequired: false,
    postStudyWorkMonths: 12,
    intakeDeadline: "August 31, 2026 (Autumn Intake)",
    roiScore: 93,
    coreModules: [
      "Human Anatomy",
      "Pathology & Histology",
      "Clinical Surgery",
      "Internal Medicine",
      "Pediatrics & Obstetrics",
    ],
  },
  {
    id: "ausbildung-pflege",
    slug: "dual-nursing-ausbildung-germany",
    name: "Pflegefachfrau/mann (Dual Vocational Nursing Ausbildung)",
    universityName: "Charité – Universitätsmedizin Berlin",
    universitySlug: "charite-universitatsmedizin-berlin",
    city: "Berlin",
    country: "Germany",
    flagEmoji: "🇩🇪",
    level: "Vocational Diploma (Ausbildung)",
    duration: "3 Years (Paid Apprenticeship)",
    tuitionFeeINR: "€0 (0 Tuition + Paid Monthly Stipend)",
    tuitionFeeLocal: "€0 (Stipend: €1,190 - €1,350/mo)",
    ieltsMinScore: "B2 German (Goethe/ÖSD)",
    greGmatRequired: false,
    postStudyWorkMonths: 18,
    intakeDeadline: "July 15, 2026 (October Intake)",
    roiScore: 99,
    coreModules: [
      "General Nursing Care",
      "Anatomy & Physiology",
      "Clinical Practice",
      "Geriatric Care",
      "Emergency Medicine",
    ],
  },
];

export function CourseCompareClient() {
  const homeModals = useHomeModals();
  const [coursesPool, setCoursesPool] = useState<CourseItem[]>(SAMPLE_COURSES);
  const [isLoadingLive, setIsLoadingLive] = useState(false);
  const [selectedCourseSlugs, setSelectedCourseSlugs] = useState<string[]>([
    "msc-data-engineering",
    "msc-robotics-cognition",
    "ms-computer-science",
    "msc-advanced-cs",
    "msc-management-technology",
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [highlightDifferences, setHighlightDifferences] = useState(false);

  useEffect(() => {
    async function loadLiveCourses() {
      try {
        setIsLoadingLive(true);
        const res = await fetch("/api/courses");
        const json = await res.json();
        if (
          json.success &&
          Array.isArray(json.courses) &&
          json.courses.length > 0
        ) {
          // Merge sample curated courses with live courses to avoid losing preselected courses
          const map = new Map<string, CourseItem>();
          SAMPLE_COURSES.forEach((c) => map.set(c.slug, c));
          json.courses.forEach((c: CourseItem) => {
            if (!map.has(c.slug)) {
              map.set(c.slug, c);
            }
          });
          setCoursesPool(Array.from(map.values()));
        }
      } catch (err) {
        console.warn(
          "Supabase live courses fetch error, using fallback pool:",
          err,
        );
      } finally {
        setIsLoadingLive(false);
      }
    }
    loadLiveCourses();
  }, []);

  const selectedCourses = selectedCourseSlugs
    .map((slug) => coursesPool.find((c) => c.slug === slug || c.id === slug))
    .filter(Boolean) as CourseItem[];

  // Ensure activeCourses always has courses to display
  const activeCourses =
    selectedCourses.length > 0 ? selectedCourses : coursesPool.slice(0, 5);

  const addCourse = (slug: string) => {
    if (
      activeCourses.length < 5 &&
      !activeCourses.some((c) => c.slug === slug || c.id === slug)
    ) {
      setSelectedCourseSlugs([...activeCourses.map((c) => c.slug), slug]);
      setIsSelectorOpen(false);
      setSearchQuery("");
    }
  };

  const removeCourse = (slug: string) => {
    if (activeCourses.length > 1) {
      setSelectedCourseSlugs(
        activeCourses
          .filter((c) => c.slug !== slug && c.id !== slug)
          .map((c) => c.slug),
      );
    }
  };

  const availableCourses = coursesPool.filter(
    (c) =>
      !activeCourses.some((ac) => ac.slug === c.slug || ac.id === c.id) &&
      (c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.universityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.level.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <div className="min-h-screen bg-[#FDFCF7] pb-20 pt-8 sm:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Hero */}
        <div className="mb-8 text-center sm:text-left">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D89A3E]/30 bg-[#D89A3E]/10 px-3.5 py-1 text-xs font-bold text-[#103B47]">
            <Sparkles className="h-3.5 w-3.5 text-[#D89A3E]" />
            <span>
              Interactive Utility • Compare Up to 5 Academic Courses & Degrees
              Side-by-Side
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-[#103B47] sm:text-4xl lg:text-5xl">
            Course & Program Comparison Matrix
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base font-sans font-normal">
            Compare course specializations, tuition fees in INR, minimum IELTS
            cutoffs, GRE/GMAT waiver rules, application deadlines, and STEM
            post-study work authorization across top international degree
            offerings.
          </p>
        </div>

        {/* Controls Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[#D9CFB8]/80 bg-white p-4 shadow-2xs">
          <div className="flex items-center gap-4 text-xs font-bold text-[#103B47]">
            <div className="flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-[#D89A3E]" />
              <span>Comparing {activeCourses.length} of 5 Courses</span>
            </div>

            {/* Highlight Differences Toggle */}
            <button
              onClick={() => setHighlightDifferences(!highlightDifferences)}
              className={`flex min-h-[40px] items-center gap-1.5 rounded-xl border px-3.5 py-1.5 transition cursor-pointer ${
                highlightDifferences
                  ? "border-[#D89A3E] bg-[#D89A3E]/15 text-[#103B47] font-bold"
                  : "border-[#D9CFB8] bg-[#FDFCF7] text-slate-700 hover:bg-white"
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#D89A3E]" />
              <span>
                {highlightDifferences
                  ? "Differences Highlighted ✓"
                  : "Highlight Differences"}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {activeCourses.length < 5 && (
              <button
                onClick={() => setIsSelectorOpen(true)}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-[#103B47] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1D5A6C] cursor-pointer"
              >
                <Plus className="h-4 w-4 text-[#D89A3E]" />
                <span>Add Course ({5 - activeCourses.length} left)</span>
              </button>
            )}
            <button
              onClick={() => homeModals.openLeadModal()}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl bg-[#D89A3E] px-4 py-2 text-xs font-bold text-slate-950 transition hover:bg-[#c4872f] cursor-pointer active:scale-98"
            >
              <span>Get Course Eligibility Review</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Modal Overlay to Add Course */}
        {isSelectorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
            <div className="relative w-full max-w-lg rounded-3xl border border-[#D9CFB8] bg-[#FDFCF7] p-6 shadow-2xl animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[#D9CFB8]/60 pb-4">
                <div>
                  <h3 className="text-base font-display font-bold text-[#103B47]">
                    Select Course / Program to Compare
                  </h3>
                  <p className="text-[11px] text-[#1D5A6C] font-medium mt-0.5 flex items-center gap-1">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>
                      Supabase Live Catalog • {coursesPool.length} Courses
                      Available
                    </span>
                  </p>
                </div>
                <button
                  onClick={() => setIsSelectorOpen(false)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 relative">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search course title or university..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full min-h-[44px] rounded-xl border border-[#D9CFB8] bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm focus:border-[#103B47] focus:outline-none focus:ring-1 focus:ring-[#103B47]"
                />
              </div>

              <div className="mt-4 max-h-72 space-y-1.5 overflow-y-auto pr-1 text-xs">
                {availableCourses.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-400">
                    All available courses are currently selected.
                  </p>
                ) : (
                  availableCourses.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => addCourse(c.slug)}
                      className="flex w-full items-center justify-between rounded-xl p-3 text-left transition hover:bg-white border border-[#D9CFB8]/50 bg-white/60 cursor-pointer min-h-[44px]"
                    >
                      <div>
                        <p className="font-bold text-[#103B47]">{c.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {c.universityName} • {c.country} {c.flagEmoji}
                        </p>
                      </div>
                      <span className="rounded-lg bg-[#D89A3E]/15 border border-[#D89A3E]/30 px-2.5 py-1 text-[11px] font-bold text-[#103B47] hover:bg-[#D89A3E] hover:text-slate-950 transition">
                        + Add
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-3xl border border-[#D9CFB8]/80 bg-white shadow-sm">
          <table className="w-full min-w-[760px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[#D9CFB8]/70 bg-[#FDFCF7]">
                <th className="w-48 p-4 font-bold uppercase tracking-wider text-slate-400">
                  Course Parameters
                </th>
                {activeCourses.map((course) => (
                  <th key={course.id} className="p-4 align-top w-64">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="inline-block rounded-md bg-[#1D5A6C]/10 border border-[#1D5A6C]/20 px-2 py-0.5 text-[10px] font-bold text-[#103B47] mb-1">
                          {course.level}
                        </span>
                        <h4 className="font-display font-bold text-[#103B47] text-xs leading-snug">
                          {course.name}
                        </h4>
                        <p className="mt-1 text-[11px] text-slate-500 font-normal">
                          {course.flagEmoji} {course.universityName}
                        </p>
                      </div>
                      {activeCourses.length > 1 && (
                        <button
                          onClick={() => removeCourse(course.slug)}
                          className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition shrink-0 cursor-pointer"
                          title="Remove course from comparison"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D9CFB8]/40 text-slate-700">
              {/* Row 1: University & Country */}
              <tr>
                <td className="bg-[#FDFCF7]/60 p-4 font-bold text-[#103B47]">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-[#1D5A6C]" />
                    <span>Institution & Location</span>
                  </div>
                </td>
                {activeCourses.map((c) => (
                  <td key={c.id} className="p-4 font-semibold text-slate-900">
                    <Link
                      href={`/universities/${c.universitySlug}`}
                      className="hover:text-[#D89A3E] transition"
                    >
                      {c.universityName}
                    </Link>
                    <span className="block text-[11px] text-slate-500 font-normal mt-0.5">
                      {c.city}, {c.country} {c.flagEmoji}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 2: Course Duration */}
              <tr className={highlightDifferences ? "bg-[#D89A3E]/10" : ""}>
                <td className="bg-[#FDFCF7]/60 p-4 font-bold text-[#103B47]">
                  <div className="flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-slate-500" />
                    <span>Duration & Format</span>
                  </div>
                </td>
                {activeCourses.map((c) => (
                  <td
                    key={c.id}
                    className="p-4 font-bold text-slate-800 font-mono"
                  >
                    {c.duration}
                  </td>
                ))}
              </tr>

              {/* Row 3: Tuition Fees (INR) */}
              <tr className={highlightDifferences ? "bg-[#D89A3E]/10" : ""}>
                <td className="bg-[#FDFCF7]/60 p-4 font-bold text-[#103B47]">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                    <span>Tuition Fee (INR / yr)</span>
                  </div>
                </td>
                {activeCourses.map((c) => (
                  <td
                    key={c.id}
                    className="p-4 font-bold font-mono text-[#103B47] text-sm"
                  >
                    {c.tuitionFeeINR}
                    <span className="block text-[10px] font-normal text-slate-400 mt-0.5">
                      Local: {c.tuitionFeeLocal}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 4: IELTS Cutoff */}
              <tr className={highlightDifferences ? "bg-[#D89A3E]/10" : ""}>
                <td className="bg-[#FDFCF7]/60 p-4 font-bold text-[#103B47]">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-sky-600" />
                    <span>Min. IELTS Band</span>
                  </div>
                </td>
                {activeCourses.map((c) => (
                  <td key={c.id} className="p-4 font-semibold">
                    <span className="rounded-md bg-sky-50 border border-sky-200 px-2 py-0.5 text-sky-900 font-bold font-mono">
                      {c.ieltsMinScore} Overall
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 5: GRE / GMAT Requirement */}
              <tr className={highlightDifferences ? "bg-[#D89A3E]/10" : ""}>
                <td className="bg-[#FDFCF7]/60 p-4 font-bold text-[#103B47]">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-[#D89A3E]" />
                    <span>GRE / GMAT Policy</span>
                  </div>
                </td>
                {activeCourses.map((c) => (
                  <td key={c.id} className="p-4 font-medium">
                    {c.greGmatRequired ? (
                      <span className="inline-flex items-center gap-1 text-amber-800 font-bold bg-[#D89A3E]/15 border border-[#D89A3E]/30 px-2 py-0.5 rounded">
                        <Check className="h-3.5 w-3.5" /> Required
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        <Check className="h-3.5 w-3.5 text-emerald-600" />{" "}
                        Waived / Optional
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 6: Post-Study Work Visa */}
              <tr className={highlightDifferences ? "bg-[#D89A3E]/10" : ""}>
                <td className="bg-[#FDFCF7]/60 p-4 font-bold text-[#103B47]">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-[#D89A3E]" />
                    <span>Post-Study Work Rights</span>
                  </div>
                </td>
                {activeCourses.map((c) => (
                  <td
                    key={c.id}
                    className="p-4 font-bold font-mono text-[#D89A3E]"
                  >
                    {c.postStudyWorkMonths} Months (
                    {Math.round(c.postStudyWorkMonths / 12)} Yrs)
                  </td>
                ))}
              </tr>

              {/* Row 7: Upcoming Intake Deadline */}
              <tr>
                <td className="bg-[#FDFCF7]/60 p-4 font-bold text-[#103B47]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-[#1D5A6C]" />
                    <span>Upcoming Deadline</span>
                  </div>
                </td>
                {activeCourses.map((c) => (
                  <td key={c.id} className="p-4 font-semibold text-slate-800">
                    {c.intakeDeadline}
                  </td>
                ))}
              </tr>

              {/* Row 8: ROI & Employability Score */}
              <tr>
                <td className="bg-[#FDFCF7]/60 p-4 font-bold text-[#103B47]">
                  <div className="flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-[#D89A3E]" />
                    <span>ROI Score</span>
                  </div>
                </td>
                {activeCourses.map((c) => (
                  <td key={c.id} className="p-4 font-extrabold text-[#103B47]">
                    <span className="rounded-lg bg-[#D89A3E]/15 border border-[#D89A3E]/30 px-2.5 py-1 text-[#103B47] font-mono font-black">
                      {c.roiScore} / 100
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 9: Core Curriculum Modules */}
              <tr>
                <td className="bg-[#FDFCF7]/60 p-4 font-bold text-[#103B47]">
                  <span>Core Curriculum Modules</span>
                </td>
                {activeCourses.map((c) => (
                  <td key={c.id} className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {c.coreModules.map((m, idx) => (
                        <span
                          key={idx}
                          className="rounded bg-[#1D5A6C]/10 border border-[#1D5A6C]/15 px-2 py-0.5 text-[10px] font-semibold text-[#103B47]"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 10: Action CTAs */}
              <tr className="bg-[#FDFCF7]/40">
                <td className="bg-[#FDFCF7]/60 p-4 font-bold text-[#103B47]">
                  <span>Course Action</span>
                </td>
                {activeCourses.map((c) => (
                  <td key={c.id} className="p-4">
                    <div className="space-y-2">
                      <Link
                        href={`/universities/${c.universitySlug}`}
                        className="block w-full min-h-[40px] leading-[38px] rounded-xl border border-[#103B47] text-center text-xs font-bold text-[#103B47] hover:bg-[#103B47] hover:text-white transition cursor-pointer"
                      >
                        University Page
                      </Link>
                      <button
                        onClick={() => homeModals.openLeadModal(c.country)}
                        className="block w-full min-h-[40px] rounded-xl bg-[#D89A3E] text-center text-xs font-bold text-slate-950 hover:bg-[#c4872f] transition shadow-2xs cursor-pointer active:scale-98"
                      >
                        Review Eligibility
                      </button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
