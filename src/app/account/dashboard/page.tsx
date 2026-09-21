"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Compass,
  GraduationCap,
  Bookmark,
  Bot,
  Building2,
  User,
  LogOut,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  FileText,
  AlertCircle,
  Loader2,
  Lock,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

import { useState } from "react";
import { University } from "@/types";
import { fetchLiveUniversities } from "@/lib/supabase/dataFetchers";

export default function StudentAccountDashboard() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const displayName = user?.name || "Student";
  const [shortlistedUnis, setShortlistedUnis] = useState<University[]>([]);

  useEffect(() => {
    async function loadShortlists() {
      let allUnis: University[] = [];
      try {
        const live = await fetchLiveUniversities();
        if (live && live.length > 0) {
          allUnis = live;
        }
      } catch (e) {
        console.warn("Live fetch error:", e);
      }

      try {
        const stored = JSON.parse(
          localStorage.getItem("vista_saved_shortlist") || "[]",
        );
        if (Array.isArray(stored) && stored.length > 0) {
          const matched = stored
            .map((slug: string) => allUnis.find((u) => u.slug === slug))
            .filter(Boolean) as University[];
          setShortlistedUnis(matched);
        } else {
          setShortlistedUnis([]);
        }
      } catch {
        setShortlistedUnis([]);
      }
    }

    loadShortlists();

    const handleUpdate = () => loadShortlists();
    window.addEventListener("vista_shortlist_updated", handleUpdate);
    return () =>
      window.removeEventListener("vista_shortlist_updated", handleUpdate);
  }, []);

  const removeShortlist = (slug: string) => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("vista_saved_shortlist") || "[]",
      );
      const updated = stored.filter((s: string) => s !== slug);
      localStorage.setItem("vista_saved_shortlist", JSON.stringify(updated));
      setShortlistedUnis((prev) => prev.filter((u) => u.slug !== slug));
      window.dispatchEvent(new CustomEvent("vista_shortlist_updated"));
    } catch (e) {
      console.warn("Remove shortlist error:", e);
    }
  };

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/account/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#102C57]" />
        <p className="mt-3 text-xs font-semibold text-slate-500">
          Loading student dashboard...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-md">
          <Lock className="mx-auto h-10 w-10 text-[#102C57]" />
          <h2 className="mt-3 text-lg font-bold text-slate-900">
            Sign in Required
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Please sign in to access your student workspace.
          </p>
          <Link
            href="/login?redirect=/account/dashboard"
            className="mt-4 inline-block w-full rounded-xl bg-[#102C57] py-2.5 text-xs font-bold text-white hover:bg-[#0c2242]"
          >
            Sign In →
          </Link>
        </div>
      </div>
    );
  }

  // Template T-13: Progress indicator Level 1-4
  const profileSteps = [
    { level: "Level 1", label: "Basic Academic Profile", status: "completed" },
    {
      level: "Level 2",
      label: "Budget & Country Preferences",
      status: "completed",
    },
    { level: "Level 3", label: "Test Scores & Transcripts", status: "current" },
    {
      level: "Level 4",
      label: "Direct University Applications",
      status: "pending",
    },
  ];

  const recentChats = [
    {
      id: 1,
      title: "Germany MS in Data Science with €0 Tuition",
      date: "Today, 2:45 PM",
      messages: 8,
    },
    {
      id: 2,
      title: "UK Stay-Back Visa Rules after 1-Year Master's",
      date: "Yesterday",
      messages: 14,
    },
    {
      id: 3,
      title: "Blocked Account (Sperrkonto) Breakdown in INR",
      date: "Sep 08, 2026",
      messages: 5,
    },
  ];

  const deadlines = [
    {
      university: "TU Munich, Germany",
      program: "MS Informatics",
      cutoff: "May 31, 2027",
      daysLeft: 263,
      urgent: false,
    },
    {
      university: "Imperial College London, UK",
      program: "MSc Computing",
      cutoff: "Jan 15, 2027",
      daysLeft: 127,
      urgent: true,
    },
    {
      university: "University of Melbourne, Australia",
      program: "Master of IT",
      cutoff: "Nov 30, 2026",
      daysLeft: 81,
      urgent: true,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-slate-200 bg-white px-4 py-3.5 sm:px-6 lg:px-8 sticky top-0 z-30">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#102C57] text-white">
                <Compass className="h-5 w-5 text-[#EA5C2B]" />
              </div>
              <span className="text-lg font-extrabold text-[#102C57]">
                StudyAbroad<span className="text-[#EA5C2B]">Vista</span>
              </span>
            </Link>
            <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-800">
              Student Dashboard (T-13)
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-[#EA5C2B]" />
              {displayName}
            </span>
            <Link
              href="/login"
              onClick={logout}
              className="rounded-lg border border-slate-200 px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1"
            >
              <LogOut className="h-3 w-3" />
              Log Out
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content per Template T-13 */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1 space-y-8">
        {/* Welcome Message + Profile Completeness Progress (Level 1-4) */}
        <div className="rounded-3xl bg-gradient-to-r from-[#102C57] via-[#0d2346] to-[#163a70] p-6 sm:p-8 text-white shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-[#EA5C2B]">
                Student Workspace · DPDP Compliant
              </span>
              <h1 className="mt-2 text-2xl font-black font-serif sm:text-3xl text-white">
                Welcome back, {displayName}
              </h1>
              <p className="mt-1 text-xs text-slate-300 max-w-xl">
                Track your international education applications, shortlist
                rankings, and live AI counselling sessions.
              </p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-md border border-white/15 min-w-[280px]">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-bold text-slate-200">
                  Profile Readiness
                </span>
                <span className="font-black text-[#EA5C2B]">
                  Level 2 / 4 (65%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/20 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#D4AF37] to-[#EA5C2B] w-[65%]" />
              </div>
              <p className="mt-2 text-[11px] text-slate-300">
                <strong>Next Step:</strong> Upload IELTS/GRE score or GPA to
                unlock Level 3 direct shortlisting.
              </p>
            </div>
          </div>

          {/* Level 1-4 Steps */}
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-white/10 pt-6">
            {profileSteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    step.status === "completed"
                      ? "bg-emerald-500 text-white"
                      : step.status === "current"
                        ? "bg-[#EA5C2B] text-white animate-pulse"
                        : "bg-white/20 text-slate-300"
                  }`}
                >
                  {step.status === "completed" ? "✓" : idx + 1}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                    {step.level}
                  </p>
                  <p className="text-xs font-semibold text-white">
                    {step.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2-Column Core Section: Shortlists (Left) & Recommended Actions + Deadlines (Right) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column (8 cols): Shortlist section & Recent AI conversations */}
          <div className="lg:col-span-8 space-y-8">
            {/* Shortlist Section (Saved Universities/Programs) per W10 T-13 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#102C57] text-white">
                    <Bookmark className="h-5 w-5 text-[#EA5C2B]" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-[#102C57]">
                      Saved University Shortlist
                    </h2>
                    <p className="text-xs text-slate-500">
                      {shortlistedUnis.length > 0
                        ? `${shortlistedUnis.length} universities saved across your target destinations.`
                        : "No universities saved to your profile yet."}
                    </p>
                  </div>
                </div>
                <Link
                  href="/"
                  className="text-xs font-bold text-[#EA5C2B] hover:underline"
                >
                  + Add More Colleges
                </Link>
              </div>

              {shortlistedUnis.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    You haven't saved any universities yet. Browse top
                    universities across 19 destinations and click{" "}
                    <strong>★ Shortlist</strong> to track them here.
                  </p>
                  <Link
                    href="/"
                    className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[#102C57] px-4 py-2 text-xs font-bold text-white hover:bg-[#0c2242] transition"
                  >
                    <Building2 className="h-3.5 w-3.5 text-[#EA5C2B]" />
                    Explore Universities
                  </Link>
                </div>
              ) : (
                <div className="mt-4 divide-y divide-slate-100 overflow-hidden">
                  {shortlistedUnis.map((uni) => (
                    <div
                      key={uni.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-xl transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[#102C57]">
                          <Building2 className="h-5 w-5 text-[#EA5C2B]" />
                        </div>
                        <div>
                          <Link
                            href={`/universities/${uni.slug}`}
                            className="text-xs font-bold text-[#102C57] hover:underline"
                          >
                            {uni.name}
                          </Link>
                          <p className="text-[11px] text-slate-500">
                            {uni.country} • Global #{uni.rankingGlobal} • Min
                            IELTS: {uni.ieltsMinScore}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-800">
                          {uni.tuitionFeeRangeINR}
                        </span>
                        <Link
                          href={`/universities/${uni.slug}`}
                          className="rounded-xl bg-[#102C57] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#0c2242] transition"
                        >
                          View Details
                        </Link>
                        <button
                          onClick={() => removeShortlist(uni.slug)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition cursor-pointer"
                          title="Remove from shortlist"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent AI Conversations (Resume any) per W10 T-13 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <Bot className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-[#102C57]">
                      Recent AI Conversations
                    </h2>
                    <p className="text-xs text-slate-500">
                      Resume any personalized consultation with your AI
                      Counsellor.
                    </p>
                  </div>
                </div>
                <Link
                  href="/"
                  className="text-xs font-bold text-[#102C57] hover:underline flex items-center gap-1"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#EA5C2B]" />
                  Open Live AI Chat
                </Link>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {recentChats.map((chat) => (
                  <div
                    key={chat.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 hover:border-slate-300 transition flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-slate-400">
                        {chat.date}
                      </span>
                      <h4 className="mt-1 text-xs font-bold text-slate-800 line-clamp-2">
                        {chat.title}
                      </h4>
                    </div>
                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px]">
                      <span className="text-slate-500">
                        {chat.messages} responses
                      </span>
                      <Link
                        href="/"
                        className="font-bold text-[#EA5C2B] hover:underline"
                      >
                        Resume →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Recommended Actions, Deadline Tracker, & Recent Guides */}
          <div className="lg:col-span-4 space-y-6">
            {/* Recommended Actions (Personalized based on lead score) per W10 T-13 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-black text-[#102C57] flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#EA5C2B]" />
                Recommended Actions
              </h3>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3.5 text-xs">
                  <p className="font-bold text-amber-900">
                    Upload B1 German Certificate
                  </p>
                  <p className="mt-1 text-[11px] text-amber-800">
                    Increases tuition-free admission match by 40% for TU Berlin
                    & RWTH Aachen.
                  </p>
                  <button className="mt-2 text-xs font-bold text-amber-900 underline">
                    Upload Document →
                  </button>
                </div>

                <div className="rounded-2xl bg-indigo-50 border border-indigo-200 p-3.5 text-xs">
                  <p className="font-bold text-indigo-900">
                    Book 1-on-1 Visa Specialist Call
                  </p>
                  <p className="mt-1 text-[11px] text-indigo-800">
                    Review APS certificate requirements and blocked account
                    deposit timings.
                  </p>
                  <button className="mt-2 text-xs font-bold text-indigo-900 underline">
                    Schedule Call →
                  </button>
                </div>
              </div>
            </div>

            {/* Deadline Tracker Widget per W10 T-13 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-[#102C57] flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#EA5C2B]" />
                  Deadline Tracker
                </h3>
                <span className="text-[10px] font-bold text-slate-400">
                  2026-2027
                </span>
              </div>
              <div className="space-y-3">
                {deadlines.map((d, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs pb-3 border-b border-slate-100 last:border-0 last:pb-0"
                  >
                    <div>
                      <p className="font-bold text-slate-800">{d.university}</p>
                      <p className="text-[10px] text-slate-500">
                        {d.program} • {d.cutoff}
                      </p>
                    </div>
                    <span
                      className={`rounded-lg px-2 py-0.5 text-[10px] font-bold ${
                        d.urgent
                          ? "bg-rose-100 text-rose-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {d.daysLeft}d left
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Guides Viewed / Recommended per W10 T-13 */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-black text-[#102C57] flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-[#EA5C2B]" />
                Recommended Guides
              </h3>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link
                    href="/"
                    className="block rounded-xl p-2 hover:bg-slate-50"
                  >
                    <p className="font-bold text-[#102C57] hover:text-[#EA5C2B]">
                      Germany Blocked Account: 2026 Living Cost Guide
                    </p>
                    <p className="text-[10px] text-slate-400">
                      4 min read • Verified with German Embassy
                    </p>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/"
                    className="block rounded-xl p-2 hover:bg-slate-50"
                  >
                    <p className="font-bold text-[#102C57] hover:text-[#EA5C2B]">
                      UK Graduate Route Post-Study Visa Checklist
                    </p>
                    <p className="text-[10px] text-slate-400">
                      6 min read • Updated Home Office rules
                    </p>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
