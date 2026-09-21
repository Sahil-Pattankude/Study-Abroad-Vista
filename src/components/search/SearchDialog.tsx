"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  X,
  MapPin,
  GraduationCap,
  Building2,
  ArrowRight,
} from "lucide-react";
import {
  fetchLiveCountries,
  fetchLivePrograms,
  fetchLiveUniversities,
} from "@/lib/supabase/dataFetchers";
import { Country, Program, University } from "@/types";
import { TEST_PREP_EXAMS } from "@/lib/data/testPrepData";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCountry?: (slug: string) => void;
}

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [universities, setUniversities] = useState<University[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchLiveCountries().then((c) => {
        if (c && c.length > 0) setCountries(c);
      });
      fetchLivePrograms().then((p) => {
        if (p && p.length > 0) setPrograms(p);
      });
      fetchLiveUniversities().then((u) => {
        if (u && u.length > 0) setUniversities(u);
      });
    }
  }, [isOpen]);

  const searchResults = useMemo(() => {
    if (!query.trim())
      return { countries: [], programs: [], universities: [], testPreps: [] };
    const q = query.toLowerCase();

    return {
      testPreps: TEST_PREP_EXAMS.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.shortName.toLowerCase().includes(q) ||
          t.fullName.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          q === "test prep" ||
          q === "exam" ||
          q === "ielts" ||
          q === "gre" ||
          q === "nclex",
      ).slice(0, 3),
      countries: countries
        .filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            (c.heroTagline || "").toLowerCase().includes(q),
        )
        .slice(0, 3),
      programs: programs
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            (p.keyFields || []).some((f) => f.toLowerCase().includes(q)),
        )
        .slice(0, 3),
      universities: universities
        .filter(
          (u) =>
            u.name.toLowerCase().includes(q) ||
            (u.city || "").toLowerCase().includes(q),
        )
        .slice(0, 3),
    };
  }, [query, countries, programs, universities]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/50 p-4 pt-16 backdrop-blur-xs">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden">
        {/* Search Header Input */}
        <div className="flex items-center border-b border-slate-200 px-4 py-3">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search destination, university (e.g. TUM, Manchester), or program..."
            className="flex-1 border-0 bg-transparent px-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-4 text-xs">
          {!query.trim() ? (
            <div className="py-6 text-center text-slate-400">
              <p className="font-semibold text-slate-600">Quick suggestions:</p>
              <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                {[
                  "Germany Free Tuition",
                  "USA STEM OPT",
                  "TUM Munich",
                  "MBBS in Uzbekistan",
                  "Ausbildung",
                ].map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="rounded-lg bg-slate-100 px-2.5 py-1 text-slate-700 hover:bg-slate-200"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Test Prep Exams */}
              {searchResults.testPreps.length > 0 && (
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px] mb-1.5">
                    Test Prep & Licensing Exams
                  </h4>
                  <div className="space-y-1">
                    {searchResults.testPreps.map((t) => (
                      <a
                        key={t.id}
                        href={`/test-prep/${t.slug}`}
                        onClick={onClose}
                        className="flex items-center justify-between rounded-xl p-2 hover:bg-slate-50 transition"
                      >
                        <div className="flex items-center gap-2">
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-[11px] font-bold text-[#EA5C2B]">
                            {t.shortName.slice(0, 3)}
                          </span>
                          <div>
                            <p className="font-bold text-slate-800">{t.name}</p>
                            <p className="text-[11px] text-slate-500">
                              {t.category} • Fee: {t.feeINR}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Countries */}
              {searchResults.countries.length > 0 && (
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px] mb-1.5">
                    Destinations
                  </h4>
                  <div className="space-y-1">
                    {searchResults.countries.map((c) => (
                      <a
                        key={c.id}
                        href={`#country-${c.slug}`}
                        onClick={onClose}
                        className="flex items-center justify-between rounded-xl p-2 hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{c.flagEmoji}</span>
                          <div>
                            <p className="font-bold text-slate-800">{c.name}</p>
                            <p className="text-[11px] text-slate-500">
                              {c.postStudyWorkVisa} • {c.avgTuitionINR}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Universities */}
              {searchResults.universities.length > 0 && (
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px] mb-1.5">
                    Universities
                  </h4>
                  <div className="space-y-1">
                    {searchResults.universities.map((u) => (
                      <div
                        key={u.id}
                        className="flex items-center justify-between rounded-xl p-2 hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-[#EA5C2B]" />
                          <div>
                            <p className="font-bold text-slate-800">{u.name}</p>
                            <p className="text-[11px] text-slate-500">
                              {u.city}, {u.country} • Rank #{u.rankingGlobal}
                            </p>
                          </div>
                        </div>
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          {u.tuitionFeeRangeINR}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Programs */}
              {searchResults.programs.length > 0 && (
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-slate-400 text-[10px] mb-1.5">
                    Programs
                  </h4>
                  <div className="space-y-1">
                    {searchResults.programs.map((p) => (
                      <a
                        key={p.id}
                        href={`#program-${p.slug}`}
                        onClick={onClose}
                        className="flex items-center justify-between rounded-xl p-2 hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4 text-[#102C57]" />
                          <div>
                            <p className="font-bold text-slate-800">{p.name}</p>
                            <p className="text-[11px] text-slate-500">
                              {p.duration} • Top: {p.topDestinations.join(", ")}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.testPreps.length === 0 &&
                searchResults.countries.length === 0 &&
                searchResults.universities.length === 0 &&
                searchResults.programs.length === 0 && (
                  <div className="py-6 text-center text-slate-500">
                    <p>No direct matches found for &quot;{query}&quot;.</p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Try searching with our 24/7 AI Counsellor for flexible
                      recommendations!
                    </p>
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
