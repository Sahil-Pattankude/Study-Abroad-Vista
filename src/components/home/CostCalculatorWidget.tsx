"use client";

import { useState, useEffect } from "react";
import {
  Calculator,
  Banknote,
  HelpCircle,
  Building,
  GraduationCap,
  Coins,
  Plane,
  Sparkles,
  ChevronDown,
  Info,
} from "lucide-react";
import { fetchLiveCountries } from "@/lib/supabase/dataFetchers";
import { Country } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useHomeModals } from "@/components/home/HomeClientContext";
import { CountryFlag } from "@/components/ui/CountryFlag";

interface CostCalculatorProps {
  defaultCountry?: string;
  variant?: "standalone" | "embedded";
  onOpenLeadModal?: () => void;
}

type ProgramLevel =
  "masters" | "bachelors" | "emba" | "mbbs" | "ausbildung" | "nursing";
type CityTier = "tier1" | "tier2" | "tier3";

export function CostCalculatorWidget({
  defaultCountry,
  variant = "standalone",
  onOpenLeadModal,
}: CostCalculatorProps) {
  const homeModals = useHomeModals();
  const handleLead = onOpenLeadModal || homeModals.openLeadModal;
  const [countriesList, setCountriesList] = useState<Country[]>([]);
  const [countrySlug, setCountrySlug] = useState(defaultCountry || "germany");
  const [programLevel, setProgramLevel] = useState<ProgramLevel>("masters");
  const [durationYears, setDurationYears] = useState(2);
  const [cityTier, setCityTier] = useState<CityTier>("tier1");
  const [accommodation, setAccommodation] = useState<
    "shared" | "hostel" | "studio"
  >("shared");
  const [includePartTimeOffset, setIncludePartTimeOffset] = useState(true);
  const [currencyMode, setCurrencyMode] = useState<"inr" | "dual">("dual");

  useEffect(() => {
    fetchLiveCountries().then((c) => {
      if (c && c.length > 0) {
        setCountriesList(c);
        if (defaultCountry) {
          const found = c.find(
            (item) =>
              item.slug.toLowerCase() === defaultCountry.toLowerCase() ||
              item.name.toLowerCase().includes(defaultCountry.toLowerCase()),
          );
          if (found) setCountrySlug(found.slug);
        }
      }
    });
  }, [defaultCountry]);

  const selectedCountry = countriesList.find((c) => c.slug === countrySlug);
  const exchangeRate = selectedCountry?.exchangeRateToINR || 90;
  const currencySymbol = selectedCountry?.currency || "EUR";

  // Base tuition estimates by country (annual in INR) per program level
  const baseTuitionMap: Record<string, Record<ProgramLevel, number>> = {
    usa: {
      masters: 2800000,
      bachelors: 3200000,
      emba: 4500000,
      mbbs: 3500000,
      ausbildung: 1500000,
      nursing: 2200000,
    },
    uk: {
      masters: 2200000,
      bachelors: 2000000,
      emba: 3800000,
      mbbs: 3800000,
      ausbildung: 1200000,
      nursing: 1800000,
    },
    canada: {
      masters: 1800000,
      bachelors: 2100000,
      emba: 3200000,
      mbbs: 2800000,
      ausbildung: 1100000,
      nursing: 1600000,
    },
    australia: {
      masters: 2400000,
      bachelors: 2500000,
      emba: 3600000,
      mbbs: 3900000,
      ausbildung: 1400000,
      nursing: 2000000,
    },
    ireland: {
      masters: 1600000,
      bachelors: 1700000,
      emba: 2800000,
      mbbs: 3400000,
      ausbildung: 900000,
      nursing: 1500000,
    },
    "new-zealand": {
      masters: 1700000,
      bachelors: 1800000,
      emba: 2900000,
      mbbs: 3200000,
      ausbildung: 1000000,
      nursing: 1600000,
    },
    germany: {
      masters: 50000,
      bachelors: 50000,
      emba: 1800000,
      mbbs: 50000,
      ausbildung: 0,
      nursing: 0,
    },
    france: {
      masters: 1200000,
      bachelors: 1100000,
      emba: 3500000,
      mbbs: 800000,
      ausbildung: 600000,
      nursing: 900000,
    },
    italy: {
      masters: 250000,
      bachelors: 250000,
      emba: 2000000,
      mbbs: 250000,
      ausbildung: 400000,
      nursing: 250000,
    },
    netherlands: {
      masters: 1500000,
      bachelors: 1400000,
      emba: 2800000,
      mbbs: 1800000,
      ausbildung: 800000,
      nursing: 1300000,
    },
    russia: {
      masters: 350000,
      bachelors: 320000,
      emba: 900000,
      mbbs: 380000,
      ausbildung: 250000,
      nursing: 300000,
    },
    uzbekistan: {
      masters: 280000,
      bachelors: 250000,
      emba: 700000,
      mbbs: 350000,
      ausbildung: 200000,
      nursing: 250000,
    },
    kazakhstan: {
      masters: 300000,
      bachelors: 280000,
      emba: 750000,
      mbbs: 360000,
      ausbildung: 220000,
      nursing: 280000,
    },
    kyrgyzstan: {
      masters: 250000,
      bachelors: 220000,
      emba: 600000,
      mbbs: 300000,
      ausbildung: 180000,
      nursing: 220000,
    },
    georgia: {
      masters: 450000,
      bachelors: 400000,
      emba: 1100000,
      mbbs: 500000,
      ausbildung: 300000,
      nursing: 400000,
    },
    philippines: {
      masters: 380000,
      bachelors: 350000,
      emba: 900000,
      mbbs: 450000,
      ausbildung: 250000,
      nursing: 350000,
    },
    uae: {
      masters: 1500000,
      bachelors: 1600000,
      emba: 2500000,
      mbbs: 2200000,
      ausbildung: 900000,
      nursing: 1400000,
    },
    singapore: {
      masters: 2200000,
      bachelors: 2400000,
      emba: 3800000,
      mbbs: 3000000,
      ausbildung: 1200000,
      nursing: 1900000,
    },
    malaysia: {
      masters: 600000,
      bachelors: 550000,
      emba: 1400000,
      mbbs: 1200000,
      ausbildung: 450000,
      nursing: 550000,
    },
  };

  // 1. Annual Tuition
  const countryTuitions =
    baseTuitionMap[countrySlug] || baseTuitionMap["germany"];
  const annualTuitionINR = countryTuitions[programLevel] ?? 1500000;

  // 2. Monthly Living Costs
  const cityMultiplier =
    cityTier === "tier1" ? 1.25 : cityTier === "tier2" ? 1.0 : 0.8;
  const accomMultiplier =
    accommodation === "studio" ? 1.35 : accommodation === "hostel" ? 0.9 : 1.0;
  const baseMonthlyLocal = 850;
  const monthlyLivingINR =
    baseMonthlyLocal * exchangeRate * cityMultiplier * accomMultiplier;
  const annualLivingINR = monthlyLivingINR * 12;

  // 3. One-Time Setup Costs
  const oneTimeSetupCostINR =
    countrySlug === "germany" ? 11208 * exchangeRate + 80000 : 220000;

  // 4. Part-time Work Offsets
  const hourlyWageLocal =
    countrySlug === "germany" ? 13.5 : countrySlug === "usa" ? 16 : 14;
  const annualPartTimeEarningsINR = includePartTimeOffset
    ? exchangeRate * hourlyWageLocal * 20 * 42
    : 0;

  // 5. Total 2-Year Calculation
  const totalTuitionINR = annualTuitionINR * durationYears;
  const totalLivingINR = annualLivingINR * durationYears;
  const totalOneTimeINR = oneTimeSetupCostINR;
  const totalGrossCostINR = totalTuitionINR + totalLivingINR + totalOneTimeINR;
  const totalOffsetINR = annualPartTimeEarningsINR * durationYears;
  const netEstimatedBudgetINR = Math.max(0, totalGrossCostINR - totalOffsetINR);

  // Foreign currency equivalent
  const formatForeign = (inrAmount: number) => {
    const val = inrAmount / exchangeRate;
    return `${currencySymbol} ${val.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
  };

  // Tuition percentage for visual bar
  const tuitionPct =
    totalGrossCostINR > 0
      ? Math.round((totalTuitionINR / totalGrossCostINR) * 100)
      : 50;
  const livingPct =
    totalGrossCostINR > 0
      ? Math.round((totalLivingINR / totalGrossCostINR) * 100)
      : 40;
  const setupPct = Math.max(0, 100 - tuitionPct - livingPct);

  return (
    <div
      id="cost-calculator"
      className={`mx-auto ${
        variant === "embedded" ? "max-w-full" : "max-w-5xl"
      } rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 lg:p-10 shadow-sm transition-all`}
    >
      {/* 1. Header Bar with Currency Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-orange-50 px-3.5 py-1 text-xs font-bold text-[#EA5C2B]">
            <Calculator className="h-3.5 w-3.5" />
            <span>Interactive Cost & Living Estimator</span>
          </div>
          <h3 className="mt-2.5 font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#102C57]">
            Study & Living Cost Breakdown
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Customize your degree, city tier, and housing to calculate total
            tuition, living costs, and part-time earnings in real time.
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-1 self-start sm:self-center rounded-2xl bg-slate-100 p-1 text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setCurrencyMode("inr")}
            className={`rounded-xl px-3.5 py-2 transition cursor-pointer ${
              currencyMode === "inr"
                ? "bg-[#102C57] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            INR (₹) Only
          </button>
          <button
            type="button"
            onClick={() => setCurrencyMode("dual")}
            className={`rounded-xl px-3.5 py-2 transition cursor-pointer ${
              currencyMode === "dual"
                ? "bg-[#102C57] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Dual (₹ + {currencySymbol})
          </button>
        </div>
      </div>

      {/* 2. Step 1: Input Preferences Section */}
      <div className="mt-8 space-y-6">
        {/* Row A: Target Country + Degree Level */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Target Country */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              1. Destination Country
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-3.5 pointer-events-none z-10">
                <CountryFlag code={countrySlug} size="sm" />
              </div>
              <select
                id="calc-destination"
                aria-label="Target study destination"
                value={countrySlug}
                onChange={(e) => setCountrySlug(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 pl-11 pr-8 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:border-[#102C57] focus:bg-white focus:outline-none cursor-pointer transition"
              >
                {countriesList.map((c) => (
                  <option
                    key={c.id}
                    value={c.slug}
                    className="text-slate-900 bg-white"
                  >
                    {c.name} ({c.currency} ≈ ₹{c.exchangeRateToINR}) • {c.tier}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Degree Level */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              2. Program Level & Stream
            </label>
            <select
              aria-label="Degree Level"
              value={programLevel}
              onChange={(e) => setProgramLevel(e.target.value as ProgramLevel)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-xs sm:text-sm font-semibold text-slate-900 focus:border-[#102C57] focus:bg-white focus:outline-none cursor-pointer transition"
            >
              <option value="masters">Master&apos;s (MS, MSc, MA, MEng)</option>
              <option value="bachelors">Bachelor&apos;s (BS, BA, BEng)</option>
              <option value="emba">Executive MBA (EMBA)</option>
              <option value="mbbs">Medical Degree (MBBS / MD)</option>
              <option value="ausbildung">
                Ausbildung (Dual Vocational Training)
              </option>
              <option value="nursing">Nursing & Healthcare Diploma</option>
            </select>
          </div>
        </div>

        {/* Row B: 3-column Duration, City Tier, Accommodation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Duration */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              3. Course Duration
            </label>
            <div className="grid grid-cols-4 gap-1.5 rounded-2xl bg-slate-100 p-1 text-xs font-bold">
              {[1, 2, 3, 4].map((yrs) => (
                <button
                  key={yrs}
                  type="button"
                  onClick={() => setDurationYears(yrs)}
                  className={`rounded-xl py-2 transition cursor-pointer text-center ${
                    durationYears === yrs
                      ? "bg-[#102C57] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {yrs} {yrs === 1 ? "Year" : "Years"}
                </button>
              ))}
            </div>
          </div>

          {/* City Tier */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              4. Destination City Tier
            </label>
            <div className="grid grid-cols-3 gap-1 rounded-2xl bg-slate-100 p-1 text-xs font-bold">
              {[
                { key: "tier1", label: "Tier 1 (Metro)" },
                { key: "tier2", label: "Tier 2 (City)" },
                { key: "tier3", label: "Tier 3 (Town)" },
              ].map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setCityTier(t.key as CityTier)}
                  className={`rounded-xl py-2 transition cursor-pointer text-center text-[11px] sm:text-xs truncate px-1 ${
                    cityTier === t.key
                      ? "bg-[#102C57] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accommodation */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              5. Housing Preference
            </label>
            <div className="grid grid-cols-3 gap-1 rounded-2xl bg-slate-100 p-1 text-xs font-bold">
              {[
                { key: "shared", label: "Shared Flat" },
                { key: "hostel", label: "Univ Dorm" },
                { key: "studio", label: "Studio" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() =>
                    setAccommodation(item.key as typeof accommodation)
                  }
                  className={`rounded-xl py-2 transition cursor-pointer text-center text-[11px] sm:text-xs truncate px-1 ${
                    accommodation === item.key
                      ? "bg-[#102C57] text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row C: Part-Time Offset Toggle */}
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/60 p-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="parttime-calc"
              checked={includePartTimeOffset}
              onChange={(e) => setIncludePartTimeOffset(e.target.checked)}
              className="h-5 w-5 rounded accent-emerald-600 cursor-pointer shrink-0"
            />
            <label
              htmlFor="parttime-calc"
              className="cursor-pointer text-xs sm:text-sm font-medium text-slate-800"
            >
              Offset <strong>20 hrs/week legal part-time work earnings</strong>{" "}
              during semester terms (~{currencySymbol} {hourlyWageLocal}/hr
              minimum wage).
            </label>
          </div>
          <span className="hidden sm:inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 shrink-0">
            Save up to {formatCurrency(totalOffsetINR)}
          </span>
        </div>
      </div>

      {/* 3. Step 2: Full-Width Visual Financial Output Dashboard */}
      <div className="mt-8 rounded-2xl border border-slate-800 bg-gradient-to-br from-[#102C57] via-[#0c2345] to-[#08182f] text-white p-6 sm:p-8 shadow-xl">
        {/* Top Summary Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
              Total Estimated Net Budget ({durationYears}-Year Horizon)
            </span>
            <div className="mt-2 flex items-baseline flex-wrap gap-3">
              <div className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                {formatCurrency(netEstimatedBudgetINR)}
              </div>
              {currencyMode === "dual" && (
                <div className="rounded-xl bg-white/15 px-3 py-1 text-sm font-bold text-orange-300 border border-white/10">
                  ≈ {formatForeign(netEstimatedBudgetINR)} ({currencySymbol})
                </div>
              )}
            </div>
          </div>

          <div className="sm:text-right">
            <span className="inline-block rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-extrabold text-emerald-300 border border-emerald-500/30">
              {selectedCountry?.name || "Target Country"} • {durationYears} Year
              Total
            </span>
            <p className="mt-1.5 text-xs text-slate-300">
              Includes Tuition + Living + Setup Costs
            </p>
          </div>
        </div>

        {/* Visual Progress Distribution Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span>Financial Distribution:</span>
            <span>
              Tuition {tuitionPct}% • Living {livingPct}% • Setup {setupPct}%
            </span>
          </div>
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
            <div
              style={{ width: `${tuitionPct}%` }}
              className="bg-[#EA5C2B]"
              title="Tuition"
            />
            <div
              style={{ width: `${livingPct}%` }}
              className="bg-blue-400"
              title="Living"
            />
            <div
              style={{ width: `${setupPct}%` }}
              className="bg-purple-400"
              title="Setup"
            />
          </div>
        </div>

        {/* 4 Itemized Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Card 1: Tuition */}
          <div className="rounded-xl bg-white/5 p-3.5 border border-white/10">
            <div className="flex items-center gap-2 text-slate-300 mb-1.5 font-medium">
              <GraduationCap className="h-4 w-4 text-[#EA5C2B]" />
              <span>Total Tuition</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white">
              {formatCurrency(totalTuitionINR)}
            </div>
            {currencyMode === "dual" && (
              <span className="text-[11px] text-slate-400 font-normal">
                {formatForeign(totalTuitionINR)}
              </span>
            )}
          </div>

          {/* Card 2: Living */}
          <div className="rounded-xl bg-white/5 p-3.5 border border-white/10">
            <div className="flex items-center gap-2 text-slate-300 mb-1.5 font-medium">
              <Building className="h-4 w-4 text-blue-400" />
              <span>Living & Rent</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white">
              {formatCurrency(totalLivingINR)}
            </div>
            {currencyMode === "dual" && (
              <span className="text-[11px] text-slate-400 font-normal">
                {formatForeign(totalLivingINR)}
              </span>
            )}
          </div>

          {/* Card 3: One-Time */}
          <div className="rounded-xl bg-white/5 p-3.5 border border-white/10">
            <div className="flex items-center gap-2 text-slate-300 mb-1.5 font-medium">
              <Plane className="h-4 w-4 text-purple-400" />
              <span>Setup & Visa</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-white">
              {formatCurrency(totalOneTimeINR)}
            </div>
            <span className="text-[11px] text-slate-400 font-normal">
              Flights & deposits
            </span>
          </div>

          {/* Card 4: Part-Time Offset */}
          <div className="rounded-xl bg-emerald-500/10 p-3.5 border border-emerald-500/20">
            <div className="flex items-center gap-2 text-emerald-300 mb-1.5 font-medium">
              <Coins className="h-4 w-4" />
              <span>Part-time Savings</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-emerald-300">
              {includePartTimeOffset
                ? `- ${formatCurrency(totalOffsetINR)}`
                : "₹0 (Disabled)"}
            </div>
            <span className="text-[11px] text-emerald-400 font-normal">
              20 hrs/week offset
            </span>
          </div>
        </div>

        {/* Footer Actions & Exchange Rate */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <Info className="h-3.5 w-3.5 text-[#EA5C2B] shrink-0" />
            <span>
              Real-time exchange rate: 1 {currencySymbol} ≈ ₹{exchangeRate}.
              Includes health insurance & blocked account guidelines.
            </span>
          </div>

          <button
            onClick={() =>
              handleLead(
                `${selectedCountry?.name || countrySlug} - ${programLevel.toUpperCase()} Budget (${formatCurrency(netEstimatedBudgetINR)})`,
              )
            }
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-[#EA5C2B] py-3.5 px-6 text-xs sm:text-sm font-bold text-white shadow-lg transition hover:bg-[#d94f20] active:scale-98 cursor-pointer shrink-0"
          >
            <Banknote className="h-4 w-4" />
            <span>
              Get Scholarship & Loan Evaluation for{" "}
              {selectedCountry?.name || "Country"} →
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
