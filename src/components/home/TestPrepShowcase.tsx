import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Banknote, 
  Award, 
  CheckCircle2, 
  Layers,
  Globe2,
  Stethoscope,
  GraduationCap
} from "lucide-react";
import { TEST_PREP_EXAMS } from "@/lib/data/testPrepData";

export function TestPrepShowcase() {
  const englishExams = TEST_PREP_EXAMS.filter((e) => e.category === "English Proficiency").slice(0, 3);
  const graduateExams = TEST_PREP_EXAMS.filter((e) => e.category === "Graduate Admissions");
  const healthcareExams = TEST_PREP_EXAMS.filter((e) => e.category === "Medical & Healthcare Licensing");

  return (
    <section id="test-prep-hub" className="cv-auto border-t border-slate-200 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#102C57]/10 px-3 py-1 text-xs font-bold text-[#102C57]">
              <Sparkles className="h-3.5 w-3.5 text-[#EA5C2B]" />
              Phase 1 Standardized Exam Intelligence
            </div>
            <h2 className="mt-2.5 font-serif text-3xl font-extrabold tracking-tight text-[#102C57] sm:text-4xl">
              Test Prep & Global Licensing Hub
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
              Official fees converted to INR, minimum score cutoffs for 19 countries, and free 8-week structured study roadmaps for Indian applicants.
            </p>
          </div>
          <Link
            href="/test-prep"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#102C57] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#091A36] transition shrink-0"
          >
            <span>Explore All 9 Exams Hub</span>
            <ArrowRight className="h-4 w-4 text-[#EA5C2B]" />
          </Link>
        </div>

        {/* 3 Categories Showcase Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* 1. English Proficiency Card */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 flex flex-col justify-between transition hover:border-[#102C57]/30 hover:shadow-md">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                  <Globe2 className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 text-[10px] font-bold text-blue-800">
                  4 Exams Available
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold text-[#102C57]">English Language Proficiency</h3>
              <p className="mt-1 text-xs text-slate-500">IELTS Academic, TOEFL iBT, PTE Academic & Duolingo DET.</p>

              <div className="mt-5 space-y-2.5">
                {englishExams.map((exam) => (
                  <Link
                    key={exam.id}
                    href={`/test-prep/${exam.slug}`}
                    className="group flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3 hover:border-[#102C57] transition"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-[#EA5C2B] transition">{exam.name}</p>
                      <p className="text-[10px] text-slate-400">Target: {exam.targetCutoffIndianStudents} • {exam.feeINR}</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-1 group-hover:text-[#EA5C2B] transition-transform" />
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/test-prep"
              className="mt-6 block text-center text-xs font-bold text-[#102C57] hover:text-[#EA5C2B] hover:underline"
            >
              Compare All English Tests →
            </Link>
          </div>

          {/* 2. Graduate & MBA Admissions */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 flex flex-col justify-between transition hover:border-[#102C57]/30 hover:shadow-md">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-800">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 text-[10px] font-bold text-amber-900">
                  MS & MBA Focus
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold text-[#102C57]">Graduate & MBA Admissions</h3>
              <p className="mt-1 text-xs text-slate-500">Aptitude exams for STEM Master&apos;s and Top Global Business Schools.</p>

              <div className="mt-5 space-y-2.5">
                {graduateExams.map((exam) => (
                  <Link
                    key={exam.id}
                    href={`/test-prep/${exam.slug}`}
                    className="group flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3 hover:border-[#102C57] transition"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-[#EA5C2B] transition">{exam.name}</p>
                      <p className="text-[10px] text-slate-400">Target: {exam.targetCutoffIndianStudents} • {exam.feeINR}</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-1 group-hover:text-[#EA5C2B] transition-transform" />
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/test-prep"
              className="mt-6 block text-center text-xs font-bold text-[#102C57] hover:text-[#EA5C2B] hover:underline"
            >
              View Graduate Cutoff Matrix →
            </Link>
          </div>

          {/* 3. Medical & Healthcare Licensing */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50/70 p-6 flex flex-col justify-between transition hover:border-[#102C57]/30 hover:shadow-md">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                  <Stethoscope className="h-5 w-5" />
                </div>
                <span className="rounded-full bg-emerald-50 border border-emerald-200/60 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                  High Demand Migration
                </span>
              </div>

              <h3 className="mt-4 text-lg font-bold text-[#102C57]">Medical & Nursing Licensing</h3>
              <p className="mt-1 text-xs text-slate-500">Licensing roadmaps for Indian MBBS doctors and Nursing graduates.</p>

              <div className="mt-5 space-y-2.5">
                {healthcareExams.map((exam) => (
                  <Link
                    key={exam.id}
                    href={`/test-prep/${exam.slug}`}
                    className="group flex items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3 hover:border-[#102C57] transition"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-[#EA5C2B] transition">{exam.name}</p>
                      <p className="text-[10px] text-slate-400">Target: {exam.targetCutoffIndianStudents} • {exam.feeINR}</p>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:translate-x-1 group-hover:text-[#EA5C2B] transition-transform" />
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/test-prep"
              className="mt-6 block text-center text-xs font-bold text-[#102C57] hover:text-[#EA5C2B] hover:underline"
            >
              Explore Healthcare Licensing →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
