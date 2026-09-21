import { Suspense } from "react";
import { ArrowRight, Clock, Banknote, ShieldCheck } from "lucide-react";
import { CountryGridTabs } from "./CountryGridTabs";
import { LeadTriggerButton } from "@/components/home/HomeClientContext";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { CountryCardsSkeleton } from "./HomeSkeletons";
import { SectionError } from "@/components/ui/SectionError";
import { SectionEmpty } from "@/components/ui/SectionEmpty";
import { fetchCountriesFromBackend } from "@/lib/data/liveContent";

const ANCHOR_SIX_SLUGS = ["usa", "uk", "canada", "australia", "germany", "ireland"];

/**
 * Async cards. Suspended by the shell below, so the section heading
 * and tabs paint immediately while destinations stream in from Supabase.
 */
async function CountryCards() {
  let countries;
  try {
    countries = await fetchCountriesFromBackend();
  } catch (err) {
    console.error("CountryGrid backend fetch failed:", err);
    return (
      <div className="mt-10">
        <SectionError
          title="Couldn't load destinations"
          message="We couldn't reach the server to fetch study destinations."
        />
      </div>
    );
  }

  if (countries.length === 0) {
    return (
      <div className="mt-10">
        <SectionEmpty
          title="No destinations available"
          message="No active study destinations are published right now. Please check back soon."
        />
      </div>
    );
  }

  return (
    <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {countries.map((country) => {
        const isAnchor = ANCHOR_SIX_SLUGS.includes(country.slug);
        return (
          <div
            key={country.id}
            id={`country-${country.slug}`}
            data-country-tier={country.tier}
            data-is-anchor={isAnchor ? "true" : "false"}
            style={isAnchor ? undefined : { display: "none" }}
            className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl"
          >
            <div>
              {/* Header with Flag and Tier */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CountryFlag countryCode={country.code} countryName={country.name} size="lg" />
                  <div>
                    <h3 className="text-lg font-black text-[#102C57] transition group-hover:text-[#EA5C2B]">
                      {country.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {country.code} • {country.tier}
                    </span>
                  </div>
                </div>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-700">
                  {country.safetyRating} ★ Safety
                </span>
              </div>

              <p className="mt-3.5 text-xs leading-relaxed text-slate-600">
                {country.heroTagline}
              </p>

              {/* Key Metrics */}
              <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-xs">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Banknote className="h-3.5 w-3.5 text-[#EA5C2B]" />
                    Avg. Tuition:
                  </span>
                  <span className="font-bold text-[#102C57]">{country.avgTuitionINR}</span>
                </div>

                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Clock className="h-3.5 w-3.5 text-[#EA5C2B]" />
                    Work Visa (PSW):
                  </span>
                  <span className="font-semibold text-emerald-700">{country.postStudyWorkVisa}</span>
                </div>

                <div className="flex items-center justify-between text-slate-700">
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#EA5C2B]" />
                    Top Intakes:
                  </span>
                  <span className="text-slate-700">{country.topIntakes.join(", ")}</span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-[11px] font-medium text-slate-400">
                {country.currency} ({country.currencySymbol}) ≈ ₹{country.exchangeRateToINR}
              </span>
              <LeadTriggerButton
                country={country.name}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#102C57] transition hover:text-[#EA5C2B]"
              >
                Apply / Inquire
                <ArrowRight className="h-3.5 w-3.5" />
              </LeadTriggerButton>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function CountryGrid() {
  return (
    <section className="cv-auto py-16 sm:py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#EA5C2B]/10 px-3 py-1 text-xs font-bold text-[#EA5C2B]">
              Primary Destinations
            </div>
            <h2 className="mt-2.5 font-serif text-3xl font-extrabold tracking-tight text-[#102C57] sm:text-4xl">
              Anchor Destinations & 19 Launch Countries
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl">
              Explore the Anchor Six premier study hubs alongside high-ROI European and accredited medical destinations.
            </p>
          </div>

          {/* Tier / Anchor Filter Tabs Client Component */}
          <CountryGridTabs />
        </div>

        {/* Countries Grid */}
        <Suspense fallback={<CountryCardsSkeleton />}>
          <CountryCards />
        </Suspense>
      </div>
    </section>
  );
}
