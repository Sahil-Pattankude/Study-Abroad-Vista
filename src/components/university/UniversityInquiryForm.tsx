"use client";

import { useState } from "react";
import { CheckCircle2, ArrowRight, Loader2 } from "lucide-react";

interface UniversityInquiryFormProps {
  universityName: string;
  countrySlug: string;
}

export function UniversityInquiryForm({ universityName, countrySlug }: UniversityInquiryFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!phone.replace(/\D/g, "").match(/^[6-9]\d{9}$/)) {
      setErrorMsg("Please enter a valid 10-digit Indian mobile number.");
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
          phone: phone.replace(/\D/g, ""),
          countryTarget: countrySlug || "usa",
          programTarget: "ms",
          budgetRangeINR: "15-25Lakhs",
          intakeYear: "Fall 2026",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      // Save to client storage
      try {
        const localLead = {
          id: `live-${Date.now()}`,
          fullName,
          email,
          phone,
          countryTarget: countrySlug,
          programTarget: "ms",
          createdAt: new Date().toISOString(),
        };
        const existing = JSON.parse(localStorage.getItem("vista_submitted_leads") || "[]");
        localStorage.setItem("vista_submitted_leads", JSON.stringify([localLead, ...existing]));
        window.dispatchEvent(new CustomEvent("vista_lead_submitted"));
      } catch {
        // ignore
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6 text-center shadow-md">
        <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-600" />
        <h3 className="mt-2 text-sm font-extrabold text-[#102C57]">Eligibility Review Requested!</h3>
        <p className="mt-1 text-xs text-slate-600">
          Thank you, <strong className="text-slate-900">{fullName}</strong>. An admissions counselor for {universityName} will contact you via WhatsApp/Phone within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg sticky top-24">
      <h3 className="text-sm font-bold text-slate-900">Free Admission Review</h3>
      <p className="mt-1 text-xs text-slate-500">Check your admission eligibility for {universityName}.</p>
      
      {errorMsg && (
        <div className="mt-3 rounded-lg bg-rose-50 p-2 text-xs font-semibold text-rose-700">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name</label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Rahul Sharma"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#102C57] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#102C57] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-700 mb-1">Mobile Number (+91)</label>
          <input
            type="tel"
            required
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9876543210"
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#102C57] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[#102C57] py-2.5 text-xs font-bold text-white transition hover:bg-[#0c2242] flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              Submit for Eligibility Check
              <ArrowRight className="h-3.5 w-3.5 text-[#EA5C2B]" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
