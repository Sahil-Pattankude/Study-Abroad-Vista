"use client";

import { useState } from "react";
import { CheckCircle2, ArrowRight, Loader2, ShieldCheck } from "lucide-react";

interface ProgramOption {
  id: string;
  slug: string;
  name: string;
}

interface CountryInquiryFormProps {
  countryName: string;
  countrySlug: string;
  availablePrograms: ProgramOption[];
}

export function CountryInquiryForm({ countryName, countrySlug, availablePrograms }: CountryInquiryFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [targetProgram, setTargetProgram] = useState(availablePrograms[0]?.slug || "ms");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const cleanPhone = phone.replace(/\D/g, "");
    if (!cleanPhone.match(/^[6-9]\d{9}$/)) {
      setErrorMsg("Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/leads/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim(),
          phone: cleanPhone,
          countryTarget: countrySlug || "usa",
          programTarget: targetProgram,
          budgetRangeINR: "15-25Lakhs",
          intakeYear: "Fall 2026",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      // Save locally to client state
      try {
        const localLead = {
          id: `live-${Date.now()}`,
          fullName: fullName.trim(),
          email: email.trim(),
          phone: cleanPhone,
          countryTarget: countrySlug,
          programTarget: targetProgram,
          createdAt: new Date().toISOString(),
        };
        const existing = JSON.parse(localStorage.getItem("vista_submitted_leads") || "[]");
        localStorage.setItem("vista_submitted_leads", JSON.stringify([localLead, ...existing]));
        window.dispatchEvent(new CustomEvent("vista_lead_submitted"));
      } catch {
        // ignore storage quota issues
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to submit guidance request.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 text-center shadow-lg">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
        <h3 className="mt-2 text-sm font-extrabold text-[#102C57]">Guidance Request Submitted!</h3>
        <p className="mt-1 text-xs text-slate-600 leading-relaxed">
          Thank you, <strong className="text-slate-900">{fullName}</strong>. An expert advisor for <strong className="text-[#102C57]">{countryName}</strong> will contact you via WhatsApp/Phone within 24 hours.
        </p>
        <div className="mt-4 rounded-xl bg-white p-3 border border-emerald-100 text-[11px] text-slate-500">
          📍 Lead stored securely in marketplace. You can track your request in your <a href="/dashboard/student" className="font-bold text-[#EA5C2B] underline">Student Dashboard</a>.
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sticky top-24">
      <h3 className="text-sm font-bold text-slate-900">Free {countryName} Counselling</h3>
      <p className="mt-1 text-xs text-slate-500">
        Get personalized shortlist, tuition waivers, and visa guidance.
      </p>

      {errorMsg && (
        <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-xs font-semibold text-rose-700">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#102C57]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@example.com"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#102C57]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">WhatsApp / Phone (+91)</label>
          <input
            type="tel"
            required
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9876543210"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#102C57]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Target Program</label>
          <select
            value={targetProgram}
            onChange={(e) => setTargetProgram(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#102C57] bg-white"
          >
            {availablePrograms.map((p) => (
              <option key={p.id} value={p.slug}>{p.name}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-xl bg-[#EA5C2B] py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#d94f20] transition flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Get Free {countryName} Guidance →
            </>
          )}
        </button>
      </form>

      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-1 text-[10px] text-slate-400">
        <ShieldCheck className="h-3 w-3 text-emerald-600" />
        <span>Verified Advisors • No Spam Guarantee</span>
      </div>
    </div>
  );
}

export default CountryInquiryForm;
