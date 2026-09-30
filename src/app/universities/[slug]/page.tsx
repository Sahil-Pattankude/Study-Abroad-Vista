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
    <div className="min-h-screen bg-[#FDFCF7] flex flex-col justify-between">
      <Header />

      <main className="flex-1 pb-16">
        {/* Breadcrumb */}
        <div className="border-b border-[#D9CFB8]/60 bg-white/70 backdrop-blur-xs py-2.5">
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-8 text-xs font-semibold text-slate-500">
            <Link href="/" className="hover:text-[#103B47] transition">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <Link
              href={`/destinations/${uni.countrySlug}`}
              className="hover:text-[#103B47] transition"
            >
              {uni.country}
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[#103B47] font-bold truncate max-w-[200px] sm:max-w-none">
              {uni.name}
            </span>
          </div>
        </div>

        {/* University Header Hero */}
        <section className="bg-white border-b border-[#D9CFB8]/70 py-8 sm:py-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#103B47] text-white shadow-md shrink-0 ring-1 ring-[#D89A3E]/30">
                  <Building2 className="h-8 w-8 text-[#D89A3E]" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-md bg-[#D89A3E]/10 px-2.5 py-0.5 text-xs font-bold text-[#D89A3E] border border-[#D89A3E]/30 font-mono">
                      QS World Rank #{uni.rankingGlobal}
                    </span>
                    <span className="rounded-md bg-[#1D5A6C]/10 px-2.5 py-0.5 text-xs font-bold text-[#1D5A6C] border border-[#1D5A6C]/20 font-mono">
                      National #{uni.rankingNational}
                    </span>
                  </div>
                  <h1 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-[#103B47]">
                    {uni.name}
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-slate-600 flex items-center gap-1.5 font-medium">
                    <MapPin className="h-4 w-4 text-[#D89A3E]" />
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
                <div className="rounded-2xl border border-[#D9CFB8]/80 bg-white p-4 shadow-2xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                    Tuition Estimate
                  </span>
                  <span className="text-[#103B47] font-mono font-black text-sm mt-1.5 block">
                    {uni.tuitionFeeRangeINR}
                  </span>
                </div>
                <div className="rounded-2xl border border-[#D9CFB8]/80 bg-white p-4 shadow-2xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                    Min. IELTS
                  </span>
                  <span className="text-[#103B47] font-mono font-black text-sm mt-1.5 block">
                    {uni.ieltsMinScore} Bands
                  </span>
                </div>
                <div className="rounded-2xl border border-[#D9CFB8]/80 bg-white p-4 shadow-2xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                    Acceptance Rate
                  </span>
                  <span className="text-[#103B47] font-mono font-black text-sm mt-1.5 block">
                    {uni.acceptanceRate}%
                  </span>
                </div>
                <div className="rounded-2xl border border-[#D9CFB8]/80 bg-white p-4 shadow-2xs">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                    PSW Duration
                  </span>
                  <span className="text-[#D89A3E] font-mono font-black text-sm mt-1.5 block">
                    {uni.postStudyWorkMonths} Months
                  </span>
                </div>
              </div>

              {/* Admissions & Intakes */}
              <div className="rounded-2xl border border-[#D9CFB8]/80 bg-white p-6 shadow-2xs">
                <h2 className="text-lg font-serif font-bold text-[#103B47]">
                  Upcoming Intakes & Application Windows
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {(Array.isArray(uni.intakes)
                    ? uni.intakes
                    : ["Fall (Sep)", "Spring (Jan)"]
                  ).map((intake, i) => (
                    <span
                      key={i}
                      className="rounded-xl bg-[#1D5A6C]/10 border border-[#1D5A6C]/20 px-3.5 py-1.5 text-xs font-bold text-[#103B47]"
                    >
                      {intake}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  Indian applicants are strongly advised to apply 4–6 months
                  prior to intake deadlines to ensure adequate time for document
                  verification, APS certificates (for Germany), scholarship
                  consideration, and student visa processing.
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
