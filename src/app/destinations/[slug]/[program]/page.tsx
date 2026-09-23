import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  ChevronRight,
  CheckCircle2,
  Award,
  Calendar,
  DollarSign,
  Briefcase,
  GraduationCap,
} from "lucide-react";
import {
  fetchLiveCountries,
  fetchLivePrograms,
  fetchLiveUniversities,
  getLiveCountryBySlug,
  getLiveProgramBySlug,
} from "@/lib/supabase/dataFetchers";
import { fitMetaDescription } from "@/lib/seo/metaUtils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CountryInquiryForm } from "@/components/country/CountryInquiryForm";
import { CountryFlag } from "@/components/ui/CountryFlag";

interface Props {
  params: Promise<{ slug: string; program: string }>;
}

const PHASE_1_L3_COMBINATIONS = [
  { slug: "uk", program: "masters", alias: "ms", seoPriority: 0.9 },
  { slug: "uk", program: "mba", alias: "mba", seoPriority: 0.85 },
  { slug: "uk", program: "executive-mba", alias: "emba", seoPriority: 0.8 },
  { slug: "uk", program: "nursing", alias: "nursing", seoPriority: 0.85 },
  { slug: "usa", program: "masters", alias: "ms", seoPriority: 0.9 },
  { slug: "usa", program: "mba", alias: "mba", seoPriority: 0.85 },
  { slug: "usa", program: "executive-mba", alias: "emba", seoPriority: 0.8 },
  { slug: "germany", program: "masters", alias: "ms", seoPriority: 0.9 },
  {
    slug: "germany",
    program: "ausbildung",
    alias: "ausbildung",
    seoPriority: 0.85,
  },
  { slug: "canada", program: "masters", alias: "ms", seoPriority: 0.85 },
  { slug: "russia", program: "mbbs", alias: "mbbs", seoPriority: 0.9 },
  { slug: "georgia", program: "mbbs", alias: "mbbs", seoPriority: 0.9 },
];

export async function generateStaticParams() {
  const [countries, programs] = await Promise.all([
    fetchLiveCountries(),
    fetchLivePrograms(),
  ]);

  const paramSet = new Set<string>();
  const params: { slug: string; program: string }[] = [];

  const addParam = (slug: string, program: string) => {
    const key = `${slug.toLowerCase()}___${program.toLowerCase()}`;
    if (!paramSet.has(key)) {
      paramSet.add(key);
      params.push({ slug: slug.toLowerCase(), program: program.toLowerCase() });
    }
  };

  // 1. Explicit Phase 1 Launch Combinations (Canonical & Aliases)
  for (const item of PHASE_1_L3_COMBINATIONS) {
    addParam(item.slug, item.program);
    if (item.alias) {
      addParam(item.slug, item.alias);
    }
  }

  // 2. All 19 Destinations Popular Programs Matrix
  for (const c of countries) {
    for (const p of c.popularPrograms || []) {
      addParam(c.slug, p);
      if (p === "ms") addParam(c.slug, "masters");
      if (p === "emba") addParam(c.slug, "executive-mba");
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, program } = await params;
  const [country, prog] = await Promise.all([
    getLiveCountryBySlug(slug || ""),
    getLiveProgramBySlug(program || ""),
  ]);

  if (!country || !prog) return { title: "Program Not Found" };

  const canonicalProgramSlug =
    program.toLowerCase() === "masters"
      ? "masters"
      : program.toLowerCase() === "executive-mba"
        ? "executive-mba"
        : prog.slug;

  const rawDescription = `Complete admissions guide for ${prog.name} in ${country.name}. Tuition ranges (${country.avgTuitionINR}), post-study work visa (${country.postStudyWorkVisa}), eligibility, and Indian student intake deadlines.`;

  return {
    title: `${prog.name} in ${country.name} for Indian Students (2026-2027) | Top Universities & Fees`,
    description: fitMetaDescription(rawDescription),
    alternates: {
      canonical: `/study-in-${country.slug}/${canonicalProgramSlug}`,
    },
    openGraph: {
      title: `${prog.name} in ${country.name} (2026-2027) — Study Abroad Vista`,
      description: fitMetaDescription(rawDescription),
      url: `/study-in-${country.slug}/${canonicalProgramSlug}`,
      type: "website",
    },
  };
}

export default async function CountryProgramPage({ params }: Props) {
  const { slug, program } = await params;
  const [country, prog, liveUniversities] = await Promise.all([
    getLiveCountryBySlug(slug || ""),
    getLiveProgramBySlug(program || ""),
    fetchLiveUniversities(),
  ]);

  if (!country || !prog) {
    notFound();
  }

  const relevantUniversities = liveUniversities.filter(
    (u) =>
      u.countrySlug === country.slug &&
      (u.programsOffered || []).includes(prog.slug as any),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${prog.name} in ${country.name}`,
    description: `Study ${prog.name} in ${country.name}. Check top universities, tuition fees in INR, entrance requirements, and post-study work visa rights for Indian applicants.`,
    provider: {
      "@type": "EducationalOrganization",
      name: "StudyAbroad Vista",
      url: "https://studyabroadvista.com",
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "Full-time",
      courseWorkload: prog.duration,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://studyabroadvista.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `Study in ${country.name}`,
        item: `https://studyabroadvista.com/study-in-${country.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `${prog.name} in ${country.name}`,
        item: `https://studyabroadvista.com/study-in-${country.slug}/${prog.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <Header />

      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <main className="flex-1 pb-16">
        {/* Breadcrumb Navigation */}
        <div className="border-b border-slate-200/80 bg-white py-2.5">
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-8 text-xs font-semibold text-slate-500">
            <Link href="/" className="hover:text-[#102C57]">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <Link
              href={`/study-in-${country.slug}`}
              className="hover:text-[#102C57]"
            >
              {country.name}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[#102C57] font-bold">{prog.name}</span>
          </div>
        </div>

        {/* Hero Conversion Header */}
        <section className="bg-gradient-to-b from-[#102C57] to-[#091A36] text-white py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-semibold">
              <CountryFlag code={country.code} name={country.name} size="sm" />
              <span>{prog.level} Track</span>
            </div>

            <h1 className="mt-4 font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight">
              {prog.name} in {country.name} for Indian Students
            </h1>

            <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Discover top universities offering {prog.name} in {country.name},
              realistic tuition costs in INR, eligibility criteria, and
              post-study work authorization.
            </p>

            {/* Program Quick Specs */}
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 max-w-4xl">
              <div className="rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md">
                <span className="text-[10px] uppercase font-bold text-slate-300">
                  Typical Duration
                </span>
                <span className="mt-1 block text-sm font-bold text-white">
                  {prog.duration}
                </span>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md">
                <span className="text-[10px] uppercase font-bold text-slate-300">
                  Est. Tuition
                </span>
                <span className="mt-1 block text-sm font-bold text-white">
                  {country.avgTuitionINR}
                </span>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md">
                <span className="text-[10px] uppercase font-bold text-slate-300">
                  Post-Study Visa
                </span>
                <span className="mt-1 block text-sm font-bold text-[#EA5C2B]">
                  {country.postStudyWorkVisa}
                </span>
              </div>
              <div className="rounded-xl border border-white/15 bg-white/10 p-3.5 backdrop-blur-md">
                <span className="text-[10px] uppercase font-bold text-slate-300">
                  ROI Score
                </span>
                <span className="mt-1 block text-sm font-bold text-emerald-400">
                  {prog.roiScore}/100
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Content Layout */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-8">
              {/* Specialization Areas */}
              <section className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
                <h2 className="text-xl font-bold text-slate-900">
                  High-Demand Specializations
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Popular tracks Indian students pursue in {country.name}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(prog.keyFields || []).map((field: string, i: number) => (
                    <span
                      key={i}
                      className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700"
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </section>

              {/* Universities Offering this Program */}
              <section className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
                <h2 className="text-xl font-bold text-slate-900">
                  Universities in {country.name} Offering {prog.name}
                </h2>
                <div className="mt-6 space-y-4">
                  {relevantUniversities.length > 0 ? (
                    relevantUniversities.map((uni) => (
                      <div
                        key={uni.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-slate-200 p-4 hover:border-[#102C57] transition"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">
                              {uni.name}
                            </span>
                            <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                              QS #{uni.rankingGlobal}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">
                            {uni.city}, {country.name} • Intakes:{" "}
                            {uni.intakes.join(", ")}
                          </p>
                        </div>
                        <div className="mt-3 sm:mt-0 flex items-center gap-3">
                          <span className="text-xs font-semibold text-slate-700">
                            {uni.tuitionFeeRangeINR}
                          </span>
                          <Link
                            href={`/universities/${uni.slug}`}
                            className="rounded-lg bg-[#102C57] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#0c2242]"
                          >
                            Apply
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl bg-slate-50 p-6 text-center text-xs text-slate-500">
                      All state and accredited universities in {country.name}{" "}
                      offer recognized {prog.name} curricula for international
                      applicants.
                    </div>
                  )}
                </div>
              </section>

              {/* Admission Requirements */}
              <section className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
                <h2 className="text-xl font-bold text-slate-900">
                  General Entry Requirements for Indian Students
                </h2>
                <div className="mt-4 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Academic Background:</strong> Minimum 60%–70% in
                      previous qualification (Bachelor&apos;s for MS/MBA, 12th
                      for UG/MBBS).
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Language Proficiency:</strong> IELTS 6.5+ or TOEFL
                      85+ (Waivers available for select universities with 70%+
                      in 12th English).
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Standardized Tests:</strong> GRE/GMAT optional for
                      many programs, recommended for scholarship consideration.
                    </span>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Rail Lead Form */}
            <div className="lg:col-span-4">
              <CountryInquiryForm
                countryName={country.name}
                countrySlug={country.slug}
                availablePrograms={[
                  { id: prog.id, slug: prog.slug, name: prog.name },
                ]}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
