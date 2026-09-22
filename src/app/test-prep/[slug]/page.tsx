import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import {
  ChevronRight,
  Clock,
  Banknote,
  Award,
  Calendar,
  CheckCircle2,
  HelpCircle,
  Building2,
  ArrowRight,
  Globe2,
  BookOpen,
  Sparkles,
  Layers,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { TEST_PREP_EXAMS, TestPrepExam } from "@/lib/data/testPrepData";
import { fitMetaDescription } from "@/lib/seo/metaUtils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  HomeModalProvider,
  LeadTriggerButton,
  AICounsellorTriggerButton,
} from "@/components/home/HomeClientContext";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TEST_PREP_EXAMS.map((exam) => ({
    slug: exam.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const exam = TEST_PREP_EXAMS.find(
    (e) => e.slug.toLowerCase() === slug.toLowerCase(),
  );

  if (!exam) {
    return { title: "Exam Not Found | StudyAbroad Vista" };
  }

  const rawDescription = `Complete guide to ${exam.name} (${exam.fullName}). Official fee ${exam.feeINR}, test format, score cutoffs for top universities, and free 8-week study blueprints.`;
  const formattedDesc = fitMetaDescription(rawDescription);

  return {
    title: `${exam.name} Preparation Guide (2026-2027) | Fees in INR, Syllabus & Cutoffs for Indian Students`,
    description: formattedDesc,
    openGraph: {
      title: `${exam.name} Exam Guide: Fees in INR, Cutoffs & 8-Week Roadmap`,
      description: formattedDesc,
      url: `https://studyabroadvista.com/test-prep/${exam.slug}`,
      type: "article",
    },
    alternates: {
      canonical: `/test-prep/${exam.slug}`,
    },
  };
}

export default async function TestPrepDetailPage({ params }: Props) {
  const { slug } = await params;
  const exam = TEST_PREP_EXAMS.find(
    (e) => e.slug.toLowerCase() === slug.toLowerCase(),
  );

  if (!exam) {
    notFound();
  }

  // Related exams from the same category or common combinations
  const relatedExams = TEST_PREP_EXAMS.filter(
    (e) =>
      e.id !== exam.id &&
      (e.category === exam.category ||
        (exam.category === "Graduate Admissions" &&
          e.category === "English Proficiency")),
  );

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: exam.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: `${exam.name} Master Preparation Blueprint`,
    description: exam.overview,
    provider: {
      "@type": "Organization",
      name: "StudyAbroad Vista / Dnyanal Educon",
      sameAs: "https://studyabroadvista.com",
    },
  };

  return (
    <HomeModalProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseJsonLd) }}
      />

      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
        <Header />

        <main className="flex-1 pb-16">
          {/* Breadcrumbs */}
          <div className="border-b border-slate-200/80 bg-white py-2.5">
            <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-8 text-xs font-semibold text-slate-500">
              <Link href="/" className="hover:text-[#102C57] transition">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <Link
                href="/test-prep"
                className="hover:text-[#102C57] transition"
              >
                Test Prep Hub
              </Link>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-[#102C57] font-bold">{exam.name}</span>
            </div>
          </div>

          {/* Hero Section */}
          <section className="relative overflow-hidden bg-gradient-to-b from-[#102C57] via-[#0D2346] to-[#091A36] text-white py-14 sm:py-18">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-0.5 text-xs font-semibold text-white">
                  {exam.category}
                </span>
                <span className="inline-flex items-center rounded-full bg-orange-500/20 px-3 py-0.5 text-xs font-semibold text-[#EA5C2B] border border-orange-500/30">
                  Conducted by: {exam.conductingBody}
                </span>
              </div>

              <h1 className="mt-4 font-serif text-3xl sm:text-5xl font-black text-white tracking-tight">
                {exam.name}
              </h1>
              <p className="mt-1 text-sm font-medium text-slate-300">
                {exam.fullName}
              </p>

              <p className="mt-4 text-sm sm:text-base text-slate-200 max-w-3xl leading-relaxed">
                {exam.heroTagline}
              </p>

              {/* Quick Metrics Bar */}
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Exam Fee (INR)
                  </span>
                  <p className="mt-1 text-base font-black text-[#EA5C2B]">
                    {exam.feeINR}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Total Duration
                  </span>
                  <p className="mt-1 text-sm font-bold text-white">
                    {exam.duration}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Score Validity
                  </span>
                  <p className="mt-1 text-sm font-bold text-white">
                    {exam.validityYears === 99
                      ? "Lifetime"
                      : `${exam.validityYears} Years`}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Score Scale
                  </span>
                  <p className="mt-1 text-sm font-bold text-white">
                    {exam.scoringScale}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Indian Target Cutoff
                  </span>
                  <p className="mt-1 text-sm font-black text-emerald-400">
                    {exam.targetCutoffIndianStudents}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Delivery Mode
                  </span>
                  <p
                    className="mt-1 text-xs font-bold text-white truncate"
                    title={exam.formatMode}
                  >
                    {exam.formatMode.split(" ")[0]}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <LeadTriggerButton
                  country={exam.targetCountries[0]}
                  className="rounded-xl bg-[#EA5C2B] px-6 py-3 text-xs font-bold text-white shadow-md hover:bg-[#d44e20] transition inline-flex items-center gap-2"
                >
                  <span>Get Free {exam.shortName} Prep Assessment</span>
                  <ArrowRight className="h-4 w-4" />
                </LeadTriggerButton>
                <AICounsellorTriggerButton className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-xs font-bold text-white hover:bg-white/20 transition inline-flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#EA5C2B]" />
                  <span>Ask AI for {exam.shortName} Tips</span>
                </AICounsellorTriggerButton>
              </div>
            </div>
          </section>

          {/* Content Layout */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-10">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
              {/* Main Content Area (2 cols) */}
              <div className="lg:col-span-2 space-y-10">
                {/* 1. Overview Section */}
                <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
                  <h2 className="text-xl font-bold text-[#102C57] flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-[#EA5C2B]" />
                    <span>About {exam.name}</span>
                  </h2>
                  <p className="mt-4 text-xs sm:text-sm leading-relaxed text-slate-600">
                    {exam.overview}
                  </p>

                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Target Degrees & Programs
                      </h3>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {exam.targetPrograms.map((prog) => (
                          <span
                            key={prog}
                            className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                          >
                            {prog}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Conducting Body & Frequency
                      </h3>
                      <p className="mt-2 text-xs font-bold text-slate-800">
                        {exam.conductingBody}
                      </p>
                      <p className="text-xs text-slate-500">{exam.frequency}</p>
                    </div>
                  </div>
                </section>

                {/* 2. Section-by-Section Exam Format */}
                <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#102C57] flex items-center gap-2">
                      <Layers className="h-5 w-5 text-[#EA5C2B]" />
                      <span>{exam.shortName} Section Breakdown & Syllabus</span>
                    </h2>
                    <span className="text-xs font-bold text-slate-400">
                      {exam.sections.length} Sections
                    </span>
                  </div>

                  <div className="mt-6 space-y-4">
                    {exam.sections.map((sec, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-5 hover:border-[#102C57]/30 transition"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#102C57] text-[10px] font-bold text-white">
                              {idx + 1}
                            </span>
                            <h3 className="text-sm font-bold text-slate-900">
                              {sec.name}
                            </h3>
                          </div>
                          <div className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5 text-slate-400" />
                              {sec.duration}
                            </span>
                            <span>•</span>
                            <span>{sec.questionsCount}</span>
                          </div>
                        </div>

                        <div className="mt-3 text-xs text-slate-600">
                          <p>
                            <strong className="text-slate-800">
                              Skills Tested:
                            </strong>{" "}
                            {sec.skillsTested}
                          </p>
                          <div className="mt-2.5 rounded-xl bg-orange-50/80 border border-orange-200/50 p-3 text-slate-700">
                            <p className="text-[11px] font-bold text-[#EA5C2B] uppercase tracking-wider mb-0.5">
                              Strategy for Indian Students:
                            </p>
                            <p className="text-xs">{sec.tips}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 3. Minimum Cutoffs & Country Score Requirements */}
                <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
                  <h2 className="text-xl font-bold text-[#102C57] flex items-center gap-2">
                    <Globe2 className="h-5 w-5 text-[#EA5C2B]" />
                    <span>Target Score Requirements by Destination</span>
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Minimum eligibility thresholds vs. competitive scores for
                    top-tier university admissions and visa approvals:
                  </p>

                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-slate-700">
                          <th className="p-3 font-bold">Destination Country</th>
                          <th className="p-3 font-bold">Minimum Threshold</th>
                          <th className="p-3 font-bold text-emerald-800">
                            Competitive Target Score
                          </th>
                          <th className="p-3 font-bold text-right">
                            Destination Guide
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-600">
                        {exam.scoreRequirementsByCountry.map((req, idx) => (
                          <tr
                            key={idx}
                            className="hover:bg-slate-50/80 transition"
                          >
                            <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                              <span className="text-xl">{req.flag}</span>
                              <span>{req.country}</span>
                            </td>
                            <td className="p-3 font-medium text-slate-700">
                              {req.minRequired}
                            </td>
                            <td className="p-3 font-bold text-emerald-700">
                              {req.competitiveScore}
                            </td>
                            <td className="p-3 text-right">
                              <Link
                                href={`/study-in-${req.country.toLowerCase().replace(/\s+/g, "-")}`}
                                className="font-bold text-[#102C57] hover:text-[#EA5C2B] hover:underline"
                              >
                                View Country
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* 4. 8-Week Preparation Roadmap */}
                <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#102C57] flex items-center gap-2">
                      <Zap className="h-5 w-5 text-[#EA5C2B]" />
                      <span>8-Week Structured Study Roadmap</span>
                    </h2>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                      Step-by-Step
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    Proven phased roadmap designed for working professionals and
                    university students in India:
                  </p>

                  <div className="mt-6 space-y-4">
                    {exam.prepRoadmap.map((item, idx) => (
                      <div
                        key={idx}
                        className="relative flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#102C57] text-xs font-bold text-white">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-md bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-[#EA5C2B]">
                              {item.week}
                            </span>
                            <h3 className="text-sm font-bold text-slate-900">
                              {item.title}
                            </h3>
                          </div>
                          <p className="mt-2 text-xs leading-relaxed text-slate-600">
                            {item.milestone}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 5. Frequently Asked Questions */}
                <section className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
                  <h2 className="text-xl font-bold text-[#102C57] flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-[#EA5C2B]" />
                    <span>Frequently Asked Questions about {exam.name}</span>
                  </h2>

                  <div className="mt-6 space-y-4">
                    {exam.faqs.map((faq, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5"
                      >
                        <h3 className="text-sm font-bold text-slate-900">
                          {faq.question}
                        </h3>
                        <p className="mt-2 text-xs sm:text-sm leading-relaxed text-slate-600">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              {/* Sidebar (1 col) */}
              <div className="space-y-6">
                {/* 1. Quick Profile Assessment Card */}
                <div className="sticky top-24 space-y-6">
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#EA5C2B] mb-4">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-bold text-[#102C57]">
                      Get Free {exam.shortName} Readiness Evaluation
                    </h3>
                    <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                      Share your target intake, destination, and current score
                      to receive personalized university shortlisting and fee
                      waiver tips.
                    </p>

                    <div className="mt-6 space-y-3">
                      <LeadTriggerButton
                        country={exam.targetCountries[0]}
                        className="w-full rounded-xl bg-[#EA5C2B] py-3 text-xs font-bold text-white shadow-xs hover:bg-[#d44e20] transition flex items-center justify-center gap-2"
                      >
                        <span>Schedule Free Strategy Call</span>
                        <ArrowRight className="h-4 w-4" />
                      </LeadTriggerButton>

                      <AICounsellorTriggerButton className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100 transition flex items-center justify-center gap-2">
                        <Sparkles className="h-4 w-4 text-[#EA5C2B]" />
                        <span>Instant AI Consultation</span>
                      </AICounsellorTriggerButton>
                    </div>

                    <div className="mt-6 border-t border-slate-100 pt-4 text-[11px] text-slate-400 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>100% Free Zero-Bias Counseling</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>Official IDP & ETS Partner Guidance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        <span>DPDP Act 2023 Compliant</span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Related Exams Widget */}
                  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#102C57] mb-4">
                      Related & Alternative Tests
                    </h3>
                    <ul className="space-y-3 text-xs">
                      {relatedExams.slice(0, 4).map((rel) => (
                        <li key={rel.id}>
                          <Link
                            href={`/test-prep/${rel.slug}`}
                            className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 hover:border-[#102C57]/20 hover:bg-slate-100 transition"
                          >
                            <div>
                              <p className="font-bold text-slate-900 group-hover:text-[#EA5C2B] transition">
                                {rel.name}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {rel.feeINR} • {rel.category.split(" ")[0]}
                              </p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 group-hover:text-[#EA5C2B] transition-transform" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </HomeModalProvider>
  );
}
