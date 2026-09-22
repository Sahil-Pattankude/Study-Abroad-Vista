"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Clock,
  Bell,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  FileCheck,
  Send,
  Building2,
  Share2,
} from "lucide-react";
import { useHomeModals } from "@/components/home/HomeClientContext";

interface IntakeConfig {
  id: string;
  name: string;
  destination: string;
  programType: string;
  targetApplicationDeadline: string; // ISO date
  intakeStartDate: string;
}

const INTAKES_DATA: IntakeConfig[] = [
  {
    id: "uk-fall-2027",
    name: "Fall 2027 UK Masters (September Intake)",
    destination: "United Kingdom",
    programType: "Masters (MSc/MA)",
    targetApplicationDeadline: "2027-06-30",
    intakeStartDate: "September 2027",
  },
  {
    id: "germany-winter-2027",
    name: "Winter 2027 Germany Public Unis (Uni-Assist)",
    destination: "Germany",
    programType: "Masters (MSc - Tuition Free)",
    targetApplicationDeadline: "2027-07-15",
    intakeStartDate: "October 2027",
  },
  {
    id: "us-fall-2027-r1",
    name: "Fall 2027 US STEM Masters (Priority Round 1)",
    destination: "United States",
    programType: "STEM Masters (MS)",
    targetApplicationDeadline: "2026-12-15",
    intakeStartDate: "August 2027",
  },
  {
    id: "us-fall-2027-r2",
    name: "Fall 2027 US STEM Masters (Regular Round 2)",
    destination: "United States",
    programType: "STEM Masters (MS)",
    targetApplicationDeadline: "2027-02-01",
    intakeStartDate: "August 2027",
  },
  {
    id: "canada-fall-2027",
    name: "Fall 2027 Canada PGWP Programs",
    destination: "Canada",
    programType: "Post-Graduate Diploma / Masters",
    targetApplicationDeadline: "2027-03-01",
    intakeStartDate: "September 2027",
  },
  {
    id: "australia-feb-2027",
    name: "February 2027 Australia Semester 1",
    destination: "Australia",
    programType: "Bachelors & Masters",
    targetApplicationDeadline: "2026-11-30",
    intakeStartDate: "February 2027",
  },
];

const MILESTONES_SCHEDULE = [
  {
    daysBefore: 90,
    label: "T-90 Days: Finalize Shortlist & Standardized Exams",
    description:
      "Lock down your 5 target universities (Safe, Target, Reach). Take IELTS/TOEFL and GRE/GMAT if needed.",
    action: "University Shortlisting",
  },
  {
    daysBefore: 60,
    label: "T-60 Days: SOP, LORs & Official Transcripts",
    description:
      "Draft customized Statement of Purpose (SOP), collect 2–3 Academic/Work Recommendation letters, and request sealed university transcripts.",
    action: "Document Packaging",
  },
  {
    daysBefore: 30,
    label: "T-30 Days: Application Submission & Scholarship Portals",
    description:
      "Submit main portal applications (Uni-Assist, Common App, UCAS) and apply for university early-bird scholarships.",
    action: "Portal Submission",
  },
  {
    daysBefore: 15,
    label: "T-15 Days: Document Verification & Referee Verification",
    description:
      "Ensure all referees have submitted digital LORs. Check portal checklist for missing documents or APS certificates.",
    action: "Portal Audit",
  },
  {
    daysBefore: 7,
    label: "T-7 Days: Final Submission Check & Fee Payment",
    description:
      "Final review of application fee receipt and admission confirmation notice.",
    action: "Final Dispatch",
  },
  {
    daysBefore: 1,
    label: "T-1 Day: Portal Closing Deadline",
    description: "Portal strictly closes at 23:59 target university time zone.",
    action: "Deadline Closed",
  },
];

export function DeadlineTrackerClient() {
  const homeModals = useHomeModals();
  const [selectedIntakeId, setSelectedIntakeId] = useState("uk-fall-2027");
  const [reminderEmail, setReminderEmail] = useState("");
  const [reminderPhone, setReminderPhone] = useState("");
  const [reminderScheduled, setReminderScheduled] = useState(false);

  const activeIntake =
    INTAKES_DATA.find((i) => i.id === selectedIntakeId) || INTAKES_DATA[0];

  const handleScheduleReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (reminderEmail || reminderPhone) {
      setReminderScheduled(true);
      // Trigger context-aware lead tracking
      homeModals.openLeadModal(
        `Deadline Tracker Alert: ${activeIntake.name} (Deadline: ${activeIntake.targetApplicationDeadline})`,
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20 pt-8 sm:pt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Hero */}
        <div className="mb-8 text-center sm:text-left">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold text-[#EA5C2B]">
            <Clock className="h-3.5 w-3.5" />
            <span>Intake Milestones & Reminders • [FR-TOOLS-006]</span>
          </div>
          <h1 className="font-serif text-3xl font-black text-[#102C57] sm:text-4xl lg:text-5xl">
            Study Abroad Intake Deadline Tracker
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Track strict application cutoffs across UK, USA, Germany, Canada,
            and Australia. Get automated WhatsApp & Email reminders at 90, 60,
            30, 15, 7, and 1 days before admission portals close.
          </p>
        </div>

        {/* Intake Selector Grid */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-[#102C57] mb-3">
            Select Target Admission Intake & Destination
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {INTAKES_DATA.map((intake) => {
              const isSelected = intake.id === selectedIntakeId;
              return (
                <button
                  key={intake.id}
                  onClick={() => {
                    setSelectedIntakeId(intake.id);
                    setReminderScheduled(false);
                  }}
                  className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "border-[#EA5C2B] bg-orange-50/60 shadow-xs ring-1 ring-[#EA5C2B]"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                      {intake.destination} • {intake.intakeStartDate}
                    </span>
                    <h3 className="text-xs font-bold text-[#102C57] mt-1 leading-snug">
                      {intake.name}
                    </h3>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">
                      Deadline:
                    </span>
                    <span className="font-bold text-[#EA5C2B]">
                      {intake.targetApplicationDeadline}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column: Timeline Milestones + Reminder Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: 90-60-30-15-7-1 Day Timeline Milestones */}
          <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-extrabold text-[#102C57]">
                  Application Milestones Countdown Schedule
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Critical checkpoints for {activeIntake.name}
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                Target Deadline: {activeIntake.targetApplicationDeadline}
              </span>
            </div>

            <div className="space-y-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {MILESTONES_SCHEDULE.map((m, idx) => (
                <div key={idx} className="relative pl-10">
                  <div className="absolute left-2 top-0 -translate-x-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-[#102C57] text-white text-[10px] font-black shadow-xs">
                    {idx + 1}
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4 hover:bg-white hover:border-slate-200 transition">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <h4 className="text-xs font-bold text-slate-900">
                        {m.label}
                      </h4>
                      <span className="rounded-md bg-orange-100 px-2 py-0.5 text-[10px] font-extrabold text-[#EA5C2B]">
                        {m.action}
                      </span>
                    </div>
                    <p className="text-[12px] text-slate-600 mt-1.5 leading-relaxed">
                      {m.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Reminder Subscription Box */}
          <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-[#102C57] p-6 text-white shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-orange-300 mb-4">
                <Bell className="h-5 w-5 text-[#EA5C2B]" />
              </div>
              <h3 className="text-base font-extrabold text-white">
                Set Automated Deadline Reminders
              </h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Receive proactive alert notifications via WhatsApp and Email at
                90, 60, 30, 15, 7, and 1 days before {activeIntake.name} closes.
              </p>

              {reminderScheduled ? (
                <div className="mt-6 rounded-xl bg-emerald-500/20 p-4 border border-emerald-500/30 text-emerald-200 text-xs">
                  <div className="flex items-center gap-2 font-bold text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>Reminder Alerts Active!</span>
                  </div>
                  <p className="mt-1 text-[11px] text-emerald-200">
                    You are subscribed to timeline updates for{" "}
                    {activeIntake.name}. We will notify you before each critical
                    milestone.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleScheduleReminder}
                  className="mt-6 space-y-3.5"
                >
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={reminderEmail}
                      onChange={(e) => setReminderEmail(e.target.value)}
                      placeholder="student@gmail.com"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:border-[#EA5C2B] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      WhatsApp Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={reminderPhone}
                      onChange={(e) => setReminderPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-slate-700 bg-slate-800/90 px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:border-[#EA5C2B] focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#EA5C2B] py-3 text-xs font-bold text-white shadow-lg transition hover:bg-[#d94f20] active:scale-98 cursor-pointer mt-2"
                  >
                    <Bell className="h-4 w-4" />
                    <span>Activate 6-Stage Deadline Alerts →</span>
                  </button>
                </form>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 text-center">
              <button
                onClick={() =>
                  homeModals.openLeadModal(
                    `Application Guidance: ${activeIntake.name}`,
                  )
                }
                className="text-[11px] font-bold text-orange-300 hover:underline"
              >
                Need human admissions help? Book 1-on-1 counselor call
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
