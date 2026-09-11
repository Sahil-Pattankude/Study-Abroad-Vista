"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Compass, 
  Briefcase, 
  Wallet, 
  Download, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  AlertTriangle,
  Users,
  TrendingUp,
  CreditCard,
  User,
  LogOut,
  Bell,
  Loader2,
  Lock
} from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

export default function BuyerPortalDashboard() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const orgName = user?.organization || user?.name || "Apex Overseas Consultants";
  const [walletBalance, setWalletBalance] = useState(28500);
  const [purchasedLeads, setPurchasedLeads] = useState<number[]>([1]);

  useEffect(() => {
    if (!isLoading && (!user || (user.role !== "buyer" && user.role !== "admin"))) {
      router.push("/login?redirect=/buyer/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#102C57]" />
        <p className="mt-3 text-xs font-semibold text-slate-500">Loading B2B buyer workspace...</p>
      </div>
    );
  }

  if (!user || (user.role !== "buyer" && user.role !== "admin")) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-md">
          <Lock className="mx-auto h-10 w-10 text-[#EA5C2B]" />
          <h2 className="mt-3 text-lg font-bold text-slate-900">B2B Consultant Portal</h2>
          <p className="mt-1 text-xs text-slate-500">Please sign in with your consultant credentials to access the lead marketplace.</p>
          <Link
            href="/login?redirect=/buyer/dashboard"
            className="mt-4 inline-block w-full rounded-xl bg-[#102C57] py-2.5 text-xs font-bold text-white hover:bg-[#0c2242]"
          >
            Sign In to Portal →
          </Link>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Today's Verified Leads", value: "14", change: "+3 since 9 AM" },
    { label: "Delivered This Month", value: "128", change: "98.4% OTP Verified" },
    { label: "Conversion Rate", value: "24.2%", change: "Industry Avg: 16%" },
    { label: "Active Team Seats", value: "4 / 5", change: "Branch: Pune & Mumbai" },
  ];

  const mockLeads = [
    {
      id: 1,
      name: "Rahul Sharma",
      targetCountry: "Germany",
      program: "MS in Computer Science",
      budget: "₹15 - 25 Lakhs",
      intake: "Fall 2026",
      phone: "+91 98765 43210 (Verified OTP)",
      email: "rahul.s@example.com",
      cpl: 1200,
      leadScore: 94,
      status: "unlocked"
    },
    {
      id: 2,
      name: "Priya Patel",
      targetCountry: "United Kingdom",
      program: "MBA in Business Analytics",
      budget: "₹25 - 40 Lakhs",
      intake: "September 2026",
      phone: "+91 98234 *****",
      email: "p****@example.com",
      cpl: 1500,
      leadScore: 88,
      status: "locked"
    },
    {
      id: 3,
      name: "Dr. Ankit Verma",
      targetCountry: "Uzbekistan",
      program: "MBBS / General Medicine",
      budget: "₹18 - 25 Lakhs",
      intake: "Fall 2026",
      phone: "+91 99887 *****",
      email: "a****@example.com",
      cpl: 1800,
      leadScore: 91,
      status: "locked"
    },
    {
      id: 4,
      name: "Sneha Nair",
      targetCountry: "Ireland",
      program: "MS in Data Science",
      budget: "₹20 - 30 Lakhs",
      intake: "Fall 2026",
      phone: "+91 97112 *****",
      email: "s****@example.com",
      cpl: 1400,
      leadScore: 86,
      status: "locked"
    },
  ];

  const handleUnlock = (id: number, cpl: number) => {
    if (walletBalance < cpl) {
      alert("Insufficient wallet balance. Please recharge via Razorpay.");
      return;
    }
    setWalletBalance(prev => prev - cpl);
    setPurchasedLeads(prev => [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Bar with Wallet & Today's Stats per W10 T-14 */}
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
            <span className="rounded-md bg-orange-50 px-2.5 py-1 text-[11px] font-bold text-[#EA5C2B]">
              Buyer Portal (T-14)
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {/* Wallet Quick Widget */}
            <div className="hidden sm:flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1.5 border border-slate-200">
              <Wallet className="h-4 w-4 text-[#EA5C2B]" />
              <span className="font-bold text-slate-700">₹{walletBalance.toLocaleString("en-IN")}</span>
              <button 
                onClick={() => setWalletBalance(prev => prev + 10000)}
                className="rounded-lg bg-[#EA5C2B] px-2 py-0.5 text-[10px] font-bold text-white hover:bg-[#ff7240]"
              >
                + Recharge
              </button>
            </div>

            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-[#EA5C2B]" />
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

      {/* Quick Navigation Links per W10 T-14: All leads, Disputes, Wallet, Settings, Team */}
      <div className="border-b border-slate-200 bg-white px-4 py-2 text-xs">
        <div className="mx-auto flex max-w-7xl items-center gap-6 font-bold text-slate-600">
          <span className="text-[#102C57] border-b-2 border-[#102C57] pb-1">All Leads</span>
          <span className="hover:text-[#102C57] cursor-pointer">Disputes & Refunds</span>
          <span className="hover:text-[#102C57] cursor-pointer">Wallet & Invoices</span>
          <span className="hover:text-[#102C57] cursor-pointer">Team & Routing Rules</span>
          <span className="hover:text-[#102C57] cursor-pointer">Webhook API</span>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1 space-y-6">
        {/* Alerts: Pending disputes, low balance, daily cap per W10 T-14 */}
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <span><strong>Portal Alert:</strong> Daily lead cap remaining: 36 leads. No pending lead disputes in queue.</span>
          </div>
          <span className="font-bold text-amber-800 underline cursor-pointer">Adjust Lead Rules →</span>
        </div>

        {/* Stats Grid per W10 T-14 */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{s.label}</span>
              <p className="mt-1 text-2xl font-black text-[#102C57]">{s.value}</p>
              <span className="text-[10px] text-emerald-600 font-semibold">{s.change}</span>
            </div>
          ))}
        </div>

        {/* Lead Inbox (Last 20 Leads with Quick Actions) per W10 T-14 */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-black text-[#102C57]">Live Student Lead Inbox</h2>
              <p className="text-xs text-slate-500">100% Indian aspirants verified via MSG91 OTP under DPDP Act 2023.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">Filter: All Streams</span>
              <span className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">Auto-Delivery: Active</span>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="p-3">Candidate</th>
                  <th className="p-3">Target Country & Program</th>
                  <th className="p-3">Budget Range</th>
                  <th className="p-3">Quality Score</th>
                  <th className="p-3">Contact Details</th>
                  <th className="p-3 text-right">CPL Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockLeads.map((lead) => {
                  const isUnlocked = purchasedLeads.includes(lead.id);
                  return (
                    <tr key={lead.id} className="hover:bg-slate-50/70">
                      <td className="p-3 font-bold text-[#102C57]">{lead.name}</td>
                      <td className="p-3">
                        <p className="font-bold text-slate-800">{lead.targetCountry}</p>
                        <p className="text-[11px] text-slate-500">{lead.program}</p>
                      </td>
                      <td className="p-3 font-medium text-slate-700">{lead.budget}</td>
                      <td className="p-3">
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                          {lead.leadScore}/100
                        </span>
                      </td>
                      <td className="p-3">
                        {isUnlocked ? (
                          <div className="text-[11px]">
                            <p className="font-bold text-slate-800">{lead.phone}</p>
                            <p className="text-slate-500">{lead.email}</p>
                          </div>
                        ) : (
                          <span className="text-slate-400 font-mono text-[11px]">{lead.phone}</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {isUnlocked ? (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800">
                            ✓ Unlocked
                          </span>
                        ) : (
                          <button
                            onClick={() => handleUnlock(lead.id, lead.cpl)}
                            className="rounded-lg bg-[#EA5C2B] px-3.5 py-1.5 text-[11px] font-bold text-white hover:bg-[#ff7240] shadow-xs"
                          >
                            Buy Lead ₹{lead.cpl}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
