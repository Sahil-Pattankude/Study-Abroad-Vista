"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  Award,
  ArrowRight,
  Sparkles,
  Calculator,
  CheckCircle2,
  Calendar,
  HelpCircle,
  Clock,
  Layers,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useHomeModals } from "@/components/home/HomeClientContext";

export function ROICalculatorClient() {
  const homeModals = useHomeModals();

  // Inputs
  const [currentSalaryINR, setCurrentSalaryINR] = useState(2500000); // ₹25 Lakhs / yr
  const [targetSalaryINR, setTargetSalaryINR] = useState(6500000); // ₹65 Lakhs / yr
  const [programCostINR, setProgramCostINR] = useState(3800000); // ₹38 Lakhs tuition + books
  const [formatType, setFormatType] = useState<
    "executive_modular" | "full_time"
  >("executive_modular");
  const [annualHikePercent, setAnnualHikePercent] = useState(8); // Standard 8% annual increment

  // Opportunity cost (salary loss if full time, 0 if executive weekend/modular)
  const opportunityCostINR =
    formatType === "full_time" ? currentSalaryINR * 1.5 : 0;
  const totalInvestmentINR = programCostINR + opportunityCostINR;

  // Annual salary delta (post-EMBA vs pre-EMBA)
  const initialSalaryDelta = Math.max(1, targetSalaryINR - currentSalaryINR);

  // Break-even years (Payback Period)
  const breakEvenYears = +(totalInvestmentINR / initialSalaryDelta).toFixed(1);

  // 10-Year Cumulative Gain Projection
  // Year-by-year baseline (without EMBA) vs with EMBA
  let cumulativeWithoutEMBA = 0;
  let cumulativeWithEMBA = -totalInvestmentINR;

  let simSalaryNoEMBA = currentSalaryINR;
  let simSalaryWithEMBA = targetSalaryINR;

  const yearlyTrajectory: {
    year: number;
    withoutEMBA: number;
    withEMBA: number;
    netBenefit: number;
  }[] = [];

  for (let y = 1; y <= 10; y++) {
    cumulativeWithoutEMBA += simSalaryNoEMBA;
    cumulativeWithEMBA += simSalaryWithEMBA;

    yearlyTrajectory.push({
      year: y,
      withoutEMBA: Math.round(cumulativeWithoutEMBA),
      withEMBA: Math.round(cumulativeWithEMBA),
      netBenefit: Math.round(cumulativeWithEMBA - cumulativeWithoutEMBA),
    });

    simSalaryNoEMBA *= 1 + (annualHikePercent / 100) * 0.7; // Lower growth trajectory
    simSalaryWithEMBA *= 1 + annualHikePercent / 100; // Accelerated leadership growth trajectory
  }

  const tenYearCumulativeGainINR = Math.max(
    0,
    yearlyTrajectory[9].withEMBA - yearlyTrajectory[9].withoutEMBA,
  );

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20 pt-8 sm:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Hero */}
        <div className="mb-8 text-center sm:text-left">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold text-[#EA5C2B]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Executive Career Analytics • [FR-TOOLS-005]</span>
          </div>
          <h1 className="font-serif text-3xl font-black text-[#102C57] sm:text-4xl lg:text-5xl">
            Executive MBA (EMBA) ROI & Career Gain Calculator
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Quantify your post-EMBA salary leap, calculate exact break-even
            payback timelines in years, and evaluate 10-year cumulative wealth
            trajectory across global business schools.
          </p>
        </div>

        {/* Main 2-Column Calculator Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Interactive Inputs */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs lg:col-span-6 space-y-6">
            <h2 className="text-base font-extrabold text-[#102C57] flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-[#EA5C2B]" />
              <span>1. Your Current & Target Executive Profile</span>
            </h2>

            {/* Current Salary Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-2">
                <span className="text-slate-700">
                  Current Annual Total CTC (INR)
                </span>
                <span className="text-[#102C57] text-sm font-extrabold bg-slate-100 px-2.5 py-0.5 rounded-md">
                  {formatCurrency(currentSalaryINR)}
                </span>
              </div>
              <input
                type="range"
                min={1000000}
                max={10000000}
                step={250000}
                value={currentSalaryINR}
                onChange={(e) => setCurrentSalaryINR(Number(e.target.value))}
                className="w-full accent-[#EA5C2B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                <span>₹10 Lakhs</span>
                <span>₹50 Lakhs</span>
                <span>₹1.0 Crore</span>
              </div>
            </div>

            {/* Target Post-EMBA Salary Slider */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-2">
                <span className="text-slate-700">
                  Target Post-EMBA Leadership CTC
                </span>
                <span className="text-emerald-700 text-sm font-extrabold bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                  {formatCurrency(targetSalaryINR)}
                </span>
              </div>
              <input
                type="range"
                min={2500000}
                max={25000000}
                step={500000}
                value={targetSalaryINR}
                onChange={(e) => setTargetSalaryINR(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                <span>₹25 Lakhs</span>
                <span>₹1.25 Crores</span>
                <span>₹2.5 Crores</span>
              </div>
            </div>

            {/* Program Cost Slider */}
            <div className="border-t border-slate-100 pt-5">
              <h2 className="text-base font-extrabold text-[#102C57] flex items-center gap-2 mb-4">
                <Award className="h-4 w-4 text-[#EA5C2B]" />
                <span>2. EMBA Program Investment & Format</span>
              </h2>

              <div className="flex justify-between items-center text-xs font-bold mb-2">
                <span className="text-slate-700">
                  Total Program Tuition & Global Immersions
                </span>
                <span className="text-[#102C57] text-sm font-extrabold bg-slate-100 px-2.5 py-0.5 rounded-md">
                  {formatCurrency(programCostINR)}
                </span>
              </div>
              <input
                type="range"
                min={1500000}
                max={12000000}
                step={250000}
                value={programCostINR}
                onChange={(e) => setProgramCostINR(Number(e.target.value))}
                className="w-full accent-[#102C57] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
                <span>₹15L (Europe/Asia)</span>
                <span>₹55L (INSEAD/LBS)</span>
                <span>₹1.2Cr (Wharton/Kellogg)</span>
              </div>
            </div>

            {/* Program Format Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Delivery Format & Opportunity Cost
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setFormatType("executive_modular")}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    formatType === "executive_modular"
                      ? "border-[#EA5C2B] bg-orange-50/70 text-[#102C57] shadow-2xs"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <p className="font-extrabold text-slate-900">
                    Modular / Weekend
                  </p>
                  <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                    Keep working • ₹0 Opportunity Cost
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormatType("full_time")}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                    formatType === "full_time"
                      ? "border-[#EA5C2B] bg-orange-50/70 text-[#102C57] shadow-2xs"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <p className="font-extrabold text-slate-900">
                    Full-Time Sabbatical
                  </p>
                  <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                    18 Months Salary Loss (+
                    {formatCurrency(currentSalaryINR * 1.5)})
                  </p>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: ROI Results & 10-Year Horizon */}
          <div className="space-y-6 lg:col-span-6">
            {/* Top Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Payback Period */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Break-Even Timeline
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-100 text-[#EA5C2B]">
                    <Clock className="h-4 w-4" />
                  </span>
                </div>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-[#102C57]">
                    {breakEvenYears}
                  </span>
                  <span className="text-sm font-bold text-slate-600">
                    Years
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Full investment recovered in approx.{" "}
                  {Math.round(breakEvenYears * 12)} months post graduation.
                </p>
              </div>

              {/* 10-Year Cumulative Gain */}
              <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    10-Yr Net Cumulative Gain
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <TrendingUp className="h-4 w-4" />
                  </span>
                </div>
                <div className="mt-3 text-3xl font-black text-emerald-700">
                  {formatCurrency(tenYearCumulativeGainINR)}
                </div>
                <p className="text-[11px] text-emerald-700 font-medium mt-1">
                  Net earnings gain over standard non-EMBA career path.
                </p>
              </div>
            </div>

            {/* Trajectory Breakdown Table */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs overflow-hidden">
              <h3 className="text-sm font-extrabold text-[#102C57] mb-3 flex items-center justify-between">
                <span>10-Year Earnings Trajectory Comparison</span>
                <span className="text-xs text-slate-500 font-normal">
                  INR Lakhs
                </span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-50/50">
                      <th className="py-2 px-3">Horizon</th>
                      <th className="py-2 px-3">Without EMBA</th>
                      <th className="py-2 px-3 text-[#102C57]">
                        With EMBA (Net)
                      </th>
                      <th className="py-2 px-3 text-emerald-700 font-black">
                        Net Career Wealth Delta
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {[
                      yearlyTrajectory[0],
                      yearlyTrajectory[2],
                      yearlyTrajectory[4],
                      yearlyTrajectory[9],
                    ].map((row) => (
                      <tr
                        key={row.year}
                        className="hover:bg-slate-50/60 transition"
                      >
                        <td className="py-2.5 px-3 font-bold text-slate-800">
                          Year {row.year}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600">
                          {formatCurrency(row.withoutEMBA)}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-[#102C57]">
                          {formatCurrency(row.withEMBA)}
                        </td>
                        <td className="py-2.5 px-3 font-black text-emerald-700">
                          +{formatCurrency(row.netBenefit)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Context-Aware Lead Capture [FR-TOOLS-010] */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <button
                  onClick={() =>
                    homeModals.openLeadModal(
                      `EMBA ROI Report - BreakEven: ${breakEvenYears} Yrs, 10Y Gain: ${formatCurrency(tenYearCumulativeGainINR)}`,
                    )
                  }
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#102C57] py-3 text-xs font-bold text-white shadow-md hover:bg-[#0c2242] transition cursor-pointer"
                >
                  <Sparkles className="h-4 w-4 text-[#EA5C2B]" />
                  <span>
                    Download Detailed Executive B-School ROI Dossier →
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
