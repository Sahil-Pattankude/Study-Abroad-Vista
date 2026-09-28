"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Award,
  Search,
  ArrowRight,
  Sparkles,
  Filter,
} from "lucide-react";
import { University, Country } from "@/types";
import { CountryFlag } from "@/components/ui/CountryFlag";

interface UniversitiesClientDirectoryProps {
  initialUniversities: University[];
  countries: Country[];
}

export function UniversitiesClientDirectory({
  initialUniversities,
  countries,
}: UniversitiesClientDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"rank" | "name">("rank");

  const filteredUniversities = useMemo(() => {
    return initialUniversities
      .filter((uni) => {
        const matchesSearch =
          uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          uni.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          uni.country.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCountry =
          selectedCountry === "all" ||
          uni.country.toLowerCase() === selectedCountry.toLowerCase();

        return matchesSearch && matchesCountry;
      })
      .sort((a, b) => {
        if (sortBy === "rank") {
          return a.rankingGlobal - b.rankingGlobal;
        }
        return a.name.localeCompare(b.name);
      });
  }, [initialUniversities, searchQuery, selectedCountry, sortBy]);

  const uniqueCountries = useMemo(() => {
    const list = Array.from(new Set(initialUniversities.map((u) => u.country)));
    return list.sort();
  }, [initialUniversities]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Search Input */}
          <div className="relative md:col-span-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by university name, city..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#102C57] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102C57]/10 transition"
            />
          </div>

          {/* Country Filter */}
          <div className="relative">
            <Filter className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-8 text-xs sm:text-sm text-slate-900 focus:border-[#102C57] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102C57]/10 transition cursor-pointer"
            >
              <option value="all">All Countries ({initialUniversities.length})</option>
              {uniqueCountries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "rank" | "name")}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 text-xs sm:text-sm text-slate-900 focus:border-[#102C57] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#102C57]/10 transition cursor-pointer"
            >
              <option value="rank">Sort by QS World Ranking (Top First)</option>
              <option value="name">Sort Alphabetically (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Pill Chips */}
        <div className="mt-4 flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-500 mr-1">Popular Destinations:</span>
          {["USA", "UK", "Canada", "Australia", "Germany", "Ireland"].map((cName) => {
            const isSelected = selectedCountry.toLowerCase() === cName.toLowerCase();
            return (
              <button
                key={cName}
                type="button"
                onClick={() =>
                  setSelectedCountry(isSelected ? "all" : cName)
                }
                className={`rounded-full px-3 py-1 text-xs font-semibold transition cursor-pointer ${
                  isSelected
                    ? "bg-[#102C57] text-white"
                    : "border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                {cName}
              </button>
            );
          })}
          {selectedCountry !== "all" && (
            <button
              type="button"
              onClick={() => setSelectedCountry("all")}
              className="text-xs font-bold text-rose-600 hover:underline ml-auto"
            >
              Clear Filter ✕
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-600">
          Showing <span className="font-extrabold text-[#102C57]">{filteredUniversities.length}</span> institutions
        </p>
        <p className="text-xs text-slate-400">
          Verified for Indian Aspirants 2026-2027
        </p>
      </div>

      {/* University Grid */}
      {filteredUniversities.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <Building2 className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-base font-bold text-[#102C57]">
            No universities found
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Try adjusting your search keywords or destination filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCountry("all");
            }}
            className="mt-4 rounded-xl bg-[#102C57] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#1b3d73] transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredUniversities.map((uni) => {
            const countryObj = countries.find(
              (c) => c.name.toLowerCase() === uni.country.toLowerCase()
            );

            return (
              <div
                key={uni.id || uni.slug}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200"
              >
                <div>
                  {/* Top Badge: Rank & Country */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700 border border-amber-200/60">
                      <Award className="h-3.5 w-3.5 text-amber-600" />
                      #{uni.rankingGlobal} QS Global
                    </span>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                      {countryObj && (
                        <CountryFlag
                          code={countryObj.code}
                          name={uni.country}
                          size="sm"
                        />
                      )}
                      <span>{uni.country}</span>
                    </div>
                  </div>

                  {/* University Name */}
                  <h3 className="text-base font-extrabold text-[#102C57] group-hover:text-[#EA5C2B] transition leading-snug">
                    <Link href={`/universities/${uni.slug}`} className="hover:underline">
                      {uni.name}
                    </Link>
                  </h3>

                  {/* Location */}
                  <div className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>{uni.city}, {uni.country}</span>
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-50/80 p-3 border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">
                        Annual Tuition
                      </span>
                      <span className="font-extrabold text-slate-800">
                        {uni.tuitionFeeRangeINR || "Contact for INR"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">
                        Acceptance Rate
                      </span>
                      <span className="font-extrabold text-[#102C57]">
                        {uni.acceptanceRate ? `${uni.acceptanceRate}%` : "Competitive"}
                      </span>
                    </div>
                    {uni.ieltsMinScore ? (
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">
                          IELTS Cutoff
                        </span>
                        <span className="font-bold text-slate-700">
                          {uni.ieltsMinScore} Overall
                        </span>
                      </div>
                    ) : null}
                    {uni.postStudyWorkMonths ? (
                      <div>
                        <span className="text-[10px] font-bold uppercase text-slate-400 block">
                          PSW Visa
                        </span>
                        <span className="font-bold text-emerald-600 flex items-center gap-1">
                          <Sparkles className="h-3 w-3" /> {uni.postStudyWorkMonths} Months
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* Bottom Card Actions */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/compare/universities?u1=${uni.slug}`}
                    className="text-xs font-semibold text-slate-500 hover:text-[#102C57] transition"
                  >
                    + Compare
                  </Link>
                  <Link
                    href={`/universities/${uni.slug}`}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#102C57] px-3.5 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#EA5C2B] transition active:scale-98"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
