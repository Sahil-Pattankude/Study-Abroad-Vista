"use client";

import { useState } from "react";
import { X, CheckCircle, ShieldCheck, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { COUNTRIES, PROGRAMS } from "@/lib/data/masterData";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCountry?: string;
}

export function LeadModal({ isOpen, onClose, defaultCountry }: LeadModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryTarget, setCountryTarget] = useState(defaultCountry || "germany");
  const [programTarget, setProgramTarget] = useState("ms");
  const [budgetRangeINR, setBudgetRangeINR] = useState("15-25Lakhs");
  const [intakeYear, setIntakeYear] = useState("2026 / 2027");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!phone.match(/^[6-9]\d{9}$/)) {
      setErrorMsg("Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/leads/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          countryTarget,
          programTarget,
          budgetRangeINR,
          intakeYear,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
        >
          <X className="h-4 w-4" />
        </button>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-xl font-extrabold text-[#102C57]">
              Application Profile Received!
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Thank you, <span className="font-semibold text-slate-900">{fullName}</span>. A certified university admissions counselor will review your profile for <span className="font-semibold text-slate-900">{countryTarget.toUpperCase()}</span> and connect via WhatsApp/Phone within 24 hours.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-6 rounded-xl bg-[#102C57] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#0c2242]"
            >
              Done & Return to Site
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-100 text-[#EA5C2B]">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-[#EA5C2B]">
                Fast Track Evaluation
              </span>
            </div>

            <h3 className="mt-2 text-xl font-black text-[#102C57]">
              Get Matched with Top Global Universities
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Zero fee. Verified eligibility check across 19 destinations & 6 study streams.
            </p>

            {errorMsg && (
              <div className="mt-3 rounded-xl bg-red-50 p-2.5 text-xs font-medium text-red-700">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5 text-xs">
              {/* Name */}
              <div>
                <label className="block font-bold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-slate-800 focus:border-[#102C57] focus:outline-none"
                />
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-slate-700">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-slate-800 focus:border-[#102C57] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700">Mobile Number (India) *</label>
                  <div className="mt-1 flex rounded-xl border border-slate-200 focus-within:border-[#102C57]">
                    <span className="flex items-center rounded-l-xl bg-slate-50 px-2.5 text-slate-500 font-semibold">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full rounded-r-xl px-3 py-2 text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Target Country & Program */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-slate-700">Target Country</label>
                  <select
                    value={countryTarget}
                    onChange={(e) => setCountryTarget(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-800 focus:border-[#102C57] focus:outline-none"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.flagEmoji} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700">Program / Degree</label>
                  <select
                    value={programTarget}
                    onChange={(e) => setProgramTarget(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-800 focus:border-[#102C57] focus:outline-none"
                  >
                    {PROGRAMS.map((p) => (
                      <option key={p.id} value={p.slug}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Budget & Intake */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block font-bold text-slate-700">Estimated Budget</label>
                  <select
                    value={budgetRangeINR}
                    onChange={(e) => setBudgetRangeINR(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-800 focus:border-[#102C57] focus:outline-none"
                  >
                    <option value="under-15Lakhs">Under ₹15 Lakhs</option>
                    <option value="15-25Lakhs">₹15 - 25 Lakhs</option>
                    <option value="25-40Lakhs">₹25 - 40 Lakhs</option>
                    <option value="40Lakhs+">₹40 Lakhs +</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700">Target Intake</label>
                  <select
                    value={intakeYear}
                    onChange={(e) => setIntakeYear(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-slate-800 focus:border-[#102C57] focus:outline-none"
                  >
                    <option value="Fall 2026">Fall 2026 (Aug / Sep)</option>
                    <option value="Spring 2027">Spring 2027 (Jan / Feb)</option>
                    <option value="Fall 2027">Fall 2027</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 text-[10px] text-slate-500">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Your information is protected under India DPDP Act 2023. Zero spam.</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#102C57] py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#0c2242] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting Application...
                  </>
                ) : (
                  <>
                    Connect with Certified Counselor
                    <ArrowRight className="h-4 w-4 text-[#EA5C2B]" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
