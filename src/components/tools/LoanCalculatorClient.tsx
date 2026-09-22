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
    <div className="min-h-screen bg-slate-50/60 pb-20 pt-8 sm:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Hero */}
        <div className="mb-8 text-center sm:text-left">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold text-[#EA5C2B]">
            <Banknote className="h-3.5 w-3.5" />
            <span>Fintech & Banking Partner Integration • [FR-TOOLS-009]</span>
          </div>
          <h1 className="font-serif text-3xl font-black text-[#102C57] sm:text-4xl lg:text-5xl">
            Study Abroad Education Loan & EMI Calculator
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Calculate instant pre-approval probability, monthly EMI repayments,
            and compare competitive education loan quotes from SBI, HDFC
            Credila, Prodigy Finance, and Avanse.
          </p>
        </div>

        {/* 2-Column: Loan Parameters + EMI Schedule & Partner Banks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Interactive Loan Inputs */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6 h-fit">
            <h2 className="text-sm font-extrabold text-[#102C57] flex items-center gap-2">
              <Calculator className="h-4 w-4 text-[#EA5C2B]" />
              <span>1. Your Education Loan Requirements</span>
            </h2>

            {/* Target Loan Amount Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span className="text-slate-700">Target Loan Amount (INR)</span>
                <span className="text-[#102C57] font-extrabold bg-slate-100 px-2.5 py-0.5 rounded-md text-sm">
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
                className="w-full accent-[#EA5C2B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>₹5 Lakhs</span>
                <span>₹75 Lakhs</span>
                <span>₹1.5 Crores</span>
              </div>
            </div>

            {/* Co-Signer Monthly Income */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                <span className="text-slate-700">
                  Co-Signer Monthly Net Income (INR)
                </span>
                <span className="text-[#102C57] font-extrabold bg-slate-100 px-2.5 py-0.5 rounded-md text-sm">
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
                className="w-full accent-[#102C57] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
                <span>₹30,000</span>
                <span>₹2.5 Lakhs</span>
                <span>₹5.0 Lakhs</span>
              </div>
            </div>

            {/* Collateral Security Option */}
            <div className="border-t border-slate-100 pt-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Collateral Security Available?
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setHasCollateral(false)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    !hasCollateral
                      ? "border-[#EA5C2B] bg-orange-50/70 text-[#102C57] shadow-2xs"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <p className="font-bold text-slate-900">Non-Collateral</p>
                  <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                    Unsecured • Faster ~10.45%
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setHasCollateral(true)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    hasCollateral
                      ? "border-[#EA5C2B] bg-orange-50/70 text-[#102C57] shadow-2xs"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <p className="font-bold text-slate-900">
                    Property / FD Backed
                  </p>
                  <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                    Lowest Rates ~8.65%
                  </p>
                </button>
              </div>
            </div>

            {/* Repayment Tenure */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Repayment Tenure
              </label>
              <div className="flex gap-2">
                {[5, 7, 10, 12, 15].map((yrs) => (
                  <button
                    key={yrs}
                    type="button"
                    onClick={() => setRepaymentTenureYears(yrs)}
                    className={`flex-1 rounded-xl py-2 text-xs font-bold transition cursor-pointer ${
                      repaymentTenureYears === yrs
                        ? "bg-[#102C57] text-white shadow-xs"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
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
            <div className="rounded-2xl border border-slate-700/80 bg-gradient-to-br from-slate-950 via-[#102C57] to-slate-950 p-6 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Estimated Monthly EMI (Post Moratorium)
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-300 border border-emerald-500/30">
                  {isHighProbability
                    ? "🟢 High Pre-Approval Odds"
                    : "🟡 Moderate Eligibility"}
                </span>
              </div>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black text-white sm:text-4xl">
                  {formatCurrency(emiINR)}
                </span>
                <span className="text-xs text-slate-300 font-semibold">
                  / Month
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-slate-800 pt-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Est. Interest Rate
                  </span>
                  <span className="text-sm font-extrabold text-orange-300 mt-0.5 block">
                    {estimatedRate}% p.a.
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Total Interest
                  </span>
                  <span className="text-sm font-extrabold text-white mt-0.5 block">
                    {formatCurrency(totalInterestPayableINR)}
                  </span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    Total Loan Cost
                  </span>
                  <span className="text-sm font-extrabold text-emerald-300 mt-0.5 block">
                    {formatCurrency(totalRepaymentINR)}
                  </span>
                </div>
              </div>

              {/* Context-Aware Lead Action [FR-TOOLS-010] */}
              <div className="mt-5 pt-3 border-t border-slate-800">
                <button
                  onClick={() =>
                    homeModals.openLeadModal(
                      `Education Loan Sanction: ${formatCurrency(loanAmountINR)} (${hasCollateral ? "Collateral" : "Non-Collateral"}, EMI: ${formatCurrency(emiINR)}/mo)`,
                    )
                  }
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#EA5C2B] py-3 text-xs font-bold text-white shadow-md hover:bg-[#d94f20] transition cursor-pointer"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Apply for Instant Loan Pre-Approval Letter →</span>
                </button>
              </div>
            </div>

            {/* Partner Bank Comparisons [FR-TOOLS-009] */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
              <h3 className="text-sm font-extrabold text-[#102C57] mb-4 flex items-center justify-between">
                <span>Integrated Lending Partners & Pre-Approval Schemes</span>
                <span className="text-[11px] text-slate-500 font-normal">
                  Updated Q3 2026
                </span>
              </h3>

              <div className="space-y-3">
                {PARTNER_BANKS.map((bank) => (
                  <div
                    key={bank.id}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900">
                          {bank.name}
                        </h4>
                        <span className="rounded-md bg-slate-200 px-1.5 py-0.2 text-[9px] font-extrabold text-slate-700">
                          {bank.type}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500">
                        <span>
                          Rate:{" "}
                          <strong className="text-slate-800 font-bold">
                            {bank.interestRateRange}
                          </strong>
                        </span>
                        <span>
                          Max:{" "}
                          <strong className="text-slate-800 font-bold">
                            {bank.maxAmountINR}
                          </strong>
                        </span>
                        <span>
                          Approval:{" "}
                          <strong className="text-emerald-700 font-bold">
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
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-[#102C57] hover:border-[#102C57] transition shadow-2xs shrink-0 cursor-pointer"
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
