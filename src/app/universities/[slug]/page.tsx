import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  Building2,
  MapPin,
  Award,
  ChevronRight,
  CheckCircle2,
  Coins,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { PROGRAMS } from "@/lib/data/masterData";
import {
  fetchLiveUniversities,
  fetchLiveCountries,
} from "@/lib/supabase/dataFetchers";
import { fitMetaDescription } from "@/lib/seo/metaUtils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { UniversityInquiryForm } from "@/components/university/UniversityInquiryForm";
import { UniversityActions } from "@/components/university/UniversityActions";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const unis = await fetchLiveUniversities();
  return unis.map((u) => ({
    slug: u.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const unis = await fetchLiveUniversities();
  const uni = unis.find((u) => u.slug === slug);
  if (!uni) return { title: "University Not Found" };

  const rawDescription = `Admissions guide for ${uni.name} in ${uni.city}, ${uni.country}. Global QS rank #${uni.rankingGlobal}, tuition fees (${uni.tuitionFeeRangeINR}), IELTS score cutoffs, and Indian student application deadlines.`;

  return {
    title: `${uni.name} Admission for Indian Students (2026-2027) | Fees, Eligibility & Rankings`,
    description: fitMetaDescription(rawDescription),
    alternates: {
      canonical: `/universities/${uni.slug}`,
    },
  };
}

export default async function UniversityDetailPage({ params }: Props) {
  const { slug } = await params;
  const [unis, countries] = await Promise.all([
    fetchLiveUniversities(),
    fetchLiveCountries(),
  ]);
  const uni = unis.find((u) => u.slug === slug);

  if (!uni) {
    notFound();
  }

  const country = countries.find((c) => c.slug === uni.countrySlug);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <Header />

      <main className="flex-1 pb-16">
        {/* Breadcrumb */}
        <div className="border-b border-slate-200/80 bg-white py-2.5 px-4 sm:px-8">
          <div className="mx-auto flex max-w-7xl items-center gap-2 text-xs font-semibold text-slate-500">
            <Link href="/" className="hover:text-[#102C57]">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <Link
              href={`/study-in-${uni.countrySlug}`}
              className="hover:text-[#102C57]"
            >
              {uni.country}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[#102C57] font-bold">{uni.name}</span>
          </div>
        </div>

        {/* University Header Hero */}
        <section className="bg-white border-b border-slate-200 py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#102C57] text-white shadow-md shrink-0">
                  <Building2 className="h-8 w-8 text-[#EA5C2B]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-800 border border-amber-200">
                      QS World Rank #{uni.rankingGlobal}
                    </span>
                    <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                      National #{uni.rankingNational}
                    </span>
                  </div>
                  <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900">
                    {uni.name}
                  </h1>
                  <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-[#EA5C2B]" />
                    {uni.city}, {uni.country}
                  </p>
                </div>
              </div>

              <UniversityActions
                universityId={uni.id}
                universitySlug={uni.slug}
                universityName={uni.name}
                countrySlug={uni.countrySlug}
                claimedStatus={(uni as any).claimed_status || "unclaimed"}
              />
            </div>
          </div>
        </section>

        {/* Tab-Style Content */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              {/* Key Overview Facts */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Tuition Estimate
                  </span>
                  <span className="text-slate-900 font-bold mt-1 block">
                    {uni.tuitionFeeRangeINR}
                  </span>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Min. IELTS
                  </span>
                  <span className="text-slate-900 font-bold mt-1 block">
                    {uni.ieltsMinScore} Bands
                  </span>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Acceptance Rate
                  </span>
                  <span className="text-slate-900 font-bold mt-1 block">
                    {uni.acceptanceRate}%
                  </span>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    PSW Duration
                  </span>
                  <span className="text-[#EA5C2B] font-bold mt-1 block">
                    {uni.postStudyWorkMonths} Months
                  </span>
                </div>
              </div>

              {/* Admissions & Intakes */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="text-lg font-bold text-slate-900">
                  Upcoming Intakes & Application Windows
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(Array.isArray(uni.intakes)
                    ? uni.intakes
                    : ["Fall (Sep)", "Spring (Jan)"]
                  ).map((intake, i) => (
                    <span
                      key={i}
                      className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-900"
                    >
                      {intake}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-xs text-slate-600 leading-relaxed">
                  Indian applicants are strongly advised to apply 4–6 months
                  prior to intake deadlines to ensure adequate time for document
                  verification, scholarship consideration, and student visa
                  processing.
                </p>
              </div>
            </div>

            {/* Right Sticky Inquiry Card */}
            <div className="lg:col-span-4">
              <UniversityInquiryForm
                universityName={uni.name}
                countrySlug={uni.countrySlug}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
