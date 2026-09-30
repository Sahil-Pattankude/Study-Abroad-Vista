"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  Building2,
  Award,
  ArrowRight,
  TrendingUp,
  FileText,
} from "lucide-react";
import { useHomeModals } from "@/components/home/HomeClientContext";
import { CountryFlag } from "@/components/ui/CountryFlag";

interface UniversityEvaluation {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  qsRank: number;
  probability: "Safe" | "Target" | "Reach";
  minGpaRequired: number; // out of 10
  minIeltsRequired: number;
  greRequired: boolean;
  matchReason: string;
  tuitionFeeINR: string;
  slug: string;
}

const SAMPLE_DATABASE: UniversityEvaluation[] = [
  {
    id: "tum-germany",
    name: "Technical University of Munich (TUM)",
    country: "Germany",
    countryCode: "de",
    qsRank: 28,
    probability: "Target",
    minGpaRequired: 7.8,
    minIeltsRequired: 6.5,
    greRequired: false,
    matchReason:
      "Requires strong GPA and German APS certificate with zero tuition fees.",
    tuitionFeeINR: "₹0 / Free Tuition",
    slug: "technical-university-of-munich",
  },
  {
    id: "utoronto-canada",
    name: "University of Toronto",
    country: "Canada",
    countryCode: "ca",
    qsRank: 21,
    probability: "Reach",
    minGpaRequired: 8.5,
    minIeltsRequired: 7.0,
    greRequired: false,
    matchReason:
      "Highly competitive global ranking with strong emphasis on research thesis.",
    tuitionFeeINR: "₹22 - 38 Lakhs/yr",
    slug: "university-of-toronto",
  },
  {
    id: "rwth-aachen",
    name: "RWTH Aachen University",
    country: "Germany",
    countryCode: "de",
    qsRank: 99,
    probability: "Safe",
    minGpaRequired: 7.0,
    minIeltsRequired: 6.5,
    greRequired: false,
    matchReason:
      "Profile comfortably exceeds engineering cutoff with tuition-free status.",
    tuitionFeeINR: "₹0 / Free Tuition",
    slug: "rwth-aachen-university",
  },
  {
    id: "manchester-uk",
    name: "University of Manchester",
    country: "United Kingdom",
    countryCode: "gb",
    qsRank: 32,
    probability: "Target",
    minGpaRequired: 7.5,
    minIeltsRequired: 6.5,
    greRequired: false,
    matchReason: "Well matched with 2-year Graduate Route PSW visa rights.",
    tuitionFeeINR: "₹24 - 34 Lakhs/yr",
    slug: "university-of-manchester",
  },
  {
    id: "asu-usa",
    name: "Arizona State University (ASU)",
    country: "United States",
    countryCode: "us",
    qsRank: 179,
    probability: "Safe",
    minGpaRequired: 6.5,
    minIeltsRequired: 6.5,
    greRequired: false,
    matchReason:
      "High acceptance probability with 3-Year STEM OPT extension eligibility.",
    tuitionFeeINR: "₹25 - 35 Lakhs/yr",
    slug: "arizona-state-university",
  },
  {
    id: "stanford-usa",
    name: "Stanford University",
    country: "United States",
    countryCode: "us",
    qsRank: 5,
    probability: "Reach",
    minGpaRequired: 9.2,
    minIeltsRequired: 7.5,
    greRequired: true,
    matchReason:
      "Ultra-selective Ivy-tier admissions requiring elite GRE and publications.",
    tuitionFeeINR: "₹45 - 65 Lakhs/yr",
    slug: "stanford-university",
  },
  {
    id: "tashkent-med",
    name: "Tashkent Medical Academy",
    country: "Uzbekistan",
    countryCode: "uz",
    qsRank: 450,
    probability: "Safe",
    minGpaRequired: 5.5,
    minIeltsRequired: 5.5,
    greRequired: false,
    matchReason:
      "100% NMC FMGL compliant 54-month English medium MBBS program.",
    tuitionFeeINR: "₹3.5 - 4.5 Lakhs/yr",
    slug: "tashkent-medical-academy",
  },
  {
    id: "monash-australia",
    name: "Monash University (Group of Eight)",
    country: "Australia",
    countryCode: "au",
    qsRank: 42,
    probability: "Target",
    minGpaRequired: 7.2,
    minIeltsRequired: 6.5,
    greRequired: false,
    matchReason:
      "Eligible for Australian Post-Study Work rights up to 4 years.",
    tuitionFeeINR: "₹24 - 36 Lakhs/yr",
    slug: "monash-university",
  },
];

export function EligibilityCheckerClient() {
  const homeModals = useHomeModals();

  // Profile Inputs
  const [gpa, setGpa] = useState<number>(7.6);
  const [ieltsScore, setIeltsScore] = useState<number>(7.0);
  const [greScore, setGreScore] = useState<number>(315);
  const [workExperienceYears, setWorkExperienceYears] = useState<number>(2);
  const [targetDegree, setTargetDegree] = useState("masters");
  const [evaluated, setEvaluated] = useState(false);

  // Dynamic Probability Calculation Engine [FR-TOOLS-008]
  const evaluateProbability = (uni: UniversityEvaluation) => {
    let score = 0;

    // GPA delta
    if (gpa >= uni.minGpaRequired + 0.8) score += 3;
    else if (gpa >= uni.minGpaRequired) score += 2;
    else score += 0;

    // IELTS delta
    if (ieltsScore >= uni.minIeltsRequired + 0.5) score += 2;
    else if (ieltsScore >= uni.minIeltsRequired) score += 1;

    // Work experience bonus
    if (workExperienceYears >= 2) score += 1;

    // GRE requirement bonus
    if (uni.greRequired && greScore >= 320) score += 2;

    if (score >= 5 && uni.qsRank > 30) return "Safe";
    if (score >= 3 || uni.qsRank > 20) return "Target";
    return "Reach";
  };

  const results = SAMPLE_DATABASE.map((uni) => ({
    ...uni,
    computedTier: evaluateProbability(uni),
  }));

  const safeUnis = results.filter((r) => r.computedTier === "Safe");
  const targetUnis = results.filter((r) => r.computedTier === "Target");
  const reachUnis = results.filter((r) => r.computedTier === "Reach");

  return (
    <div className="min-h-screen bg-[#FDFCF7] pb-20 pt-8 sm:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Hero */}
        <div className="mb-8 text-center sm:text-left">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D9CFB8] bg-[#F5EFE0] px-3.5 py-1 text-xs font-semibold text-[#1D5A6C]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#D89A3E]" />
            <span>AI Admissions Probability Engine</span>
          </div>
          <h1 className="font-serif text-3xl font-black text-[#103B47] sm:text-4xl lg:text-5xl">
            Admission Eligibility & Probability Checker
          </h1>
          <p className="mt-3 max-w-3xl text-xs sm:text-sm md:text-base leading-relaxed text-[#6B6B6B]">
            Input your GPA, English proficiency, and test scores to instantly
            evaluate your admission odds across global universities categorized
            into Safe (🟢), Target (🟡), and Reach (🟣) tiers.
          </p>
        </div>

        {/* 2-Column: Profile Inputs + Categorized Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Profile Inputs */}
          <div className="lg:col-span-4 rounded-2xl border border-[#D9CFB8] bg-white p-6 sm:p-8 shadow-xs space-y-6 h-fit">
            <h2 className="text-base font-serif font-bold text-[#103B47] flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#D89A3E]" />
              <span>Your Academic Profile</span>
            </h2>

            {/* GPA Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                <span className="text-[#103B47]">
                  Undergrad GPA (10-Point Scale)
                </span>
                <span className="text-[#103B47] font-mono font-bold bg-[#F5EFE0] border border-[#D9CFB8]/70 px-2.5 py-1 rounded-md text-sm">
                  {gpa.toFixed(1)} / 10
                </span>
              </div>
              <input
                type="range"
                min={5.0}
                max={10.0}
                step={0.1}
                value={gpa}
                onChange={(e) => setGpa(Number(e.target.value))}
                className="w-full accent-[#D89A3E] cursor-pointer h-2 bg-[#F5EFE0] rounded-lg"
              />
              <div className="flex justify-between text-[11px] font-mono text-[#6B6B6B] mt-1">
                <span>5.0 (50%)</span>
                <span>7.5 (First Class)</span>
                <span>10.0 (Gold Medal)</span>
              </div>
            </div>

            {/* IELTS Band */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                <span className="text-[#103B47]">
                  IELTS Academic Overall Band
                </span>
                <span className="text-[#103B47] font-mono font-bold bg-[#F5EFE0] border border-[#D9CFB8]/70 px-2.5 py-1 rounded-md text-sm">
                  Band {ieltsScore.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min={5.0}
                max={9.0}
                step={0.5}
                value={ieltsScore}
                onChange={(e) => setIeltsScore(Number(e.target.value))}
                className="w-full accent-[#1D5A6C] cursor-pointer h-2 bg-[#F5EFE0] rounded-lg"
              />
            </div>

            {/* GRE Score */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                <span className="text-[#103B47]">
                  GRE General Score (Optional)
                </span>
                <span className="text-[#103B47] font-mono font-bold bg-[#F5EFE0] border border-[#D9CFB8]/70 px-2.5 py-1 rounded-md text-sm">
                  {greScore} / 340
                </span>
              </div>
              <input
                type="range"
                min={280}
                max={340}
                step={2}
                value={greScore}
                onChange={(e) => setGreScore(Number(e.target.value))}
                className="w-full accent-[#1D5A6C] cursor-pointer h-2 bg-[#F5EFE0] rounded-lg"
              />
            </div>

            {/* Work Experience */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                <span className="text-[#103B47]">Relevant Work Experience</span>
                <span className="text-[#103B47] font-mono font-bold bg-[#F5EFE0] border border-[#D9CFB8]/70 px-2.5 py-1 rounded-md text-sm">
                  {workExperienceYears}{" "}
                  {workExperienceYears === 1 ? "Year" : "Years"}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={10}
                step={1}
                value={workExperienceYears}
                onChange={(e) => setWorkExperienceYears(Number(e.target.value))}
                className="w-full accent-[#1D5A6C] cursor-pointer h-2 bg-[#F5EFE0] rounded-lg"
              />
            </div>

            {/* Target Program Level */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#103B47] mb-1.5">
                Target Degree Level
              </label>
              <select
                aria-label="Target degree level"
                value={targetDegree}
                onChange={(e) => setTargetDegree(e.target.value)}
                className="min-h-[44px] w-full rounded-xl border border-[#D9CFB8] bg-[#FDFCF7] px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#103B47] focus:outline-none focus:border-[#1D5A6C]"
              >
                <option value="masters">Postgraduate Masters (MS/MA)</option>
                <option value="bachelors">
                  Undergraduate Bachelors (BS/BA)
                </option>
                <option value="mbbs">Medical Degree (MBBS/MD)</option>
                <option value="mba">Executive MBA (EMBA)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={() =>
                homeModals.openLeadModal(
                  `Profile Evaluation: GPA ${gpa}/10, IELTS ${ieltsScore}, GRE ${greScore}, Exp: ${workExperienceYears}y`,
                )
              }
              className="min-h-[44px] w-full flex items-center justify-center gap-2 rounded-xl bg-[#D89A3E] py-3.5 px-6 text-xs sm:text-sm font-bold text-[#103B47] shadow-md hover:bg-[#c4872d] transition cursor-pointer"
            >
              <span>Get Human Counselor Audit →</span>
            </button>
          </div>

          {/* Right Column: 3-Tier Color-Coded Categorized Results */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Safe Tier */}
            <div className="rounded-2xl border border-[#A8CDBD] bg-white p-5 sm:p-6 shadow-xs">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#A8CDBD]/20 text-[#1D5A6C] font-bold">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#103B47] flex items-center gap-2">
                    <span>Safe Universities</span>
                    <span className="rounded-md bg-[#A8CDBD]/20 border border-[#A8CDBD] px-2 py-0.5 text-[10px] font-mono font-bold text-[#103B47]">
                      &gt;85% Probability (Green)
                    </span>
                  </h3>
                  <p className="text-xs text-[#6B6B6B] mt-0.5">
                    Your profile comfortably exceeds all admission cutoffs.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {safeUnis.map((u) => (
                  <div
                    key={u.id}
                    className="p-4 rounded-xl border border-[#A8CDBD]/50 bg-[#A8CDBD]/10 hover:bg-[#A8CDBD]/20 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <CountryFlag code={u.countryCode} size="sm" />
                          <span className="text-[10px] font-mono font-bold text-[#6B6B6B] uppercase">
                            {u.country}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-[#103B47]">
                          QS #{u.qsRank}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#103B47] mt-2">
                        {u.name}
                      </h4>
                      <p className="text-xs text-[#6B6B6B] mt-1">
                        {u.matchReason}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-[#A8CDBD]/40 text-xs font-mono font-bold text-[#103B47] flex justify-between">
                      <span className="text-[#6B6B6B]">Tuition:</span>
                      <span>{u.tuitionFeeINR}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Target Tier */}
            <div className="rounded-2xl border border-[#D9CFB8] bg-white p-5 sm:p-6 shadow-xs">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5EFE0] text-[#D89A3E] font-bold">
                  <AlertTriangle className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#103B47] flex items-center gap-2">
                    <span>Target Universities</span>
                    <span className="rounded-md bg-[#F5EFE0] border border-[#D9CFB8] px-2 py-0.5 text-[10px] font-mono font-bold text-[#D89A3E]">
                      55% - 85% Probability (Yellow)
                    </span>
                  </h3>
                  <p className="text-xs text-[#6B6B6B] mt-0.5">
                    Strong competitive alignment; compelling SOP & LOR required.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {targetUnis.map((u) => (
                  <div
                    key={u.id}
                    className="p-4 rounded-xl border border-[#D9CFB8]/80 bg-[#FDFCF7] hover:bg-[#F5EFE0]/60 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <CountryFlag code={u.countryCode} size="sm" />
                          <span className="text-[10px] font-mono font-bold text-[#6B6B6B] uppercase">
                            {u.country}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-[#103B47]">
                          QS #{u.qsRank}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#103B47] mt-2">
                        {u.name}
                      </h4>
                      <p className="text-xs text-[#6B6B6B] mt-1">
                        {u.matchReason}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-[#D9CFB8]/60 text-xs font-mono font-bold text-[#103B47] flex justify-between">
                      <span className="text-[#6B6B6B]">Tuition:</span>
                      <span>{u.tuitionFeeINR}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Reach Tier */}
            <div className="rounded-2xl border border-[#7C6BAE]/30 bg-white p-5 sm:p-6 shadow-xs">
              <div className="flex items-center gap-2.5 mb-4">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#7C6BAE]/10 text-[#7C6BAE] font-bold">
                  <XCircle className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#103B47] flex items-center gap-2">
                    <span>Reach / Dream Universities</span>
                    <span className="rounded-md bg-[#7C6BAE]/15 border border-[#7C6BAE]/30 px-2 py-0.5 text-[10px] font-mono font-bold text-[#7C6BAE]">
                      &lt;55% Highly Competitive (Purple)
                    </span>
                  </h3>
                  <p className="text-xs text-[#6B6B6B] mt-0.5">
                    Elite institution; requires outstanding research, profile
                    boosters, or higher test percentiles.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {reachUnis.map((u) => (
                  <div
                    key={u.id}
                    className="p-4 rounded-xl border border-[#7C6BAE]/20 bg-[#7C6BAE]/5 hover:bg-[#7C6BAE]/15 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <CountryFlag code={u.countryCode} size="sm" />
                          <span className="text-[10px] font-mono font-bold text-[#6B6B6B] uppercase">
                            {u.country}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-[#103B47]">
                          QS #{u.qsRank}
                        </span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#103B47] mt-2">
                        {u.name}
                      </h4>
                      <p className="text-xs text-[#6B6B6B] mt-1">
                        {u.matchReason}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-[#7C6BAE]/20 text-xs font-mono font-bold text-[#103B47] flex justify-between">
                      <span className="text-[#6B6B6B]">Tuition:</span>
                      <span>{u.tuitionFeeINR}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
