import { Metadata } from "next";
import { fitMetaDescription } from "@/lib/seo/metaUtils";
import { CompareViewWrapper } from "@/components/tools/CompareViewWrapper";

export const metadata: Metadata = {
  title: "Compare Universities & Courses Side-by-Side (Fees in INR, Cutoffs & Visas) | StudyAbroad Vista",
  description: fitMetaDescription(
    "Compare up to 5 global universities or academic courses side-by-side. Analyze QS world rankings, annual tuition fees in INR, minimum IELTS cutoffs, GRE waivers, and post-study work visa rights."
  ),
  alternates: {
    canonical: "https://studyabroadvista.com/compare",
  },
};

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function ComparePage() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-slate-50">
      <Header />
      <main className="flex-1">
        <CompareViewWrapper />
      </main>
      <Footer />
    </div>
  );
}
