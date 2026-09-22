import { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LoanCalculatorClient } from "@/components/tools/LoanCalculatorClient";

export const metadata: Metadata = {
  title:
    "Study Abroad Education Loan & EMI Calculator (SBI, HDFC, Prodigy) | StudyAbroad Vista",
  description:
    "Calculate monthly EMI repayments, compare collateral vs non-collateral interest rates (8.15% - 11.25%), and check instant pre-approval eligibility across top partner banks.",
  alternates: {
    canonical: "/loan-calculator",
  },
};

export default function LoanCalculatorPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50">
      <Header />
      <main className="flex-1">
        <LoanCalculatorClient />
      </main>
      <Footer />
    </div>
  );
}
