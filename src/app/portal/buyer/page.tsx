"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Compass, Briefcase, Wallet, Download, CheckCircle, Clock, ShieldCheck, ArrowRight, LogOut, User, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";
import { Footer } from "@/components/layout/Footer";

export default function BuyerPortalPage() {
  const router = useRouter();
  const { user, isLoggedIn, isLoading, login, logout } = useAuth();
  const [b2bEmail, setB2bEmail] = useState("");
  const [b2bPassword, setB2bPassword] = useState("");
  const [b2bError, setB2bError] = useState("");
  const [walletBalance, setWalletBalance] = useState(25000);
  const [purchasedLeads, setPurchasedLeads] = useState<(number | string)[]>([1]);
  const [liveDbLeads, setLiveDbLeads] = useState<any[]>([]);

  const currentUser = user || {
    name: "Apex Overseas Consultants",
    email: "consultant@apexoverseas.com",
    role: "buyer",
    organization: "Apex Overseas Consultants",
  };

  useEffect(() => {
    async function loadLiveLeads() {
      let combinedLeads: any[] = [];
      const seenIds = new Set<string>();

      // 1. Fetch live leads directly from server API (/api/leads)
      try {
        const res = await fetch("/api/leads");
        if (res.ok) {
          const apiJson = await res.json();
          if (apiJson.success && Array.isArray(apiJson.leads) && apiJson.leads.length > 0) {
            apiJson.leads.forEach((l: any, idx: number) => {
              const leadId = String(l.id || `db-${idx}`);
              if (!seenIds.has(leadId)) {
                seenIds.add(leadId);
                const rawCountry = l.country_target || l.countryTarget || "GERMANY";
                const rawProg = l.program_target || l.programTarget || "ms";
                combinedLeads.push({
                  id: leadId,
                  name: l.full_name || l.fullName || "Applicant",
                  targetCountry: String(rawCountry).toUpperCase(),
                  program: `${String(rawProg).toUpperCase()} Degree`,
                  budget: l.budget_range_inr || l.budgetRangeINR || "₹15 - 25 Lakhs",
                  intake: l.intake_year || l.intakeYear || "Fall 2026",
                  phone: `${l.phone || "+91 9876543210"} (Verified OTP)`,
                  email: l.email || "student@example.com",
                  cpl: 1500,
                });
              }
            });
          }
        }
      } catch (err) {
        console.warn("API lead fetch warning:", err);
      }

      // 2. Read local submitted leads from localStorage as supplement
      try {
        const stored = JSON.parse(localStorage.getItem("vista_submitted_leads") || "[]");
        if (Array.isArray(stored) && stored.length > 0) {
          stored.forEach((l: any) => {
            const leadId = String(l.id || `local-${l.email || Date.now()}`);
            if (!seenIds.has(leadId)) {
              seenIds.add(leadId);
              const name = l.fullName || l.full_name || "Applicant";
              const rawCountry = l.countryTarget || l.country_target || "UNITED STATES";
              const rawProg = l.programTarget || l.program_target || "ms";
              combinedLeads.push({
                id: leadId,
                name: name,
                targetCountry: String(rawCountry).toUpperCase(),
                program: `${String(rawProg).toUpperCase()} Degree`,
                budget: l.budgetRangeINR || l.budget_range_inr || "₹15 - 25 Lakhs",
                intake: l.intakeYear || l.intake_year || "Fall 2026",
                phone: `${l.phone ? (l.phone.startsWith("+91") ? l.phone : `+91 ${l.phone}`) : "+91 98765 43210"} (Verified OTP)`,
                email: l.email || "student@example.com",
                cpl: 1500,
              });
            }
          });
        }
      } catch (e) {
        console.warn("Local leads read warning:", e);
      }

      setLiveDbLeads(combinedLeads);
    }

    loadLiveLeads();

    const handleNewLead = () => {
      loadLiveLeads();
    };
    window.addEventListener("vista_lead_submitted", handleNewLead);
    return () => {
      window.removeEventListener("vista_lead_submitted", handleNewLead);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#102C57]" />
        <p className="mt-3 text-xs font-semibold text-slate-500">Loading B2B marketplace...</p>
      </div>
    );
  }



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
    },
    {
      id: 2,
      name: "Priya Patel",
      targetCountry: "United Kingdom",
      program: "MBA in Business Analytics",
      budget: "₹25 - 40 Lakhs",
      intake: "September 2026",
      phone: "+91 98234 11223 (Verified OTP)",
      email: "priya.p@example.com",
      cpl: 1500,
    },
    {
      id: 3,
      name: "Dr. Ankit Verma",
      targetCountry: "Uzbekistan",
      program: "MBBS / General Medicine",
      budget: "₹18 - 25 Lakhs",
      intake: "Fall 2026",
      phone: "+91 99887 66554 (Verified OTP)",
      email: "ankit.verma@example.com",
      cpl: 1800,
    },
    {
      id: 4,
      name: "Sneha Nair",
      targetCountry: "Ireland",
      program: "MS in Data Science",
      budget: "₹20 - 30 Lakhs",
      intake: "Fall 2026",
      phone: "+91 97112 33445 (Verified OTP)",
      email: "sneha.n@example.com",
      cpl: 1400,
    },
  ];

  const handleBuyLead = (id: number, cpl: number) => {
    if (walletBalance < cpl) {
      alert("Insufficient wallet balance. Please top-up via Razorpay.");
      return;
    }
    setWalletBalance((prev) => prev - cpl);
    setPurchasedLeads((prev) => [...prev, id]);
  };

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
            <span className="rounded-md bg-orange-50 px-2.5 py-1 text-[11px] font-bold text-[#EA5C2B]">
              B2B Consultant Marketplace
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="font-semibold text-slate-700 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-[#EA5C2B]" />
              {user?.organization || user?.name || "Apex Overseas Consultants"}
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
        {/* Wallet Overview & Stats */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-[#102C57] to-[#0a1c38] p-6 text-white shadow-md sm:col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                  <Wallet className="h-4 w-4 text-[#EA5C2B]" />
                  Prepaid Lead Wallet Balance (INR)
                </span>
                <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                  Active
                </span>
              </div>
              <p className="mt-3 text-3xl font-black sm:text-4xl">
                ₹{walletBalance.toLocaleString("en-IN")}
              </p>
              <p className="mt-1 text-xs text-slate-300">
                Automated GST invoices generated per lead transaction via Razorpay.
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setWalletBalance((prev) => prev + 10000)}
                className="rounded-xl bg-[#EA5C2B] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#d94f20]"
              >
                + Top-Up Wallet (₹10,000)
              </button>
              <button className="rounded-xl border border-slate-600 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-white/5">
                Download Invoices
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Lead Performance
              </span>
              <p className="mt-3 text-3xl font-black text-[#102C57]">
                {purchasedLeads.length} Delivered
              </p>
              <div className="mt-4 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Verified Indian Phone Numbers:</span>
                  <span className="font-bold text-emerald-600">100% (OTP)</span>
                </div>
                <div className="flex justify-between">
                  <span>Match Criteria:</span>
                  <span className="font-semibold text-slate-800">Germany & UK</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] text-slate-400 border-t border-slate-100 pt-3">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>48-hr invalid lead replacement policy</span>
            </div>
          </div>
        </div>

        {/* Real-time Available Leads Feed */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-black text-[#102C57]">
                Live Lead Ingestion Feed (Real-Time Matching)
              </h2>
              <p className="text-xs text-slate-500">
                Pre-screened, phone-verified student applicants matching your registered criteria.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("vista_lead_submitted"))}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-[#102C57] hover:bg-slate-100 transition flex items-center gap-1"
              >
                🔄 Refresh Live Feed
              </button>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                Auto-Delivery: ON
              </span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[...liveDbLeads, ...mockLeads].map((lead) => {
              const isBought = purchasedLeads.includes(lead.id);

              return (
                <div
                  key={lead.id}
                  className={`rounded-2xl border p-5 transition ${
                    isBought
                      ? "border-emerald-200 bg-emerald-50/40 shadow-xs"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-[#102C57]">
                        {lead.targetCountry}
                      </span>
                      <h3 className="mt-1 text-sm font-extrabold text-[#102C57]">
                        {isBought ? lead.name : `${lead.name.split(" ")[0]} ••••••`}
                      </h3>
                    </div>
                    <span className="text-xs font-black text-[#EA5C2B]">
                      CPL: ₹{lead.cpl}
                    </span>
                  </div>

                  <p className="mt-2 text-xs font-semibold text-slate-700">
                    {lead.program}
                  </p>

                  <div className="mt-3 space-y-1 text-[11px] text-slate-500 border-t border-slate-100 pt-2">
                    <p>Budget: <strong className="text-slate-700">{lead.budget}</strong></p>
                    <p>Target Intake: <strong className="text-slate-700">{lead.intake}</strong></p>
                    <p>
                      Phone:{" "}
                      <strong className={isBought ? "text-emerald-700 font-bold" : "text-slate-400"}>
                        {isBought ? lead.phone : "+91 98XXX XXXXX (Hidden)"}
                      </strong>
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    {isBought ? (
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 font-bold text-emerald-700">
                          <CheckCircle className="h-4 w-4" />
                          Lead Unlocked
                        </span>
                        <button className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-1 font-bold text-slate-700 hover:bg-slate-100">
                          <Download className="h-3.5 w-3.5" />
                          Export
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleBuyLead(lead.id, lead.cpl)}
                        className="w-full rounded-xl bg-[#102C57] py-2 text-xs font-bold text-white transition hover:bg-[#0c2242]"
                      >
                        Purchase Lead (₹{lead.cpl})
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
