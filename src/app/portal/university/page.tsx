"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Compass, Building2, Eye, Users, FileCheck, CheckCircle2, User, LogOut, Loader2, Lock } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

export default function UniversityPortalPage() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const orgName = user?.organization || user?.name || "Technical University of Munich (TUM)";

  useEffect(() => {
    if (!isLoading && (!user || (user.role !== "university" && user.role !== "admin"))) {
      router.push("/login?redirect=/portal/university");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#102C57]" />
        <p className="mt-3 text-xs font-semibold text-slate-500">Loading university partner workspace...</p>
      </div>
    );
  }

  if (!user || (user.role !== "university" && user.role !== "admin")) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-md">
          <Lock className="mx-auto h-10 w-10 text-[#102C57]" />
          <h2 className="mt-3 text-lg font-bold text-slate-900">University Partner Portal</h2>
          <p className="mt-1 text-xs text-slate-500">Please sign in with your verified university partner credentials to view applicant analytics.</p>
          <Link
            href="/login?redirect=/portal/university"
            className="mt-4 inline-block w-full rounded-xl bg-[#102C57] py-2.5 text-xs font-bold text-white hover:bg-[#0c2242]"
          >
            Sign In to Partner Portal →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
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
            <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700">
              University Partner Portal
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-[#EA5C2B]" />
              {orgName}
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

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-[#102C57]">Institutional Listing Dashboard</h1>
            <p className="text-xs text-slate-500">Manage course offerings, entry criteria, and student views from India.</p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            <CheckCircle2 className="h-4 w-4" />
            Verified Institution
          </span>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 text-slate-500">
              <Eye className="h-4 w-4 text-[#EA5C2B]" />
              <span className="text-xs font-bold uppercase">Profile Impressions (30d)</span>
            </div>
            <p className="mt-3 text-3xl font-black text-[#102C57]">14,280</p>
            <span className="text-[11px] text-emerald-600 font-semibold">↑ 18% from last month</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 text-slate-500">
              <Users className="h-4 w-4 text-indigo-600" />
              <span className="text-xs font-bold uppercase">Direct Inquiries</span>
            </div>
            <p className="mt-3 text-3xl font-black text-[#102C57]">382</p>
            <span className="text-[11px] text-slate-500">Indian student profiles matched</span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 text-slate-500">
              <FileCheck className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-bold uppercase">Active Programs</span>
            </div>
            <p className="mt-3 text-3xl font-black text-[#102C57]">24 Listed</p>
            <span className="text-[11px] text-slate-500">MS Computer Science, Robotics, etc.</span>
          </div>
        </div>

        {/* Programs Catalog Manager */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-base font-black text-[#102C57]">Published Academic Programs</h2>
            <button className="rounded-xl bg-[#102C57] px-4 py-2 text-xs font-bold text-white hover:bg-[#0c2242]">
              + Add New Program
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {[
              { name: "M.Sc. in Data Engineering and Analytics", level: "Postgraduate (2 Yrs)", fees: "€0 (Public University)", deadline: "May 31, 2026" },
              { name: "M.Sc. in Robotics, Cognition, Intelligence", level: "Postgraduate (2 Yrs)", fees: "€0 (Public University)", deadline: "May 31, 2026" },
              { name: "M.Sc. in Management & Technology", level: "Postgraduate (2 Yrs)", fees: "€0 (Public University)", deadline: "May 31, 2026" },
            ].map((p, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-slate-200 p-4 hover:border-slate-300">
                <div>
                  <h4 className="text-xs font-bold text-[#102C57]">{p.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{p.level} • Next Intake: {p.deadline}</p>
                </div>
                <div className="mt-2 sm:mt-0 flex items-center gap-4">
                  <span className="text-xs font-black text-emerald-700">{p.fees}</span>
                  <button className="rounded-lg border border-slate-200 px-3 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50">
                    Edit Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
