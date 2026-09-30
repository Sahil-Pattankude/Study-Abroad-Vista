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
import { PeacockEye } from "@/components/ui/BrandSignatures";

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

  // Selected country object
  const selectedCountry = countriesList.find((c) => c.slug === countrySlug);
  const exchangeRate = selectedCountry?.exchangeRateToINR || 90;
  const currencySymbol = selectedCountry?.currencySymbol || "€";

  // Base tuition estimates by country and program level
  const getBaseTuitionINR = (): number => {
    if (countrySlug === "germany") {
      if (programLevel === "ausbildung") return 0;
      if (programLevel === "masters") return 150000;
      if (programLevel === "bachelors") return 100000;
      if (programLevel === "emba") return 1200000;
      return 300000;
    }
    if (countrySlug === "usa") {
      if (programLevel === "masters") return 2400000;
      if (programLevel === "bachelors") return 2800000;
      if (programLevel === "emba") return 4500000;
      if (programLevel === "mbbs") return 3500000;
      return 1800000;
    }
    if (countrySlug === "uk") {
      if (programLevel === "masters") return 1800000;
      if (programLevel === "bachelors") return 1900000;
      if (programLevel === "emba") return 3200000;
      if (programLevel === "mbbs") return 2800000;
      return 1400000;
    }
    if (countrySlug === "canada") {
      if (programLevel === "masters") return 1500000;
      if (programLevel === "bachelors") return 1700000;
      if (programLevel === "emba") return 2600000;
      return 1300000;
    }
    if (countrySlug === "australia") {
      if (programLevel === "masters") return 1900000;
      if (programLevel === "bachelors") return 2000000;
      if (programLevel === "emba") return 3400000;
      return 1500000;
    }
    if (countrySlug === "ireland") {
      if (programLevel === "masters") return 1400000;
      if (programLevel === "bachelors") return 1500000;
      if (programLevel === "emba") return 2200000;
      return 1200000;
    }
    // MBBS countries
    if (
      ["russia", "georgia", "kazakhstan", "uzbekistan", "philippines"].includes(
        countrySlug,
      )
    ) {
      return 350000;
    }
    return 800000;
  };

  // Base monthly living costs in local currency
  const getBaseMonthlyLivingLocal = (): number => {
    let base = 900;
    if (countrySlug === "germany") base = 934;
    else if (countrySlug === "usa") base = 1400;
    else if (countrySlug === "uk") base = 1200;
    else if (countrySlug === "canada") base = 1300;
    else if (countrySlug === "australia") base = 1600;
    else if (countrySlug === "ireland") base = 1100;
    else if (
      ["russia", "georgia", "kazakhstan", "uzbekistan", "philippines"].includes(
        countrySlug,
      )
    )
      base = 350;

    // City tier multiplier
    if (cityTier === "tier1") base *= 1.25;
    else if (cityTier === "tier3") base *= 0.85;

    // Housing multiplier
    if (accommodation === "hostel") base *= 0.85;
    else if (accommodation === "studio") base *= 1.35;

    return Math.round(base);
  };

  // 1. Annual Tuition in INR
  const annualTuitionINR = getBaseTuitionINR();

  // 2. Annual Living Costs in INR
  const monthlyLivingLocal = getBaseMonthlyLivingLocal();
  const annualLivingINR = monthlyLivingLocal * 12 * exchangeRate;

  // 3. One-Time Setup Costs
  const oneTimeSetupCostINR =
    countrySlug === "germany" ? 11208 * exchangeRate + 80000 : 220000;

  // 4. Part-time Work Offsets
  const hourlyWageLocal =
    countrySlug === "germany" ? 13.5 : countrySlug === "usa" ? 16 : 14;
  const annualPartTimeEarningsINR = includePartTimeOffset
    ? exchangeRate * hourlyWageLocal * 20 * 42
    : 0;

  // 5. Total Horizon Calculation
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
      } rounded-2xl border border-[#D9CFB8] bg-white p-4 sm:p-8 lg:p-10 shadow-xs transition-all`}
    >
      {/* 1. Header Bar with Currency Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D9CFB8]/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-[#F5EFE0] border border-[#D9CFB8] px-3.5 py-1 text-xs font-semibold text-[#1D5A6C]">
            <PeacockEye size={12} />
            <span>Interactive Cost & Living Estimator</span>
          </div>
          <h3 className="mt-2.5 font-display text-2xl sm:text-3xl font-normal tracking-tight text-[#103B47]">
            Study & Living Cost Breakdown
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
            Customize your degree, city tier, and housing to calculate total
            tuition, living costs, and part-time earnings in real time in{" "}
            <span className="font-mono text-[#103B47] font-medium">
              ₹ Lakhs
            </span>
            .
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center gap-1 self-start sm:self-center rounded-lg bg-[#F5EFE0] border border-[#D9CFB8] p-1 text-xs font-semibold shrink-0">
          <button
            type="button"
            onClick={() => setCurrencyMode("inr")}
            className={`rounded-md px-3.5 py-1.5 transition cursor-pointer font-mono ${
              currencyMode === "inr"
                ? "bg-[#1D5A6C] text-white shadow-xs font-bold"
                : "text-[#6B6B6B] hover:text-[#103B47]"
            }`}
          >
            INR (₹) Only
          </button>
          <button
            type="button"
            onClick={() => setCurrencyMode("dual")}
            className={`rounded-md px-3.5 py-1.5 transition cursor-pointer font-mono ${
              currencyMode === "dual"
                ? "bg-[#1D5A6C] text-white shadow-xs font-bold"
                : "text-[#6B6B6B] hover:text-[#103B47]"
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#103B47] mb-2 font-mono">
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
                className="w-full rounded-lg border border-[#D9CFB8] bg-[#FDFCF7] pl-11 pr-8 py-2.5 text-xs sm:text-sm font-semibold text-[#1A1A1A] focus:border-[#1D5A6C] focus:bg-white focus:outline-none cursor-pointer transition"
              >
                {countriesList.map((c) => (
                  <option
                    key={c.id}
                    value={c.slug}
                    className="text-slate-900 bg-white"
                  >
                    {c.name} ({c.currency} ≈ ₹{c.exchangeRateToINR}) · {c.tier}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Degree Level */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#103B47] mb-2 font-mono">
              2. Program Level & Stream
            </label>
            <select
              aria-label="Degree Level"
              value={programLevel}
              onChange={(e) => setProgramLevel(e.target.value as ProgramLevel)}
              className="w-full rounded-lg border border-[#D9CFB8] bg-[#FDFCF7] px-4 py-2.5 text-xs sm:text-sm font-semibold text-[#1A1A1A] focus:border-[#1D5A6C] focus:bg-white focus:outline-none cursor-pointer transition"
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
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#103B47] mb-2 font-mono">
              3. Course Duration
            </label>
            <div className="grid grid-cols-4 gap-1.5 rounded-lg bg-[#F5EFE0] p-1 text-xs font-semibold border border-[#D9CFB8]">
              {[1, 2, 3, 4].map((yrs) => (
                <button
                  key={yrs}
                  type="button"
                  onClick={() => setDurationYears(yrs)}
                  className={`rounded-md py-1.5 transition cursor-pointer text-center font-mono ${
                    durationYears === yrs
                      ? "bg-[#1D5A6C] text-white shadow-xs font-bold"
                      : "text-[#6B6B6B] hover:text-[#103B47]"
                  }`}
                >
                  {yrs} {yrs === 1 ? "Yr" : "Yrs"}
                </button>
              ))}
            </div>
          </div>

          {/* City Tier */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#103B47] mb-2 font-mono">
              4. City Tier
            </label>
            <div className="grid grid-cols-3 gap-1 rounded-lg bg-[#F5EFE0] p-1 text-xs font-semibold border border-[#D9CFB8]">
              {[
                { key: "tier1", label: "T1 (Metro)" },
                { key: "tier2", label: "T2 (City)" },
                { key: "tier3", label: "T3 (Town)" },
              ].map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setCityTier(t.key as CityTier)}
                  className={`rounded-md py-1.5 transition cursor-pointer text-center text-[11px] font-mono truncate px-1 ${
                    cityTier === t.key
                      ? "bg-[#1D5A6C] text-white shadow-xs font-bold"
                      : "text-[#6B6B6B] hover:text-[#103B47]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accommodation */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#103B47] mb-2 font-mono">
              5. Housing Preference
            </label>
            <div className="grid grid-cols-3 gap-1 rounded-lg bg-[#F5EFE0] p-1 text-xs font-semibold border border-[#D9CFB8]">
              {[
                { key: "shared", label: "Shared" },
                { key: "hostel", label: "Dorm" },
                { key: "studio", label: "Studio" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() =>
                    setAccommodation(item.key as typeof accommodation)
                  }
                  className={`rounded-md py-1.5 transition cursor-pointer text-center text-[11px] font-mono truncate px-1 ${
                    accommodation === item.key
                      ? "bg-[#1D5A6C] text-white shadow-xs font-bold"
                      : "text-[#6B6B6B] hover:text-[#103B47]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row C: Part-Time Offset Toggle */}
        <div className="flex items-center justify-between gap-4 rounded-xl border border-[#A8CDBD] bg-[#A8CDBD]/10 p-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="parttime-calc"
              checked={includePartTimeOffset}
              onChange={(e) => setIncludePartTimeOffset(e.target.checked)}
              className="h-4 w-4 rounded accent-[#1D5A6C] cursor-pointer shrink-0"
            />
            <label
              htmlFor="parttime-calc"
              className="cursor-pointer text-xs sm:text-sm font-medium text-[#103B47]"
            >
              Offset <strong>20 hrs/week legal part-time work earnings</strong>{" "}
              during semester terms (~{currencySymbol} {hourlyWageLocal}/hr
              minimum wage).
            </label>
          </div>
          <span className="hidden sm:inline-flex items-center rounded-md bg-[#A8CDBD]/20 border border-[#A8CDBD] px-3 py-1 text-xs font-mono font-semibold text-[#103B47] shrink-0">
            Save up to {formatCurrency(totalOffsetINR)}
          </span>
        </div>
      </div>

      {/* 3. Step 2: Full-Width Visual Financial Output Dashboard */}
      <div className="mt-8 rounded-2xl border border-[#1D5A6C] bg-[#103B47] text-[#FDFCF7] p-6 sm:p-8 shadow-md relative overflow-hidden">
        {/* Top Summary Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1D5A6C]/50 pb-6">
          <div>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#A8CDBD]">
              Total Estimated Net Budget ({durationYears}-Year Horizon)
            </span>
            <div className="mt-2 flex items-baseline flex-wrap gap-3">
              <div className="text-3xl sm:text-5xl font-mono font-bold text-[#EBC783] tracking-tight">
                {formatCurrency(netEstimatedBudgetINR)}
              </div>
              {currencyMode === "dual" && (
                <div className="rounded-md bg-white/10 px-3 py-1 text-sm font-mono font-semibold text-[#EBC783] border border-[#1D5A6C]">
                  ≈ {formatForeign(netEstimatedBudgetINR)} ({currencySymbol})
                </div>
              )}
            </div>
          </div>

          <div className="sm:text-right">
            <span className="inline-block rounded-md bg-[#1D5A6C]/60 border border-[#A8CDBD]/40 px-3.5 py-1 text-xs font-mono font-semibold text-[#A8CDBD]">
              {selectedCountry?.name || "Target Country"} · {durationYears} Year
              Total
            </span>
            <p className="mt-1.5 text-xs text-[#F5EFE0]/80">
              Includes Tuition + Living + Setup Costs
            </p>
          </div>
        </div>

        {/* Visual Progress Distribution Bar */}
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-xs font-mono text-[#A8CDBD]">
            <span>Financial Distribution:</span>
            <span>
              Tuition {tuitionPct}% · Living {livingPct}% · Setup {setupPct}%
            </span>
          </div>
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[#0B2830]">
            <div
              style={{ width: `${tuitionPct}%` }}
              className="bg-[#D89A3E]"
              title="Tuition"
            />
            <div
              style={{ width: `${livingPct}%` }}
              className="bg-[#A8CDBD]"
              title="Living"
            />
            <div
              style={{ width: `${setupPct}%` }}
              className="bg-[#7C6BAE]"
              title="Setup"
            />
          </div>
        </div>

        {/* 4 Itemized Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Card 1: Tuition */}
          <div className="rounded-xl bg-white/5 p-3.5 border border-[#1D5A6C]">
            <div className="flex items-center gap-2 text-[#A8CDBD] mb-1.5 font-medium">
              <GraduationCap className="h-4 w-4 text-[#D89A3E]" />
              <span>Total Tuition</span>
            </div>
            <div className="text-base sm:text-lg font-mono font-bold text-white">
              {formatCurrency(totalTuitionINR)}
            </div>
            {currencyMode === "dual" && (
              <span className="text-[11px] font-mono text-[#A8CDBD]">
                {formatForeign(totalTuitionINR)}
              </span>
            )}
          </div>

          {/* Card 2: Living */}
          <div className="rounded-xl bg-white/5 p-3.5 border border-[#1D5A6C]">
            <div className="flex items-center gap-2 text-[#A8CDBD] mb-1.5 font-medium">
              <Building className="h-4 w-4 text-[#A8CDBD]" />
              <span>Living & Rent</span>
            </div>
            <div className="text-base sm:text-lg font-mono font-bold text-white">
              {formatCurrency(totalLivingINR)}
            </div>
            {currencyMode === "dual" && (
              <span className="text-[11px] font-mono text-[#A8CDBD]">
                {formatForeign(totalLivingINR)}
              </span>
            )}
          </div>

          {/* Card 3: One-Time */}
          <div className="rounded-xl bg-white/5 p-3.5 border border-[#1D5A6C]">
            <div className="flex items-center gap-2 text-[#A8CDBD] mb-1.5 font-medium">
              <Plane className="h-4 w-4 text-[#7C6BAE]" />
              <span>Setup & Visa</span>
            </div>
            <div className="text-base sm:text-lg font-mono font-bold text-white">
              {formatCurrency(totalOneTimeINR)}
            </div>
            <span className="text-[11px] text-[#A8CDBD]">
              Flights & deposits
            </span>
          </div>

          {/* Card 4: Part-Time Offset */}
          <div className="rounded-xl bg-[#A8CDBD]/15 p-3.5 border border-[#A8CDBD]/30">
            <div className="flex items-center gap-2 text-[#A8CDBD] mb-1.5 font-medium">
              <Coins className="h-4 w-4" />
              <span>Part-time Savings</span>
            </div>
            <div className="text-base sm:text-lg font-mono font-bold text-[#EBC783]">
              {includePartTimeOffset
                ? `- ${formatCurrency(totalOffsetINR)}`
                : "₹0 (Disabled)"}
            </div>
            <span className="text-[11px] font-mono text-[#A8CDBD]">
              20 hrs/week offset
            </span>
          </div>
        </div>

        {/* Footer Actions & Exchange Rate */}
        <div className="mt-6 pt-5 border-t border-[#1D5A6C]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[11px] text-[#A8CDBD]">
            <Info className="h-3.5 w-3.5 text-[#D89A3E] shrink-0" />
            <span className="font-mono">
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
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-md bg-[#D89A3E] py-3 px-6 text-xs sm:text-sm font-semibold text-[#103B47] shadow-sm transition hover:bg-[#c4872d] cursor-pointer shrink-0"
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
