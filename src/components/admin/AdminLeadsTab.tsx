"use client";

import { useState } from "react";
import {
  Users,
  IndianRupee,
  ShieldAlert,
  CheckCircle2,
  PhoneCall,
  ArrowUpRight,
  Search,
  Filter,
  ShieldCheck,
  Zap,
  Database,
} from "lucide-react";

export function AdminLeadsTab() {
  const [searchQuery, setSearchQuery] = useState("");

  const sampleLeads = [
    {
      id: "LD-9482",
      studentName: "Aarav Sharma",
      phone: "+91 98234 •••••",
      preferredCountry: "Germany",
      targetProgram: "M.S. Computer Science & AI",
      budgetINR: "₹18 - ₹25 Lakhs",
      ieltsScore: "7.5",
      otpVerified: true,
      routedTo: "EdVantage Global Pune",
      leadPriceINR: "₹3,500",
      timestamp: "12 mins ago",
      status: "Dispatched",
    },
    {
      id: "LD-9481",
      studentName: "Priya Patel",
      phone: "+91 97120 •••••",
      preferredCountry: "United Kingdom",
      targetProgram: "M.Sc. Data Analytics & FinTech",
      budgetINR: "₹25 - ₹35 Lakhs",
      ieltsScore: "7.0",
      otpVerified: true,
      routedTo: "Apex Overseas Ahmedabad",
      leadPriceINR: "₹3,500",
      timestamp: "28 mins ago",
      status: "Dispatched",
    },
    {
      id: "LD-9480",
      studentName: "Rohan Mukherjee",
      phone: "+91 99031 •••••",
      preferredCountry: "Ireland",
      targetProgram: "M.S. Software Engineering",
      budgetINR: "₹20 - ₹28 Lakhs",
      ieltsScore: "6.5",
      otpVerified: true,
      routedTo: "GlobalVisa Partners Kolkata",
      leadPriceINR: "₹3,000",
      timestamp: "1 hour ago",
      status: "Dispatched",
    },
    {
      id: "LD-9479",
      studentName: "Ananya Iyer",
      phone: "+91 94452 •••••",
      preferredCountry: "Australia",
      targetProgram: "Master of Cyber Security",
      budgetINR: "₹30 - ₹45 Lakhs",
      ieltsScore: "8.0",
      otpVerified: true,
      routedTo: "SouthernCross Counsellors Chennai",
      leadPriceINR: "₹3,500",
      timestamp: "2 hours ago",
      status: "Dispatched",
    },
    {
      id: "LD-9478",
      studentName: "Vikram Malhotra",
      phone: "+91 98110 •••••",
      preferredCountry: "France",
      targetProgram: "Grande École MIM Business",
      budgetINR: "₹15 - ₹22 Lakhs",
      ieltsScore: "7.0",
      otpVerified: true,
      routedTo: "EuroPass Pathways Delhi",
      leadPriceINR: "₹2,800",
      timestamp: "3 hours ago",
      status: "Dispatched",
    },
  ];

  const filteredLeads = sampleLeads.filter((l) => {
    const q = searchQuery.toLowerCase();
    return (
      !searchQuery ||
      l.studentName.toLowerCase().includes(q) ||
      l.preferredCountry.toLowerCase().includes(q) ||
      l.targetProgram.toLowerCase().includes(q) ||
      l.routedTo.toLowerCase().includes(q) ||
      l.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Engine Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <Users className="h-4 w-4 text-[#102C57]" />
            <span className="text-xs font-bold uppercase">
              Total Leads Captured
            </span>
          </div>
          <p className="mt-3 text-3xl font-black text-[#102C57]">3,420</p>
          <span className="text-[11px] text-emerald-700 font-semibold">
            100% Indian SMS OTP Verified
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
            42 B2B Agency Wallets Active
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <Zap className="h-4 w-4 text-[#EA5C2B]" />
            <span className="text-xs font-bold uppercase">
              LDE Routing Latency
            </span>
          </div>
          <p className="mt-3 text-3xl font-black text-[#EA5C2B]">0.42s</p>
          <span className="text-[11px] text-slate-500">
            Real-time instant distribution
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
            100% Compliant
          </p>
          <span className="text-[11px] text-slate-500">
            Masked PII / Strict Consent
          </span>
        </div>
      </div>

      {/* Main Leads Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Users className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-lg font-black text-[#102C57]">
                  Lead Distribution Engine (LDE) Live Stream
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time routing of high-intent, OTP-verified student leads
                  to authorized B2B consultants.
                </p>
              </div>
            </div>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lead ID, student, country, agency..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#102C57] focus:bg-white outline-none"
            />
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Lead ID & Student</th>
                <th className="px-4 py-3">Target Country & Program</th>
                <th className="px-4 py-3">Budget (INR)</th>
                <th className="px-4 py-3">IELTS Band</th>
                <th className="px-4 py-3">Dispatched Agency</th>
                <th className="px-4 py-3">Debit Price</th>
                <th className="px-4 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-4 py-3.5">
                    <div className="font-bold text-[#102C57]">
                      {lead.studentName}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <span className="font-mono text-indigo-700">
                        {lead.id}
                      </span>
                      <span>•</span>
                      <span>{lead.timestamp}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-bold text-slate-800">
                      {lead.preferredCountry}
                    </span>
                    <p className="text-[11px] text-slate-500">
                      {lead.targetProgram}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 font-semibold text-slate-700">
                    {lead.budgetINR}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                      {lead.ieltsScore} Band
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="font-semibold text-indigo-900">
                      {lead.routedTo}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-bold text-emerald-700">
                    {lead.leadPriceINR}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      {lead.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
