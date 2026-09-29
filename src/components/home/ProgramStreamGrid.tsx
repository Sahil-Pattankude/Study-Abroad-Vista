import { fetchLivePrograms } from "@/lib/supabase/dataFetchers";
import { Program } from "@/types";
import { GraduationCap, Award, Compass, ArrowRight } from "lucide-react";
import { LeadTriggerButton } from "@/components/home/HomeClientContext";

interface ProgramStreamGridProps {
  onOpenLeadModal?: (programSlug: string) => void;
  programs?: Program[];
}

export async function ProgramStreamGrid({
  onOpenLeadModal,
  programs: propPrograms,
}: ProgramStreamGridProps) {
  const livePrograms = propPrograms || (await fetchLivePrograms());
  return (
    <section
      id="programs-grid"
      className="cv-auto bg-[#FDFCF7] py-16 sm:py-20 border-t border-[#D9CFB8]/40"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#1D5A6C]/10 px-3 py-1 text-xs font-bold text-[#1D5A6C]">
            ✦ Academic Streams
          </div>
          <h2 className="mt-2.5 font-display text-3xl font-bold tracking-tight text-[#103B47] sm:text-4xl">
            8 Core Programs Tailored for Global Career Growth
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            From STEM master&apos;s and Executive MBA to NMC-compliant medical
            degrees and Germany Ausbildung.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {livePrograms.map((program) => (
            <div
              key={program.id}
              id={`program-${program.slug}`}
              className="flex flex-col justify-between rounded-2xl border border-[#D9CFB8]/60 bg-white p-6 shadow-sm transition hover:border-[#1D5A6C]/40 hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FDFCF7] text-[#1D5A6C] border border-[#D9CFB8]/40">
                    <GraduationCap className="h-6 w-6 text-[#D89A3E]" />
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                    <Award className="h-3 w-3" />
                    ROI: {program.roiScore}/100
                  </div>
                </div>

                <h3 className="mt-4 font-display text-lg font-bold text-[#1D5A6C]">
                  {program.name}
                </h3>
                <span className="text-[11px] font-semibold text-slate-500">
                  {program.level} • {program.duration}
                </span>

                <p className="mt-3 text-xs leading-relaxed text-slate-600">
                  {program.summary}
                </p>

                {/* Key Fields */}
                <div className="mt-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    High Demand Specializations:
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {program.keyFields.map((field) => (
                      <span
                        key={field}
                        className="rounded-full bg-[#1D5A6C]/5 px-2.5 py-0.5 text-[10px] font-medium text-[#103B47]"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Top Destinations */}
                <div className="mt-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Recommended Destinations:
                  </span>
                  <p className="mt-1 text-xs font-semibold text-[#1D5A6C]">
                    {program.topDestinations.join(", ")}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-[#D9CFB8]/40 pt-4">
                <LeadTriggerButton
                  country={program.slug}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-[#1D5A6C]/5 py-2.5 text-xs font-bold text-[#1D5A6C] border border-[#1D5A6C]/20 transition hover:bg-[#1D5A6C] hover:text-white"
                >
                  <Compass className="h-3.5 w-3.5 text-[#D89A3E]" />
                  Explore Eligibility & Intake
                  <ArrowRight className="h-3.5 w-3.5 text-[#D89A3E]" />
                </LeadTriggerButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
