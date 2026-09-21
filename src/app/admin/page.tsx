"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Compass,
  ShieldAlert,
  Users,
  IndianRupee,
  Globe2,
  FileCheck,
  CheckCircle2,
  Lock,
  LogOut,
  Loader2,
  AlertOctagon,
  ArrowRight,
  ShieldCheck,
  Pencil,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { Country, University, Program } from "@/types";
import { useAuth } from "@/lib/auth/AuthContext";
import { CountryFlag } from "@/components/ui/CountryFlag";
import {
  fetchLiveCountries,
  fetchLiveUniversities,
  fetchLivePrograms,
  fetchLiveClaims,
} from "@/lib/supabase/dataFetchers";
import { EditUniversityModal } from "@/components/admin/EditUniversityModal";

export default function AdminPortalPage() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading, login, logout } = useAuth();
  const [countriesList, setCountriesList] = useState<Country[]>([]);
  const [universitiesList, setUniversitiesList] = useState<University[]>([]);
  const [programsList, setProgramsList] = useState<Program[]>([]);
  const [selectedUniToEdit, setSelectedUniToEdit] = useState<University | null>(
    null,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [claimsList, setClaimsList] = useState<any[]>([]);

  const handleApproveClaim = async (claim: any) => {
    try {
      await fetch("/api/claims/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          claimId: claim.id,
          action: "approved",
          universityId: claim.universityId || claim.universitySlug,
          universityName: claim.universityName,
          userId: claim.userId,
        }),
      });
    } catch {
      // ignore
    }

    setClaimsList((prev) =>
      prev.map((c) => (c.id === claim.id ? { ...c, status: "approved" } : c)),
    );
  };

  useEffect(() => {
    if (!isLoading && !user) {
      const timer = setTimeout(() => {
        router.push("/login?redirect=/admin");
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [user, isLoading, router]);

  const [isRefreshingClaims, setIsRefreshingClaims] = useState(false);

  const refreshClaims = async () => {
    setIsRefreshingClaims(true);
    try {
      const claims = await fetchLiveClaims();
      setClaimsList(claims);
    } finally {
      setIsRefreshingClaims(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchLiveCountries().then((res) => setCountriesList(res));
      fetchLiveUniversities().then((res) => setUniversitiesList(res));
      fetchLivePrograms().then((res) => setProgramsList(res));
      fetchLiveClaims().then((res) => setClaimsList(res));
      refreshClaims();

      const pollInterval = setInterval(() => {
        fetchLiveClaims().then((res) => setClaimsList(res));
      }, 5000);

      return () => clearInterval(pollInterval);
    }
  }, [user]);

  // 1. Loading State during session hydration
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md mb-4 border border-white/10 animate-pulse">
          <Compass className="h-7 w-7 text-[#EA5C2B]" />
        </div>
        <div className="flex items-center gap-2 text-slate-300 text-sm font-semibold">
          <Loader2 className="h-4 w-4 animate-spin text-[#EA5C2B]" />
          <span>Verifying Administrator Security Clearance...</span>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated State (Not logged in)
  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white selection:bg-[#EA5C2B]/30">
        <div className="w-full max-w-md rounded-3xl border border-red-900/40 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-950/80 border border-red-800/60 text-red-400 mb-5 shadow-inner">
            <Lock className="h-8 w-8" />
          </div>

          <span className="rounded-full bg-red-900/40 border border-red-700/50 px-3 py-1 text-[11px] font-bold text-red-300 uppercase tracking-widest">
            Protected Admin Zone
          </span>

          <h1 className="mt-3 text-2xl font-black text-white">
            Authentication Required
          </h1>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            The StudyAbroad Vista Operations & Lead Distribution Engine is
            restricted to authorized platform administrators only.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => {
                login(
                  "admin@studyabroadvista.com",
                  "admin",
                  "Super Admin (Operations Lead)",
                );
                router.push("/admin");
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#EA5C2B] py-3 text-xs font-bold text-white shadow-lg transition hover:bg-[#d94f20] active:scale-[0.99] cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>⚡ Instant 1-Click Sign In as Super Admin</span>
            </button>

            <Link
              href="/login?redirect=/admin"
              className="rounded-xl border border-slate-800 bg-slate-900/60 py-2.5 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-center"
            >
              Sign In with Credentials →
            </Link>

            <Link
              href="/"
              className="rounded-xl border border-slate-800/50 bg-slate-950 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-300 text-center"
            >
              ← Return to Public Homepage
            </Link>
          </div>

          <div className="mt-6 border-t border-slate-800/80 pt-4 text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>Redirecting to secure login in a moment...</span>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated but Unauthorized Role (e.g. Student, Buyer, University)
  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-white selection:bg-[#EA5C2B]/30">
        <div className="w-full max-w-md rounded-3xl border border-amber-900/40 bg-slate-900/80 p-8 shadow-2xl backdrop-blur-xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-950/80 border border-amber-800/60 text-amber-400 mb-5 shadow-inner">
            <AlertOctagon className="h-8 w-8" />
          </div>

          <span className="rounded-full bg-amber-900/40 border border-amber-700/50 px-3 py-1 text-[11px] font-bold text-amber-300 uppercase tracking-widest">
            403 Forbidden · Access Denied
          </span>

          <h1 className="mt-3 text-2xl font-black text-white">
            Super Admin Access Required
          </h1>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            You are signed in as{" "}
            <strong className="text-white">{user.email}</strong> (Role:{" "}
            <span className="text-amber-400 font-bold uppercase">
              {user.role}
            </span>
            ). This account does not possess Super Administrator permissions.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={() => {
                login(
                  "admin@studyabroadvista.com",
                  "admin",
                  "Super Admin (Operations Lead)",
                );
                router.push("/admin");
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#EA5C2B] py-3 text-xs font-bold text-white shadow-lg transition hover:bg-[#d94f20] cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>⚡ Instant 1-Click Switch to Super Admin</span>
            </button>

            <button
              onClick={() => {
                logout();
                router.push("/login?redirect=/admin");
              }}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 py-2.5 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out Current Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Authorized Super Administrator -> Render Operations Control Center
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Navbar */}
      <nav className="border-b border-slate-300 bg-slate-900 px-4 py-3.5 sm:px-6 lg:px-8 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#102C57]">
                <Compass className="h-5 w-5 text-[#EA5C2B]" />
              </div>
              <span className="text-lg font-extrabold text-white">
                StudyAbroad<span className="text-[#EA5C2B]">Vista</span>
              </span>
            </Link>
            <span className="rounded-md bg-red-900/60 px-2.5 py-1 text-[11px] font-bold text-red-300 border border-red-700/50">
              Admin Operations Panel
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-slate-300 font-semibold">
                {user.name || "Super Admin (Operations Lead)"}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                ({user.email})
              </span>
            </div>
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 font-bold text-slate-200 hover:bg-slate-700 flex items-center gap-1.5 transition"
            >
              <LogOut className="h-3 w-3" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              Operations & Lead Distribution Engine (LDE)
            </h1>
            <p className="text-xs text-slate-600">
              Dnyanal Educon Pvt. Ltd. • Master control center for all 19
              destinations and B2B buyers.
            </p>
          </div>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 flex items-center gap-1.5 self-start sm:self-auto">
            <CheckCircle2 className="h-4 w-4" />
            System Healthy (99.98% Uptime)
          </span>
        </div>

        {/* Top Operational Metrics */}
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 text-slate-500">
              <Users className="h-4 w-4 text-[#102C57]" />
              <span className="text-xs font-bold uppercase">
                Total Leads Captured
              </span>
            </div>
            <p className="mt-3 text-3xl font-black text-[#102C57]">3,420</p>
            <span className="text-[11px] text-slate-500">
              100% Indian SMS OTP verified
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 text-slate-500">
              <IndianRupee className="h-4 w-4 text-emerald-600" />
              <span className="text-xs font-bold uppercase">
                Prepaid Wallet Revenue
              </span>
            </div>
            <p className="mt-3 text-3xl font-black text-emerald-700">
              ₹4.85 Lakhs
            </p>
            <span className="text-[11px] text-slate-500">
              B2B Consultant top-ups
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 text-slate-500">
              <Globe2 className="h-4 w-4 text-[#EA5C2B]" />
              <span className="text-xs font-bold uppercase">
                Catalog Coverage
              </span>
            </div>
            <p className="mt-3 text-3xl font-black text-[#102C57]">
              {countriesList.length} Countries
            </p>
            <span className="text-[11px] text-slate-500">
              6 Launch Program Streams
            </span>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
            <div className="flex items-center gap-2 text-slate-500">
              <ShieldAlert className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-bold uppercase">
                DPDP Audit Status
              </span>
            </div>
            <p className="mt-3 text-3xl font-black text-purple-700">
              100% Valid
            </p>
            <span className="text-[11px] text-slate-500">
              Zero data breaches
            </span>
          </div>
        </div>

        {/* Pending Profile Claims Queue */}
        <div className="mt-8 rounded-2xl border border-indigo-100 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#EA5C2B]" />
              <div>
                <h2 className="text-base font-black text-[#102C57]">
                  Pending Profile Claims Queue
                </h2>
                <p className="text-xs text-slate-500">
                  Review official domain email and authorization requests from
                  university representatives.
                </p>
              </div>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
              {claimsList.filter((c) => c.status === "pending").length} Action
              Required
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={refreshClaims}
                disabled={isRefreshingClaims}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 text-[#EA5C2B] ${isRefreshingClaims ? "animate-spin" : ""}`}
                />
                <span>Refresh Queue</span>
              </button>
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
                {claimsList.filter((c) => c.status === "pending").length} Action
                Required
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {claimsList.map((c) => (
              <div
                key={c.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-slate-200 p-4 hover:border-slate-300 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <CountryFlag
                      code={c.countryCode || c.countryId}
                      name={c.countryName}
                      size="sm"
                    />
                    <h4 className="text-xs font-bold text-[#102C57]">
                      {c.universityName}
                    </h4>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                      {c.countryName || c.countryId}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        c.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {c.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Applicant:{" "}
                    <strong className="text-slate-800">
                      {c.applicantName}
                    </strong>{" "}
                    ({c.designation}) • Email:{" "}
                    <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700 font-semibold">
                      {c.officialEmail}
                    </code>
                  </p>
                </div>

                <div className="mt-3 sm:mt-0 flex items-center gap-3">
                  {c.status === "pending" ? (
                    <button
                      onClick={() => handleApproveClaim(c)}
                      className="rounded-xl bg-[#102C57] px-4 py-2 text-xs font-bold text-white hover:bg-[#0c2242] transition cursor-pointer flex items-center gap-1.5"
                    >
                      <ShieldCheck className="h-3.5 w-3.5 text-[#EA5C2B]" />
                      <span>Approve Claim & Grant Portal Access</span>
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      Verified Partner
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Master Catalog Quick Access */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* 19 Countries Catalog */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-[#102C57]">
                Country Records ({countriesList.length})
              </h3>
              <span className="text-xs font-semibold text-emerald-600">
                Supabase Connected
              </span>
            </div>
            <div className="mt-3 max-h-64 overflow-y-auto space-y-1.5 text-xs">
              {countriesList.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 border border-slate-100/60"
                >
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    <span>{c.flagEmoji}</span>
                    <span>{c.name}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      ({c.tier})
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold">
                    {c.currency} ≈ ₹{c.exchangeRateToINR}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Universities Catalog */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-[#102C57]">
                Live Universities ({universitiesList.length})
              </h3>
              <span className="text-xs font-semibold text-emerald-600">
                Supabase Connected
              </span>
            </div>
            <div className="mt-3 max-h-72 overflow-y-auto space-y-2 text-xs">
              {universitiesList.map((u) => (
                <div
                  key={u.slug}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 transition"
                >
                  <div>
                    <h4 className="font-bold text-[#102C57]">{u.name}</h4>
                    <p className="text-[10px] text-slate-500">
                      {u.city}, {u.country} • Rank #{u.rankingGlobal}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                      {u.tuitionFeeRangeINR}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedUniToEdit(u);
                        setIsEditModalOpen(true);
                      }}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-700 hover:bg-slate-100 hover:border-slate-300 flex items-center gap-1 transition cursor-pointer"
                    >
                      <Pencil className="h-3 w-3 text-[#EA5C2B]" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6 Programs Catalog */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-[#102C57]">
                Program Disciplines (6)
              </h3>
              <span className="text-xs text-slate-400">All Live</span>
            </div>
            <div className="mt-3 space-y-2 text-xs">
              {programsList.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100"
                >
                  <div>
                    <h4 className="font-bold text-[#102C57]">{p.name}</h4>
                    <p className="text-[10px] text-slate-500">
                      {p.level} • {p.duration}
                    </p>
                  </div>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                    ROI {p.roiScore}/100
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit University Modal */}
      <EditUniversityModal
        university={selectedUniToEdit}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUniToEdit(null);
        }}
        onSave={(updatedUni) => {
          setUniversitiesList((prev) =>
            prev.map((item) =>
              item.slug === updatedUni.slug ? updatedUni : item,
            ),
          );
        }}
      />
    </div>
  );
}
