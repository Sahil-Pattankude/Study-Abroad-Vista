"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Compass,
  GraduationCap,
  Bookmark,
  FileText,
  Bot,
  ArrowLeft,
  Building2,
  User,
  LogOut,
  Trash2,
} from "lucide-react";
import { FEATURED_UNIVERSITIES } from "@/lib/data/masterData";
import { fetchLiveUniversities } from "@/lib/supabase/dataFetchers";
import { University } from "@/types";
import { useAuth } from "@/lib/auth/AuthContext";

export default function StudentDashboardPage() {
  const { user, logout } = useAuth();
  const displayName = user?.name || "Student";
  const [shortlistedUnis, setShortlistedUnis] = useState<University[]>(
    FEATURED_UNIVERSITIES.slice(0, 4),
  );

  useEffect(() => {
    async function loadShortlists() {
      let allUnis = FEATURED_UNIVERSITIES;
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
          if (matched.length > 0) {
            setShortlistedUnis(matched);
            return;
          }
        }
      } catch (e) {
        console.warn("Shortlist read error:", e);
      }

      setShortlistedUnis(allUnis.slice(0, 4));
    }

    loadShortlists();

    const handleUpdate = () => {
      loadShortlists();
    };
    window.addEventListener("vista_shortlist_updated", handleUpdate);
    return () => {
      window.removeEventListener("vista_shortlist_updated", handleUpdate);
    };
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navbar */}
      <nav className="border-b border-slate-200 bg-white px-4 py-3.5 sm:px-6 lg:px-8">
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
              Student Dashboard
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-[#EA5C2B]" />
              Welcome, {displayName}
            </span>
            <Link
              href="/login"
              onClick={logout}
              className="rounded-lg border border-slate-200 px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1 transition"
            >
              <LogOut className="h-3 w-3" />
              Log Out
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {user?.role === "university" && (
          <div className="mb-5 flex items-center justify-between rounded-2xl border border-indigo-200 bg-indigo-50 p-4 text-xs font-bold text-[#102C57] shadow-xs">
            <div className="flex items-center gap-2.5">
              <Building2 className="h-5 w-5 text-[#EA5C2B]" />
              <span>
                You are signed in with university partner credentials (
                {user.email}).
              </span>
            </div>
            <Link
              href="/portal/university"
              className="rounded-xl bg-[#102C57] px-3.5 py-2 text-white hover:bg-[#0c2242] transition"
            >
              Switch to University Portal →
            </Link>
          </div>
        )}

        {/* Personalized Welcome Banner */}
        <div className="mb-6 rounded-3xl bg-gradient-to-r from-[#102C57] via-[#0e274d] to-[#153b75] p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-[#EA5C2B]">
              <GraduationCap className="h-3.5 w-3.5" /> Aspirant Workspace ·
              Profile Verified
            </div>
            <h1 className="mt-2 text-2xl font-black font-serif text-white sm:text-3xl">
              Welcome back, {displayName}!
            </h1>
            <p className="mt-1 text-xs text-slate-300">
              {user?.email ? `Registered email: ${user.email} • ` : ""}Target
              Intake: Fall 2027 • DPDP Act 2023 Compliant Workspace
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="rounded-xl bg-[#EA5C2B] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#ff7240] transition"
            >
              Explore 19 Destinations →
            </Link>
          </div>
        </div>
        {/* Profile Card & Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 text-[#102C57]">
              <Bookmark className="h-5 w-5 text-[#EA5C2B]" />
              <span className="text-xs font-bold uppercase">
                Saved Shortlists
              </span>
            </div>
            <p className="mt-3 text-2xl font-black text-[#102C57]">
              {shortlistedUnis.length}
            </p>
            <span className="text-[11px] text-slate-500">
              Universities in watchlist
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 text-[#102C57]">
              <FileText className="h-5 w-5 text-indigo-600" />
              <span className="text-xs font-bold uppercase">Evaluations</span>
            </div>
            <p className="mt-3 text-2xl font-black text-[#102C57]">2 Active</p>
            <span className="text-[11px] text-slate-500">
              Germany MS & Ireland
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 text-[#102C57]">
              <Bot className="h-5 w-5 text-emerald-600" />
              <span className="text-xs font-bold uppercase">
                AI Chat Sessions
              </span>
            </div>
            <p className="mt-3 text-2xl font-black text-[#102C57]">12 Chats</p>
            <span className="text-[11px] text-slate-500">
              Saved Gemini advice
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 text-[#102C57]">
              <GraduationCap className="h-5 w-5 text-purple-600" />
              <span className="text-xs font-bold uppercase">Consultation</span>
            </div>
            <p className="mt-3 text-2xl font-black text-[#102C57]">Confirmed</p>
            <span className="text-[11px] text-emerald-600 font-semibold">
              1-on-1 Call Tomorrow
            </span>
          </div>
        </div>

        {/* Shortlist Table */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-black text-[#102C57]">
                My Saved University Shortlist
              </h2>
              <p className="text-xs text-slate-500">
                Compare rankings, fees, and minimum IELTS cutoffs.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EA5C2B] hover:underline"
            >
              Explore more universities
            </Link>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="p-3">University</th>
                  <th className="p-3">Country</th>
                  <th className="p-3">Global Rank</th>
                  <th className="p-3">Annual Fees (INR)</th>
                  <th className="p-3">IELTS Requirement</th>
                  <th className="p-3">Work Visa</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shortlistedUnis.map((uni) => (
                  <tr key={uni.id} className="hover:bg-slate-50/70">
                    <td className="p-3 font-bold text-[#102C57] flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-[#EA5C2B]" />
                      <Link
                        href={`/universities/${uni.slug}`}
                        className="hover:underline"
                      >
                        {uni.name}
                      </Link>
                    </td>
                    <td className="p-3 font-medium text-slate-600">
                      {uni.country}
                    </td>
                    <td className="p-3 font-semibold text-slate-700">
                      #{uni.rankingGlobal}
                    </td>
                    <td className="p-3 font-bold text-slate-800">
                      {uni.tuitionFeeRangeINR}
                    </td>
                    <td className="p-3 text-slate-700">
                      {uni.ieltsMinScore} Bands
                    </td>
                    <td className="p-3 text-emerald-700 font-medium">
                      {uni.postStudyWorkMonths} Months
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/universities/${uni.slug}`}
                          className="rounded-lg bg-[#102C57] px-3 py-1 text-[11px] font-bold text-white hover:bg-[#0c2242] transition"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => removeShortlist(uni.slug)}
                          className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                          title="Remove from shortlist"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
