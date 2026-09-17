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
  SlidersHorizontal
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
    coreModules: ["Distributed Systems", "Big Data Analytics", "Machine Learning", "Database Internals", "Cloud Infrastructure"],
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
    coreModules: ["Autonomous Systems", "Computer Vision", "Cognitive Systems", "Control Theory", "Embedded Systems"],
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
    coreModules: ["Artificial Intelligence", "Deep Learning", "Systems Architecture", "Cybersecurity", "Quantum Computing"],
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
    coreModules: ["Advanced Machine Learning", "Quantum Information", "Formal Verification", "Computational Complexity", "Algorithms"],
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
    coreModules: ["Technology Strategy", "Corporate Finance", "Innovation Management", "Entrepreneurship", "Digital Transformation"],
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
    coreModules: ["High Performance Computing", "Machine Learning Systems", "Operating Systems", "Networking", "Compiler Design"],
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
    coreModules: ["Global Leadership", "Strategic Management", "Venture Capital", "Financial Markets", "Sustainability"],
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
    coreModules: ["Information Retrieval & Web Search", "Scalable Computing", "Machine Learning", "Data Visualisation", "Security"],
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
    coreModules: ["Software Architecture", "Distributed Systems", "Cloud Computing", "Human-Computer Interaction", "Project Management"],
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
    coreModules: ["Applied Machine Learning", "Communication Skills for CS", "Industrial Internship", "Software Engineering", "Neural Networks"],
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
    coreModules: ["Human Anatomy", "Pathology & Histology", "Clinical Surgery", "Internal Medicine", "Pediatrics & Obstetrics"],
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
    coreModules: ["General Nursing Care", "Anatomy & Physiology", "Clinical Practice", "Geriatric Care", "Emergency Medicine"],
  }
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
    "msc-management-technology"
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
        if (json.success && json.courses && json.courses.length > 0) {
          setCoursesPool(json.courses);
        }
      } catch (err) {
        console.warn("Supabase live courses fetch error, using fallback pool:", err);
      } finally {
        setIsLoadingLive(false);
      }
    }
    loadLiveCourses();
  }, []);

  const selectedCourses = selectedCourseSlugs
    .map((slug) => coursesPool.find((c) => c.slug === slug || c.id === slug))
    .filter(Boolean) as CourseItem[];

  const addCourse = (slug: string) => {
    if (selectedCourseSlugs.length < 5 && !selectedCourseSlugs.includes(slug)) {
      setSelectedCourseSlugs([...selectedCourseSlugs, slug]);
      setIsSelectorOpen(false);
      setSearchQuery("");
    }
  };

  const removeCourse = (slug: string) => {
    if (selectedCourseSlugs.length > 1) {
      setSelectedCourseSlugs(selectedCourseSlugs.filter((s) => s !== slug));
    }
  };

  const availableCourses = coursesPool.filter(
    (c) => !selectedCourseSlugs.includes(c.slug) && !selectedCourseSlugs.includes(c.id) &&
      (c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
       c.universityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
       c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
       c.level.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20 pt-8 sm:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header Hero */}
        <div className="mb-8 text-center sm:text-left">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-[#102C57]">
            <Sparkles className="h-3.5 w-3.5 text-[#EA5C2B]" />
            <span>Interactive Utility • Compare Up to 5 Academic Courses & Degrees Side-by-Side</span>
          </div>
          <h1 className="font-serif text-3xl font-black text-[#102C57] sm:text-4xl lg:text-5xl">
            Course & Program Comparison Matrix
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Compare course specializations, tuition fees in INR, minimum IELTS cutoffs, GRE/GMAT waiver rules, application deadlines, and STEM post-study work authorization across top international degree offerings.
          </p>
        </div>

        {/* Controls Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-4 text-xs font-bold text-[#102C57]">
            <div className="flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-[#EA5C2B]" />
              <span>Comparing {selectedCourses.length} of 5 Courses</span>
            </div>

            {/* Highlight Differences Toggle */}
            <button
              onClick={() => setHighlightDifferences(!highlightDifferences)}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 transition ${
                highlightDifferences
                  ? "border-amber-300 bg-amber-50 text-amber-900 font-bold"
                  : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-amber-600" />
              <span>{highlightDifferences ? "Differences Highlighted ✓" : "Highlight Differences"}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {selectedCourseSlugs.length < 5 && (
              <button
                onClick={() => setIsSelectorOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#102C57] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0d2346] cursor-pointer"
              >
                <Plus className="h-4 w-4 text-[#EA5C2B]" />
                <span>Add Course ({5 - selectedCourseSlugs.length} left)</span>
              </button>
            )}
            <button
              onClick={() => homeModals.openLeadModal()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#EA5C2B] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#ff7240] cursor-pointer"
            >
              <span>Get Course Eligibility Review</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Modal Overlay to Add Course */}
        {isSelectorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-extrabold text-[#102C57]">Select Course / Program to Compare</h3>
                  <p className="text-[11px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Supabase Live Catalog • {coursesPool.length} Courses Available</span>
                  </p>
                </div>
                <button
                  onClick={() => setIsSelectorOpen(false)}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search course title or university..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-4 text-xs focus:border-[#102C57] focus:outline-none focus:ring-1 focus:ring-[#102C57]"
                />
              </div>

              <div className="mt-4 max-h-72 space-y-1.5 overflow-y-auto pr-1 text-xs">
                {availableCourses.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-400">All available courses are currently selected.</p>
                ) : (
                  availableCourses.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => addCourse(c.slug)}
                      className="flex w-full items-center justify-between rounded-xl p-2.5 text-left transition hover:bg-slate-50 border border-slate-100"
                    >
                      <div>
                        <p className="font-bold text-[#102C57]">{c.name}</p>
                        <p className="text-[11px] text-slate-500">{c.universityName} • {c.country} {c.flagEmoji}</p>
                      </div>
                      <span className="rounded-lg bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-[#102C57] hover:bg-[#102C57] hover:text-white transition">
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
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-xl">
          <table className="w-full min-w-[760px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="w-48 p-4 font-bold uppercase tracking-wider text-slate-400">
                  Course Parameters
                </th>
                {selectedCourses.map((course) => (
                  <th key={course.id} className="p-4 align-top w-64">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="inline-block rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-800 mb-1">
                          {course.level}
                        </span>
                        <h4 className="font-extrabold text-[#102C57] text-xs leading-snug">
                          {course.name}
                        </h4>
                        <p className="mt-1 text-[11px] text-slate-500 font-normal">
                          {course.flagEmoji} {course.universityName}
                        </p>
                      </div>
                      {selectedCourses.length > 1 && (
                        <button
                          onClick={() => removeCourse(course.slug)}
                          className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition shrink-0"
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
            <tbody className="divide-y divide-slate-100 text-slate-700">
              
              {/* Row 1: University & Country */}
              <tr>
                <td className="bg-slate-50/40 p-4 font-bold text-[#102C57]">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-4 w-4 text-indigo-600" />
                    <span>Institution & Location</span>
                  </div>
                </td>
                {selectedCourses.map((c) => (
                  <td key={c.id} className="p-4 font-semibold text-slate-900">
                    <Link href={`/universities/${c.universitySlug}`} className="hover:text-[#EA5C2B] transition">
                      {c.universityName}
                    </Link>
                    <span className="block text-[11px] text-slate-500 font-normal mt-0.5">
                      {c.city}, {c.country} {c.flagEmoji}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 2: Course Duration */}
              <tr className={highlightDifferences ? "bg-amber-50/30" : ""}>
                <td className="bg-slate-50/40 p-4 font-bold text-[#102C57]">
                  <div className="flex items-center gap-1.5">
                    <Layers className="h-4 w-4 text-slate-500" />
                    <span>Duration & Format</span>
                  </div>
                </td>
                {selectedCourses.map((c) => (
                  <td key={c.id} className="p-4 font-bold text-slate-800">
                    {c.duration}
                  </td>
                ))}
              </tr>

              {/* Row 3: Tuition Fees (INR) */}
              <tr className={highlightDifferences ? "bg-amber-50/30" : ""}>
                <td className="bg-slate-50/40 p-4 font-bold text-[#102C57]">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                    <span>Tuition Fee (INR / yr)</span>
                  </div>
                </td>
                {selectedCourses.map((c) => (
                  <td key={c.id} className="p-4 font-bold text-emerald-700 text-sm">
                    {c.tuitionFeeINR}
                    <span className="block text-[10px] font-normal text-slate-400 mt-0.5">
                      Local: {c.tuitionFeeLocal}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 4: IELTS Cutoff */}
              <tr className={highlightDifferences ? "bg-amber-50/30" : ""}>
                <td className="bg-slate-50/40 p-4 font-bold text-[#102C57]">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <span>Min. IELTS Band</span>
                  </div>
                </td>
                {selectedCourses.map((c) => (
                  <td key={c.id} className="p-4 font-semibold">
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-blue-800 font-bold">
                      {c.ieltsMinScore} Overall
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 5: GRE / GMAT Requirement */}
              <tr className={highlightDifferences ? "bg-amber-50/30" : ""}>
                <td className="bg-slate-50/40 p-4 font-bold text-[#102C57]">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-purple-600" />
                    <span>GRE / GMAT Policy</span>
                  </div>
                </td>
                {selectedCourses.map((c) => (
                  <td key={c.id} className="p-4 font-medium">
                    {c.greGmatRequired ? (
                      <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
                        <Check className="h-3.5 w-3.5" /> Required
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                        <Check className="h-3.5 w-3.5 text-emerald-600" /> Waived / Optional
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 6: Post-Study Work Visa */}
              <tr className={highlightDifferences ? "bg-amber-50/30" : ""}>
                <td className="bg-slate-50/40 p-4 font-bold text-[#102C57]">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-[#EA5C2B]" />
                    <span>Post-Study Work Rights</span>
                  </div>
                </td>
                {selectedCourses.map((c) => (
                  <td key={c.id} className="p-4 font-bold text-[#EA5C2B]">
                    {c.postStudyWorkMonths} Months ({Math.round(c.postStudyWorkMonths / 12)} Yrs)
                  </td>
                ))}
              </tr>

              {/* Row 7: Upcoming Intake Deadline */}
              <tr>
                <td className="bg-slate-50/40 p-4 font-bold text-[#102C57]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-indigo-600" />
                    <span>Upcoming Deadline</span>
                  </div>
                </td>
                {selectedCourses.map((c) => (
                  <td key={c.id} className="p-4 font-semibold text-slate-800">
                    {c.intakeDeadline}
                  </td>
                ))}
              </tr>

              {/* Row 8: ROI & Employability Score */}
              <tr>
                <td className="bg-slate-50/40 p-4 font-bold text-[#102C57]">
                  <div className="flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-amber-500" />
                    <span>ROI Score</span>
                  </div>
                </td>
                {selectedCourses.map((c) => (
                  <td key={c.id} className="p-4 font-extrabold text-indigo-900">
                    <span className="rounded-lg bg-amber-50 border border-amber-200 px-2 py-1 text-amber-900 font-black">
                      {c.roiScore} / 100
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 9: Core Curriculum Modules */}
              <tr>
                <td className="bg-slate-50/40 p-4 font-bold text-[#102C57]">
                  <span>Core Curriculum Modules</span>
                </td>
                {selectedCourses.map((c) => (
                  <td key={c.id} className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {c.coreModules.map((m, idx) => (
                        <span key={idx} className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                          {m}
                        </span>
                      ))}
                    </div>
                  </td>
                ))}
              </tr>

              {/* Row 10: Action CTAs */}
              <tr className="bg-slate-50/20">
                <td className="bg-slate-50/40 p-4 font-bold text-[#102C57]">
                  <span>Course Action</span>
                </td>
                {selectedCourses.map((c) => (
                  <td key={c.id} className="p-4">
                    <div className="space-y-2">
                      <Link
                        href={`/universities/${c.universitySlug}`}
                        className="block w-full rounded-xl border border-[#102C57] text-center py-2 text-xs font-bold text-[#102C57] hover:bg-[#102C57] hover:text-white transition"
                      >
                        University Page
                      </Link>
                      <button
                        onClick={() => homeModals.openLeadModal(c.country)}
                        className="block w-full rounded-xl bg-[#EA5C2B] text-center py-2 text-xs font-bold text-white hover:bg-[#ff7240] transition shadow-sm cursor-pointer"
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
