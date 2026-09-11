"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Compass, 
  Building2, 
  Eye, 
  Users, 
  FileCheck, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  LogOut,
  TrendingUp,
  Award,
  Loader2,
  Lock
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

export default function UniversityPortalDashboard() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const orgName = user?.organization || user?.name || "Technical University of Munich (TUM)";

  useEffect(() => {
    if (!isLoading && (!user || (user.role !== "university" && user.role !== "admin"))) {
      router.push("/login?redirect=/university/dashboard");
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
          <p className="mt-1 text-xs text-slate-500">Please sign in with your verified university partner credentials.</p>
          <Link
            href="/login?redirect=/university/dashboard"
            className="mt-4 inline-block w-full rounded-xl bg-[#102C57] py-2.5 text-xs font-bold text-white hover:bg-[#0c2242]"
          >
            Sign In to Partner Portal →
          </Link>
        </div>
      </div>
    );
  }

  const metrics = [
    { label: "Profile Impressions (30d)", value: "38,450", change: "+18% vs last month" },
    { label: "Indian Student Inquiries", value: "412", change: "Target: Fall 2027" },
    { label: "Direct Applications Initiated", value: "86", change: "Verified English Medium" },
    { label: "Profile Verification Tier", value: "Verified Gold", change: "Institutional Partner" },
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
            <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700">
              University Partner Portal (T-15)
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
              className="rounded-lg border border-slate-200 px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1"
            >
              <LogOut className="h-3 w-3" />
              Log Out
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1 space-y-8">
        {/* Featured Tier Status + Upgrade CTA per W10 T-15 */}
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-[#102C57] p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-[#D4AF37]">
              <Award className="h-3.5 w-3.5" /> Institutional Partner Tier: Gold Listing
            </div>
            <h1 className="mt-2 text-2xl font-black font-serif sm:text-3xl text-white">
              {orgName} · Partner Console
            </h1>
            <p className="mt-1 text-xs text-indigo-200 max-w-xl">
              Showcase accredited English-taught degrees to 1.2M+ annual Indian visitors across 19 destinations.
            </p>
          </div>
          <button className="rounded-xl bg-[#EA5C2B] px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-[#ff7240] transition">
            Upgrade to Platinum Spotlight →
          </button>
        </div>

        {/* Analytics Widgets: Impressions, Clicks, Applications per W10 T-15 */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {metrics.map((m, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{m.label}</span>
              <p className="mt-2 text-2xl font-black text-[#102C57]">{m.value}</p>
              <span className="text-[11px] text-emerald-600 font-semibold">{m.change}</span>
            </div>
          ))}
        </div>

        {/* Program Editor Quick Access & Inquiries per W10 T-15 */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Program Editor Quick Access */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-black text-[#102C57]">Published Programs (6 Active)</h3>
              <button className="rounded-xl bg-[#102C57] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#0c2242]">
                + Add New Program
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { name: "M.Sc. in Robotics, Cognition, Intelligence", intake: "Winter 2027", fee: "€0 Tuition", views: "14.2K" },
                { name: "M.Sc. in Data Engineering and Analytics", intake: "Winter 2027", fee: "€0 Tuition", views: "18.9K" },
                { name: "M.Sc. in Management & Technology (TUM-BWL)", intake: "Winter 2027", fee: "€0 Tuition", views: "9.5K" },
              ].map((prog, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/60 text-xs">
                  <div>
                    <p className="font-bold text-[#102C57]">{prog.name}</p>
                    <p className="text-[10px] text-slate-500">{prog.intake} • {prog.fee}</p>
                  </div>
                  <button className="text-xs font-bold text-[#EA5C2B] hover:underline">
                    Edit Fees & Intake
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Campaign Performance & Student Inquiries */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-black text-[#102C57]">Indian Student Inquiries</h3>
              <span className="text-xs font-bold text-slate-400">Past 48 Hours</span>
            </div>
            <div className="mt-4 space-y-3">
              {[
                { student: "Student", degree: "B.Tech CSE (8.8 CGPA)", program: "MS Data Engineering", date: "10 mins ago" },
                { student: "Ananya Deshmukh", degree: "B.E. Mechanical (8.4 CGPA)", program: "MS Automotive Engineering", date: "2 hrs ago" },
                { student: "Karthik Raja", degree: "B.Sc. IT (8.9 CGPA)", program: "M.Sc. Informatics", date: "5 hrs ago" },
              ].map((inq, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/60 text-xs">
                  <div>
                    <p className="font-bold text-[#102C57]">{inq.student}</p>
                    <p className="text-[10px] text-slate-500">{inq.degree} • Interested in {inq.program}</p>
                  </div>
                  <button className="rounded-lg bg-indigo-600 px-3 py-1 text-[11px] font-bold text-white hover:bg-indigo-700">
                    Review Profile
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
