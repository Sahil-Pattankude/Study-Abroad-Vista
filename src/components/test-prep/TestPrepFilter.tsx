"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Search, 
  ArrowRight, 
  Clock, 
  Banknote, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  Layers,
  Globe2,
  Stethoscope,
  GraduationCap
} from "lucide-react";
import { TEST_PREP_EXAMS, TestPrepExam } from "@/lib/data/testPrepData";
import { LeadTriggerButton } from "@/components/home/HomeClientContext";

type CategoryFilter = "ALL" | "English Proficiency" | "Graduate Admissions" | "Medical & Healthcare Licensing";

export function TestPrepFilter() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("ALL");

  // All unique countries across all exams
  const allCountries = useMemo(() => {
    const set = new Set<string>();
    TEST_PREP_EXAMS.forEach((exam) => {
      exam.targetCountries.forEach((c) => set.add(c));
    });
    return Array.from(set).sort();
  }, []);

  const filteredExams = useMemo(() => {
    return TEST_PREP_EXAMS.filter((exam) => {
      const matchCategory = selectedCategory === "ALL" || exam.category === selectedCategory;
      const matchCountry = selectedCountry === "ALL" || exam.targetCountries.includes(selectedCountry);
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        exam.name.toLowerCase().includes(q) ||
        exam.shortName.toLowerCase().includes(q) ||
        exam.fullName.toLowerCase().includes(q) ||
        exam.category.toLowerCase().includes(q) ||
        exam.targetPrograms.some((p) => p.toLowerCase().includes(q)) ||
        exam.targetCountries.some((c) => c.toLowerCase().includes(q));

      return matchCategory && matchCountry && matchSearch;
    });
  }, [selectedCategory, selectedCountry, searchQuery]);

  const categoryCounts = useMemo(() => {
    return {
      ALL: TEST_PREP_EXAMS.length,
      "English Proficiency": TEST_PREP_EXAMS.filter((e) => e.category === "English Proficiency").length,
      "Graduate Admissions": TEST_PREP_EXAMS.filter((e) => e.category === "Graduate Admissions").length,
      "Medical & Healthcare Licensing": TEST_PREP_EXAMS.filter((e) => e.category === "Medical & Healthcare Licensing").length,
    };
  }, []);

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by exam (IELTS, GRE, NCLEX), degree, or destination..."
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition focus:border-[#102C57] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102C57]/10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          {/* Country Dropdown Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Destination:</span>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition focus:border-[#102C57] focus:bg-white focus:outline-none"
            >
              <option value="ALL">All Destinations ({allCountries.length})</option>
              {allCountries.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
          <span className="text-xs font-bold text-slate-400 mr-1 uppercase tracking-wider">Filter Category:</span>
          
          <button
            onClick={() => setSelectedCategory("ALL")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              selectedCategory === "ALL"
                ? "bg-[#102C57] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>All Exams</span>
            <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${selectedCategory === "ALL" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`}>
              {categoryCounts.ALL}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory("English Proficiency")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              selectedCategory === "English Proficiency"
                ? "bg-[#102C57] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Globe2 className="h-3.5 w-3.5 text-blue-400" />
            <span>English Proficiency</span>
            <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${selectedCategory === "English Proficiency" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`}>
              {categoryCounts["English Proficiency"]}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory("Graduate Admissions")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              selectedCategory === "Graduate Admissions"
                ? "bg-[#102C57] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <GraduationCap className="h-3.5 w-3.5 text-amber-400" />
            <span>Graduate & MBA</span>
            <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${selectedCategory === "Graduate Admissions" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`}>
              {categoryCounts["Graduate Admissions"]}
            </span>
          </button>

          <button
            onClick={() => setSelectedCategory("Medical & Healthcare Licensing")}
            className={`inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              selectedCategory === "Medical & Healthcare Licensing"
                ? "bg-[#102C57] text-white shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <Stethoscope className="h-3.5 w-3.5 text-emerald-400" />
            <span>Medical & Healthcare</span>
            <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${selectedCategory === "Medical & Healthcare Licensing" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`}>
              {categoryCounts["Medical & Healthcare Licensing"]}
            </span>
          </button>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-500">
          Showing <span className="font-bold text-slate-900">{filteredExams.length}</span> standardized tests & licensing exams
        </p>
        {(searchQuery || selectedCategory !== "ALL" || selectedCountry !== "ALL") && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("ALL");
              setSelectedCountry("ALL");
            }}
            className="text-xs font-semibold text-[#EA5C2B] hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Grid of Exams */}
      {filteredExams.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <BookOpen className="mx-auto h-10 w-10 text-slate-300" />
          <h3 className="mt-3 text-base font-bold text-slate-800">No matching exams found</h3>
          <p className="mt-1 text-xs text-slate-500">Try loosening your search terms or resetting the destination filter.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("ALL");
              setSelectedCountry("ALL");
            }}
            className="mt-4 rounded-xl bg-[#102C57] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#091A36]"
          >
            Show All 9 Exams
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>
      )}
    </div>
  );
}

function ExamCard({ exam }: { exam: TestPrepExam }) {
  const categoryBadgeColor = {
    "English Proficiency": "bg-blue-50 text-blue-700 border-blue-200",
    "Graduate Admissions": "bg-amber-50 text-amber-800 border-amber-200",
    "Medical & Healthcare Licensing": "bg-emerald-50 text-emerald-800 border-emerald-200",
  }[exam.category];

  return (
    <div className="group flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-xs transition duration-200 hover:-translate-y-1 hover:border-[#102C57]/30 hover:shadow-lg">
      <div>
        {/* Category & Conducting Body */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[10px] font-bold ${categoryBadgeColor}`}>
            {exam.category}
          </span>
          <span className="text-[11px] font-medium text-slate-500 truncate" title={exam.conductingBody}>
            {exam.conductingBody}
          </span>
        </div>

        {/* Title */}
        <div className="mt-4">
          <h3 className="text-xl font-bold tracking-tight text-[#102C57] group-hover:text-[#EA5C2B] transition">
            {exam.name}
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-snug">{exam.fullName}</p>
        </div>

        {/* Tagline */}
        <p className="mt-3 text-xs leading-relaxed text-slate-600 line-clamp-2">
          {exam.heroTagline}
        </p>

        {/* Key Metrics Box */}
        <div className="mt-5 rounded-2xl bg-slate-50/80 border border-slate-100 p-3.5 space-y-2.5">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-start gap-2">
              <Banknote className="h-4 w-4 text-[#EA5C2B] shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Fee (INR)</p>
                <p className="font-bold text-slate-900">{exam.feeINR}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Duration</p>
                <p className="font-bold text-slate-900">{exam.duration}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200/60 pt-2 grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-start gap-2">
              <Award className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Score</p>
                <p className="font-bold text-emerald-700 leading-tight">{exam.targetCutoffIndianStudents}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Validity</p>
                <p className="font-bold text-slate-900">
                  {exam.validityYears === 99 ? "Lifetime" : `${exam.validityYears} Years`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Accepted Destinations Badges */}
        <div className="mt-4">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Key Destinations:</p>
          <div className="flex flex-wrap gap-1">
            {exam.targetCountries.slice(0, 4).map((country) => (
              <span key={country} className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                {country}
              </span>
            ))}
            {exam.targetCountries.length > 4 && (
              <span className="rounded-lg bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                +{exam.targetCountries.length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          href={`/test-prep/${exam.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#102C57] hover:text-[#EA5C2B] transition"
        >
          <span>View 8-Week Blueprint</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </Link>

        <LeadTriggerButton
          country={exam.targetCountries[0]}
          className="inline-flex items-center justify-center rounded-xl bg-orange-50 border border-orange-200 px-3 py-1.5 text-xs font-bold text-[#EA5C2B] hover:bg-[#EA5C2B] hover:text-white transition shadow-xs"
        >
          Book Prep Advice
        </LeadTriggerButton>
      </div>
    </div>
  );
}
