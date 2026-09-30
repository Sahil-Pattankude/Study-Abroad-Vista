"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Banknote,
  DollarSign,
  Building,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Percent,
  Calendar,
  Calculator,
  UserCheck,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useHomeModals } from "@/components/home/HomeClientContext";

interface PartnerBank {
  id: string;
  name: string;
  type:
    | "Public Sector (Collateral)"
    | "Private NBFC (Non-Collateral)"
    | "International USD/EUR Loan";
  interestRateRange: string;
  maxAmountINR: string;
  moratoriumPeriod: string;
  collateralRequired: boolean;
  preApprovalSpeed: string;
  logoColor: string;
}

const PARTNER_BANKS: PartnerBank[] = [
  {
    id: "sbi-eduloan",
    name: "State Bank of India (SBI Global Ed-Vantage)",
    type: "Public Sector (Collateral)",
    interestRateRange: "8.15% - 9.30%",
    maxAmountINR: "Up to ₹1.5 Crores",
    moratoriumPeriod: "Course Period + 6 Months",
    collateralRequired: true,
    preApprovalSpeed: "7–10 Business Days",
    logoColor: "bg-blue-600 text-white",
  },
  {
    id: "hdfc-credila",
    name: "HDFC Credila Financial Services",
    type: "Private NBFC (Non-Collateral)",
    interestRateRange: "9.75% - 11.25%",
    maxAmountINR: "Up to ₹75 Lakhs (Unsecured)",
    moratoriumPeriod: "Course Period + 12 Months",
    collateralRequired: false,
    preApprovalSpeed: "48 Hours Fast-Track",
    logoColor: "bg-red-600 text-white",
  },
  {
    id: "prodigy-finance",
    name: "Prodigy Finance (No Co-signer / No Collateral)",
    type: "International USD/EUR Loan",
    interestRateRange: "10.5% - 13.0% (USD/EUR)",
    maxAmountINR: "Up to 100% Tuition & Living (USD)",
    moratoriumPeriod: "Course Period + 6 Months",
    collateralRequired: false,
    preApprovalSpeed: "100% Digital • 3 Days",
    logoColor: "bg-emerald-600 text-white",
  },
  {
    id: "avanse-finance",
    name: "Avanse Financial Services",
    type: "Private NBFC (Non-Collateral)",
    interestRateRange: "10.25% - 11.75%",
    maxAmountINR: "Up to ₹60 Lakhs (Unsecured)",
    moratoriumPeriod: "Course Period + 6 Months",
    collateralRequired: false,
    preApprovalSpeed: "72 Hours Direct sanction",
    logoColor: "bg-purple-600 text-white",
  },
];

export function LoanCalculatorClient() {
  const homeModals = useHomeModals();

  // Inputs
  const [loanAmountINR, setLoanAmountINR] = useState<number>(3500000); // ₹35 Lakhs
  const [coSignerIncomeINR, setCoSignerIncomeINR] = useState<number>(120000); // ₹1.2 Lakhs / month
  const [hasCollateral, setHasCollateral] = useState<boolean>(false);
  const [repaymentTenureYears, setRepaymentTenureYears] = useState<number>(10);
  const [targetDestination, setTargetDestination] = useState<string>("germany");

  // Approximate interest calculation
  const estimatedRate = hasCollateral ? 8.65 : 10.45;
  const monthlyRate = estimatedRate / 12 / 100;
  const totalMonths = repaymentTenureYears * 12;

  // Standard EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const emiINR = Math.round(
    (loanAmountINR * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1),
  );

  const totalRepaymentINR = emiINR * totalMonths;
  const totalInterestPayableINR = totalRepaymentINR - loanAmountINR;

  // Pre-approval probability score
  const isHighProbability =
    hasCollateral ||
    coSignerIncomeINR >= 80000 ||
    loanAmountINR <= coSignerIncomeINR * 30;

  return (
    <div className="min-h-screen bg-[#FDFCF7] pb-20 pt-8 sm:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Hero */}
        <div className="mb-8 text-center sm:text-left">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#D9CFB8] bg-[#F5EFE0] px-3.5 py-1 text-xs font-semibold text-[#1D5A6C]">
            <Banknote className="h-3.5 w-3.5 text-[#D89A3E]" />
            <span>Fintech & Banking Partner Integration</span>
          </div>
          <h1 className="font-serif text-3xl font-black text-[#103B47] sm:text-4xl lg:text-5xl">
            Study Abroad Education Loan & EMI Calculator
          </h1>
          <p className="mt-3 max-w-3xl text-xs sm:text-sm md:text-base leading-relaxed text-[#6B6B6B]">
            Calculate instant pre-approval probability, monthly EMI repayments
            in{" "}
            <span className="font-mono text-[#103B47] font-semibold">
              ₹ Lakhs
            </span>
            , and compare competitive education loan quotes from SBI, HDFC
            Credila, Prodigy Finance, and Avanse.
          </p>
        </div>

        {/* 2-Column: Loan Parameters + EMI Schedule & Partner Banks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Interactive Loan Inputs */}
          <div className="lg:col-span-5 rounded-2xl border border-[#D9CFB8] bg-white p-6 sm:p-8 shadow-xs space-y-6 h-fit">
            <h2 className="text-base font-serif font-bold text-[#103B47] flex items-center gap-2">
              <Calculator className="h-4 w-4 text-[#D89A3E]" />
              <span>1. Your Education Loan Requirements</span>
            </h2>

            {/* Target Loan Amount Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                <span className="text-[#103B47]">Target Loan Amount (INR)</span>
                <span className="text-[#103B47] font-mono font-bold bg-[#F5EFE0] border border-[#D9CFB8]/70 px-2.5 py-1 rounded-md text-sm">
                  {formatCurrency(loanAmountINR)}
                </span>
              </div>
              <input
                type="range"
                min={500000}
                max={15000000}
                step={250000}
                value={loanAmountINR}
                onChange={(e) => setLoanAmountINR(Number(e.target.value))}
                className="w-full accent-[#D89A3E] cursor-pointer h-2 bg-[#F5EFE0] rounded-lg"
              />
              <div className="flex justify-between text-[11px] font-mono text-[#6B6B6B] mt-1">
                <span>₹5 Lakhs</span>
                <span>₹75 Lakhs</span>
                <span>₹1.5 Crores</span>
              </div>
            </div>

            {/* Co-Signer Monthly Income */}
            <div>
              <div className="flex justify-between items-center text-xs font-semibold mb-1.5">
                <span className="text-[#103B47]">
                  Co-Signer Monthly Net Income (INR)
                </span>
                <span className="text-[#103B47] font-mono font-bold bg-[#F5EFE0] border border-[#D9CFB8]/70 px-2.5 py-1 rounded-md text-sm">
                  {formatCurrency(coSignerIncomeINR)} / mo
                </span>
              </div>
              <input
                type="range"
                min={30000}
                max={500000}
                step={10000}
                value={coSignerIncomeINR}
                onChange={(e) => setCoSignerIncomeINR(Number(e.target.value))}
                className="w-full accent-[#1D5A6C] cursor-pointer h-2 bg-[#F5EFE0] rounded-lg"
              />
              <div className="flex justify-between text-[11px] font-mono text-[#6B6B6B] mt-1">
                <span>₹30,000</span>
                <span>₹2.5 Lakhs</span>
                <span>₹5.0 Lakhs</span>
              </div>
            </div>

            {/* Collateral Security Option */}
            <div className="border-t border-[#D9CFB8]/60 pt-4">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#103B47] mb-2">
                Collateral Security Available?
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setHasCollateral(false)}
                  className={`min-h-[44px] p-3 rounded-xl border text-left transition cursor-pointer ${
                    !hasCollateral
                      ? "border-[#D89A3E] bg-[#F5EFE0] text-[#103B47] ring-1 ring-[#D89A3E]"
                      : "border-[#D9CFB8] bg-[#FDFCF7] text-[#6B6B6B] hover:bg-[#F5EFE0]"
                  }`}
                >
                  <p className="font-bold text-[#103B47]">Non-Collateral</p>
                  <p className="text-[11px] text-[#6B6B6B] font-mono mt-0.5">
                    Unsecured • Faster ~10.45%
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setHasCollateral(true)}
                  className={`min-h-[44px] p-3 rounded-xl border text-left transition cursor-pointer ${
                    hasCollateral
                      ? "border-[#D89A3E] bg-[#F5EFE0] text-[#103B47] ring-1 ring-[#D89A3E]"
                      : "border-[#D9CFB8] bg-[#FDFCF7] text-[#6B6B6B] hover:bg-[#F5EFE0]"
                  }`}
                >
                  <p className="font-bold text-[#103B47]">
                    Property / FD Backed
                  </p>
                  <p className="text-[11px] text-[#6B6B6B] font-mono mt-0.5">
                    Lowest Rates ~8.65%
                  </p>
                </button>
              </div>
            </div>

            {/* Repayment Tenure */}
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#103B47] mb-2">
                Repayment Tenure
              </label>
              <div className="flex gap-2">
                {[5, 7, 10, 12, 15].map((yrs) => (
                  <button
                    key={yrs}
                    type="button"
                    onClick={() => setRepaymentTenureYears(yrs)}
                    className={`min-h-[44px] flex-1 rounded-xl py-2 text-xs font-mono font-bold transition cursor-pointer ${
                      repaymentTenureYears === yrs
                        ? "bg-[#1D5A6C] text-white shadow-xs"
                        : "bg-[#F5EFE0] text-[#103B47] border border-[#D9CFB8] hover:bg-[#ede5d0]"
                    }`}
                  >
                    {yrs} Yrs
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: EMI Financial Summary & Partner Banks */}
          <div className="lg:col-span-7 space-y-6">
            {/* Top EMI Summary Card */}
            <div className="rounded-2xl border border-[#1D5A6C] bg-gradient-to-br from-[#103B47] via-[#103B47] to-[#0B2830] p-6 sm:p-8 text-[#FDFCF7] shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#A8CDBD]">
                  Estimated Monthly EMI (Post Moratorium)
                </span>
                <span className="rounded-full bg-[#A8CDBD]/20 px-3 py-1 text-xs font-mono font-bold text-[#A8CDBD] border border-[#A8CDBD]/30 self-start sm:self-auto">
                  {isHighProbability
                    ? "🟢 High Pre-Approval Odds"
                    : "🟡 Moderate Eligibility"}
                </span>
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-mono font-bold text-[#EBC783] sm:text-5xl">
                  {formatCurrency(emiINR)}
                </span>
                <span className="text-xs font-mono text-[#A8CDBD]">
                  / Month
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-[#1D5A6C]/60 pt-5 text-xs">
                <div className="rounded-xl bg-white/5 p-3 border border-[#1D5A6C]">
                  <span className="text-[#A8CDBD] block text-[10px] font-mono uppercase font-semibold">
                    Est. Interest Rate
                  </span>
                  <span className="text-sm font-mono font-bold text-[#EBC783] mt-0.5 block">
                    {estimatedRate}% p.a.
                  </span>
                </div>

                <div className="rounded-xl bg-white/5 p-3 border border-[#1D5A6C]">
                  <span className="text-[#A8CDBD] block text-[10px] font-mono uppercase font-semibold">
                    Total Interest
                  </span>
                  <span className="text-sm font-mono font-bold text-white mt-0.5 block">
                    {formatCurrency(totalInterestPayableINR)}
                  </span>
                </div>

                <div className="rounded-xl bg-white/5 p-3 border border-[#1D5A6C] col-span-2 sm:col-span-1">
                  <span className="text-[#A8CDBD] block text-[10px] font-mono uppercase font-semibold">
                    Total Repayment
                  </span>
                  <span className="text-sm font-mono font-bold text-[#A8CDBD] mt-0.5 block">
                    {formatCurrency(totalRepaymentINR)}
                  </span>
                </div>
              </div>

              {/* Context-Aware Lead Action */}
              <div className="mt-6 pt-4 border-t border-[#1D5A6C]/60">
                <button
                  onClick={() =>
                    homeModals.openLeadModal(
                      `Education Loan Sanction: ${formatCurrency(loanAmountINR)} (${hasCollateral ? "Collateral" : "Non-Collateral"}, EMI: ${formatCurrency(emiINR)}/mo)`,
                    )
                  }
                  className="min-h-[44px] w-full flex items-center justify-center gap-2 rounded-xl bg-[#D89A3E] py-3.5 px-6 text-xs sm:text-sm font-bold text-[#103B47] shadow-md hover:bg-[#c4872d] transition cursor-pointer"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Apply for Instant Loan Pre-Approval Letter →</span>
                </button>
              </div>
            </div>

            {/* Partner Bank Comparisons */}
            <div className="rounded-2xl border border-[#D9CFB8] bg-white p-6 sm:p-8 shadow-xs">
              <h3 className="text-base font-serif font-bold text-[#103B47] mb-4 flex items-center justify-between">
                <span>Integrated Lending Partners & Pre-Approval Schemes</span>
                <span className="text-xs font-mono text-[#6B6B6B] font-normal">
                  Updated Q3 2026
                </span>
              </h3>

              <div className="space-y-3">
                {PARTNER_BANKS.map((bank) => (
                  <div
                    key={bank.id}
                    className="p-4 rounded-xl border border-[#D9CFB8]/70 bg-[#FDFCF7] hover:bg-[#F5EFE0]/60 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-xs sm:text-sm font-bold text-[#103B47]">
                          {bank.name}
                        </h4>
                        <span className="rounded-md bg-[#F5EFE0] border border-[#D9CFB8] px-2 py-0.5 text-[10px] font-mono font-semibold text-[#1D5A6C]">
                          {bank.type}
                        </span>
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#6B6B6B] font-mono">
                        <span>
                          Rate:{" "}
                          <strong className="text-[#103B47] font-bold">
                            {bank.interestRateRange}
                          </strong>
                        </span>
                        <span>
                          Max:{" "}
                          <strong className="text-[#103B47] font-bold">
                            {bank.maxAmountINR}
                          </strong>
                        </span>
                        <span>
                          Approval:{" "}
                          <strong className="text-[#1D5A6C] font-bold">
                            {bank.preApprovalSpeed}
                          </strong>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        homeModals.openLeadModal(
                          `Loan Application with ${bank.name} (${formatCurrency(loanAmountINR)})`,
                        )
                      }
                      className="min-h-[44px] rounded-lg border border-[#1D5A6C] bg-white px-4 py-2 text-xs font-bold text-[#1D5A6C] hover:bg-[#1D5A6C] hover:text-white transition shadow-2xs shrink-0 cursor-pointer"
                    >
                      Check Eligibility →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
