import { PROGRAMS } from "@/lib/data/masterData";
import { GraduationCap, Award, Compass, ArrowRight } from "lucide-react";
import { LeadTriggerButton } from "@/components/home/HomeClientContext";

interface ProgramStreamGridProps {
  onOpenLeadModal?: (programSlug: string) => void;
}

export function ProgramStreamGrid({ onOpenLeadModal }: ProgramStreamGridProps) {
  return (
    <section id="programs-grid" className="cv-auto bg-slate-50/70 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#102C57]/10 px-3 py-1 text-xs font-bold text-[#102C57]">
            Academic Streams
          </div>
          <h2 className="mt-2.5 font-serif text-3xl font-extrabold tracking-tight text-[#102C57] sm:text-4xl">
            8 Core Programs Tailored for Career Growth
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            From STEM master&apos;s and Executive MBA to NMC-compliant medical degrees and Germany Ausbildung.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROGRAMS.map((program) => (
            <div
              key={program.id}
              id={`program-${program.slug}`}
              className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-slate-300 hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-[#102C57]">
                    <GraduationCap className="h-6 w-6 text-[#EA5C2B]" />
                  </div>
                  <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                    <Award className="h-3 w-3" />
                    ROI: {program.roiScore}/100
                  </div>
                </div>

                <h3 className="mt-4 text-lg font-black text-[#102C57]">
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
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-700"
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
                  <p className="mt-1 text-xs font-semibold text-[#102C57]">
                    {program.topDestinations.join(", ")}
                  </p>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4">
                <LeadTriggerButton
                  country={program.slug}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 py-2.5 text-xs font-bold text-[#102C57] transition hover:bg-[#102C57] hover:text-white"
                >
                  <Compass className="h-3.5 w-3.5 text-[#EA5C2B]" />
                  Explore Eligibility & Intake
                  <ArrowRight className="h-3.5 w-3.5" />
                </LeadTriggerButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
