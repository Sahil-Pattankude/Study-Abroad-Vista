import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ScholarshipFinderClient } from "@/components/tools/ScholarshipFinderClient";

export const metadata: Metadata = {
  title:
    "Study Abroad Scholarships for Indian Students (2026-2027) | StudyAbroad Vista",
  description:
    "Explore fully-funded study abroad scholarships (DAAD, Chevening, Fulbright, Erasmus Mundus, Women in STEM) with eligibility checker and direct application guidance.",
  alternates: {
    canonical: "/scholarships",
  },
};

export default function ScholarshipsPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50">
      <Header />
      <main className="flex-1">
        <ScholarshipFinderClient />
      </main>
      <Footer />
    </div>
  );
}
