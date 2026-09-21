import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Building2,
  ArrowRight,
  Plane,
  Coins,
} from "lucide-react";
import {
  COUNTRIES,
  PROGRAMS,
  FEATURED_UNIVERSITIES,
  COUNTRY_ALIASES,
  getCountryBySlug,
} from "@/lib/data/masterData";
import { fitMetaDescription } from "@/lib/seo/metaUtils";
import { getCountryEditorial } from "@/lib/data/contentData";
import { getPillarGuideByCountry } from "@/lib/sanity/fetchers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CountryInquiryForm } from "@/components/country/CountryInquiryForm";
import { CountryFlag } from "@/components/ui/CountryFlag";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const canonicalParams = COUNTRIES.map((c) => ({
    slug: c.slug,
  }));
  const aliasParams = Object.keys(COUNTRY_ALIASES).map((alias) => ({
    slug: alias,
  }));
  return [...canonicalParams, ...aliasParams];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const country = getCountryBySlug(slug || "");
  if (!country) return { title: "Country Not Found" };

  const rawDescription = `Complete guide to studying in ${country.name} for Indian students. Compare tuition fees in INR (${country.avgTuitionINR}), post-study work visa (${country.postStudyWorkVisa}), top universities, and scholarships.`;

  return {
    title: `Study in ${country.name} for Indian Students (2026-2027) | Cost, Visas & Top Universities`,
    description: fitMetaDescription(rawDescription),
    alternates: {
      canonical: `/study-in-${country.slug}`,
    },
  };
}

export default async function CountryHubPage({ params }: Props) {
  const resolvedParams = await params;
  let rawSlug = resolvedParams?.slug || "";
  if (rawSlug.startsWith("study-in-")) {
    rawSlug = rawSlug.replace("study-in-", "");
  }
  const country = getCountryBySlug(rawSlug);

  if (!country) {
    notFound();
  }

  const baseEditorial = getCountryEditorial(country.slug);
  const sanityGuide = await getPillarGuideByCountry(country.slug);
  const editorial = baseEditorial
    ? {
        ...baseEditorial,
        heroSubtitle: sanityGuide?.heroSubtitle || baseEditorial.heroSubtitle,
        overviewParagraphs: sanityGuide?.overview
          ? [sanityGuide.overview]
          : baseEditorial.overviewParagraphs,
        faqs:
          sanityGuide?.faqs && sanityGuide.faqs.length > 0
            ? sanityGuide.faqs
            : baseEditorial.faqs,
      }
    : null;
  const universitiesInCountry = FEATURED_UNIVERSITIES.filter(
    (u) => u.countrySlug === country.slug,
  );

  const popularProgs = Array.isArray(country.popularPrograms)
    ? country.popularPrograms
    : ["ms", "mba"];
  const availablePrograms = PROGRAMS.filter((p) =>
    popularProgs.includes(p.slug),
  );

  const topIntakesList = Array.isArray(country.topIntakes)
    ? country.topIntakes
    : ["Fall", "Spring"];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <Header />

      <main className="flex-1 pb-16">
        {/* Breadcrumbs */}
        <div className="border-b border-slate-200/80 bg-white py-2.5 px-4 sm:px-8">
          <div className="mx-auto flex max-w-7xl items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href="/" className="hover:text-[#102C57]">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-400">Destinations</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[#102C57] font-bold">{country.name}</span>
          </div>
        </div>

        {/* 1. Hero with Quick Stats (W10 Template T-02) */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#102C57] to-[#091A36] text-white py-12 sm:py-16">
          <div className="pointer-events-none absolute -top-24 left-1/2 -z-0 h-96 w-96 -translate-x-1/2 rounded-full bg-[#EA5C2B]/20 blur-3xl" />
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-semibold backdrop-blur-md">
              <CountryFlag
                countryCode={country.code}
                countryName={country.name}
                size="sm"
              />
              <span>Destination Guide • {country.tier}</span>
            </div>

            <h1 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              Study in {country.name} for Indian Students (2026–2027)
            </h1>

            <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              {editorial?.heroSubtitle || country.heroTagline}
            </p>

            {/* Quick Stats Grid */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              <div className="rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-300">
                  Avg Tuition
                </span>
                <span className="mt-1 block text-sm sm:text-base font-black text-white">
                  {country.avgTuitionINR}
                </span>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-300">
                  Living Costs
                </span>
                <span className="mt-1 block text-sm sm:text-base font-black text-white">
                  {country.avgLivingCostINR}
                </span>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-300">
                  Post-Study Visa
                </span>
                <span className="mt-1 block text-sm sm:text-base font-black text-[#EA5C2B]">
                  {country.postStudyWorkVisa}
                </span>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-300">
                  Top Intakes
                </span>
                <span className="mt-1 block text-xs sm:text-sm font-bold text-white">
                  {topIntakesList.join(", ")}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2-Column Main Content + Sticky Lead Form */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Left Content Area (8 Cols) */}
            <div className="lg:col-span-8 space-y-12">
              {/* 2. Overview & Why Choose */}
              <section className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
                  {editorial?.overviewHeading || `Why Choose ${country.name}?`}
                </h2>
                <div className="mt-4 space-y-3 text-sm text-slate-600 leading-relaxed">
                  {editorial ? (
                    editorial.overviewParagraphs.map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))
                  ) : (
                    <p>{country.overview}</p>
                  )}
                </div>

                {editorial && (
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {editorial.whyChooseReasons.map((r, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4"
                      >
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 mb-2" />
                        <h4 className="text-xs font-bold text-emerald-900">
                          {r.title}
                        </h4>
                        <p className="mt-1 text-[11px] text-slate-600 leading-snug">
                          {r.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {editorial && editorial.tradeoffsToKnow.length > 0 && (
                  <div className="mt-6 rounded-xl border border-amber-200/80 bg-amber-50/60 p-4">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-900 mb-2">
                      <AlertCircle className="h-4 w-4 text-[#EA5C2B]" />
                      <span>
                        Important Trade-Offs & Requirements to Know Upfront
                      </span>
                    </div>
                    <div className="space-y-2 text-[11px] text-slate-700">
                      {editorial.tradeoffsToKnow.map((t, idx) => (
                        <p key={idx}>
                          <strong>{t.title}:</strong> {t.desc}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* 3. Programs in Country */}
              <section className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Available Programs in {country.name}
                    </h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Explore eligible study tracks with Indian qualifications
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#EA5C2B] bg-orange-50 px-2.5 py-1 rounded-lg">
                    {availablePrograms.length} Core Streams
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {availablePrograms.map((prog) => (
                    <Link
                      key={prog.id}
                      href={`/destinations/${country.slug}/${prog.slug}`}
                      className="group flex flex-col justify-between rounded-xl border border-slate-200 p-4 transition-all hover:border-[#102C57] hover:shadow-md bg-white"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-[#EA5C2B] transition-colors">
                            {prog.name}
                          </span>
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                            {prog.duration}
                          </span>
                        </div>
                        <p className="mt-1.5 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                          {prog.summary}
                        </p>
                      </div>
                      <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-[#102C57] group-hover:translate-x-1 transition-transform">
                        <span>View universities & requirements</span>
                        <ArrowRight className="h-3 w-3 text-[#EA5C2B]" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* 4. Cost Breakdown Table */}
              <section className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="h-5 w-5 text-[#EA5C2B]" />
                  <h2 className="text-xl font-bold text-slate-900">
                    Cost of Studying in {country.name} (INR Estimates)
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mb-6">
                  Based on current currency exchange rates ({country.currency} 1
                  ≈ ₹{country.exchangeRateToINR})
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 bg-slate-50/50">
                        <th className="py-2.5 px-3">Program Track</th>
                        <th className="py-2.5 px-3">Tuition / Year</th>
                        <th className="py-2.5 px-3">Living Costs</th>
                        <th className="py-2.5 px-3">Total Annual</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {editorial?.costBreakdown ? (
                        editorial.costBreakdown.map((c, i) => (
                          <tr
                            key={i}
                            className="hover:bg-slate-50/50 transition"
                          >
                            <td className="py-3 px-3 font-bold text-slate-800">
                              {c.programType}
                            </td>
                            <td className="py-3 px-3 text-slate-600">
                              {c.tuitionRangeINR}
                            </td>
                            <td className="py-3 px-3 text-slate-600">
                              {c.livingCostINR}
                            </td>
                            <td className="py-3 px-3 font-bold text-[#102C57]">
                              {c.totalAnnualINR}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td className="py-3 px-3 font-bold text-slate-800">
                            General Degree Average
                          </td>
                          <td className="py-3 px-3">{country.avgTuitionINR}</td>
                          <td className="py-3 px-3">
                            {country.avgLivingCostINR}
                          </td>
                          <td className="py-3 px-3 font-bold text-[#102C57]">
                            ₹25 - 45 Lakhs
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {editorial?.hiddenCosts && (
                  <div className="mt-6 pt-6 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900 mb-2.5">
                      Other Mandatory Incidental Costs:
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      {editorial.hiddenCosts.map((h, i) => (
                        <div
                          key={i}
                          className="rounded-lg bg-slate-50 p-2.5 border border-slate-100"
                        >
                          <span className="block text-slate-500">{h.item}</span>
                          <span className="font-bold text-slate-800">
                            {h.costINR}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* 5. Top Universities */}
              <section className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Featured Universities in {country.name}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Institutions actively recruiting Indian candidates
                    </p>
                  </div>
                </div>

                {universitiesInCountry.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {universitiesInCountry.map((uni) => (
                      <Link
                        key={uni.id}
                        href={`/universities/${uni.slug}`}
                        className="group rounded-xl border border-slate-200 p-4 transition hover:border-[#102C57] hover:shadow-md bg-white"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#102C57]/5 text-[#102C57]">
                            <Building2 className="h-5 w-5 text-[#EA5C2B]" />
                          </div>
                          <span className="rounded-md bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
                            QS #{uni.rankingGlobal}
                          </span>
                        </div>
                        <h3 className="mt-3 text-sm font-bold text-slate-900 group-hover:text-[#EA5C2B] transition">
                          {uni.name}
                        </h3>
                        <span className="text-xs text-slate-500">
                          {uni.city}, {country.name}
                        </span>
                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-medium">
                            {uni.tuitionFeeRangeINR}
                          </span>
                          <span className="font-bold text-[#102C57]">
                            View Profile →
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-500">
                    Showing all institutional programs matching {country.name}{" "}
                    curriculum standards.
                  </div>
                )}
              </section>

              {/* 6. Visa & Post-Study Work */}
              <section className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <Plane className="h-5 w-5 text-[#EA5C2B]" />
                  <h2 className="text-xl font-bold text-slate-900">
                    Student Visa & Post-Study Work Rights
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Visa Classification
                    </span>
                    <p className="mt-1 font-bold text-slate-800">
                      {editorial?.visaDetails.visaType ||
                        `${country.name} Student Visa`}
                    </p>
                    <span className="mt-2 block text-[10px] font-bold uppercase text-slate-400">
                      Processing Time
                    </span>
                    <p className="mt-1 font-medium text-slate-700">
                      {editorial?.visaDetails.processingTime || "4 to 6 weeks"}
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4 border border-slate-100">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Part-Time Work Limit
                    </span>
                    <p className="mt-1 font-bold text-slate-800">
                      {editorial?.visaDetails.workHoursDuringTerm ||
                        "20 hours / week during terms"}
                    </p>
                    <span className="mt-2 block text-[10px] font-bold uppercase text-slate-400">
                      Post-Study Work (PSW)
                    </span>
                    <p className="mt-1 font-black text-[#EA5C2B]">
                      {editorial?.visaDetails.postStudyWorkDuration ||
                        country.postStudyWorkVisa}
                    </p>
                  </div>
                </div>

                {editorial?.visaDetails.prPathwaySummary && (
                  <div className="mt-4 rounded-xl bg-indigo-50/60 p-4 border border-indigo-100 text-xs">
                    <span className="font-bold text-indigo-950">
                      Permanent Residency (PR) & Settlement Outlook:
                    </span>
                    <p className="mt-1 text-slate-600 leading-relaxed">
                      {editorial.visaDetails.prPathwaySummary}
                    </p>
                  </div>
                )}
              </section>

              {/* 7. FAQs */}
              {editorial?.faqs && editorial.faqs.length > 0 && (
                <section className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center gap-2 mb-6">
                    <HelpCircle className="h-5 w-5 text-[#EA5C2B]" />
                    <h2 className="text-xl font-bold text-slate-900">
                      Frequently Asked Questions ({country.name})
                    </h2>
                  </div>

                  <div className="space-y-3.5">
                    {editorial.faqs.map((faq, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-slate-100 bg-slate-50/60 p-4"
                      >
                        <h4 className="text-xs font-bold text-slate-900">
                          {faq.question}
                        </h4>
                        <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Sticky Rail: Interactive Lead Capture Widget */}
            <div className="lg:col-span-4">
              <CountryInquiryForm
                countryName={country.name}
                countrySlug={country.slug}
                availablePrograms={availablePrograms}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
