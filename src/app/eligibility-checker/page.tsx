import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EligibilityCheckerClient } from "@/components/tools/EligibilityCheckerClient";

export const metadata: Metadata = {
  title:
    "Study Abroad Admission Eligibility & Probability Checker | StudyAbroad Vista",
  description:
    "Evaluate your GPA, IELTS, and GRE test scores to discover Safe, Target, and Reach universities with color-coded admission probabilities across 19 countries.",
  alternates: {
    canonical: "/eligibility-checker",
  },
};

export default function EligibilityCheckerPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50">
      <Header />
      <main className="flex-1">
        <EligibilityCheckerClient />
      </main>
      <Footer />
    </div>
  );
}
