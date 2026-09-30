import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import {
  fetchLiveUniversities,
  fetchLiveCountries,
} from "@/lib/supabase/dataFetchers";
import { UniversitiesClientDirectory } from "@/components/university/UniversitiesClientDirectory";
import { Building2 } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title:
    "Global Universities Directory for Indian Students (2026-2027) | QS Rankings & Fees in INR",
  description:
    "Explore QS top-ranked international universities across USA, UK, Canada, Australia, Germany and Ireland. Check INR tuition fees, IELTS requirements, acceptance rates, and campus admissions.",
  alternates: {
    canonical: "/universities",
  },
};

export default async function UniversitiesPage() {
  const [universities, countries] = await Promise.all([
    fetchLiveUniversities(),
    fetchLiveCountries(),
  ]);

  return (
    <div className="min-h-screen bg-[#FDFCF7] flex flex-col justify-between">
      <Header />

      <main className="flex-1 pb-16">
        {/* Hero Header */}
        <section className="border-b border-[#D9CFB8]/80 bg-white/70 py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#D89A3E]/30 bg-[#D89A3E]/10 px-3.5 py-1 text-xs font-bold text-[#103B47] shadow-2xs mb-4">
                <Building2 className="h-3.5 w-3.5 text-[#D89A3E]" />
                <span>Verified Global Institutions Directory</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-[#103B47]">
                Global Universities Catalog
              </h1>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                Discover top-ranked global institutions tailored for Indian
                students. Compare verified QS world rankings, annual tuition in
                ₹ INR, acceptance rates, IELTS scores, and scholarship
                offerings.
              </p>
            </div>
          </div>
        </section>

        {/* Directory Search & Filters */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <UniversitiesClientDirectory
            initialUniversities={universities}
            countries={countries}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
