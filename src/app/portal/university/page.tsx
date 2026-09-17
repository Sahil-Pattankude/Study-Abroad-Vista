"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Compass, Building2, Eye, Users, FileCheck, CheckCircle2, LogOut, Loader2, Lock, X, Plus, Pencil, Save } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { supabase } from "@/lib/supabase/client";
import { EditUniversityProfileModal } from "@/components/university/EditUniversityProfileModal";
import { fetchLiveUniversities, fetchLiveClaims } from "@/lib/supabase/dataFetchers";

interface ProgramItem {
  id: number | string;
  name: string;
  level: string;
  fees: string;
  deadline: string;
}

function getCountryFlag(country?: string): string {
  if (!country) return "🌐";
  const lower = country.toLowerCase();
  if (lower.includes("canada")) return "🇨🇦";
  if (lower.includes("germany")) return "🇩🇪";
  if (lower.includes("uk") || lower.includes("united kingdom") || lower.includes("britain")) return "🇬🇧";
  if (lower.includes("usa") || lower.includes("united states") || lower.includes("america")) return "🇺🇸";
  if (lower.includes("australia")) return "🇦🇺";
  if (lower.includes("ireland")) return "🇮🇪";
  if (lower.includes("france")) return "🇫🇷";
  if (lower.includes("netherlands")) return "🇳🇱";
  if (lower.includes("singapore")) return "🇸🇬";
  if (lower.includes("nz") || lower.includes("zealand")) return "🇳🇿";
  return "🌐";
}

function getInitialProfileForUser(email?: string) {
  const lower = email?.toLowerCase() || "";
  if (lower.includes("canada") || lower.includes("toronto")) {
    return {
      id: "university-of-toronto",
      name: "University of Toronto",
      city: "Toronto",
      country: "Canada",
      rankingGlobal: 21,
      rankingNational: 1,
      tuitionFeeRangeINR: "CAD $42,500 / yr",
      ieltsMinScore: 7.0,
      acceptanceRate: 43,
      postStudyWorkMonths: 36,
    };
  }
  if (lower.includes("oxford") || lower.includes("ox.ac.uk")) {
    return {
      id: "university-of-oxford",
      name: "University of Oxford",
      city: "Oxford",
      country: "United Kingdom",
      rankingGlobal: 3,
      rankingNational: 1,
      tuitionFeeRangeINR: "£33,970 / yr",
      ieltsMinScore: 7.5,
      acceptanceRate: 17,
      postStudyWorkMonths: 24,
    };
  }
  if (lower.includes("melbourne") || lower.includes("unimelb") || lower.includes("australia")) {
    return {
      id: "university-of-melbourne",
      name: "University of Melbourne",
      city: "Melbourne",
      country: "Australia",
      rankingGlobal: 14,
      rankingNational: 1,
      tuitionFeeRangeINR: "AUD $44,000 / yr",
      ieltsMinScore: 6.5,
      acceptanceRate: 35,
      postStudyWorkMonths: 36,
    };
  }
  if (lower.includes("stanford")) {
    return {
      id: "stanford-university",
      name: "Stanford University",
      city: "Stanford",
      country: "United States",
      rankingGlobal: 5,
      rankingNational: 2,
      tuitionFeeRangeINR: "$58,746 / yr",
      ieltsMinScore: 7.5,
      acceptanceRate: 4,
      postStudyWorkMonths: 36,
    };
  }
  return {
    id: "technical-university-of-munich",
    name: "Technical University of Munich (TUM)",
    city: "Munich",
    country: "Germany",
    rankingGlobal: 28,
    rankingNational: 1,
    tuitionFeeRangeINR: "€0 (Public University)",
    ieltsMinScore: 6.5,
    acceptanceRate: 8,
    postStudyWorkMonths: 18,
  };
}

export default function UniversityPortalPage() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  
  const [profileData, setProfileData] = useState(() => getInitialProfileForUser(user?.email));

  const orgName = profileData.name;
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const [programsList, setProgramsList] = useState<ProgramItem[]>(() => {
    const initUni = getInitialProfileForUser(user?.email);
    if (initUni.country === "Canada") {
      return [
        { id: 101, name: "M.Sc. in Applied Computing (MScAC)", level: "Postgraduate (16 Mos)", fees: "CAD $42,500 / yr", deadline: "December 1, 2025" },
        { id: 102, name: "Full-time MBA (Rotman School of Management)", level: "Postgraduate (2 Yrs)", fees: "CAD $62,000 / yr", deadline: "January 15, 2026" },
        { id: 103, name: "B.Sc. in Computer Science & Artificial Intelligence", level: "Undergraduate (4 Yrs)", fees: "CAD $58,000 / yr", deadline: "January 15, 2026" },
      ];
    }
    if (initUni.country === "Australia") {
      return [
        { id: 401, name: "Master of Information Technology (AI & Cloud)", level: "Postgraduate (2 Yrs)", fees: "AUD $46,500 / yr", deadline: "November 30, 2025" },
        { id: 402, name: "Master of Management (Finance & Strategy)", level: "Postgraduate (1.5 Yrs)", fees: "AUD $48,000 / yr", deadline: "November 30, 2025" },
        { id: 403, name: "Bachelor of Science (Computer Science Specialisation)", level: "Undergraduate (3 Yrs)", fees: "AUD $44,000 / yr", deadline: "December 15, 2025" },
      ];
    }
    return [
      { id: 1, name: "M.Sc. in Data Engineering and Analytics", level: "Postgraduate (2 Yrs)", fees: "€0 (Public University)", deadline: "May 31, 2026" },
      { id: 2, name: "M.Sc. in Robotics, Cognition, Intelligence", level: "Postgraduate (2 Yrs)", fees: "€0 (Public University)", deadline: "May 31, 2026" },
      { id: 3, name: "M.Sc. in Management & Technology", level: "Postgraduate (2 Yrs)", fees: "€0 (Public University)", deadline: "May 31, 2026" },
    ];
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgramItem | null>(null);

  // Modal Form State
  const [formName, setFormName] = useState("");
  const [formLevel, setFormLevel] = useState("Postgraduate (2 Yrs)");
  const [formFees, setFormFees] = useState("€0 (Public University)");
  const [formDeadline, setFormDeadline] = useState("May 31, 2026");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || (user.role !== "university" && user.role !== "admin"))) {
      router.push("/login?redirect=/portal/university");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user?.email) {
      const derived = getInitialProfileForUser(user.email);
      setProfileData(derived);
    }
  }, [user?.email]);

  useEffect(() => {
    async function loadUniversityData() {
      if (!user) return;

      try {
        const claims = await fetchLiveClaims();
        const unis = await fetchLiveUniversities();

        // 1. Check if user's email matches a claim in university_claims
        const matchedClaim = claims.find(
          (c) => c.officialEmail?.toLowerCase() === user.email?.toLowerCase() || (c.userId && c.userId === user.id)
        );

        let targetUniSlug = matchedClaim?.universityId || "";

        // 2. Direct fallback heuristics by domain if no claim found
        if (!targetUniSlug && user.email) {
          const lowerEmail = user.email.toLowerCase();
          if (lowerEmail.includes("toronto") || lowerEmail.includes("canada")) {
            targetUniSlug = "university-of-toronto";
          } else if (lowerEmail.includes("melbourne") || lowerEmail.includes("unimelb") || lowerEmail.includes("australia")) {
            targetUniSlug = "university-of-melbourne";
          } else if (lowerEmail.includes("oxford") || lowerEmail.includes("ox.ac.uk")) {
            targetUniSlug = "university-of-oxford";
          } else if (lowerEmail.includes("stanford")) {
            targetUniSlug = "stanford-university";
          } else if (lowerEmail.includes("tum.de")) {
            targetUniSlug = "technical-university-of-munich";
          }
        }

        // 3. Match university in live catalog
        let matchedUni = unis.find(
          (u) =>
            u.id === matchedClaim?.universityId ||
            u.slug === matchedClaim?.universityId ||
            u.slug === targetUniSlug ||
            u.id === targetUniSlug ||
            u.slug.includes(targetUniSlug) ||
            targetUniSlug.includes(u.slug) ||
            (targetUniSlug === "unimelb" && u.slug === "university-of-melbourne")
        );

        // Fallback for custom submitted claim not in static list
        if (!matchedUni && matchedClaim) {
          const isAus = matchedClaim.officialEmail?.toLowerCase().includes("unimelb") || matchedClaim.officialEmail?.toLowerCase().includes("australia") || matchedClaim.universityName.toLowerCase().includes("melbourne");
          const isCanada = matchedClaim.officialEmail?.toLowerCase().includes("canada") || matchedClaim.universityName.toLowerCase().includes("toronto");
          matchedUni = {
            id: matchedClaim.universityId || "custom-uni",
            name: matchedClaim.universityName,
            slug: matchedClaim.universityId || "custom-uni",
            city: isAus ? "Melbourne" : isCanada ? "Toronto" : "Main Campus",
            country: isAus ? "Australia" : isCanada ? "Canada" : "Global",
            rankingGlobal: isAus ? 14 : 21,
            rankingNational: 1,
            tuitionFeeRangeINR: isAus ? "AUD $44,000 / yr" : isCanada ? "CAD $42,500 / yr" : "Competitive Tuition",
            ieltsMinScore: 6.5,
            acceptanceRate: 35,
            postStudyWorkMonths: 36,
            countrySlug: isAus ? "australia" : isCanada ? "canada" : "global",
            programsOffered: ["ms", "mba"],
            greGmatRequired: false,
            intakes: ["Semester 1", "Semester 2"],
            featured: true,
            claimed_status: "claimed"
          };
        }

        if (!matchedUni) {
          matchedUni = unis.find((u) => u.slug === "university-of-melbourne") || unis.find((u) => u.slug === "technical-university-of-munich");
        }

        if (matchedUni) {
          setProfileData({
            id: matchedUni.slug || matchedUni.id,
            name: matchedUni.name,
            city: matchedUni.city,
            country: matchedUni.country,
            rankingGlobal: matchedUni.rankingGlobal || 10,
            rankingNational: matchedUni.rankingNational || 1,
            tuitionFeeRangeINR: matchedUni.tuitionFeeRangeINR,
            ieltsMinScore: matchedUni.ieltsMinScore,
            acceptanceRate: matchedUni.acceptanceRate,
            postStudyWorkMonths: matchedUni.postStudyWorkMonths,
          });

          // Tailor program list for matched university
          if (matchedUni.country === "Australia" || matchedUni.slug.includes("melbourne") || targetUniSlug.includes("unimelb") || matchedUni.id === "unimelb") {
            setProgramsList([
              { id: 401, name: "Master of Information Technology (AI & Cloud)", level: "Postgraduate (2 Yrs)", fees: "AUD $46,500 / yr", deadline: "November 30, 2025" },
              { id: 402, name: "Master of Management (Finance & Strategy)", level: "Postgraduate (1.5 Yrs)", fees: "AUD $48,000 / yr", deadline: "November 30, 2025" },
              { id: 403, name: "Bachelor of Science (Computer Science Specialisation)", level: "Undergraduate (3 Yrs)", fees: "AUD $44,000 / yr", deadline: "December 15, 2025" },
            ]);
          } else if (matchedUni.country === "Canada" || matchedUni.slug.includes("toronto") || targetUniSlug.includes("utoronto") || matchedUni.id === "utoronto") {
            setProgramsList([
              { id: 101, name: "M.Sc. in Applied Computing (MScAC)", level: "Postgraduate (16 Mos)", fees: "CAD $42,500 / yr", deadline: "December 1, 2025" },
              { id: 102, name: "Full-time MBA (Rotman School of Management)", level: "Postgraduate (2 Yrs)", fees: "CAD $62,000 / yr", deadline: "January 15, 2026" },
              { id: 103, name: "B.Sc. in Computer Science & Artificial Intelligence", level: "Undergraduate (4 Yrs)", fees: "CAD $58,000 / yr", deadline: "January 15, 2026" },
            ]);
          } else if (matchedUni.country === "United Kingdom" || matchedUni.slug.includes("oxford")) {
            setProgramsList([
              { id: 201, name: "M.Sc. in Advanced Computer Science", level: "Postgraduate (1 Yr)", fees: "£33,970 / yr", deadline: "January 8, 2026" },
              { id: 202, name: "Oxford Full-time MBA (Saïd Business School)", level: "Postgraduate (1 Yr)", fees: "£78,500 Total", deadline: "January 8, 2026" },
            ]);
          } else if (matchedUni.country === "United States" || matchedUni.slug.includes("stanford")) {
            setProgramsList([
              { id: 301, name: "MS in Computer Science (Artificial Intelligence)", level: "Postgraduate (2 Yrs)", fees: "$58,746 / yr", deadline: "December 15, 2025" },
              { id: 302, name: "Stanford MBA Program (GSB)", level: "Postgraduate (2 Yrs)", fees: "$79,860 / yr", deadline: "January 6, 2026" },
            ]);
          }
        }
      } catch (err) {
        console.warn("Error loading university claimed profile:", err);
      }
    }

    loadUniversityData();
  }, [user]);

  const handleOpenAddModal = () => {
    setEditingProgram(null);
    setFormName("");
    setFormLevel("Postgraduate (2 Yrs)");
    setFormFees("€0 (Public University)");
    setFormDeadline("May 31, 2026");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prog: ProgramItem) => {
    setEditingProgram(prog);
    setFormName(prog.name);
    setFormLevel(prog.level);
    setFormFees(prog.fees);
    setFormDeadline(prog.deadline);
    setIsModalOpen(true);
  };

  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setSaving(true);

    try {
      if (editingProgram) {
        // Edit existing program
        const updated = programsList.map((p) =>
          p.id === editingProgram.id
            ? { ...p, name: formName, level: formLevel, fees: formFees, deadline: formDeadline }
            : p
        );
        setProgramsList(updated);
      } else {
        // Add new program
        const newProg: ProgramItem = {
          id: Date.now(),
          name: formName,
          level: formLevel,
          fees: formFees,
          deadline: formDeadline,
        };
        setProgramsList([...programsList, newProg]);
      }

      // Silently sync to Supabase table if available
      try {
        await supabase.from("programs").upsert({
          id: editingProgram ? String(editingProgram.id) : undefined,
          name: formName,
          level: formLevel,
          tuition_fee: formFees,
          updated_at: new Date().toISOString(),
        });
      } catch {
        // ignore fallback
      }

      setIsModalOpen(false);
    } finally {
      setSaving(false);
    }
  };

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
        {/* Institutional Identity Banner */}
        <div className="rounded-2xl border border-indigo-100 bg-white p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#102C57] text-white font-extrabold text-xl shadow-xs">
                🏛️
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black text-[#102C57]">{orgName}</h1>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Verified Institution
                  </span>
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                  <span className="flex items-center gap-1 text-slate-700">
                    <span className="text-sm">{getCountryFlag(profileData.country)}</span> {profileData.city}, {profileData.country}
                  </span>
                  <span>•</span>
                  <span className="text-indigo-700 font-bold">Public Research University</span>
                  <span>•</span>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                    QS Rank #{profileData.rankingGlobal}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-[#102C57] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#0c2242] transition cursor-pointer shadow-2xs"
              >
                <Pencil className="h-3.5 w-3.5 text-[#EA5C2B]" />
                <span>Edit Profile Details</span>
              </button>
              <Link
                href={`/universities/${profileData.id}`}
                target="_blank"
                className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition text-center"
              >
                View Live Public Profile →
              </Link>
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-500 leading-relaxed">
            Institutional listing portal for admissions. Manage academic degrees, intake deadlines, entry requirements, and Indian applicant leads.
          </p>
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
            <p className="mt-3 text-3xl font-black text-[#102C57]">{programsList.length} Listed</p>
            <span className="text-[11px] text-slate-500">
              {programsList[0]?.name ? `${programsList[0].name.split(' ')[0]} ${programsList[0].name.split(' ')[1] || ''}` : 'Degree Programs'}
            </span>
          </div>
        </div>

        {/* Programs Catalog Manager */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-black text-[#102C57]">Published Academic Programs</h2>
              <p className="text-[11px] text-slate-500">
                Listed under admissions • {profileData.country} {getCountryFlag(profileData.country)}
              </p>
            </div>
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-1.5 rounded-xl bg-[#102C57] px-4 py-2 text-xs font-bold text-white hover:bg-[#0c2242] transition cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5 text-[#EA5C2B]" />
              <span>+ Add New Program</span>
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {programsList.map((p) => (
              <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-slate-200 p-4 hover:border-slate-300 transition">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-[#102C57]">{p.name}</h4>
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">
                      {getCountryFlag(profileData.country)} {profileData.country}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    <strong className="text-slate-700">admissions</strong> • {p.level} • Next Intake: {p.deadline}
                  </p>
                </div>
                <div className="mt-2 sm:mt-0 flex items-center gap-4">
                  <span className="text-xs font-black text-emerald-700">{p.fees}</span>
                  <button
                    onClick={() => handleOpenEditModal(p)}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                  >
                    <Pencil className="h-3 w-3 text-[#EA5C2B]" />
                    <span>Edit Details</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add / Edit Program Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-[#102C57]">
                {editingProgram ? "Edit Program Details" : "Add New Academic Program"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProgram} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Program Title</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. M.Sc. in Data Science & Artificial Intelligence"
                  className="w-full rounded-xl border border-slate-200 py-2 px-3 text-slate-800 font-medium focus:border-[#102C57] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Academic Level & Duration</label>
                <input
                  type="text"
                  required
                  value={formLevel}
                  onChange={(e) => setFormLevel(e.target.value)}
                  placeholder="e.g. Postgraduate (2 Yrs)"
                  className="w-full rounded-xl border border-slate-200 py-2 px-3 text-slate-800 focus:border-[#102C57] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tuition Fees (in EUR or INR)</label>
                <input
                  type="text"
                  required
                  value={formFees}
                  onChange={(e) => setFormFees(e.target.value)}
                  placeholder="e.g. €0 (Public University) or ₹18 Lakhs / yr"
                  className="w-full rounded-xl border border-slate-200 py-2 px-3 text-slate-800 focus:border-[#102C57] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Next Intake / Application Deadline</label>
                <input
                  type="text"
                  required
                  value={formDeadline}
                  onChange={(e) => setFormDeadline(e.target.value)}
                  placeholder="e.g. May 31, 2026"
                  className="w-full rounded-xl border border-slate-200 py-2 px-3 text-slate-800 focus:border-[#102C57] focus:outline-none"
                />
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-1.5 rounded-xl bg-[#102C57] px-4 py-2 font-bold text-white hover:bg-[#0c2242] transition disabled:opacity-50"
                >
                  <Save className="h-3.5 w-3.5 text-[#EA5C2B]" />
                  <span>{editingProgram ? "Save Changes" : "Publish Program"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      <EditUniversityProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        initialData={profileData}
        onSave={(updated) => setProfileData(updated)}
      />
    </div>
  );
}
