import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  ChevronRight,
  Globe2,
  ArrowRight,
  CheckCircle2,
  Award,
} from "lucide-react";
import {
  fetchLivePrograms,
  fetchLiveCountries,
  getLiveProgramBySlug,
  PROGRAM_ALIASES,
} from "@/lib/supabase/dataFetchers";
import { fitMetaDescription } from "@/lib/seo/metaUtils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CountryFlag } from "@/components/ui/CountryFlag";

interface Props {
  params: Promise<{ program: string }>;
}

export async function generateStaticParams() {
  const livePrograms = await fetchLivePrograms();
  const canonicalParams = livePrograms.map((p) => ({
    program: p.slug,
  }));
  const aliasParams = Object.keys(PROGRAM_ALIASES).map((alias) => ({
    program: alias,
  }));
  return [...canonicalParams, ...aliasParams];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { program } = await params;
  const prog = await getLiveProgramBySlug(program);
  if (!prog) return { title: "Program Not Found" };

  const rawDescription = `Complete guide to studying ${prog.name} abroad for Indian students. Compare top destinations (${prog.topDestinations.join(", ")}), tuition fees in INR, eligibility cutoffs, and career ROI.`;

  return {
    title: `Study ${prog.name} Abroad for Indian Students (2026-2027) | Global Comparison & Top Countries`,
    description: fitMetaDescription(rawDescription),
    alternates: {
      canonical: `/programs/${prog.slug}`,
    },
  };
}

export default async function ProgramHubPage({ params }: Props) {
  const { program } = await params;
  const [prog, liveCountries] = await Promise.all([
    getLiveProgramBySlug(program),
    fetchLiveCountries(),
  ]);

  if (!prog) {
    notFound();
  }

  const topCountries = liveCountries.filter(
    (c) =>
      prog.topDestinations
        .map((d) => d.toLowerCase())
        .includes(c.name.toLowerCase()) ||
      (c.popularPrograms || []).includes(prog.slug as any),
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <Header />

      <main className="flex-1 pb-16">
        {/* Breadcrumbs */}
        <div className="border-b border-slate-200/80 bg-white py-2.5">
          <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-8 text-xs font-semibold text-slate-500">
            <Link href="/" className="hover:text-[#102C57]">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-slate-400">Programs</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[#102C57] font-bold">{prog.name}</span>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-gradient-to-b from-[#102C57] to-[#091A36] text-white py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3.5 py-1 text-xs font-semibold">
              <Award className="h-3.5 w-3.5 text-[#EA5C2B]" />
              <span>{prog.level} Degree Overview</span>
            </div>
            <h1 className="mt-4 font-serif text-3xl sm:text-5xl font-black text-white">
              Study {prog.name} Abroad for Indian Students
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              {prog.summary}
            </p>
          </div>
        </section>

        {/* Top Countries Grid */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Top Recommended Destinations for {prog.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {topCountries.slice(0, 9).map((country) => (
              <Link
                key={country.id}
                href={`/study-in-${country.slug}/${prog.slug}`}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:border-[#102C57] hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <CountryFlag
                    code={country.code}
                    name={country.name}
                    size="lg"
                    className="h-7 w-10 object-cover rounded-xs shadow-2xs border border-slate-200"
                  />
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    {country.tier}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-[#EA5C2B] transition">
                  {country.name}
                </h3>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2">
                  {country.heroTagline}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#102C57]">
                  <span>Avg: {country.avgTuitionINR}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-[#EA5C2B] group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
