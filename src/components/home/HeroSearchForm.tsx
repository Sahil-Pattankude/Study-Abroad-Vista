"use client";

import { useState } from "react";
import { Search, GraduationCap } from "lucide-react";
import { COUNTRIES, PROGRAMS } from "@/lib/data/masterData";
import { CountryFlag } from "@/components/ui/CountryFlag";

const ANCHOR_SLUGS = ["uk", "usa", "germany", "canada", "australia", "ireland"];
const ANCHOR_COUNTRIES = COUNTRIES.filter(c => ANCHOR_SLUGS.includes(c.slug));
const TIER2_COUNTRIES = COUNTRIES.filter(c => c.tier === "Tier 2");
const TIER3_COUNTRIES = COUNTRIES.filter(c => c.tier === "Tier 3");

export function HeroSearchForm() {
  const [selectedCountry, setSelectedCountry] = useState("germany");
  const [selectedProgram, setSelectedProgram] = useState("ms");

  const currentCountry = COUNTRIES.find(c => c.slug === selectedCountry);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const element = document.getElementById(`country-${selectedCountry}`) || document.getElementById("destinations-grid");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <form 
      onSubmit={handleSearchSubmit}
      className="mt-8 rounded-2xl border border-white/20 bg-[#132c52] sm:bg-white/10 p-2 sm:backdrop-blur-xl shadow-2xl sm:flex sm:items-center sm:gap-2 max-w-xl"
    >
      {/* Country Selector */}
      <div className="flex flex-1 items-center gap-2.5 rounded-xl bg-white/10 px-3.5 py-2.5 sm:bg-transparent">
        <CountryFlag code={currentCountry?.code || "DE"} name={currentCountry?.name} size="sm" />
        <div className="text-left w-full">
          <label htmlFor="country-select" className="block text-[9px] font-bold uppercase tracking-wider text-slate-300">Destination</label>
          <select 
            id="country-select"
            aria-label="Select study destination country"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer [&>option]:text-slate-900 [&>optgroup]:text-slate-900"
          >
            <optgroup label="Anchor Six (Priority)">
              {ANCHOR_COUNTRIES.map(c => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </optgroup>
            <optgroup label="Europe & Asia">
              {TIER2_COUNTRIES.map(c => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </optgroup>
            <optgroup label="Medical / Low-Cost">
              {TIER3_COUNTRIES.map(c => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </optgroup>
          </select>
        </div>
      </div>

      <div className="my-2 h-7 w-px bg-white/20 hidden sm:block" />

      {/* Program Selector */}
      <div className="flex flex-1 items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2.5 sm:bg-transparent">
        <GraduationCap className="h-4 w-4 text-[#EA5C2B] shrink-0" />
        <div className="text-left w-full">
          <label htmlFor="program-select" className="block text-[9px] font-bold uppercase tracking-wider text-slate-300">Program</label>
          <select 
            id="program-select"
            aria-label="Select degree or study stream"
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="w-full bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer [&>option]:text-slate-900"
          >
            {PROGRAMS.map(p => (
              <option key={p.id} value={p.slug}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#EA5C2B] px-5 py-3 text-xs font-bold text-white shadow-lg transition hover:bg-[#ff7240] sm:mt-0 sm:w-auto shrink-0"
      >
        <Search className="h-4 w-4" />
        Search
      </button>
    </form>
  );
}
