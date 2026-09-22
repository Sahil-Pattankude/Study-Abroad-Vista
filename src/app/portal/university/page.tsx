"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Compass,
  Building2,
  Eye,
  Users,
  FileCheck,
  CheckCircle2,
  LogOut,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Award,
  Sparkles,
  TrendingUp,
  Search,
  Globe,
  MapPin,
  Clock,
  Calendar,
  DollarSign,
  Download,
  Check,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Filter,
  BarChart3,
  CreditCard,
  Receipt,
  Mail,
  Phone,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { EditUniversityProfileModal } from "@/components/university/EditUniversityProfileModal";
import {
  fetchLiveUniversities,
  fetchLiveCountries,
  fetchLiveClaims,
} from "@/lib/supabase/dataFetchers";
import { CountryFlag } from "@/components/ui/CountryFlag";

interface ProgramItem {
  id: number | string;
  name: string;
  degreeType: string;
  duration: string;
  fees: string;
  intakes: string;
  deadline: string;
  minRequirements: string;
  description: string;
  views30d: number;
  inquiriesCount: number;
  status: "active" | "draft";
}

interface StudentInquiry {
  id: string;
  studentName: string;
  email: string;
  phone: string;
  location: string;
  degreeApplied: string;
  currentBg: string;
  cgpa?: string;
  testScores: string;
  targetIntake: string;
  date: string;
  status: "new" | "reviewing" | "shortlisted" | "contacted";
}

type TabType = "overview" | "programs" | "analytics" | "inquiries" | "upgrade";
type FeaturedTier = "Free" | "Silver" | "Gold" | "Platinum";

function getCountryCode(country?: string): string {
  if (!country) return "UN";
  const lower = country.toLowerCase();
  if (
    lower.includes("netherland") ||
    lower.includes("holland") ||
    lower.includes("dutch")
  )
    return "NL";
  if (lower.includes("canada")) return "CA";
  if (lower.includes("germany")) return "DE";
  if (
    lower.includes("uk") ||
    lower.includes("united kingdom") ||
    lower.includes("britain")
  )
    return "GB";
  if (
    lower.includes("usa") ||
    lower.includes("united states") ||
    lower.includes("america")
  )
    return "US";
  if (lower.includes("australia")) return "AU";
  if (lower.includes("ireland")) return "IE";
  if (lower.includes("france")) return "FR";
  if (lower.includes("singapore")) return "SG";
  if (lower.includes("nz") || lower.includes("zealand")) return "NZ";
  return "UN";
}

function getInitialProfileForUser(userObj?: any) {
  const email = typeof userObj === "string" ? userObj : userObj?.email || "";
  const lower = email.toLowerCase();
  const org =
    typeof userObj === "object"
      ? userObj?.organization || userObj?.user_metadata?.organization
      : "";
  const userCountry =
    typeof userObj === "object"
      ? userObj?.user_metadata?.country_name || userObj?.country
      : "";

  let derivedOrg = org && org.trim().length > 0 ? org.trim() : "";
  if (!derivedOrg && email.includes("@")) {
    const domainPart = email.split("@")[1]?.split(".")[0] || "";
    if (
      domainPart &&
      !["gmail", "yahoo", "hotmail", "outlook"].includes(domainPart)
    ) {
      derivedOrg =
        domainPart.charAt(0).toUpperCase() +
        domainPart.slice(1) +
        " University";
    }
  }

  if (lower.includes("canada") || lower.includes("toronto")) {
    return {
      id: "university-of-toronto",
      name: "University of Toronto",
      city: "Toronto",
      country: userCountry || "Canada",
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
      country: userCountry || "United Kingdom",
      rankingGlobal: 3,
      rankingNational: 1,
      tuitionFeeRangeINR: "£33,970 / yr",
      ieltsMinScore: 7.5,
      acceptanceRate: 17,
      postStudyWorkMonths: 24,
    };
  }
  if (
    lower.includes("melbourne") ||
    lower.includes("unimelb") ||
    lower.includes("australia")
  ) {
    return {
      id: "university-of-melbourne",
      name: "University of Melbourne",
      city: "Melbourne",
      country: userCountry || "Australia",
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
      country: userCountry || "United States",
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
    country: userCountry || "Germany",
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

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [featuredTier, setFeaturedTier] = useState<FeaturedTier>("Gold");
  const [profileData, setProfileData] = useState(() =>
    getInitialProfileForUser(user),
  );
  const orgName = profileData.name;
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Timeframe filter for analytics
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d" | "1y">(
    "30d",
  );

  // Currency for upgrades
  const [currency, setCurrency] = useState<"INR" | "USD">("INR");
  const [selectedUpgradeTier, setSelectedUpgradeTier] =
    useState<FeaturedTier | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [billingGst, setBillingGst] = useState("07AABCT2402R1Z8");
  const [billingOrg, setBillingOrg] = useState(orgName);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  // Programs State (FR-UNI-003)
  const [programsList, setProgramsList] = useState<ProgramItem[]>([
    {
      id: 1,
      name: "M.Sc. in Robotics, Cognition, Intelligence",
      degreeType: "Postgraduate (M.Sc.)",
      duration: "2 Years (4 Semesters)",
      fees: "€0 (Tuition Free / Public)",
      intakes: "Winter (October)",
      deadline: "May 31, 2026",
      minRequirements: "IELTS 6.5+ / TOEFL 88+, B.Tech in CSE/Mech (75%+)",
      description:
        "Cutting-edge curriculum in AI robotics, autonomous systems, machine learning, and sensor fusion with industry co-ops in Bavaria.",
      views30d: 14280,
      inquiriesCount: 142,
      status: "active",
    },
    {
      id: 2,
      name: "M.Sc. in Data Engineering and Analytics",
      degreeType: "Postgraduate (M.Sc.)",
      duration: "2 Years (4 Semesters)",
      fees: "€0 (Tuition Free / Public)",
      intakes: "Winter (October) & Summer (April)",
      deadline: "May 31, 2026",
      minRequirements:
        "IELTS 6.5+, GRE recommended, Strong background in Algorithms & Math",
      description:
        "Comprehensive master's program focusing on distributed data systems, cloud architectures, big data pipelines, and scalable AI models.",
      views30d: 18950,
      inquiriesCount: 198,
      status: "active",
    },
    {
      id: 3,
      name: "M.Sc. in Management & Technology (TUM-BWL)",
      degreeType: "Postgraduate (M.Sc. / MBA Track)",
      duration: "2 Years (4 Semesters)",
      fees: "€0 (Tuition Free / Public)",
      intakes: "Winter (October)",
      deadline: "May 31, 2026",
      minRequirements:
        "IELTS 7.0+, GMAT 600+ or TUM assessment, Engineering/STEM Bachelor's",
      description:
        "Unique hybrid program bridging technological innovation and corporate management, tailored for future enterprise leaders.",
      views30d: 9540,
      inquiriesCount: 86,
      status: "active",
    },
    {
      id: 4,
      name: "B.Sc. in Information Engineering",
      degreeType: "Undergraduate (B.Sc.)",
      duration: "3 Years (6 Semesters)",
      fees: "€0 (Tuition Free / Public)",
      intakes: "Winter (October)",
      deadline: "July 15, 2026",
      minRequirements:
        "CBSE/ICSE 12th (85%+) with Maths & Physics, TestAS certified",
      description:
        "100% English-taught bachelor program at the Heilbronn campus covering software engineering, cybersecurity, and cloud technologies.",
      views30d: 7820,
      inquiriesCount: 54,
      status: "active",
    },
  ]);

  // Program Modal State
  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ProgramItem | null>(
    null,
  );
  const [progName, setProgName] = useState("");
  const [progDegreeType, setProgDegreeType] = useState("Postgraduate (M.Sc.)");
  const [progDuration, setProgDuration] = useState("2 Years (4 Semesters)");
  const [progFees, setProgFees] = useState("€0 (Tuition Free / Public)");
  const [progIntakes, setProgIntakes] = useState("Winter (October)");
  const [progDeadline, setProgDeadline] = useState("May 31, 2026");
  const [progMinReqs, setProgMinReqs] = useState(
    "IELTS 6.5+ / TOEFL 88+, 70%+ in Bachelor's",
  );
  const [progDesc, setProgDesc] = useState("");
  const [savingProg, setSavingProg] = useState(false);

  // Inquiries State
  const [inquiries, setInquiries] = useState<StudentInquiry[]>([
    {
      id: "INQ-901",
      studentName: "Aditya Sharma",
      email: "aditya.sharma99@gmail.com",
      phone: "+91 98201 44521",
      location: "Pune, Maharashtra",
      degreeApplied: "M.Sc. in Data Engineering and Analytics",
      currentBg: "B.Tech Computer Engineering (SPPU, 8.84 CGPA)",
      cgpa: "8.84",
      testScores: "IELTS 7.5 (L:8, R:8, W:7, S:7) · GRE 322",
      targetIntake: "Winter 2026",
      date: "2 hours ago",
      status: "new",
    },
    {
      id: "INQ-902",
      studentName: "Ananya Deshmukh",
      email: "ananya.deshmukh@outlook.com",
      phone: "+91 97654 32189",
      location: "Hyderabad, Telangana",
      degreeApplied: "M.Sc. in Robotics, Cognition, Intelligence",
      currentBg: "B.Tech Mechanical Engineering (BITS Pilani, 8.62 CGPA)",
      cgpa: "8.62",
      testScores: "TOEFL 108 · GRE 326",
      targetIntake: "Winter 2026",
      date: "5 hours ago",
      status: "reviewing",
    },
    {
      id: "INQ-903",
      studentName: "Karthik Subramanian",
      email: "karthik.subra@gmail.com",
      phone: "+91 94440 98123",
      location: "Chennai, Tamil Nadu",
      degreeApplied: "M.Sc. in Management & Technology (TUM-BWL)",
      currentBg: "B.E. Electrical & Electronics (Anna Univ, 8.91 CGPA)",
      cgpa: "8.91",
      testScores: "IELTS 8.0 · GMAT Focus 675",
      targetIntake: "Winter 2026",
      date: "1 day ago",
      status: "shortlisted",
    },
    {
      id: "INQ-904",
      studentName: "Rohan Varma",
      email: "rohan.varma@gmail.com",
      phone: "+91 98112 34567",
      location: "New Delhi, NCR",
      degreeApplied: "B.Sc. in Information Engineering",
      currentBg: "CBSE Class 12 Science (PCM 92.4%)",
      cgpa: "92.4%",
      testScores: "IELTS 7.0 · TestAS 118",
      targetIntake: "Winter 2026",
      date: "2 days ago",
      status: "contacted",
    },
  ]);

  // Sync profile data when user changes
  useEffect(() => {
    if (user) {
      const derived = getInitialProfileForUser(user);
      setProfileData(derived);
      setBillingOrg(derived.name);
    }
  }, [user]);

  // Load claim info if available
  useEffect(() => {
    async function loadClaim() {
      if (!user) return;
      try {
        const claims = await fetchLiveClaims();
        const matchedClaim = claims.find(
          (c) =>
            c.officialEmail?.toLowerCase() === user.email?.toLowerCase() ||
            (c.userId && c.userId === user.id),
        );
        if (matchedClaim) {
          setProfileData((prev) => ({
            ...prev,
            name: matchedClaim.universityName || prev.name,
            country: matchedClaim.countryName || prev.country,
          }));
        }
      } catch (err) {
        console.warn("Claim lookup error:", err);
      }
    }
    loadClaim();
  }, [user]);

  // Program Management Handlers (FR-UNI-003)
  const handleOpenAddProgram = () => {
    setEditingProgram(null);
    setProgName("");
    setProgDegreeType("Postgraduate (M.Sc.)");
    setProgDuration("2 Years (4 Semesters)");
    setProgFees(
      profileData.country === "Germany"
        ? "€0 (Tuition Free / Public)"
        : "$35,000 / yr",
    );
    setProgIntakes("Winter (October)");
    setProgDeadline("May 31, 2026");
    setProgMinReqs("IELTS 6.5+ / TOEFL 88+, 70%+ in Bachelor's");
    setProgDesc("");
    setIsProgramModalOpen(true);
  };

  const handleOpenEditProgram = (prog: ProgramItem) => {
    setEditingProgram(prog);
    setProgName(prog.name);
    setProgDegreeType(prog.degreeType);
    setProgDuration(prog.duration);
    setProgFees(prog.fees);
    setProgIntakes(prog.intakes);
    setProgDeadline(prog.deadline);
    setProgMinReqs(prog.minRequirements);
    setProgDesc(prog.description);
    setIsProgramModalOpen(true);
  };

  const handleSaveProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!progName.trim()) return;

    setSavingProg(true);
    try {
      if (editingProgram) {
        setProgramsList((prev) =>
          prev.map((p) =>
            p.id === editingProgram.id
              ? {
                  ...p,
                  name: progName,
                  degreeType: progDegreeType,
                  duration: progDuration,
                  fees: progFees,
                  intakes: progIntakes,
                  deadline: progDeadline,
                  minRequirements: progMinReqs,
                  description: progDesc,
                }
              : p,
          ),
        );
      } else {
        const newProg: ProgramItem = {
          id: Date.now(),
          name: progName,
          degreeType: progDegreeType,
          duration: progDuration,
          fees: progFees,
          intakes: progIntakes,
          deadline: progDeadline,
          minRequirements: progMinReqs,
          description: progDesc,
          views30d: 0,
          inquiriesCount: 0,
          status: "active",
        };
        setProgramsList((prev) => [...prev, newProg]);
      }
      setIsProgramModalOpen(false);
    } finally {
      setSavingProg(false);
    }
  };

  const handleDeleteProgram = (id: number | string) => {
    if (
      confirm(
        "Are you sure you want to remove this academic program from your public catalog?",
      )
    ) {
      setProgramsList((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // Inquiry Status Updater
  const handleUpdateInquiryStatus = (
    id: string,
    newStatus: StudentInquiry["status"],
  ) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq)),
    );
  };

  // Upgrade Flow Handler (FR-UNI-005)
  const handleInitiateUpgrade = (tier: FeaturedTier) => {
    setSelectedUpgradeTier(tier);
    setIsCheckoutOpen(true);
    setUpgradeSuccess(false);
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUpgradeTier) return;

    setUpgrading(true);
    // Simulate gateway checkout (Razorpay / Stripe)
    await new Promise((res) => setTimeout(res, 1400));
    setFeaturedTier(selectedUpgradeTier);
    setUpgrading(false);
    setUpgradeSuccess(true);
    setTimeout(() => {
      setIsCheckoutOpen(false);
      setUpgradeSuccess(false);
    }, 2200);
  };

  // Export Analytics Summary (FR-UNI-004)
  const handleExportReport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      `Metric,Value\nInstitution,${orgName}\nFeatured Tier,${featuredTier}\nMonthly Impressions,38450\nClick Through Rate,4.8%\nTotal Student Inquiries,412\nActive Programs,${programsList.length}\nTop Query 1,MS Data Engineering Germany (18.4K views)\nTop Query 2,TUM Tuition Fees for Indian Students (14.2K views)\nTop Query 3,Robotics Cognition Intelligence TUM (9.5K views)\nReport Period,${timeframe.toUpperCase()}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `${orgName.replace(/\s+/g, "_")}_Performance_Report.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#102C57]" />
        <p className="mt-3 text-xs font-semibold text-slate-500">
          Loading university partner workspace...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-[#EA5C2B]/15">
      {/* Top Navbar */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-2xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#102C57] to-[#0d2346] text-white shadow-xs">
                <Compass className="h-5 w-5 text-[#EA5C2B]" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-tight text-[#102C57] leading-none">
                  StudyAbroad<span className="text-[#EA5C2B]">Vista</span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                  University Partner Console
                </span>
              </div>
            </Link>

            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100/80 px-2.5 py-1 text-[11px] font-bold text-indigo-800">
              <Building2 className="h-3 w-3 text-[#EA5C2B]" />
              B2B Institutional Portal
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="font-semibold text-slate-700 hidden md:flex items-center gap-1.5 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl">
              <CountryFlag
                code={getCountryCode(profileData.country)}
                name={profileData.country}
                size="sm"
              />
              <span className="font-bold text-[#102C57] line-clamp-1 max-w-[200px]">
                {orgName}
              </span>
            </span>

            {/* Claim Profile CTA if demo */}
            <Link
              href="/university-portal/claim"
              className="rounded-xl border border-indigo-200 bg-indigo-50/70 px-3 py-1.5 font-bold text-[#102C57] hover:bg-indigo-100 transition hidden sm:flex items-center gap-1"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-[#EA5C2B]" />
              <span>Claim Listing</span>
            </Link>

            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="rounded-xl border border-slate-200 px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-50 hover:text-rose-600 transition flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Workspace Tab Bar */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 border-t border-slate-100 overflow-x-auto">
          <div className="flex space-x-1 py-2">
            {[
              {
                id: "overview",
                label: "Overview & Dashboard",
                icon: Building2,
              },
              {
                id: "programs",
                label: `Programs (${programsList.length})`,
                icon: FileCheck,
              },
              {
                id: "analytics",
                label: "Analytics & Benchmarks",
                icon: BarChart3,
              },
              {
                id: "inquiries",
                label: `Student Inquiries (${inquiries.length})`,
                icon: Users,
              },
              {
                id: "upgrade",
                label: `Featured Tiers (${featuredTier})`,
                icon: Award,
                highlight: true,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl transition cursor-pointer whitespace-nowrap ${
                    isActive
                      ? "bg-[#102C57] text-white shadow-xs"
                      : tab.highlight
                        ? "text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200/60"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    className={`h-3.5 w-3.5 ${isActive ? "text-[#EA5C2B]" : tab.highlight ? "text-amber-600" : "text-slate-400"}`}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="mx-auto max-w-7xl w-full px-4 py-6 sm:px-6 lg:px-8 flex-1 space-y-6">
        {/* Top Institutional Identity Banner */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-start sm:items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#102C57] to-indigo-900 text-white font-extrabold text-2xl shadow-sm">
                🏛️
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-xl sm:text-2xl font-black text-[#102C57] font-serif">
                    {orgName}
                  </h1>
                  <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Verified Institution
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold flex items-center gap-1 ${
                      featuredTier === "Platinum"
                        ? "bg-purple-100 text-purple-800 border border-purple-200"
                        : featuredTier === "Gold"
                          ? "bg-amber-100 text-amber-800 border border-amber-200"
                          : featuredTier === "Silver"
                            ? "bg-slate-200 text-slate-800 border border-slate-300"
                            : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    <Award className="h-3.5 w-3.5 text-[#EA5C2B]" />
                    {featuredTier} Partner Tier
                  </span>
                </div>

                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <CountryFlag
                      code={getCountryCode(profileData.country)}
                      name={profileData.country}
                      size="sm"
                    />
                    <span>
                      {profileData.city}, {profileData.country}
                    </span>
                  </span>
                  <span>•</span>
                  <span className="text-indigo-700 font-bold">
                    QS World Rank #{profileData.rankingGlobal}
                  </span>
                  <span>•</span>
                  <span>
                    Acceptance Rate:{" "}
                    <strong>{profileData.acceptanceRate}%</strong>
                  </span>
                  <span>•</span>
                  <span>
                    Post-Study Work:{" "}
                    <strong>{profileData.postStudyWorkMonths} Mos</strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
              >
                <Pencil className="h-3.5 w-3.5 text-[#EA5C2B]" />
                <span>Edit Profile</span>
              </button>
              <Link
                href={`/universities/${profileData.id}`}
                target="_blank"
                className="flex items-center gap-1.5 rounded-xl bg-[#102C57] px-3.5 py-2 text-xs font-bold text-white hover:bg-[#0c2242] transition shadow-2xs"
              >
                <span>Live Public Page</span>
                <ExternalLink className="h-3 w-3 text-[#EA5C2B]" />
              </Link>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
            <p className="leading-relaxed">
              Managing official admissions listings, verified program fees,
              application deadlines, and Indian applicant lead pipelines.
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-bold text-emerald-700">
                Profile Health: 94% Complete
              </span>
              <div className="w-24 bg-slate-100 rounded-full h-2">
                <div className="bg-emerald-600 h-2 rounded-full w-[94%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* TAB 1: OVERVIEW & DASHBOARD (FR-UNI-002) */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-in fade-in">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Profile Impressions
                  </span>
                  <Eye className="h-4 w-4 text-[#EA5C2B]" />
                </div>
                <p className="mt-3 text-3xl font-black text-[#102C57]">
                  38,450
                </p>
                <div className="mt-1 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-600 font-bold">
                    ↑ 18.4% vs last month
                  </span>
                  <span className="text-slate-400">Past 30 Days</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Click-Through Rate (CTR)
                  </span>
                  <TrendingUp className="h-4 w-4 text-indigo-600" />
                </div>
                <p className="mt-3 text-3xl font-black text-[#102C57]">4.82%</p>
                <div className="mt-1 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-600 font-bold">
                    +0.6% vs country avg
                  </span>
                  <span className="text-slate-400">High Intent</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Inbound Inquiries
                  </span>
                  <Users className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="mt-3 text-3xl font-black text-[#102C57]">412</p>
                <div className="mt-1 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-600 font-bold">
                    86 Qualified Today
                  </span>
                  <span className="text-slate-400">Indian Students</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Featured Tier Status
                  </span>
                  <Award className="h-4 w-4 text-amber-600" />
                </div>
                <p className="mt-3 text-2xl font-black text-[#102C57] flex items-center gap-2">
                  <span>{featuredTier} Partner</span>
                </p>
                <div className="mt-1 flex items-center justify-between text-[11px]">
                  <button
                    onClick={() => setActiveTab("upgrade")}
                    className="font-bold text-[#EA5C2B] hover:underline cursor-pointer"
                  >
                    Upgrade Tier →
                  </button>
                  <span className="text-slate-400">Top 3 Spotlight</span>
                </div>
              </div>
            </div>

            {/* Top Search Queries Leading to Profile (FR-UNI-002) */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-[#102C57] flex items-center gap-2">
                    <Search className="h-4 w-4 text-[#EA5C2B]" />
                    Top Search Queries Leading to Profile
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Search terms used by Indian aspirants discovering {orgName}{" "}
                    across StudyAbroad Vista.
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  Past 30 Days
                </span>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-500 font-bold">
                      <th className="py-2.5 px-3 rounded-l-lg">
                        Search Query Term
                      </th>
                      <th className="py-2.5 px-3">Search Impressions</th>
                      <th className="py-2.5 px-3">Direct Clicks</th>
                      <th className="py-2.5 px-3">CTR %</th>
                      <th className="py-2.5 px-3 rounded-r-lg">
                        Inquiry Conversion
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      {
                        query: "MS Data Engineering Germany TUM",
                        imps: "18,420",
                        clicks: "1,240",
                        ctr: "6.73%",
                        conv: "14.2%",
                      },
                      {
                        query:
                          "Technical University of Munich fees for Indian students",
                        imps: "14,890",
                        clicks: "980",
                        ctr: "6.58%",
                        conv: "11.8%",
                      },
                      {
                        query:
                          "Robotics Cognition Intelligence TUM requirements",
                        imps: "9,540",
                        clicks: "620",
                        ctr: "6.50%",
                        conv: "16.4%",
                      },
                      {
                        query: "Study MS in Germany in English 2026",
                        imps: "24,100",
                        clicks: "890",
                        ctr: "3.69%",
                        conv: "8.2%",
                      },
                      {
                        query: "TUM vs RWTH Aachen Data Science",
                        imps: "6,750",
                        clicks: "410",
                        ctr: "6.07%",
                        conv: "9.5%",
                      },
                    ].map((row, i) => (
                      <tr
                        key={i}
                        className="hover:bg-slate-50/80 transition font-medium"
                      >
                        <td className="py-3 px-3 font-bold text-[#102C57] flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-mono">
                            #{i + 1}
                          </span>
                          <span>{row.query}</span>
                        </td>
                        <td className="py-3 px-3 text-slate-700">{row.imps}</td>
                        <td className="py-3 px-3 font-bold text-indigo-700">
                          {row.clicks}
                        </td>
                        <td className="py-3 px-3 text-emerald-600 font-bold">
                          {row.ctr}
                        </td>
                        <td className="py-3 px-3 text-slate-800 font-semibold">
                          {row.conv}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions & Recent Activity Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Published Programs Quick Access */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-black text-[#102C57]">
                      Published Academic Programs
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {programsList.length} Active degrees listed
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddProgram}
                    className="flex items-center gap-1 rounded-xl bg-[#102C57] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#0c2242] transition cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5 text-[#EA5C2B]" />
                    <span>Add Program</span>
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {programsList.slice(0, 3).map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition text-xs"
                    >
                      <div>
                        <p className="font-bold text-[#102C57]">{p.name}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {p.degreeType} • {p.duration} •{" "}
                          <strong className="text-emerald-700">{p.fees}</strong>
                        </p>
                      </div>
                      <button
                        onClick={() => handleOpenEditProgram(p)}
                        className="text-xs font-bold text-[#EA5C2B] hover:underline cursor-pointer"
                      >
                        Edit →
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setActiveTab("programs")}
                    className="w-full py-2 text-center text-xs font-bold text-indigo-700 hover:text-indigo-900 transition cursor-pointer"
                  >
                    View & Manage All {programsList.length} Programs →
                  </button>
                </div>
              </div>

              {/* Recent Inquiries Snapshot */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-black text-[#102C57]">
                      Recent Student Inquiries
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      High-intent Indian applicant profiles
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("inquiries")}
                    className="text-xs font-bold text-indigo-700 hover:underline cursor-pointer"
                  >
                    Open CRM Inbox ({inquiries.length}) →
                  </button>
                </div>

                <div className="mt-4 space-y-3">
                  {inquiries.slice(0, 3).map((inq) => (
                    <div
                      key={inq.id}
                      className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/60 text-xs flex flex-col justify-between gap-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#102C57]">
                          {inq.studentName}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {inq.date}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        {inq.degreeApplied} ·{" "}
                        <strong className="text-slate-800">
                          {inq.currentBg}
                        </strong>
                      </p>
                      <div className="flex items-center justify-between pt-1 text-[10px]">
                        <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-700">
                          {inq.testScores}
                        </span>
                        <span className="font-bold text-emerald-700 capitalize">
                          {inq.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROGRAM MANAGEMENT (FR-UNI-003) */}
        {activeTab === "programs" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
              <div>
                <h2 className="text-lg font-black text-[#102C57] flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-[#EA5C2B]" />
                  Academic Program Management
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Add, update, or remove degree programs published on
                  StudyAbroad Vista. Updates reflect immediately on your live
                  profile.
                </p>
              </div>

              <button
                onClick={handleOpenAddProgram}
                className="flex items-center gap-2 rounded-xl bg-[#102C57] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#0c2242] transition cursor-pointer shadow-xs"
              >
                <Plus className="h-4 w-4 text-[#EA5C2B]" />
                <span>+ Add New Degree Program</span>
              </button>
            </div>

            {/* Programs List Cards */}
            <div className="space-y-4">
              {programsList.map((prog) => (
                <div
                  key={prog.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs hover:border-slate-300 transition space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-black text-[#102C57]">
                          {prog.name}
                        </h3>
                        <span className="rounded-md bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-700">
                          {prog.degreeType}
                        </span>
                        <span className="rounded-md bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                          {prog.status === "active"
                            ? "Live / Intake Open"
                            : "Draft"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {prog.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      <button
                        onClick={() => handleOpenEditProgram(prog)}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                      >
                        <Pencil className="h-3.5 w-3.5 text-[#EA5C2B]" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteProgram(prog.id)}
                        className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                  {/* Program Detail Specs */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
                    <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Duration
                      </span>
                      <p className="mt-1 font-bold text-slate-800">
                        {prog.duration}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Tuition Fee
                      </span>
                      <p className="mt-1 font-bold text-emerald-700">
                        {prog.fees}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Intakes & Deadlines
                      </span>
                      <p className="mt-1 font-bold text-slate-800">
                        {prog.intakes} (Deadline: {prog.deadline})
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-3 border border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Entry Requirements
                      </span>
                      <p className="mt-1 font-semibold text-slate-700 line-clamp-1">
                        {prog.minRequirements}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: ANALYTICS & REPORTING (FR-UNI-004) */}
        {activeTab === "analytics" && (
          <div className="space-y-6 animate-in fade-in">
            {/* Analytics Header with Timeframe & Export */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
              <div>
                <h2 className="text-lg font-black text-[#102C57] flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[#EA5C2B]" />
                  Analytics & Market Intelligence
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  In-depth visitor impressions, competitor benchmarks, and
                  geographic distribution of Indian student interest.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Timeframe selector */}
                <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-bold text-slate-600">
                  {(["7d", "30d", "90d", "1y"] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setTimeframe(tf)}
                      className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                        timeframe === tf
                          ? "bg-white text-[#102C57] shadow-xs"
                          : "hover:text-slate-900"
                      }`}
                    >
                      {tf.toUpperCase()}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleExportReport}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5 text-[#EA5C2B]" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Performance Trends & Anonymized Competitor Benchmarks (FR-UNI-004) */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Impressions & CTR Trends */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-base font-black text-[#102C57]">
                    Impression Velocity (Past 4 Weeks)
                  </h3>
                  <span className="text-xs font-bold text-emerald-600">
                    +18.4% WoW Growth
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  {[
                    {
                      label: "Week 1 (Aug 24 - Aug 30)",
                      value: "7,840 views",
                      pct: 55,
                    },
                    {
                      label: "Week 2 (Aug 31 - Sep 06)",
                      value: "8,920 views",
                      pct: 68,
                    },
                    {
                      label: "Week 3 (Sep 07 - Sep 13)",
                      value: "10,210 views",
                      pct: 82,
                    },
                    {
                      label: "Week 4 (Sep 14 - Sep 20)",
                      value: "11,480 views",
                      pct: 95,
                    },
                  ].map((w, idx) => (
                    <div key={idx} className="space-y-1.5 text-xs">
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-700">{w.label}</span>
                        <span className="text-[#102C57]">{w.value}</span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#102C57] to-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${w.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Anonymized Competitor Comparison (FR-UNI-004) */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-base font-black text-[#102C57]">
                    Competitor Benchmark (Anonymized)
                  </h3>
                  <span className="text-xs font-bold text-slate-400">
                    German Tech Universities
                  </span>
                </div>

                <div className="mt-4 space-y-4 text-xs">
                  <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                    <div className="flex justify-between font-bold text-[#102C57]">
                      <span>{orgName} (Your Profile)</span>
                      <span className="text-emerald-700">
                        4.82% CTR · Top 5%
                      </span>
                    </div>
                    <div className="mt-2 h-2.5 w-full rounded-full bg-indigo-200">
                      <div className="h-full bg-[#102C57] rounded-full w-[88%]"></div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex justify-between font-semibold text-slate-700">
                      <span>Top 10% TU9 German Universities Benchmark</span>
                      <span>4.10% CTR</span>
                    </div>
                    <div className="mt-2 h-2.5 w-full rounded-full bg-slate-200">
                      <div className="h-full bg-slate-500 rounded-full w-[72%]"></div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="flex justify-between font-semibold text-slate-700">
                      <span>All Germany Public Universities Median</span>
                      <span>2.95% CTR</span>
                    </div>
                    <div className="mt-2 h-2.5 w-full rounded-full bg-slate-200">
                      <div className="h-full bg-slate-400 rounded-full w-[52%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Geographic Distribution of Student Interest (FR-UNI-004) */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-base font-black text-[#102C57] flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#EA5C2B]" />
                    Geographic Distribution of Indian Student Inquiries
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Breakdown of student traffic by state and metro hubs in
                    India.
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-400">
                  Total 412 Inquiries
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 text-center text-xs">
                {[
                  {
                    region: "Maharashtra",
                    share: "28.4%",
                    count: "117 Students",
                    city: "Mumbai / Pune",
                  },
                  {
                    region: "Karnataka",
                    share: "22.1%",
                    count: "91 Students",
                    city: "Bengaluru",
                  },
                  {
                    region: "Telangana & AP",
                    share: "18.2%",
                    count: "75 Students",
                    city: "Hyderabad",
                  },
                  {
                    region: "Delhi NCR",
                    share: "15.8%",
                    count: "65 Students",
                    city: "Delhi / Gurgaon",
                  },
                  {
                    region: "Tamil Nadu",
                    share: "9.5%",
                    count: "39 Students",
                    city: "Chennai",
                  },
                  {
                    region: "Other States",
                    share: "6.0%",
                    count: "25 Students",
                    city: "Gujarat / Kerala",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
                  >
                    <span className="text-lg font-black text-[#102C57]">
                      {item.share}
                    </span>
                    <p className="mt-1 font-bold text-slate-800">
                      {item.region}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {item.count}
                    </p>
                    <span className="mt-2 inline-block rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[9px] font-semibold text-slate-600">
                      {item.city}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: STUDENT INQUIRIES CRM */}
        {activeTab === "inquiries" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-xs">
              <div>
                <h2 className="text-lg font-black text-[#102C57] flex items-center gap-2">
                  <Users className="h-5 w-5 text-[#EA5C2B]" />
                  Direct Inbound Student Inquiries
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Verified Indian student inquiries matched to {orgName}{" "}
                  courses.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-500">Filter Status:</span>
                <span className="rounded-xl bg-indigo-50 px-3 py-1 font-bold text-[#102C57]">
                  All ({inquiries.length})
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xs hover:border-slate-300 transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-[#102C57] font-bold text-sm">
                        {inq.studentName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#102C57] flex items-center gap-2">
                          <span>{inq.studentName}</span>
                          <span className="text-[11px] font-normal text-slate-400">
                            ({inq.location})
                          </span>
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Target:{" "}
                          <strong className="text-slate-800">
                            {inq.degreeApplied}
                          </strong>{" "}
                          · Intake: {inq.targetIntake}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={inq.status}
                        onChange={(e) =>
                          handleUpdateInquiryStatus(
                            inq.id,
                            e.target.value as any,
                          )
                        }
                        className="rounded-xl border border-slate-200 bg-slate-50 py-1.5 px-3 text-xs font-bold text-slate-700 focus:outline-none focus:border-[#102C57]"
                      >
                        <option value="new">Status: New</option>
                        <option value="reviewing">Status: Under Review</option>
                        <option value="shortlisted">Status: Shortlisted</option>
                        <option value="contacted">Status: Contacted</option>
                      </select>

                      <a
                        href={`mailto:${inq.email}?subject=Admissions Inquiry - ${orgName}`}
                        className="flex items-center gap-1 rounded-xl bg-[#102C57] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#0c2242] transition"
                      >
                        <Mail className="h-3 w-3 text-[#EA5C2B]" />
                        <span>Email</span>
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400">
                        Academic Background
                      </span>
                      <p className="font-semibold text-slate-800">
                        {inq.currentBg}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400">
                        Standardized Test Scores
                      </span>
                      <p className="font-semibold text-indigo-700">
                        {inq.testScores}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400">
                        Direct Contacts
                      </span>
                      <p className="font-semibold text-slate-700">
                        {inq.phone} · {inq.email}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: FEATURED TIER UPGRADE (FR-UNI-005) */}
        {activeTab === "upgrade" && (
          <div className="space-y-6 animate-in fade-in">
            {/* Upgrade Ribbon */}
            <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-[#102C57] p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-amber-300 mb-2">
                  <Award className="h-4 w-4" />
                  Featured Institutional Spotlight (FR-UNI-005)
                </div>
                <h2 className="text-2xl font-black font-serif sm:text-3xl text-white">
                  Institutional Featured Tiers & Placement
                </h2>
                <p className="mt-1 text-xs text-indigo-200 max-w-2xl leading-relaxed">
                  Boost your university's visibility across 19 country guides,
                  comparison matrices, and direct Indian student inquiry
                  matching with guaranteed search rankings.
                </p>
              </div>

              {/* Currency Selector */}
              <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-2xl border border-white/20 self-start md:self-auto">
                <button
                  onClick={() => setCurrency("INR")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    currency === "INR"
                      ? "bg-[#EA5C2B] text-white shadow-xs"
                      : "text-indigo-200 hover:text-white"
                  }`}
                >
                  INR Billing (Razorpay)
                </button>
                <button
                  onClick={() => setCurrency("USD")}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    currency === "USD"
                      ? "bg-[#EA5C2B] text-white shadow-xs"
                      : "text-indigo-200 hover:text-white"
                  }`}
                >
                  USD Billing (Stripe)
                </button>
              </div>
            </div>

            {/* 4 Tiers Matrix */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Free Tier */}
              <div
                className={`rounded-3xl border p-6 flex flex-col justify-between bg-white shadow-xs ${
                  featuredTier === "Free"
                    ? "border-indigo-600 ring-2 ring-indigo-600/20"
                    : "border-slate-200"
                }`}
              >
                <div>
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700">
                    Basic Listing
                  </span>
                  <h3 className="mt-3 text-lg font-black text-[#102C57]">
                    Free
                  </h3>
                  <p className="text-2xl font-black text-slate-800 mt-2">
                    {currency === "INR" ? "₹0" : "$0"}
                    <span className="text-xs font-normal text-slate-400">
                      {" "}
                      / year
                    </span>
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Standard listing in global university directory.
                  </p>

                  <ul className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Standard directory listing</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Up to 3 published programs</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-400 line-through">
                      <span>Verified Institution Badge</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-400 line-through">
                      <span>Top Search Placement</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  {featuredTier === "Free" ? (
                    <span className="block w-full py-2 text-center text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">
                      Current Active Plan
                    </span>
                  ) : (
                    <button
                      onClick={() => setFeaturedTier("Free")}
                      className="w-full py-2 text-center text-xs font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer"
                    >
                      Downgrade to Free
                    </button>
                  )}
                </div>
              </div>

              {/* Silver Tier */}
              <div
                className={`rounded-3xl border p-6 flex flex-col justify-between bg-white shadow-xs ${
                  featuredTier === "Silver"
                    ? "border-slate-400 ring-2 ring-slate-400/20"
                    : "border-slate-200"
                }`}
              >
                <div>
                  <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700">
                    Verified Growth
                  </span>
                  <h3 className="mt-3 text-lg font-black text-[#102C57]">
                    Silver Partner
                  </h3>
                  <p className="text-2xl font-black text-slate-800 mt-2">
                    {currency === "INR" ? "₹25,000" : "$299"}
                    <span className="text-xs font-normal text-slate-400">
                      {" "}
                      / year
                    </span>
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    Priority search badge & direct applicant inquiries.
                  </p>

                  <ul className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Verified Institution Blue Badge</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Up to 10 published programs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Direct Indian student inquiries</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-400 line-through">
                      <span>Top 3 Destination Spotlight</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  {featuredTier === "Silver" ? (
                    <span className="block w-full py-2 text-center text-xs font-bold text-slate-700 bg-slate-200 rounded-xl">
                      Current Active Plan
                    </span>
                  ) : (
                    <button
                      onClick={() => handleInitiateUpgrade("Silver")}
                      className="w-full py-2 text-center text-xs font-bold text-slate-700 border border-slate-300 bg-slate-100 rounded-xl hover:bg-slate-200 cursor-pointer transition"
                    >
                      Upgrade to Silver →
                    </button>
                  )}
                </div>
              </div>

              {/* Gold Tier */}
              <div
                className={`rounded-3xl border p-6 flex flex-col justify-between bg-amber-50/40 shadow-md ${
                  featuredTier === "Gold"
                    ? "border-amber-500 ring-2 ring-amber-500/30"
                    : "border-amber-200"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800">
                      Most Popular
                    </span>
                    <Sparkles className="h-4 w-4 text-amber-600" />
                  </div>
                  <h3 className="mt-3 text-lg font-black text-[#102C57]">
                    Gold Partner
                  </h3>
                  <p className="text-2xl font-black text-amber-900 mt-2">
                    {currency === "INR" ? "₹60,000" : "$699"}
                    <span className="text-xs font-normal text-slate-400">
                      {" "}
                      / year
                    </span>
                  </p>
                  <p className="mt-2 text-xs text-slate-600">
                    Top 3 Destination Spotlight and 2x inquiry velocity.
                  </p>

                  <ul className="mt-4 space-y-2 text-xs text-slate-700 border-t border-amber-200/60 pt-4">
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-amber-600" />
                      <span>
                        <strong>Top 3 Destination Spotlight</strong>
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-amber-600" />
                      <span>Unlimited program listings</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-amber-600" />
                      <span>Competitor benchmark analytics</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-amber-600" />
                      <span>1-Click student WhatsApp/Email</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-amber-200/60">
                  {featuredTier === "Gold" ? (
                    <span className="block w-full py-2 text-center text-xs font-bold text-amber-900 bg-amber-200 rounded-xl">
                      Current Active Plan
                    </span>
                  ) : (
                    <button
                      onClick={() => handleInitiateUpgrade("Gold")}
                      className="w-full py-2 text-center text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl cursor-pointer transition shadow-xs"
                    >
                      Upgrade to Gold →
                    </button>
                  )}
                </div>
              </div>

              {/* Platinum Tier */}
              <div
                className={`rounded-3xl border p-6 flex flex-col justify-between bg-gradient-to-b from-indigo-950 to-[#102C57] text-white shadow-lg ${
                  featuredTier === "Platinum"
                    ? "border-purple-400 ring-2 ring-purple-400/40"
                    : "border-indigo-800"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-purple-500/20 border border-purple-400/40 px-2.5 py-1 text-[11px] font-bold text-purple-200">
                      Maximum Impact
                    </span>
                    <Award className="h-4 w-4 text-purple-300" />
                  </div>
                  <h3 className="mt-3 text-lg font-black text-white">
                    Platinum Spotlight
                  </h3>
                  <p className="text-2xl font-black text-white mt-2">
                    {currency === "INR" ? "₹1,20,000" : "$1,399"}
                    <span className="text-xs font-normal text-indigo-300">
                      {" "}
                      / year
                    </span>
                  </p>
                  <p className="mt-2 text-xs text-indigo-200">
                    #1 Homepage & Destination Hub Spotlight with dedicated
                    webinars.
                  </p>

                  <ul className="mt-4 space-y-2 text-xs text-indigo-100 border-t border-white/10 pt-4">
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-purple-300" />
                      <span>
                        <strong>#1 Hub Banner Placement</strong>
                      </span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-purple-300" />
                      <span>Dedicated India Webinar (50k+ reach)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-purple-300" />
                      <span>Dedicated Account Manager</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-purple-300" />
                      <span>0% commission on direct apps</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  {featuredTier === "Platinum" ? (
                    <span className="block w-full py-2 text-center text-xs font-bold text-purple-900 bg-purple-200 rounded-xl">
                      Current Active Plan
                    </span>
                  ) : (
                    <button
                      onClick={() => handleInitiateUpgrade("Platinum")}
                      className="w-full py-2 text-center text-xs font-bold text-white bg-[#EA5C2B] hover:bg-[#ff7240] rounded-xl cursor-pointer transition shadow-md"
                    >
                      Upgrade to Platinum →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Program Add / Edit Modal (FR-UNI-003) */}
      {isProgramModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-[#102C57]">
                {editingProgram
                  ? "Edit Degree Program"
                  : "Add New Academic Program"}
              </h3>
              <button
                onClick={() => setIsProgramModalOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={handleSaveProgram}
              className="mt-4 space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Program Full Title *
                </label>
                <input
                  type="text"
                  required
                  value={progName}
                  onChange={(e) => setProgName(e.target.value)}
                  placeholder="e.g. M.Sc. in Data Engineering & Artificial Intelligence"
                  className="w-full rounded-xl border border-slate-200 py-2.5 px-3 text-slate-800 font-medium focus:border-[#102C57] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Degree Level *
                  </label>
                  <select
                    value={progDegreeType}
                    onChange={(e) => setProgDegreeType(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-2 px-3 text-slate-800 focus:border-[#102C57] focus:outline-none bg-white"
                  >
                    <option value="Postgraduate (M.Sc.)">
                      Postgraduate (M.Sc.)
                    </option>
                    <option value="Undergraduate (B.Sc.)">
                      Undergraduate (B.Sc.)
                    </option>
                    <option value="MBA / Management">MBA / Management</option>
                    <option value="Doctoral / Ph.D.">Doctoral / Ph.D.</option>
                    <option value="Executive Education">
                      Executive Education
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Duration *
                  </label>
                  <input
                    type="text"
                    required
                    value={progDuration}
                    onChange={(e) => setProgDuration(e.target.value)}
                    placeholder="e.g. 2 Years (4 Semesters)"
                    className="w-full rounded-xl border border-slate-200 py-2 px-3 text-slate-800 focus:border-[#102C57] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tuition Fees *
                  </label>
                  <input
                    type="text"
                    required
                    value={progFees}
                    onChange={(e) => setProgFees(e.target.value)}
                    placeholder="e.g. €0 (Tuition Free) or $45,000 / yr"
                    className="w-full rounded-xl border border-slate-200 py-2 px-3 text-slate-800 focus:border-[#102C57] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Application Deadline *
                  </label>
                  <input
                    type="text"
                    required
                    value={progDeadline}
                    onChange={(e) => setProgDeadline(e.target.value)}
                    placeholder="e.g. May 31, 2026"
                    className="w-full rounded-xl border border-slate-200 py-2 px-3 text-slate-800 focus:border-[#102C57] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Intakes (e.g. Winter / Summer)
                </label>
                <input
                  type="text"
                  value={progIntakes}
                  onChange={(e) => setProgIntakes(e.target.value)}
                  placeholder="e.g. Winter (October) & Summer (April)"
                  className="w-full rounded-xl border border-slate-200 py-2 px-3 text-slate-800 focus:border-[#102C57] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Minimum Entry Requirements
                </label>
                <input
                  type="text"
                  value={progMinReqs}
                  onChange={(e) => setProgMinReqs(e.target.value)}
                  placeholder="e.g. IELTS 6.5+ / TOEFL 88+, 70%+ in B.Tech"
                  className="w-full rounded-xl border border-slate-200 py-2 px-3 text-slate-800 focus:border-[#102C57] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Brief Description & Highlights
                </label>
                <textarea
                  rows={2}
                  value={progDesc}
                  onChange={(e) => setProgDesc(e.target.value)}
                  placeholder="Brief curriculum overview, career outcomes, and English medium verification..."
                  className="w-full rounded-xl border border-slate-200 py-2 px-3 text-slate-800 focus:border-[#102C57] focus:outline-none"
                />
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProgramModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProg}
                  className="flex items-center gap-1.5 rounded-xl bg-[#102C57] px-5 py-2 font-bold text-white hover:bg-[#0c2242] transition disabled:opacity-50 shadow-xs cursor-pointer"
                >
                  <Save className="h-3.5 w-3.5 text-[#EA5C2B]" />
                  <span>
                    {editingProgram ? "Update Program" : "Publish Program"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Featured Tier Upgrade Checkout Modal (FR-UNI-005) */}
      {isCheckoutOpen && selectedUpgradeTier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-700">
                  <Award className="h-4 w-4 text-[#EA5C2B]" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[#102C57]">
                    Upgrade to {selectedUpgradeTier} Partner Tier
                  </h3>
                  <p className="text-[11px] text-slate-400">{orgName}</p>
                </div>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {upgradeSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="text-lg font-black text-[#102C57]">
                  Tier Activated Successfully!
                </h4>
                <p className="text-xs text-slate-500">
                  {orgName} is now upgraded to{" "}
                  <strong>{selectedUpgradeTier} Partner Tier</strong>. Your
                  search placement and premium features are live.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleConfirmPayment}
                className="mt-4 space-y-4 text-xs"
              >
                <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 space-y-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-600">Selected Tier:</span>
                    <span className="text-[#102C57]">
                      {selectedUpgradeTier} Annual Listing
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Base Price:</span>
                    <span className="font-semibold text-slate-800">
                      {currency === "INR"
                        ? selectedUpgradeTier === "Silver"
                          ? "₹25,000"
                          : selectedUpgradeTier === "Gold"
                            ? "₹60,000"
                            : "₹1,20,000"
                        : selectedUpgradeTier === "Silver"
                          ? "$299"
                          : selectedUpgradeTier === "Gold"
                            ? "$699"
                            : "$1,399"}
                    </span>
                  </div>
                  {currency === "INR" && (
                    <div className="flex justify-between text-slate-500">
                      <span>GST (18% HSN 998311):</span>
                      <span>
                        {selectedUpgradeTier === "Silver"
                          ? "₹4,500"
                          : selectedUpgradeTier === "Gold"
                            ? "₹10,800"
                            : "₹21,600"}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-slate-200 pt-2 font-black text-sm text-[#102C57]">
                    <span>Total Due:</span>
                    <span className="text-emerald-700">
                      {currency === "INR"
                        ? selectedUpgradeTier === "Silver"
                          ? "₹29,500"
                          : selectedUpgradeTier === "Gold"
                            ? "₹70,800"
                            : "₹1,41,600"
                        : selectedUpgradeTier === "Silver"
                          ? "$299"
                          : selectedUpgradeTier === "Gold"
                            ? "$699"
                            : "$1,399"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Institution Billing Legal Name
                  </label>
                  <input
                    type="text"
                    required
                    value={billingOrg}
                    onChange={(e) => setBillingOrg(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 py-2 px-3 text-slate-800 focus:border-[#102C57] focus:outline-none"
                  />
                </div>

                {currency === "INR" ? (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      GSTIN (For Indian Tax Invoicing)
                    </label>
                    <input
                      type="text"
                      value={billingGst}
                      onChange={(e) =>
                        setBillingGst(e.target.value.toUpperCase())
                      }
                      placeholder="07AABCT2402R1Z8"
                      className="w-full rounded-xl border border-slate-200 py-2 px-3 text-slate-800 font-mono focus:border-[#102C57] focus:outline-none"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      International VAT / Tax ID (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="DE129273398"
                      className="w-full rounded-xl border border-slate-200 py-2 px-3 text-slate-800 font-mono focus:border-[#102C57] focus:outline-none"
                    />
                  </div>
                )}

                <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-2.5 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-indigo-700 shrink-0" />
                  <span className="text-[11px] text-indigo-900 font-medium">
                    {currency === "INR"
                      ? "Razorpay Gateway: Corporate Card, NetBanking, UPI supported"
                      : "Stripe Gateway: Global Cards & Wire Transfer supported"}
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsCheckoutOpen(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={upgrading}
                    className="flex items-center gap-2 rounded-xl bg-[#102C57] px-6 py-2.5 font-bold text-white hover:bg-[#0c2242] transition disabled:opacity-50 shadow-xs cursor-pointer"
                  >
                    {upgrading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-[#EA5C2B]" />
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <Receipt className="h-4 w-4 text-[#EA5C2B]" />
                        <span>Pay & Activate Immediately</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
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
