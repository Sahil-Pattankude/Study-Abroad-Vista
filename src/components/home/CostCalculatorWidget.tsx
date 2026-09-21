"use client";

import { useState, useEffect } from "react";
import { Calculator, Banknote, HelpCircle, ArrowRight } from "lucide-react";
import { fetchLiveCountries } from "@/lib/supabase/dataFetchers";
import { Country } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useHomeModals } from "@/components/home/HomeClientContext";

interface CostCalculatorProps {
  onOpenLeadModal?: () => void;
}

export function CostCalculatorWidget({ onOpenLeadModal }: CostCalculatorProps) {
  const homeModals = useHomeModals();
  const handleLead = onOpenLeadModal || homeModals.openLeadModal;
  const [countriesList, setCountriesList] = useState<Country[]>([]);
  const [countrySlug, setCountrySlug] = useState("germany");
  const [durationYears, setDurationYears] = useState(2);
  const [accommodation, setAccommodation] = useState<
    "shared" | "hostel" | "studio"
  >("shared");
  const [includePartTimeOffset, setIncludePartTimeOffset] = useState(true);

  useEffect(() => {
    fetchLiveCountries().then((c) => {
      if (c && c.length > 0) setCountriesList(c);
    });
  }, []);

  const selectedCountry = countriesList.find((c) => c.slug === countrySlug);
  const exchangeRate = selectedCountry?.exchangeRateToINR || 90;

  // Base tuition estimates by country (annual in INR)
  const tuitionMap: Record<string, number> = {
    usa: 2800000,
    uk: 2200000,
    canada: 1800000,
    australia: 2400000,
    ireland: 1600000,
    "new-zealand": 1700000,
    germany: 50000, // Public free tuition, semester fee only
    france: 1200000,
    italy: 250000, // Regional DSU fee waiver
    netherlands: 1500000,
    singapore: 2200000,
    malaysia: 600000,
    uae: 1500000,
    russia: 400000,
    uzbekistan: 350000,
    kazakhstan: 380000,
    kyrgyzstan: 300000,
    georgia: 500000,
    philippines: 450000,
  };

  // Base monthly living costs in local currency * exchange rate
  const baseMonthlyLivingINR = exchangeRate * 850;
  const accommodationMultiplier =
    accommodation === "studio" ? 1.4 : accommodation === "hostel" ? 0.9 : 1.0;
  const annualLivingINR = baseMonthlyLivingINR * 12 * accommodationMultiplier;

  // Total Annual Tuition
  const annualTuitionINR = tuitionMap[countrySlug] || 1500000;

  // Other Expenses (Visa, Flight, Health Insurance)
  const annualMiscINR = 180000;

  // Potential Part-time Work Offsets (20 hrs/week permitted in most countries)
  const annualPartTimeEarningsINR = includePartTimeOffset
    ? exchangeRate * 14 * 20 * 42 // approx 14 currency units/hr, 20 hrs/wk, 42 wks
    : 0;

  const totalGrossCostINR =
    (annualTuitionINR + annualLivingINR + annualMiscINR) * durationYears;
  const totalOffsetINR = annualPartTimeEarningsINR * durationYears;
  const netEstimatedBudgetINR = Math.max(0, totalGrossCostINR - totalOffsetINR);

  return (
    <section id="cost-calculator" className="cv-auto py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-[#102C57] to-slate-900 p-8 text-white shadow-2xl lg:p-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left Controls */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-orange-300">
                <Calculator className="h-3.5 w-3.5 text-[#EA5C2B]" />
                Interactive ROI Tool
              </div>

              <h2 className="mt-4 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
                Study Abroad Cost & Living Calculator
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                Accurately estimate total tuition, accommodation, and part-time
                earnings converted to Indian Rupees (INR).
              </p>

              {/* Form Controls */}
              <div className="mt-8 space-y-5">
                {/* Destination Dropdown */}
                <div>
                  <label
                    htmlFor="calc-destination"
                    className="block text-xs font-bold uppercase tracking-wider text-slate-300"
                  >
                    Target Destination
                  </label>
                  <select
                    id="calc-destination"
                    aria-label="Target study destination"
                    value={countrySlug}
                    onChange={(e) => setCountrySlug(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-3 text-sm font-semibold text-white focus:border-[#EA5C2B] focus:outline-none"
                  >
                    {countriesList.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.flagEmoji} {c.name} ({c.currency} ≈ ₹
                        {c.exchangeRateToINR})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duration Slider / Buttons */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Program Duration
                  </label>
                  <div className="mt-2 flex gap-2">
                    {[1, 2, 3, 4, 5].map((yrs) => (
                      <button
                        key={yrs}
                        type="button"
                        onClick={() => setDurationYears(yrs)}
                        className={`flex-1 rounded-xl py-2.5 text-xs font-bold transition ${
                          durationYears === yrs
                            ? "bg-[#EA5C2B] text-white shadow-md"
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        {yrs} {yrs === 1 ? "Year" : "Years"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accommodation Style */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Accommodation Style
                  </label>
                  <div className="mt-2 grid grid-cols-3 gap-2">
                    {[
                      { key: "shared", label: "Shared Flat" },
                      { key: "hostel", label: "University Dorm" },
                      { key: "studio", label: "Private Studio" },
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() =>
                          setAccommodation(item.key as typeof accommodation)
                        }
                        className={`rounded-xl py-2.5 text-xs font-bold transition ${
                          accommodation === item.key
                            ? "bg-white text-[#102C57] shadow-md"
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Part-time work toggle */}
                <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3.5">
                  <input
                    type="checkbox"
                    id="parttime"
                    checked={includePartTimeOffset}
                    onChange={(e) => setIncludePartTimeOffset(e.target.checked)}
                    className="h-4 w-4 rounded accent-[#EA5C2B]"
                  />
                  <label
                    htmlFor="parttime"
                    className="cursor-pointer text-xs font-medium text-slate-200"
                  >
                    Factor in 20 hrs/week permitted part-time student work
                    earnings offset
                  </label>
                </div>
              </div>
            </div>

            {/* Right Financial Breakdown Box */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-700/60 bg-slate-800/80 p-6 shadow-xl lg:col-span-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Estimated Net Financial Investment
                </span>

                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white sm:text-4xl">
                    {formatCurrency(netEstimatedBudgetINR)}
                  </span>
                  <span className="text-xs text-slate-400">
                    Total for {durationYears} Yrs
                  </span>
                </div>

                {/* Detailed Breakdown */}
                <div className="mt-6 space-y-3 border-t border-slate-700 pt-5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Tuition Fees ({durationYears} yrs):</span>
                    <span className="font-semibold text-white">
                      {formatCurrency(annualTuitionINR * durationYears)}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span>Living & Accommodation:</span>
                    <span className="font-semibold text-white">
                      {formatCurrency(annualLivingINR * durationYears)}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-300">
                    <span>Visa, Insurance & Flights:</span>
                    <span className="font-semibold text-white">
                      {formatCurrency(annualMiscINR * durationYears)}
                    </span>
                  </div>

                  {includePartTimeOffset && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Est. Part-time Job Income:</span>
                      <span className="font-semibold">
                        - {formatCurrency(totalOffsetINR)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-5 rounded-xl bg-slate-900/90 p-3 text-[11px] text-slate-400">
                  <div className="flex items-start gap-2">
                    <HelpCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#EA5C2B]" />
                    <p>
                      Exchange rate: 1 {selectedCountry?.currency || "EUR"} = ₹
                      {selectedCountry?.exchangeRateToINR || 90}. Actual costs
                      vary by university ranking and lifestyle.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4">
                <button
                  onClick={() => handleLead()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#EA5C2B] py-3 text-xs font-bold text-white shadow-lg transition hover:bg-[#d94f20]"
                >
                  <Banknote className="h-4 w-4" />
                  Get Personalized Scholarship Evaluation
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
