"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Check,
  X,
  Plus,
  Trash2,
  GraduationCap,
  DollarSign,
  Award,
  Globe,
  BookOpen,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Search,
} from "lucide-react";
import { University } from "@/types";
import { fetchLiveUniversities } from "@/lib/supabase/dataFetchers";
import { useHomeModals } from "@/components/home/HomeClientContext";

export function UniversityCompareClient() {
  const homeModals = useHomeModals();
  const [allUniversities, setAllUniversities] = useState<University[]>([]);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([
    "technical-university-of-munich",
    "stanford-university",
    "university-of-toronto",
    "georgia-tech",
    "university-of-manchester",
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  useEffect(() => {
    fetchLiveUniversities().then((res) => {
      if (res && res.length > 0) {
        setAllUniversities(res);
      }
    });
  }, []);

  const selectedUnis = selectedSlugs
    .map((slug) =>
      allUniversities.find((u) => u.slug === slug || u.id === slug),
    )
    .filter(Boolean) as University[];

  const addUniversity = (slug: string) => {
    if (selectedSlugs.length < 5 && !selectedSlugs.includes(slug)) {
      setSelectedSlugs([...selectedSlugs, slug]);
      setIsSelectorOpen(false);
      setSearchQuery("");
    }
  };

  const removeUniversity = (slug: string) => {
    if (selectedSlugs.length > 1) {
      setSelectedSlugs(selectedSlugs.filter((s) => s !== slug));
    }
  };

  const availableUnis = allUniversities.filter(
    (u) =>
      !selectedSlugs.includes(u.slug) &&
      (u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.city.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20 pt-8 sm:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Hero */}
        <div className="mb-8 text-center sm:text-left">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold text-[#EA5C2B]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>
              Interactive Utility • Compare Up to 5 Universities Side-by-Side
            </span>
          </div>
          <h1 className="font-serif text-3xl font-black text-[#102C57] sm:text-4xl lg:text-5xl">
            University Comparison Matrix
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Compare QS global rankings, tuition fees in INR, minimum IELTS band
            cutoffs, GRE/GMAT waiver policies, and post-study work visa rights
            across top international institutions.
          </p>
        </div>

        {/* Top Controls Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-[#102C57]">
            <Building2 className="h-4 w-4 text-[#EA5C2B]" />
            <span>Comparing {selectedUnis.length} of 5 Universities</span>
          </div>

          <div className="flex items-center gap-3">
            {selectedSlugs.length < 5 && (
              <button
                onClick={() => setIsSelectorOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#102C57] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0d2346]"
              >
                <Plus className="h-4 w-4 text-[#EA5C2B]" />
                <span>Add University ({5 - selectedSlugs.length} left)</span>
              </button>
            )}
            <button
              onClick={() => homeModals.openLeadModal()}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#EA5C2B] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#ff7240]"
            >
              <span>Get Expert Shortlist Help</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Modal / Dropdown overlay to Add University */}
        {isSelectorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
            <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-base font-extrabold text-[#102C57]">
                  Select University to Compare
                </h3>
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
                  placeholder="Search university or country..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-4 text-xs focus:border-[#102C57] focus:outline-none focus:ring-1 focus:ring-[#102C57]"
                />
              </div>

              <div className="mt-4 max-h-72 space-y-1.5 overflow-y-auto pr-1">
                {availableUnis.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-400">
                    No matching universities found.
                  </p>
                ) : (
                  availableUnis.map((uni) => (
                    <button
                      key={uni.id}
                      onClick={() => addUniversity(uni.slug)}
                      className="flex w-full items-center justify-between rounded-xl p-2.5 text-left transition hover:bg-slate-50"
                    >
                      <div>
                        <p className="text-xs font-bold text-[#102C57]">
                          {uni.name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {uni.city}, {uni.country} • Rank #{uni.rankingGlobal}
                        </p>
                      </div>
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-[#EA5C2B] hover:bg-[#EA5C2B] hover:text-white transition">
                        + Add
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Comparison Table Grid */}
        <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-xl">
          <table className="w-full min-w-[700px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="w-48 p-4 font-bold uppercase tracking-wider text-slate-400">
                  Feature / Criteria
                </th>
                {selectedUnis.map((uni) => (
                  <th key={uni.id} className="p-4 align-top">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link
                          href={`/universities/${uni.slug}`}
                          className="font-extrabold text-[#102C57] hover:text-[#EA5C2B] transition text-sm"
                        >
                          {uni.name}
                        </Link>
                        <p className="mt-0.5 text-[11px] text-slate-500 font-normal">
                          {uni.city}, {uni.country}
                        </p>
                      </div>
                      {selectedUnis.length > 1 && (
                        <button
                          onClick={() => removeUniversity(uni.slug)}
                          className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                          title="Remove from comparison"
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
              {/* Row 1: QS Global Ranking */}
              <tr>
                <td className="bg-slate-50/40 p-4 font-bold text-[#102C57]">
                  <div className="flex items-center gap-1.5">
                    <Award className="h-4 w-4 text-amber-500" />
                    <span>QS World Rank</span>
                  </div>
                </td>
                {selectedUnis.map((uni) => (
                  <td
                    key={uni.id}
                    className="p-4 font-extrabold text-slate-900 text-sm"
                  >
                    #{uni.rankingGlobal} Global
                    {uni.rankingNational && (
                      <span className="ml-2 text-[10px] font-normal text-slate-400 block sm:inline">
                        (#{uni.rankingNational} National)
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 2: Tuition Fees in INR */}
              <tr>
                <td className="bg-slate-50/40 p-4 font-bold text-[#102C57]">
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-emerald-600" />
                    <span>Tuition Fee (INR)</span>
                  </div>
                </td>
                {selectedUnis.map((uni) => (
                  <td key={uni.id} className="p-4 font-bold text-emerald-700">
                    {uni.tuitionFeeRangeINR}
                  </td>
                ))}
              </tr>

              {/* Row 3: IELTS Cutoff */}
              <tr>
                <td className="bg-slate-50/40 p-4 font-bold text-[#102C57]">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <span>Min. IELTS Band</span>
                  </div>
                </td>
                {selectedUnis.map((uni) => (
                  <td key={uni.id} className="p-4 font-semibold">
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-blue-800 font-bold">
                      {uni.ieltsMinScore} Overall
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 4: GRE / GMAT Waiver */}
              <tr>
                <td className="bg-slate-50/40 p-4 font-bold text-[#102C57]">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-purple-600" />
                    <span>GRE / GMAT Requirement</span>
                  </div>
                </td>
                {selectedUnis.map((uni) => (
                  <td key={uni.id} className="p-4 font-medium">
                    {uni.greGmatRequired ? (
                      <span className="inline-flex items-center gap-1 text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded">
                        <Check className="h-3.5 w-3.5" /> Required
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                        <Check className="h-3.5 w-3.5 text-emerald-600" />{" "}
                        Waived / Optional
                      </span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row 5: Acceptance Rate */}
              <tr>
                <td className="bg-slate-50/40 p-4 font-bold text-[#102C57]">
                  <div className="flex items-center gap-1.5">
                    <Globe className="h-4 w-4 text-indigo-600" />
                    <span>Acceptance Rate</span>
                  </div>
                </td>
                {selectedUnis.map((uni) => (
                  <td key={uni.id} className="p-4 font-semibold text-slate-800">
                    {uni.acceptanceRate}%
                  </td>
                ))}
              </tr>

              {/* Row 6: Post-Study Work Visa */}
              <tr>
                <td className="bg-slate-50/40 p-4 font-bold text-[#102C57]">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-[#EA5C2B]" />
                    <span>Post-Study Work Visa</span>
                  </div>
                </td>
                {selectedUnis.map((uni) => (
                  <td key={uni.id} className="p-4 font-bold text-[#EA5C2B]">
                    {uni.postStudyWorkMonths} Months (
                    {Math.round(uni.postStudyWorkMonths / 12)} Yrs)
                  </td>
                ))}
              </tr>

              {/* Row 7: Primary Intakes */}
              <tr>
                <td className="bg-slate-50/40 p-4 font-bold text-[#102C57]">
                  <span>Intake Semesters</span>
                </td>
                {selectedUnis.map((uni) => (
                  <td key={uni.id} className="p-4 text-slate-600 font-medium">
                    {uni.intakes
                      ? uni.intakes.join(", ")
                      : "Fall (Sep), Spring (Jan)"}
                  </td>
                ))}
              </tr>

              {/* Row 8: Action CTAs */}
              <tr className="bg-slate-50/20">
                <td className="bg-slate-50/40 p-4 font-bold text-[#102C57]">
                  <span>Admissions Action</span>
                </td>
                {selectedUnis.map((uni) => (
                  <td key={uni.id} className="p-4">
                    <div className="space-y-2">
                      <Link
                        href={`/universities/${uni.slug}`}
                        className="block w-full rounded-xl border border-[#102C57] text-center py-2 text-xs font-bold text-[#102C57] hover:bg-[#102C57] hover:text-white transition"
                      >
                        View Full Profile
                      </Link>
                      <button
                        onClick={() => homeModals.openLeadModal(uni.country)}
                        className="block w-full rounded-xl bg-[#EA5C2B] text-center py-2 text-xs font-bold text-white hover:bg-[#ff7240] transition shadow-sm"
                      >
                        Apply / Shortlist
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
