"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Compass,
  Briefcase,
  Wallet,
  Download,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  LogOut,
  User,
  Users,
  Loader2,
  Search,
  Filter,
  Phone,
  Mail,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  BarChart3,
  Target,
  Sparkles,
  TrendingUp,
  FileText,
  DollarSign,
  Check,
  X,
  ChevronRight,
  RotateCcw,
  Calendar,
  Building2,
  Layers,
  Send,
  Plus,
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { formatCurrency } from "@/lib/utils";
import { CountryFlag } from "@/components/ui/CountryFlag";

interface LeadItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  targetCountry: string;
  targetCountrySlug: string;
  program: string;
  programSlug: string;
  budget: string;
  intake: string;
  leadScore: number;
  tier: "Exclusive" | "Semi-Exclusive" | "Shared";
  sourcePage: string;
  sourceJourney: string[];
  createdAt: string;
  cpl: number;
  status: "unread" | "contacted" | "converted" | "disputed";
  notes?: { text: string; author: string; timestamp: string }[];
  disputeReason?: string;
  disputeStatus?: "under_review" | "approved" | "rejected";
}

interface WalletTransaction {
  id: string;
  type: "credit" | "debit" | "refund";
  description: string;
  amount: number;
  date: string;
  status: "Completed" | "Pending";
  invoiceNumber?: string;
}

export default function BuyerPortalPage() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading, logout } = useAuth();

  // Active Tab: leads | wallet | analytics | disputes | targeting
  const [activeTab, setActiveTab] = useState<
    "leads" | "wallet" | "analytics" | "disputes" | "targeting"
  >("leads");

  // Leads State
  const [leadsList, setLeadsList] = useState<LeadItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "unread" | "contacted" | "converted" | "disputed"
  >("all");
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);

  // Notes state inside detail drawer
  const [newNoteText, setNewNoteText] = useState("");

  // Dispute Modal State
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeLeadId, setDisputeLeadId] = useState<string | null>(null);
  const [disputeCategory, setDisputeCategory] = useState<
    "fake_number" | "wrong_profile" | "competitor_applied" | "uninterested"
  >("fake_number");
  const [disputeNotes, setDisputeNotes] = useState("");

  // Wallet State
  const [walletBalance, setWalletBalance] = useState(28500);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [rechargeModalOpen, setRechargeModalOpen] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState<number>(25000);
  const [selectedInvoice, setSelectedInvoice] =
    useState<WalletTransaction | null>(null);

  // Analytics timeframe
  const [analyticsTimeframe, setAnalyticsTimeframe] = useState<
    "7d" | "30d" | "quarter" | "all"
  >("30d");

  // Targeting Rules State
  const [targetCountries, setTargetCountries] = useState<string[]>([
    "germany",
    "usa",
    "uk",
    "canada",
    "australia",
  ]);
  const [targetPrograms, setTargetPrograms] = useState<string[]>([
    "ms",
    "mba",
    "bachelors",
  ]);
  const [minLeadScoreThreshold, setMinLeadScoreThreshold] = useState(75);
  const [dailyBudgetCap, setDailyBudgetCap] = useState(15000);
  const [businessHours, setBusinessHours] = useState("09:00 - 19:00 IST");
  const [autoUnlockEnabled, setAutoUnlockEnabled] = useState(true);
  const [targetingSavedNotice, setTargetingSavedNotice] = useState(false);

  const orgName =
    user?.organization || user?.name || "Apex Overseas Consultants";
  const userGstin = (user as any)?.metadata?.gstin || "27AABCU9603R1ZM";

  // Initial Data Load
  useEffect(() => {
    const defaultLeads: LeadItem[] = [
      {
        id: "lead-101",
        name: "Rahul Sharma",
        phone: "+91 98765 43210",
        email: "rahul.sharma@gmail.com",
        targetCountry: "Germany",
        targetCountrySlug: "germany",
        program: "MS in Computer Science & AI",
        programSlug: "ms",
        budget: "₹15 - 25 Lakhs",
        intake: "Winter 2026",
        leadScore: 94,
        tier: "Exclusive",
        sourcePage: "/study-in-germany/ms",
        sourceJourney: [
          "Homepage",
          "Cost Calculator",
          "Germany MS Hub",
          "Lead Form",
        ],
        createdAt: "10 mins ago",
        cpl: 1500,
        status: "unread",
        notes: [
          {
            text: "Student has 8.4 CGPA in B.Tech CSE, IELTS 7.5. Wants TU Munich or RWTH Aachen.",
            author: "Automated Qualifier",
            timestamp: "10 mins ago",
          },
        ],
      },
      {
        id: "lead-102",
        name: "Priya Patel",
        phone: "+91 98234 56789",
        email: "priya.patel@yahoo.com",
        targetCountry: "United States",
        targetCountrySlug: "usa",
        program: "Full-Time STEM MBA",
        programSlug: "mba",
        budget: "₹35 - 50 Lakhs",
        intake: "Fall 2027",
        leadScore: 88,
        tier: "Semi-Exclusive",
        sourcePage: "/destinations/usa/mba",
        sourceJourney: [
          "Google Ads",
          "USA MBA Guide",
          "Loan Calculator",
          "Lead Form",
        ],
        createdAt: "2 hours ago",
        cpl: 1500,
        status: "contacted",
        notes: [
          {
            text: "Spoke with candidate. 4 years software development experience at Infosys. Interested in Boston University and Georgia Tech.",
            author: "Rajesh (Consultant)",
            timestamp: "1 hour ago",
          },
        ],
      },
      {
        id: "lead-103",
        name: "Ananya Deshmukh",
        phone: "+91 99123 45678",
        email: "ananya.d@gmail.com",
        targetCountry: "United Kingdom",
        targetCountrySlug: "uk",
        program: "MSc International Management",
        programSlug: "ms",
        budget: "₹20 - 30 Lakhs",
        intake: "September 2026",
        leadScore: 91,
        tier: "Exclusive",
        sourcePage: "/compare/universities",
        sourceJourney: ["Compare Tool", "UK Country Hub", "Lead Form"],
        createdAt: "5 hours ago",
        cpl: 1500,
        status: "converted",
        notes: [
          {
            text: "Enrolled in premium counselling pack. Applications sent to Manchester and Warwick.",
            author: "Rajesh (Consultant)",
            timestamp: "3 hours ago",
          },
        ],
      },
      {
        id: "lead-104",
        name: "Vikram Malhotra",
        phone: "+91 97654 32109",
        email: "vikram.m@outlook.com",
        targetCountry: "Canada",
        targetCountrySlug: "canada",
        program: "Post-Graduate Diploma in Data",
        programSlug: "ms",
        budget: "₹18 - 25 Lakhs",
        intake: "Jan 2027",
        leadScore: 82,
        tier: "Shared",
        sourcePage: "/destinations/canada",
        sourceJourney: ["Direct Search", "Canada Hub", "Lead Form"],
        createdAt: "Yesterday",
        cpl: 1200,
        status: "contacted",
      },
      {
        id: "lead-105",
        name: "Arjun Verma",
        phone: "+91 98111 22233",
        email: "arjun.v@gmail.com",
        targetCountry: "Australia",
        targetCountrySlug: "australia",
        program: "Bachelor of Business Analytics",
        programSlug: "bachelors",
        budget: "₹25 - 35 Lakhs",
        intake: "February 2027",
        leadScore: 68,
        tier: "Shared",
        sourcePage: "/programs/bachelors",
        sourceJourney: ["Bachelors Page", "Lead Form"],
        createdAt: "2 days ago",
        cpl: 1200,
        status: "disputed",
        disputeReason: "Phone switched off consistently across 3 days.",
        disputeStatus: "approved",
      },
    ];

    // Read stored wallet
    const storedWallet = localStorage.getItem("vista_buyer_wallet");
    if (storedWallet) {
      try {
        const parsed = JSON.parse(storedWallet);
        if (parsed.balance) setWalletBalance(parsed.balance);
        if (parsed.transactions) setTransactions(parsed.transactions);
      } catch (e) {
        console.warn("Wallet read error:", e);
      }
    } else {
      const defaultTx: WalletTransaction[] = [
        {
          id: "tx-1001",
          type: "credit",
          description: "Online Wallet Recharge (Razorpay Transfer)",
          amount: 25000,
          date: "2026-09-20T10:30:00Z",
          status: "Completed",
          invoiceNumber: "INV-2026-8812",
        },
        {
          id: "tx-1002",
          type: "debit",
          description:
            "Exclusive Lead Purchase #lead-101 (Rahul Sharma - Germany MS)",
          amount: 1500,
          date: "2026-09-22T08:15:00Z",
          status: "Completed",
        },
        {
          id: "tx-1003",
          type: "debit",
          description:
            "Semi-Exclusive Lead Purchase #lead-102 (Priya Patel - USA MBA)",
          amount: 1500,
          date: "2026-09-22T06:45:00Z",
          status: "Completed",
        },
        {
          id: "tx-1004",
          type: "refund",
          description:
            "Dispute Auto-Refund #lead-105 (Arjun Verma - Unreachable Number)",
          amount: 1200,
          date: "2026-09-21T14:20:00Z",
          status: "Completed",
        },
      ];
      setTransactions(defaultTx);
    }

    // Read stored targeting
    const storedTargeting = localStorage.getItem("vista_buyer_targeting");
    if (storedTargeting) {
      try {
        const parsed = JSON.parse(storedTargeting);
        if (parsed.countries) setTargetCountries(parsed.countries);
        if (parsed.programs) setTargetPrograms(parsed.programs);
        if (parsed.minLeadScore) setMinLeadScoreThreshold(parsed.minLeadScore);
        if (parsed.dailyLeadCap) setDailyBudgetCap(parsed.dailyLeadCap * 1500);
      } catch (e) {
        console.warn("Targeting read error:", e);
      }
    }

    // Read real submitted leads from localStorage if available
    try {
      const liveStored = JSON.parse(
        localStorage.getItem("vista_submitted_leads") || "[]",
      );
      if (Array.isArray(liveStored) && liveStored.length > 0) {
        const mappedLive: LeadItem[] = liveStored.map(
          (l: any, idx: number) => ({
            id: `live-lead-${idx + 100}`,
            name: l.fullName || l.full_name || "Applicant",
            phone: l.phone || "+91 98765 43210",
            email: l.email || "student@example.com",
            targetCountry: l.countryTarget || l.country_target || "Germany",
            targetCountrySlug: (
              l.countryTarget ||
              l.country_target ||
              "germany"
            ).toLowerCase(),
            program: `${String(l.programTarget || l.program_target || "ms").toUpperCase()} Degree Track`,
            programSlug: String(
              l.programTarget || l.program_target || "ms",
            ).toLowerCase(),
            budget: l.budgetRangeINR || l.budget_range_inr || "₹15 - 25 Lakhs",
            intake: l.intakeYear || l.intake_year || "Fall 2026",
            leadScore: 92,
            tier: "Exclusive",
            sourcePage: "/cost-calculator",
            sourceJourney: [
              "Organic Search",
              "Cost Calculator",
              "Direct Inquiry",
            ],
            createdAt: "Just now",
            cpl: 1500,
            status: "unread",
          }),
        );
        setLeadsList([...mappedLive, ...defaultLeads]);
      } else {
        setLeadsList(defaultLeads);
      }
    } catch {
      setLeadsList(defaultLeads);
    }
  }, []);

  // Filtered Leads
  const filteredLeads = leadsList.filter((l) => {
    const matchesStatus = statusFilter === "all" || l.status === statusFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      l.name.toLowerCase().includes(query) ||
      l.email.toLowerCase().includes(query) ||
      l.phone.toLowerCase().includes(query) ||
      l.targetCountry.toLowerCase().includes(query) ||
      l.program.toLowerCase().includes(query);
    return matchesStatus && matchesSearch;
  });

  // Action: Add Note to Selected Lead
  const handleAddNote = () => {
    if (!newNoteText.trim() || !selectedLead) return;
    const updatedNotes = [
      ...(selectedLead.notes || []),
      {
        text: newNoteText.trim(),
        author: user?.name || "Consultant Officer",
        timestamp: "Just now",
      },
    ];
    const updatedLead = { ...selectedLead, notes: updatedNotes };
    setSelectedLead(updatedLead);
    setLeadsList((prev) =>
      prev.map((l) => (l.id === selectedLead.id ? updatedLead : l)),
    );
    setNewNoteText("");
  };

  // Action: Update Lead Status
  const handleUpdateStatus = (newStatus: LeadItem["status"]) => {
    if (!selectedLead) return;
    const updatedLead = { ...selectedLead, status: newStatus };
    setSelectedLead(updatedLead);
    setLeadsList((prev) =>
      prev.map((l) => (l.id === selectedLead.id ? updatedLead : l)),
    );
  };

  // Action: Open Dispute Modal
  const openDisputeModal = (leadId: string) => {
    setDisputeLeadId(leadId);
    setDisputeNotes("");
    setDisputeModalOpen(true);
  };

  // Action: Submit Dispute [FR-BUY-007]
  const handleDisputeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disputeLeadId) return;

    const leadToDispute = leadsList.find((l) => l.id === disputeLeadId);
    const refundAmount = leadToDispute?.cpl || 1500;

    // 1. Update lead status
    setLeadsList((prev) =>
      prev.map((l) =>
        l.id === disputeLeadId
          ? {
              ...l,
              status: "disputed",
              disputeReason: disputeNotes || "Candidate unreachable",
              disputeStatus: "approved",
            }
          : l,
      ),
    );

    // 2. Auto-refund back to wallet
    const newBalance = walletBalance + refundAmount;
    setWalletBalance(newBalance);

    const refundTx: WalletTransaction = {
      id: `tx-ref-${Date.now()}`,
      type: "refund",
      description: `Dispute Auto-Refund #${disputeLeadId} (${leadToDispute?.name || "Lead"})`,
      amount: refundAmount,
      date: new Date().toISOString(),
      status: "Completed",
    };
    const updatedTx = [refundTx, ...transactions];
    setTransactions(updatedTx);

    // Persist wallet
    localStorage.setItem(
      "vista_buyer_wallet",
      JSON.stringify({ balance: newBalance, transactions: updatedTx }),
    );

    if (selectedLead?.id === disputeLeadId) {
      setSelectedLead({
        ...selectedLead,
        status: "disputed",
        disputeReason: disputeNotes,
        disputeStatus: "approved",
      });
    }

    setDisputeModalOpen(false);
  };

  // Action: Wallet Recharge [FR-BUY-005]
  const handleRechargeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rechargeAmount <= 0) return;

    const newBalance = walletBalance + rechargeAmount;
    setWalletBalance(newBalance);

    const newTx: WalletTransaction = {
      id: `tx-rec-${Date.now()}`,
      type: "credit",
      description: `Online Wallet Recharge (Razorpay Instant Credit)`,
      amount: rechargeAmount,
      date: new Date().toISOString(),
      status: "Completed",
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    };
    const updatedTx = [newTx, ...transactions];
    setTransactions(updatedTx);

    localStorage.setItem(
      "vista_buyer_wallet",
      JSON.stringify({ balance: newBalance, transactions: updatedTx }),
    );

    setRechargeModalOpen(false);
  };

  // Action: Save Targeting Rules [FR-BUY-008]
  const handleSaveTargeting = (e: React.FormEvent) => {
    e.preventDefault();
    const rules = {
      countries: targetCountries,
      programs: targetPrograms,
      minLeadScore: minLeadScoreThreshold,
      dailyBudgetCap,
      operatingHours: businessHours,
      autoUnlock: autoUnlockEnabled,
    };
    localStorage.setItem("vista_buyer_targeting", JSON.stringify(rules));
    setTargetingSavedNotice(true);
    setTimeout(() => setTargetingSavedNotice(false), 3500);
  };

  const toggleTargetCountry = (slug: string) => {
    setTargetCountries((prev) =>
      prev.includes(slug) ? prev.filter((c) => c !== slug) : [...prev, slug],
    );
  };

  const toggleTargetProgram = (key: string) => {
    setTargetPrograms((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key],
    );
  };

  // WoW Metrics calculations [FR-BUY-002]
  const totalReceived = leadsList.length;
  const totalConverted = leadsList.filter(
    (l) => l.status === "converted",
  ).length;
  const totalDisputed = leadsList.filter((l) => l.status === "disputed").length;
  const conversionRate =
    totalReceived > 0
      ? ((totalConverted / totalReceived) * 100).toFixed(1)
      : "24.2";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-[#EA5C2B]/15">
      {/* Top B2B Portal Header */}
      <header className="border-b border-slate-200/90 bg-white sticky top-0 z-30 px-4 sm:px-8 py-3.5 shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2.5 hover:opacity-95 transition"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#102C57] text-white shadow-xs">
                <Compass className="h-5 w-5 text-[#EA5C2B]" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-[#102C57]">
                  StudyAbroad<span className="text-[#EA5C2B]">Vista</span>
                </span>
                <span className="ml-2 rounded-md bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-[10px] font-extrabold text-[#102C57]">
                  B2B Consultant Portal
                </span>
              </div>
            </Link>
          </div>

          {/* User Profile & Wallet Quick Badge */}
          <div className="flex items-center gap-3">
            {/* Quick Wallet Recharge Badge */}
            <button
              onClick={() => {
                setActiveTab("wallet");
                setRechargeModalOpen(true);
              }}
              className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition cursor-pointer"
            >
              <Wallet className="h-3.5 w-3.5 text-emerald-600" />
              <span>Wallet: ₹{walletBalance.toLocaleString("en-IN")}</span>
              <span className="rounded bg-emerald-600 px-1.5 py-0.2 text-[10px] text-white">
                + Add
              </span>
            </button>

            {/* User Dropdown */}
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#102C57] text-[11px] font-bold text-white">
                {orgName.charAt(0)}
              </div>
              <span className="font-bold text-slate-800 hidden sm:inline max-w-xs truncate">
                {orgName}
              </span>
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="text-slate-400 hover:text-rose-600 ml-1 transition"
                title="Sign Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          {/* 1. Week-over-Week KPI Cards [FR-BUY-002] */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Card 1: Total Leads */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Delivered Leads
                </span>
                <Users className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {totalReceived}
              </div>
              <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                <TrendingUp className="h-3 w-3" />
                <span>100% OTP Verified</span>
              </div>
            </div>

            {/* Card 2: Wallet Balance */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Available Balance
                </span>
                <Wallet className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-700">
                ₹{walletBalance.toLocaleString("en-IN")}
              </div>
              <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                <span>Auto-debit active</span>
                <button
                  onClick={() => setRechargeModalOpen(true)}
                  className="font-bold text-[#EA5C2B] hover:underline"
                >
                  Top Up →
                </button>
              </div>
            </div>

            {/* Card 3: Conversion Rate */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Conversion Rate
                </span>
                <Target className="h-4 w-4 text-[#EA5C2B]" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                {conversionRate}%
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                <span>{totalConverted} Enrolled Candidates</span>
              </div>
            </div>

            {/* Card 4: Dispute SLA */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider">
                  Dispute Guarantee
                </span>
                <ShieldCheck className="h-4 w-4 text-indigo-600" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">
                24h SLA
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                <span>{totalDisputed} auto-refunds processed</span>
              </div>
            </div>
          </div>

          {/* 2. Operational Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs font-bold">
            {[
              {
                id: "leads",
                label: "📥 Leads Inbox & CRM",
                count: leadsList.length,
              },
              { id: "wallet", label: "💳 Wallet & GST Billing" },
              { id: "analytics", label: "📊 Performance Analytics" },
              {
                id: "disputes",
                label: "⚖️ Disputes & Refunds",
                count: totalDisputed,
              },
              { id: "targeting", label: "🎯 Targeting & Delivery Rules" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 rounded-t-xl py-2.5 px-4 transition whitespace-nowrap cursor-pointer ${
                  activeTab === tab.id
                    ? "border-b-2 border-[#EA5C2B] text-[#102C57] bg-white shadow-2xs font-extrabold"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      activeTab === tab.id
                        ? "bg-[#102C57] text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* TAB 1: LEADS INBOX & CRM [FR-BUY-003, FR-BUY-004] */}
          {activeTab === "leads" && (
            <div className="space-y-4">
              {/* Search & Status Filters */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
                {/* Status Filter Tabs */}
                <div className="flex flex-wrap items-center gap-1 text-xs font-bold">
                  {[
                    { id: "all", label: "All Leads" },
                    { id: "unread", label: "Unread / New" },
                    { id: "contacted", label: "Contacted" },
                    { id: "converted", label: "Converted / Enrolled" },
                    { id: "disputed", label: "Disputed" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setStatusFilter(s.id as any)}
                      className={`rounded-xl px-3 py-1.5 transition cursor-pointer ${
                        statusFilter === s.id
                          ? "bg-[#102C57] text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {/* Real-time Search */}
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search name, phone, email, country..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-4 py-2 text-xs font-semibold text-slate-900 focus:border-[#102C57] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Leads Table / Cards List */}
              <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="py-3.5 px-4">Student & Contact</th>
                        <th className="py-3.5 px-4">Target Track</th>
                        <th className="py-3.5 px-4">Quality Score</th>
                        <th className="py-3.5 px-4">Tier & Source</th>
                        <th className="py-3.5 px-4">CPL & Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {filteredLeads.map((lead) => (
                        <tr
                          key={lead.id}
                          onClick={() => setSelectedLead(lead)}
                          className="hover:bg-slate-50/80 transition cursor-pointer group"
                        >
                          {/* Student */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-slate-900 group-hover:text-[#EA5C2B] transition">
                              {lead.name}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                              <span>{lead.phone}</span>
                              <span>•</span>
                              <span className="truncate max-w-[140px]">
                                {lead.email}
                              </span>
                            </div>
                          </td>

                          {/* Track */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 font-bold text-slate-900">
                              <CountryFlag
                                code={lead.targetCountrySlug}
                                size="sm"
                              />
                              <span>{lead.targetCountry}</span>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              {lead.program} ({lead.intake})
                            </div>
                          </td>

                          {/* Quality Score */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                                lead.leadScore >= 90
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                  : lead.leadScore >= 75
                                    ? "bg-blue-50 text-blue-800 border border-blue-200"
                                    : "bg-amber-50 text-amber-800 border border-amber-200"
                              }`}
                            >
                              <Sparkles className="h-3 w-3" />
                              Score {lead.leadScore}/100
                            </span>
                            <span className="block text-[10px] text-slate-400 mt-1">
                              Budget: {lead.budget}
                            </span>
                          </td>

                          {/* Tier & Source */}
                          <td className="py-3.5 px-4">
                            <span className="rounded-md bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 text-[10px] font-bold">
                              {lead.tier}
                            </span>
                            <span className="block text-[10px] text-slate-400 mt-1 font-mono truncate max-w-[120px]">
                              {lead.sourcePage}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <span
                              className={`rounded-lg px-2.5 py-1 text-[10px] font-extrabold capitalize ${
                                lead.status === "unread"
                                  ? "bg-orange-50 text-[#EA5C2B] border border-orange-200 animate-pulse"
                                  : lead.status === "contacted"
                                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                                    : lead.status === "converted"
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : "bg-rose-50 text-rose-700 border border-rose-200"
                              }`}
                            >
                              {lead.status}
                            </span>
                            <span className="block text-[10px] text-slate-400 mt-1">
                              ₹{lead.cpl} CPL • {lead.createdAt}
                            </span>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3.5 px-4 text-right">
                            <div
                              className="flex items-center justify-end gap-1.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* 1-Click WhatsApp */}
                              <a
                                href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${lead.name}, I am reaching out from ${orgName} regarding your study abroad plans for ${lead.targetCountry}.`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white p-2 transition"
                                title="WhatsApp Direct"
                              >
                                <MessageSquare className="h-3.5 w-3.5" />
                              </a>

                              {/* 1-Click Call */}
                              <a
                                href={`tel:${lead.phone}`}
                                className="rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white p-2 transition"
                                title="Call Student"
                              >
                                <Phone className="h-3.5 w-3.5" />
                              </a>

                              {/* View Details */}
                              <button
                                onClick={() => setSelectedLead(lead)}
                                className="rounded-lg bg-slate-100 text-slate-700 hover:bg-[#102C57] hover:text-white p-2 transition"
                                title="Open Full Profile"
                              >
                                <ChevronRight className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredLeads.length === 0 && (
                  <div className="text-center py-12 px-4">
                    <Users className="mx-auto h-8 w-8 text-slate-400" />
                    <h4 className="mt-2 text-sm font-bold text-slate-800">
                      No matching leads found
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Try adjusting your search criteria or filter status.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: WALLET & GST BILLING [FR-BUY-005] */}
          {activeTab === "wallet" && (
            <div className="space-y-6">
              {/* Wallet Summary Card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800">
                      <Wallet className="h-3.5 w-3.5" />
                      <span>Prepaid Wallet Balance</span>
                    </div>
                    <div className="mt-3 text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
                      ₹{walletBalance.toLocaleString("en-IN")}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Auto-debit active for leads matching your targeting rules.
                      GST 18% applied on invoice generation.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                    <button
                      onClick={() => setRechargeModalOpen(true)}
                      className="flex items-center justify-center gap-2 rounded-xl bg-[#EA5C2B] py-3 px-6 text-xs font-bold text-white hover:bg-[#d94f20] transition shadow-md cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Instant Wallet Recharge</span>
                    </button>
                  </div>
                </div>

                {/* GST Info Note */}
                <div className="mt-6 flex items-start gap-2.5 rounded-2xl bg-indigo-50/60 p-4 border border-indigo-100 text-xs text-slate-700">
                  <Building2 className="h-4 w-4 text-[#102C57] shrink-0 mt-0.5" />
                  <div>
                    <strong>Registered Billing GSTIN:</strong> {userGstin} (
                    {orgName})
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      All monthly lead purchases generate compliant B2B tax
                      invoices with full GST input tax credit (ITC)
                      pass-through.
                    </p>
                  </div>
                </div>
              </div>

              {/* Transactions Ledger */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#102C57]">
                    Itemized Transaction Ledger
                  </h3>
                  <span className="text-xs text-slate-500">
                    Showing latest {transactions.length} activities
                  </span>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="py-3.5 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${
                            tx.type === "credit"
                              ? "bg-emerald-50 text-emerald-700"
                              : tx.type === "refund"
                                ? "bg-indigo-50 text-indigo-700"
                                : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {tx.type === "credit" ? (
                            <Plus className="h-4 w-4" />
                          ) : tx.type === "refund" ? (
                            <RotateCcw className="h-4 w-4" />
                          ) : (
                            <Users className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">
                            {tx.description}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {new Date(tx.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            • ID: {tx.id}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div
                          className={`font-black text-sm ${
                            tx.type === "credit" || tx.type === "refund"
                              ? "text-emerald-700"
                              : "text-slate-900"
                          }`}
                        >
                          {tx.type === "credit" || tx.type === "refund"
                            ? `+ ₹${tx.amount.toLocaleString("en-IN")}`
                            : `- ₹${tx.amount.toLocaleString("en-IN")}`}
                        </div>
                        {tx.invoiceNumber && (
                          <button
                            onClick={() => setSelectedInvoice(tx)}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-[#EA5C2B] hover:underline mt-0.5"
                          >
                            <Download className="h-3 w-3" />
                            <span>GST Invoice</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ANALYTICS DASHBOARD [FR-BUY-006] */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              {/* Analytics Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200">
                <div>
                  <h3 className="text-base font-bold text-[#102C57]">
                    Consultancy Conversion & Acquisition Analytics
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Track lead delivery velocity, cost per admit, and top
                    performing channels.
                  </p>
                </div>

                {/* Timeframe selector */}
                <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1 text-xs font-bold">
                  {[
                    { id: "7d", label: "7 Days" },
                    { id: "30d", label: "30 Days" },
                    { id: "quarter", label: "Quarter" },
                    { id: "all", label: "All Time" },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setAnalyticsTimeframe(t.id as any)}
                      className={`rounded-lg px-3 py-1.5 transition ${
                        analyticsTimeframe === t.id
                          ? "bg-[#102C57] text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conversion Funnel Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    Average Cost Per Admit (CPA)
                  </span>
                  <div className="text-3xl font-black text-slate-900 mt-2">
                    ₹6,198
                  </div>
                  <p className="text-[11px] text-emerald-600 font-semibold mt-1">
                    Industry benchmark: ₹18,000+
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    First-Contact Response SLA
                  </span>
                  <div className="text-3xl font-black text-slate-900 mt-2">
                    18 Mins
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    84% contacted within 1 hour of OTP
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    Lead Dispute Rate
                  </span>
                  <div className="text-3xl font-black text-emerald-700 mt-2">
                    1.4%
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Platform average: 3.2%
                  </p>
                </div>
              </div>

              {/* Breakdown by Country & Program */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Source Pages */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                    Top Converting Source Pages
                  </h4>
                  <div className="space-y-3 text-xs">
                    {[
                      { page: "/cost-calculator", leads: 48, share: 38 },
                      { page: "/study-in-germany/ms", leads: 34, share: 27 },
                      { page: "/compare/universities", leads: 26, share: 20 },
                      { page: "/study-in-usa", leads: 20, share: 15 },
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between font-semibold">
                          <span className="text-slate-800 font-mono">
                            {item.page}
                          </span>
                          <span className="text-slate-600">
                            {item.leads} Leads ({item.share}%)
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            style={{ width: `${item.share}%` }}
                            className="h-full bg-[#102C57] rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Program Breakdown */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
                    Student Leads by Program Track
                  </h4>
                  <div className="space-y-3 text-xs">
                    {[
                      {
                        prog: "Master's (STEM MS / MSc)",
                        pct: 45,
                        color: "bg-[#EA5C2B]",
                      },
                      {
                        prog: "MBA & Executive MBA",
                        pct: 28,
                        color: "bg-blue-600",
                      },
                      {
                        prog: "Bachelor's Degrees",
                        pct: 15,
                        color: "bg-purple-600",
                      },
                      {
                        prog: "Ausbildung & Nursing",
                        pct: 12,
                        color: "bg-emerald-600",
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between font-semibold">
                          <span className="text-slate-800">{item.prog}</span>
                          <span className="text-slate-600">{item.pct}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            style={{ width: `${item.pct}%` }}
                            className={`h-full ${item.color} rounded-full`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DISPUTES & REFUNDS [FR-BUY-007] */}
          {activeTab === "disputes" && (
            <div className="space-y-6">
              {/* Disputes Info Banner */}
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-700">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#102C57] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-sm text-[#102C57]">
                      StudyAbroad Vista 100% Quality & Dispute SLA
                    </strong>
                    <p className="mt-1 text-slate-600">
                      File a dispute within 72 hours of lead receipt if a phone
                      number is fake, the student is already enrolled with a
                      competitor, or the profile is invalid. All verified
                      disputes are refunded to your wallet within 24 hours.
                    </p>
                  </div>
                </div>
              </div>

              {/* Active & Resolved Disputes Table */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
                <h3 className="text-sm font-bold text-[#102C57] mb-4">
                  Dispute History & Auto-Refund Ledger
                </h3>

                <div className="space-y-3 text-xs">
                  {leadsList
                    .filter((l) => l.status === "disputed" || l.disputeReason)
                    .map((d) => (
                      <div
                        key={d.id}
                        className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">
                              {d.name} ({d.phone})
                            </span>
                            <span className="rounded-md bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 text-[10px] font-bold">
                              {d.disputeStatus === "approved"
                                ? "✅ Approved & Refunded"
                                : "⏳ Under Review (24h SLA)"}
                            </span>
                          </div>
                          <p className="text-slate-600 mt-1">
                            <strong>Reason:</strong>{" "}
                            {d.disputeReason || "Fake / Unreachable number"}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-0.5 block">
                            Lead ID: {d.id} • Target: {d.targetCountry} (
                            {d.program})
                          </span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-bold text-emerald-700 text-sm">
                            + ₹{d.cpl} Refunded
                          </span>
                          <span className="block text-[10px] text-slate-400">
                            Credited to Wallet
                          </span>
                        </div>
                      </div>
                    ))}

                  {leadsList.filter((l) => l.status === "disputed").length ===
                    0 && (
                    <div className="text-center py-8 text-slate-500">
                      No active disputes. All delivered leads meet verification
                      criteria.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TARGETING RULES [FR-BUY-008] */}
          {activeTab === "targeting" && (
            <form
              onSubmit={handleSaveTargeting}
              className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <h3 className="text-lg font-bold text-[#102C57]">
                    Targeting Rules & Delivery Automation
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Configure which countries, programs, and lead score
                    thresholds you accept for automatic wallet debit.
                  </p>
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-[#102C57] py-2.5 px-6 text-xs font-bold text-white hover:bg-[#0c2242] transition shadow-xs cursor-pointer self-start sm:self-center"
                >
                  <Check className="h-4 w-4 text-[#EA5C2B]" />
                  <span>Save Targeting Rules</span>
                </button>
              </div>

              {targetingSavedNotice && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-bold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span>Targeting parameters saved successfully!</span>
                </div>
              )}

              {/* 1. Countries */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  1. Target Study Destinations
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { slug: "germany", name: "Germany" },
                    { slug: "usa", name: "United States" },
                    { slug: "uk", name: "United Kingdom" },
                    { slug: "canada", name: "Canada" },
                    { slug: "australia", name: "Australia" },
                    { slug: "ireland", name: "Ireland" },
                    { slug: "france", name: "France" },
                    { slug: "italy", name: "Italy" },
                    { slug: "netherlands", name: "Netherlands" },
                    { slug: "new-zealand", name: "New Zealand" },
                    { slug: "uzbekistan", name: "Uzbekistan" },
                    { slug: "georgia", name: "Georgia" },
                  ].map((c) => {
                    const isSelected = targetCountries.includes(c.slug);
                    return (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => toggleTargetCountry(c.slug)}
                        className={`flex items-center gap-2 rounded-xl p-2.5 text-left font-bold transition border ${
                          isSelected
                            ? "border-[#102C57] bg-[#102C57] text-white shadow-xs"
                            : "border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <CountryFlag code={c.slug} size="sm" />
                        <span className="truncate">{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Program Streams */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  2. Accepted Degree Disciplines
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {[
                    { key: "ms", label: "Master's (MS/MSc)" },
                    { key: "mba", label: "MBA & Executive MBA" },
                    { key: "bachelors", label: "Bachelor's Degrees" },
                    { key: "mbbs", label: "Medical (MBBS / MD)" },
                    { key: "ausbildung", label: "Ausbildung (DE)" },
                    { key: "nursing", label: "Nursing & Healthcare" },
                  ].map((p) => {
                    const isSelected = targetPrograms.includes(p.key);
                    return (
                      <button
                        key={p.key}
                        type="button"
                        onClick={() => toggleTargetProgram(p.key)}
                        className={`flex items-center justify-between rounded-xl p-2.5 font-bold transition border ${
                          isSelected
                            ? "border-[#EA5C2B] bg-[#EA5C2B] text-white shadow-xs"
                            : "border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        <span>{p.label}</span>
                        {isSelected && <Check className="h-3.5 w-3.5" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Daily Cap & Score Threshold */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                    Daily Lead Budget Cap (INR)
                  </label>
                  <select
                    value={dailyBudgetCap}
                    onChange={(e) => setDailyBudgetCap(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3.5 font-semibold text-slate-900 focus:border-[#102C57] focus:bg-white focus:outline-none"
                  >
                    <option value={7500}>₹7,500 / Day (~5 Leads)</option>
                    <option value={15000}>₹15,000 / Day (~10 Leads)</option>
                    <option value={30000}>₹30,000 / Day (~20 Leads)</option>
                    <option value={75000}>₹75,000 / Day (~50 Leads)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                    Minimum Lead Score Threshold
                  </label>
                  <select
                    value={minLeadScoreThreshold}
                    onChange={(e) =>
                      setMinLeadScoreThreshold(Number(e.target.value))
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 px-3.5 font-semibold text-slate-900 focus:border-[#102C57] focus:bg-white focus:outline-none"
                  >
                    <option value={60}>Score ≥ 60 (Broader Volume)</option>
                    <option value={75}>
                      Score ≥ 75 (High Intent - Default)
                    </option>
                    <option value={85}>Score ≥ 85 (Top Profiles Only)</option>
                  </select>
                </div>
              </div>

              {/* 4. Operating Hours & Auto-Unlock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Operating Business Hours
                  </label>
                  <p className="text-[11px] text-slate-500 mb-2">
                    Leads arriving outside operating hours are queued in buffer.
                  </p>
                  <input
                    type="text"
                    value={businessHours}
                    onChange={(e) => setBusinessHours(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2 px-3 text-xs font-semibold text-slate-900"
                  />
                </div>

                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 flex items-center justify-between gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#102C57]">
                      Instant Auto-Unlock
                    </label>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Automatically debit wallet and push OTP verified leads.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoUnlockEnabled}
                    onChange={(e) => setAutoUnlockEnabled(e.target.checked)}
                    className="h-5 w-5 rounded accent-[#102C57] cursor-pointer shrink-0"
                  />
                </div>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Slide-over Individual Lead Detail Drawer [FR-BUY-004] */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#102C57] text-white font-bold text-sm">
                  {selectedLead.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <span>{selectedLead.name}</span>
                    <span className="rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[10px] font-extrabold">
                      OTP Verified
                    </span>
                  </h3>
                  <span className="text-xs text-slate-500">
                    Lead ID: {selectedLead.id} • {selectedLead.createdAt}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="p-6 space-y-6 flex-1 text-xs">
              {/* 1-Click Action Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <a
                  href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${selectedLead.name}, I am reaching out from ${orgName} regarding your study abroad plans for ${selectedLead.targetCountry}.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 text-white font-bold py-2.5 px-3 hover:bg-emerald-700 transition shadow-xs"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`tel:${selectedLead.phone}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#102C57] text-white font-bold py-2.5 px-3 hover:bg-[#0c2242] transition shadow-xs"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call Student</span>
                </a>

                <a
                  href={`mailto:${selectedLead.email}`}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold py-2.5 px-3 hover:bg-slate-50 transition"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </a>
              </div>

              {/* Profile Details Grid */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
                <h4 className="font-extrabold uppercase tracking-wider text-[11px] text-[#102C57]">
                  Academic & Intake Profile
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 block text-[10px]">
                      Target Country:
                    </span>
                    <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                      <CountryFlag
                        code={selectedLead.targetCountrySlug}
                        size="sm"
                      />
                      {selectedLead.targetCountry}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">
                      Program Stream:
                    </span>
                    <span className="font-bold text-slate-800 mt-0.5 block">
                      {selectedLead.program}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">
                      Target Intake:
                    </span>
                    <span className="font-bold text-slate-800 mt-0.5 block">
                      {selectedLead.intake}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">
                      Budget Range (INR):
                    </span>
                    <span className="font-bold text-slate-800 mt-0.5 block">
                      {selectedLead.budget}
                    </span>
                  </div>
                </div>
              </div>

              {/* Attribution & Journey */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
                <h4 className="font-extrabold uppercase tracking-wider text-[11px] text-[#102C57]">
                  Session Attribution Journey
                </h4>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {selectedLead.sourceJourney.map((step, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[11px] bg-slate-100 text-slate-700 px-2 py-1 rounded-md font-medium"
                    >
                      {step}
                      {idx < selectedLead.sourceJourney.length - 1 && (
                        <ChevronRight className="h-3 w-3 text-slate-400 ml-1" />
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* CRM Contact Status Updater */}
              <div className="space-y-2">
                <h4 className="font-extrabold uppercase tracking-wider text-[11px] text-slate-700">
                  Update Lead CRM Status
                </h4>
                <div className="grid grid-cols-4 gap-1.5">
                  {(
                    ["unread", "contacted", "converted", "disputed"] as const
                  ).map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(st)}
                      className={`rounded-xl py-2 text-center capitalize font-bold transition border ${
                        selectedLead.status === st
                          ? "bg-[#102C57] text-white border-[#102C57] shadow-xs"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Consultation Notes Ledger */}
              <div className="space-y-3">
                <h4 className="font-extrabold uppercase tracking-wider text-[11px] text-slate-700">
                  Consultation Notes
                </h4>

                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {(selectedLead.notes || []).map((note, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-slate-100 bg-slate-50 p-3"
                    >
                      <p className="text-slate-800 leading-relaxed">
                        {note.text}
                      </p>
                      <span className="block text-[10px] text-slate-400 mt-1">
                        {note.author} • {note.timestamp}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Add Note Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a private note about this student..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 font-medium focus:border-[#102C57] focus:bg-white focus:outline-none"
                  />
                  <button
                    onClick={handleAddNote}
                    className="rounded-xl bg-[#102C57] text-white px-3 py-2 font-bold hover:bg-[#0c2242] transition"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Footer: Dispute Trigger */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => openDisputeModal(selectedLead.id)}
                className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-800 transition"
              >
                <AlertCircle className="h-4 w-4" />
                <span>File 1-Click Lead Dispute (24h SLA)</span>
              </button>
              <span className="text-[11px] text-slate-400">
                Auto-refund to wallet on approval
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Modal: File Lead Dispute [FR-BUY-007] */}
      {disputeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-rose-600" />
                <span>File 1-Click Lead Dispute</span>
              </h3>
              <button
                onClick={() => setDisputeModalOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleDisputeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  Select Dispute Reason *
                </label>
                <select
                  value={disputeCategory}
                  onChange={(e) => setDisputeCategory(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 font-semibold text-slate-900 focus:border-[#102C57] focus:bg-white focus:outline-none"
                >
                  <option value="fake_number">
                    Fake Number / Unreachable (3+ attempts)
                  </option>
                  <option value="wrong_profile">
                    Inaccurate Degree Stream / Budget Mismatch
                  </option>
                  <option value="competitor_applied">
                    Student Already Enrolled via Competitor
                  </option>
                  <option value="uninterested">
                    Accidental Click / Uninterested
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  Additional Notes for Operations Review
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide call timestamp or reason details..."
                  value={disputeNotes}
                  onChange={(e) => setDisputeNotes(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 font-medium text-slate-900 focus:border-[#102C57] focus:bg-white focus:outline-none"
                />
              </div>

              <div className="rounded-xl bg-amber-50 p-3 text-[11px] text-amber-900 border border-amber-200">
                <strong>24-Hour SLA Guarantee:</strong> Approved disputes credit
                the ₹1,500 lead cost back to your active wallet balance
                instantly.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDisputeModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white py-2 px-4 font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-rose-600 text-white py-2 px-5 font-bold hover:bg-rose-700 transition shadow-md cursor-pointer"
                >
                  Submit Dispute & Auto-Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Wallet Recharge [FR-BUY-005] */}
      {rechargeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Wallet className="h-5 w-5 text-emerald-600" />
                <span>Online Wallet Recharge</span>
              </h3>
              <button
                onClick={() => setRechargeModalOpen(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleRechargeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-2">
                  Select Recharge Amount
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[10000, 25000, 50000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setRechargeAmount(amt)}
                      className={`rounded-xl py-2.5 px-2 text-center font-bold transition border ${
                        rechargeAmount === amt
                          ? "border-[#102C57] bg-[#102C57] text-white shadow-xs"
                          : "border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100"
                      }`}
                    >
                      ₹{amt.toLocaleString("en-IN")}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  Or Enter Custom Amount (INR)
                </label>
                <input
                  type="number"
                  min={5000}
                  step={1000}
                  value={rechargeAmount}
                  onChange={(e) => setRechargeAmount(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3.5 font-bold text-slate-900 focus:border-[#102C57] focus:bg-white focus:outline-none text-base"
                />
              </div>

              <div className="rounded-xl bg-slate-50 p-3 text-[11px] text-slate-600 border border-slate-100 space-y-1">
                <div className="flex justify-between">
                  <span>Recharge Amount:</span>
                  <span className="font-bold text-slate-900">
                    ₹{rechargeAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>18% GST (Tax Invoice Included):</span>
                  <span className="font-bold text-slate-900">
                    ₹{Math.round(rechargeAmount * 0.18).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-1 font-extrabold text-[#102C57]">
                  <span>Total Payable:</span>
                  <span>
                    ₹{Math.round(rechargeAmount * 1.18).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRechargeModalOpen(false)}
                  className="rounded-xl border border-slate-200 bg-white py-2 px-4 font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#EA5C2B] text-white py-2.5 px-6 font-bold hover:bg-[#d94f20] transition shadow-md cursor-pointer"
                >
                  Pay & Credit Instantly →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: GST Tax Invoice View [FR-BUY-005] */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl space-y-6 text-xs text-slate-800">
            {/* Invoice Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="text-base font-black text-[#102C57]">
                  StudyAbroad<span className="text-[#EA5C2B]">Vista</span>
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">
                  Dnyanal Educon Private Limited • GSTIN: 27AABCD1234F1Z5
                </span>
              </div>
              <div className="text-right">
                <span className="rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[10px] font-extrabold">
                  PAID TAX INVOICE
                </span>
                <p className="font-mono text-[11px] font-bold mt-1 text-slate-900">
                  {selectedInvoice.invoiceNumber}
                </p>
              </div>
            </div>

            {/* Bill To */}
            <div className="grid grid-cols-2 gap-4 text-[11px]">
              <div>
                <span className="text-slate-400 font-bold uppercase block text-[10px]">
                  Billed To:
                </span>
                <strong className="text-slate-900 block mt-0.5">
                  {orgName}
                </strong>
                <span className="text-slate-600 block">GSTIN: {userGstin}</span>
                <span className="text-slate-600 block">Maharashtra, India</span>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase block text-[10px]">
                  Invoice Details:
                </span>
                <span className="text-slate-600 block mt-0.5">
                  Date:{" "}
                  {new Date(selectedInvoice.date).toLocaleDateString("en-IN")}
                </span>
                <span className="text-slate-600 block">
                  Payment Mode: Online NetBanking / Razorpay
                </span>
              </div>
            </div>

            {/* Line Items */}
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-50 text-slate-600 font-bold">
                <tr>
                  <th className="p-2.5">Description</th>
                  <th className="p-2.5">HSN/SAC</th>
                  <th className="p-2.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-2.5 font-medium">
                    {selectedInvoice.description}
                  </td>
                  <td className="p-2.5 text-slate-500">998311</td>
                  <td className="p-2.5 text-right font-bold">
                    ₹{selectedInvoice.amount.toLocaleString("en-IN")}
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 text-slate-500">CGST (9%)</td>
                  <td className="p-2.5 text-slate-500">-</td>
                  <td className="p-2.5 text-right font-medium">
                    ₹
                    {Math.round(selectedInvoice.amount * 0.09).toLocaleString(
                      "en-IN",
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="p-2.5 text-slate-500">SGST (9%)</td>
                  <td className="p-2.5 text-slate-500">-</td>
                  <td className="p-2.5 text-right font-medium">
                    ₹
                    {Math.round(selectedInvoice.amount * 0.09).toLocaleString(
                      "en-IN",
                    )}
                  </td>
                </tr>
                <tr className="bg-slate-50 font-extrabold text-[#102C57]">
                  <td className="p-2.5" colSpan={2}>
                    Total Invoice Value (INR)
                  </td>
                  <td className="p-2.5 text-right">
                    ₹
                    {Math.round(selectedInvoice.amount * 1.18).toLocaleString(
                      "en-IN",
                    )}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Modal Actions */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="rounded-xl border border-slate-200 bg-white py-2 px-4 font-bold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="rounded-xl bg-[#102C57] text-white py-2 px-5 font-bold hover:bg-[#0c2242] transition flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download PDF Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © {new Date().getFullYear()} StudyAbroad Vista B2B Ecosystem. DPDP
            Act & GST Compliant.
          </span>
          <div className="flex items-center gap-4">
            <Link href="/terms-of-service" className="hover:underline">
              B2B SLA Terms
            </Link>
            <Link href="/privacy-policy" className="hover:underline">
              Data Protection
            </Link>
            <Link href="/contact" className="hover:underline">
              Partner Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
