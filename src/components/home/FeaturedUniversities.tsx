import { Suspense } from "react";
import { Building2 } from "lucide-react";
import { LeadTriggerButton } from "@/components/home/HomeClientContext";
import { UniversityCardsSkeleton } from "./HomeSkeletons";
import { SectionError } from "@/components/ui/SectionError";
import { SectionEmpty } from "@/components/ui/SectionEmpty";
import { fetchUniversitiesFromBackend } from "@/lib/data/liveContent";

async function UniversityCards() {
  let universities;
  try {
    universities = await fetchUniversitiesFromBackend();
  } catch (err) {
    console.error("FeaturedUniversities backend fetch failed:", err);
    return (
      <div className="mt-8">
        <SectionError
          title="Couldn't load universities"
          message="We couldn't reach the server to fetch partner universities."
        />
      </div>
    );
  }

  const featured = universities.filter((u) => u.featured);

  if (featured.length === 0) {
    return (
      <div className="mt-8">
        <SectionEmpty
          title="No partner universities yet"
          message="No featured partner institutions are published right now. Please check back soon."
        />
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {featured.map((uni, idx) => {
        const badgeText =
          uni.tierBadge ||
          (uni.rankingGlobal <= 25
            ? "Platinum Partner"
            : uni.rankingGlobal <= 100
            ? "Gold Partner"
            : "Silver Partner");
        const badgeClass =
          badgeText === "Platinum Partner"
            ? "bg-[#D4AF37]/15 text-[#997915] border border-[#D4AF37]/40"
            : badgeText === "Gold Partner"
            ? "bg-amber-100 text-amber-800 border border-amber-300"
            : "bg-slate-100 text-slate-700 border border-slate-200";

        return (
          <div
            key={`${uni.id}-${idx}`}
            className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition hover:bg-white hover:shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#102C57] shadow-xs border border-slate-100">
                  <Building2 className="h-5 w-5 text-[#EA5C2B]" />
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${badgeClass}`}>
                  {badgeText}
                </span>
              </div>
              <span className="rounded-full bg-slate-200/70 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                Global #{uni.rankingGlobal}
              </span>
            </div>

            <h3 className="mt-4 text-base font-extrabold text-[#102C57]">
              {uni.name}
            </h3>
            <p className="text-xs text-slate-500">
              {uni.city}, {uni.country}
            </p>

            <div className="mt-4 space-y-1.5 border-t border-slate-200/60 pt-3 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Tuition:</span>
                <span className="font-bold text-[#102C57]">{uni.tuitionFeeRangeINR}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">IELTS Min:</span>
                <span className="font-semibold text-slate-700">{uni.ieltsMinScore} Bands</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Work Visa:</span>
                <span className="font-semibold text-emerald-700">{uni.postStudyWorkMonths} Months</span>
              </div>
            </div>

            <LeadTriggerButton
              country={uni.country}
              className="mt-5 w-full rounded-xl bg-white py-2 text-center text-xs font-bold text-[#102C57] border border-slate-200 hover:bg-[#102C57] hover:text-white transition"
            >
              Check Admission Cutoffs
            </LeadTriggerButton>
          </div>
        );
      })}
    </div>
  );
}

export function FeaturedUniversities() {
  return (
    <section className="cv-auto border-t border-slate-100 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#EA5C2B]">
              Global Accreditation & Tier Badges
            </span>
            <h2 className="mt-1 font-serif text-3xl font-extrabold text-[#102C57] sm:text-4xl">
              Featured Tier Partner Universities
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Platinum, Gold, and Silver partner institutions with direct admissions, high post-study work visa allowances, and verified English curriculum.
            </p>
          </div>
          <LeadTriggerButton
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-[#102C57] hover:bg-slate-50"
          >
            Request Custom University Shortlist
          </LeadTriggerButton>
        </div>

        <Suspense fallback={<UniversityCardsSkeleton />}>
          <UniversityCards />
        </Suspense>
      </div>
    </section>
  );
}
