"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Award,
  Search,
  Filter,
  CheckCircle2,
  DollarSign,
  GraduationCap,
  Globe,
  ArrowRight,
  Sparkles,
  Users,
  Calendar,
} from "lucide-react";
import { useHomeModals } from "@/components/home/HomeClientContext";
import { CountryFlag } from "@/components/ui/CountryFlag";

interface ScholarshipItem {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  coverage:
    | "100% Full Ride"
    | "Tuition Waiver"
    | "Stipend + Grant"
    | "Partial (₹5-15L)";
  awardAmount: string;
  eligiblePrograms: string[];
  minMarksPercent: number;
  demographicTag?:
    | "Women in STEM"
    | "First-Generation"
    | "Minority / General"
    | "All Indian Students";
  deadline: string;
  provider: string;
  overview: string;
}

const SCHOLARSHIPS_DATA: ScholarshipItem[] = [
  {
    id: "daad-germany",
    name: "DAAD Study Scholarships for Foreign Graduates",
    country: "Germany",
    countryCode: "de",
    coverage: "100% Full Ride",
    awardAmount: "€934/month + Free Tuition + Health Insurance",
    eligiblePrograms: ["Masters (MS/MA)", "STEM", "Architecture"],
    minMarksPercent: 75,
    demographicTag: "All Indian Students",
    deadline: "November 15, 2026",
    provider: "German Academic Exchange Service (DAAD)",
    overview:
      "Full living allowance stipend and health insurance for high-achieving international postgraduate students in Germany.",
  },
  {
    id: "chevening-uk",
    name: "Chevening UK Government Scholarships",
    country: "United Kingdom",
    countryCode: "gb",
    coverage: "100% Full Ride",
    awardAmount: "100% Tuition + Living Stipend + Return Flights",
    eligiblePrograms: ["1-Year Masters (MSc/MA/MBA)"],
    minMarksPercent: 70,
    demographicTag: "All Indian Students",
    deadline: "November 5, 2026",
    provider: "UK Foreign, Commonwealth & Development Office (FCDO)",
    overview:
      "Fully-funded 1-year master's degree scholarship across any top UK university for future Indian leaders.",
  },
  {
    id: "fulbright-nehru-usa",
    name: "Fulbright-Nehru Master's Fellowships",
    country: "United States",
    countryCode: "us",
    coverage: "100% Full Ride",
    awardAmount: "Full J-1 Visa Tuition + J-1 Living Allowance",
    eligiblePrograms: ["Masters (MS)", "Public Policy", "Environment"],
    minMarksPercent: 65,
    demographicTag: "All Indian Students",
    deadline: "May 15, 2027",
    provider: "US-India Educational Foundation (USIEF)",
    overview:
      "Designed for highly motivated Indian graduates with at least 3 years of work experience to pursue master's in the USA.",
  },
  {
    id: "erasmus-mundus-eu",
    name: "Erasmus Mundus Joint Masters Scholarship",
    country: "European Union",
    countryCode: "nl",
    coverage: "100% Full Ride",
    awardAmount: "€1,400/month + Full European Tuition",
    eligiblePrograms: ["Dual Degree Masters", "STEM", "Data Science"],
    minMarksPercent: 70,
    demographicTag: "All Indian Students",
    deadline: "January 15, 2027",
    provider: "European Commission",
    overview:
      "Study in at least two different European countries with all tuition, travel, and monthly allowance paid.",
  },
  {
    id: "british-council-women-stem",
    name: "British Council Women in STEM Scholarships",
    country: "United Kingdom",
    countryCode: "gb",
    coverage: "100% Full Ride",
    awardAmount: "Full Tuition + Living Costs + Childcare Support",
    eligiblePrograms: ["STEM Masters", "Computer Science", "Biotech"],
    minMarksPercent: 65,
    demographicTag: "Women in STEM",
    deadline: "March 31, 2027",
    provider: "British Council",
    overview:
      "Exclusive financial award for female STEM graduates from India to pursue master's degrees in UK institutions.",
  },
  {
    id: "ontario-trillium-canada",
    name: "Ontario Graduate & Trillium Scholarship",
    country: "Canada",
    countryCode: "ca",
    coverage: "Stipend + Grant",
    awardAmount: "CAD $15,000 - $40,000 / year",
    eligiblePrograms: ["Masters (MSc)", "PhD"],
    minMarksPercent: 80,
    demographicTag: "First-Generation",
    deadline: "January 30, 2027",
    provider: "Government of Ontario & Partner Universities",
    overview:
      "Merit and research-based funding for outstanding international candidates entering leading Ontario universities.",
  },
  {
    id: "australia-awards",
    name: "Australia Awards Scholarships",
    country: "Australia",
    countryCode: "au",
    coverage: "100% Full Ride",
    awardAmount: "Full Tuition + Return Airfare + AUD $3,000/mo",
    eligiblePrograms: ["Masters (MSc)", "Public Health", "Engineering"],
    minMarksPercent: 70,
    demographicTag: "Minority / General",
    deadline: "April 30, 2027",
    provider: "Department of Foreign Affairs & Trade (DFAT)",
    overview:
      "Long-term development awards administered by the Australian Government for emerging leaders from partner countries.",
  },
  {
    id: "dsu-italy-waiver",
    name: "Italy Regional DSU Need-Based Grant",
    country: "Italy",
    countryCode: "it",
    coverage: "100% Full Ride",
    awardAmount: "€7,200/year Cash Grant + Free Dorm + €0 Tuition",
    eligiblePrograms: ["Bachelors (BS)", "Masters (MS)", "Engineering"],
    minMarksPercent: 55,
    demographicTag: "All Indian Students",
    deadline: "August 31, 2027",
    provider: "Italian Regional Governments (Lazio, Lombardy, Piedmont)",
    overview:
      "Need-based welfare grant based on family ISEE income (< €25,000/yr), making studying in Italy completely free.",
  },
];

export function ScholarshipFinderClient() {
  const homeModals = useHomeModals();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedDemographic, setSelectedDemographic] = useState("all");
  const [minAcademicFilter, setMinAcademicFilter] = useState(60);

  const filteredScholarships = SCHOLARSHIPS_DATA.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.country.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCountry =
      selectedCountry === "all" ||
      s.country.toLowerCase().includes(selectedCountry.toLowerCase());

    const matchesDemographic =
      selectedDemographic === "all" ||
      s.demographicTag === selectedDemographic ||
      s.demographicTag === "All Indian Students";

    const matchesMarks = s.minMarksPercent <= minAcademicFilter;

    return (
      matchesSearch && matchesCountry && matchesDemographic && matchesMarks
    );
  });

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20 pt-8 sm:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Hero */}
        <div className="mb-8 text-center sm:text-left">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold text-[#EA5C2B]">
            <Award className="h-3.5 w-3.5" />
            <span>Fully-Funded & Government Awards • [FR-TOOLS-007]</span>
          </div>
          <h1 className="font-serif text-3xl font-black text-[#102C57] sm:text-4xl lg:text-5xl">
            International Scholarship Finder
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Search verified government, university, and demographic-specific
            scholarships (DAAD, Chevening, Fulbright, Women in STEM, Erasmus)
            for Indian applicants.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search scholarship name or provider..."
                className="w-full rounded-xl border border-slate-200 pl-10 pr-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-[#102C57] focus:outline-none"
              />
            </div>

            {/* Country Selector */}
            <div>
              <select
                aria-label="Filter by destination country"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 focus:border-[#102C57] focus:outline-none cursor-pointer"
              >
                <option value="all">All Destination Countries</option>
                <option value="germany">Germany (DAAD)</option>
                <option value="uk">United Kingdom (Chevening)</option>
                <option value="usa">United States (Fulbright)</option>
                <option value="canada">Canada (Trillium)</option>
                <option value="australia">Australia (Awards)</option>
                <option value="italy">Italy (DSU Grant)</option>
              </select>
            </div>

            {/* Demographic Category Filter [FR-TOOLS-007] */}
            <div>
              <select
                aria-label="Filter by demographic category"
                value={selectedDemographic}
                onChange={(e) => setSelectedDemographic(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-slate-700 focus:border-[#102C57] focus:outline-none cursor-pointer"
              >
                <option value="all">All Demographics</option>
                <option value="Women in STEM">Women in STEM Awards</option>
                <option value="First-Generation">
                  First-Generation College
                </option>
                <option value="Minority / General">
                  Minority & Need-Based
                </option>
              </select>
            </div>

            {/* Academic Marks Filter Slider */}
            <div className="flex flex-col justify-center">
              <div className="flex justify-between text-[11px] font-bold text-slate-600 mb-1">
                <span>Your Academic %:</span>
                <span className="text-[#EA5C2B] font-extrabold">
                  {minAcademicFilter}%+
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={90}
                step={5}
                value={minAcademicFilter}
                onChange={(e) => setMinAcademicFilter(Number(e.target.value))}
                className="accent-[#EA5C2B] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Results List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredScholarships.map((sch) => (
            <div
              key={sch.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-[#102C57] transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CountryFlag code={sch.countryCode} size="sm" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      {sch.country}
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-700 border border-emerald-200">
                    {sch.coverage}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-[#102C57] mt-3 group-hover:text-[#EA5C2B] transition">
                  {sch.name}
                </h3>
                <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                  Provided by {sch.provider}
                </p>

                <div className="mt-3 rounded-xl bg-slate-50 p-3 border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400">
                    Award Benefits & Financial Value:
                  </span>
                  <p className="text-xs font-bold text-slate-800 mt-0.5">
                    {sch.awardAmount}
                  </p>
                </div>

                <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                  {sch.overview}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="text-[11px] text-slate-500">
                  <span>Deadline: </span>
                  <span className="font-bold text-slate-800">
                    {sch.deadline}
                  </span>
                </div>

                <button
                  onClick={() =>
                    homeModals.openLeadModal(
                      `Scholarship Application Assistance: ${sch.name} (${sch.country})`,
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#102C57] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#0c2242] transition shadow-2xs cursor-pointer"
                >
                  <span>Apply with Vista →</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
