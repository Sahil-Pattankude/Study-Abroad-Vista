"use client";

import { useState } from "react";
import { ShieldCheck, Building2, Mail, User, FileText, CheckCircle2, AlertCircle, Loader2, X } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

interface Props {
  universityId: string;
  universityName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

export function ClaimProfileModal({ universityId, universityName, isOpen, onClose, onSubmitted }: Props) {
  if (!isOpen) return null;

  const { user } = useAuth();

  const [applicantName, setApplicantName] = useState(user?.name || "");
  const [officialEmail, setOfficialEmail] = useState(user?.email || "");
  const [designation, setDesignation] = useState("Director of International Admissions");
  const [proofUrl, setProofUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!officialEmail.includes("@")) {
      setError("Please enter a valid institutional email address.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/claims/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          universityId,
          universityName,
          userId: user?.id,
          applicantName: applicantName.trim(),
          officialEmail: officialEmail.trim(),
          designation: designation.trim(),
          proofDocumentUrl: proofUrl.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit claim request.");
        setLoading(false);
        return;
      }

      setSuccess(true);
      if (onSubmitted) onSubmitted();

      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError(err?.message || "Failed to submit claim request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-[#102C57]">
              <ShieldCheck className="h-5 w-5 text-[#EA5C2B]" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#102C57]">Claim Official Profile</h2>
              <p className="text-[11px] text-slate-500">{universityName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Notices */}
        {success && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-xs font-bold text-emerald-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>Claim submitted! Admin review pending in /admin queue.</span>
          </div>
        )}
        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-bold text-rose-800">
            <AlertCircle className="h-4 w-4 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Your Full Name</label>
            <div className="relative rounded-xl border border-slate-200 bg-white transition focus-within:border-[#102C57]">
              <input
                type="text"
                required
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                placeholder="e.g. Dr. Sahil Pattankude"
                className="w-full rounded-xl py-2 px-3 text-slate-900 font-medium focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Official Institutional Email</label>
            <div className="relative rounded-xl border border-slate-200 bg-white transition focus-within:border-[#102C57]">
              <input
                type="email"
                required
                value={officialEmail}
                onChange={(e) => setOfficialEmail(e.target.value)}
                placeholder="admissions@university.edu"
                className="w-full rounded-xl py-2 px-3 text-slate-900 font-medium focus:outline-none"
              />
            </div>
            <p className="mt-1 text-[10px] text-slate-400">Must match institutional domain (e.g. @tum.de or @stanford.edu)</p>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Official Designation</label>
            <div className="relative rounded-xl border border-slate-200 bg-white transition focus-within:border-[#102C57]">
              <input
                type="text"
                required
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="e.g. Director of Admissions / Dean"
                className="w-full rounded-xl py-2 px-3 text-slate-900 font-medium focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Authorization Proof (ID / Verification Link)</label>
            <div className="relative rounded-xl border border-slate-200 bg-white transition focus-within:border-[#102C57]">
              <input
                type="text"
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                placeholder="https://university.edu/staff/profile"
                className="w-full rounded-xl py-2 px-3 text-slate-900 font-medium focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl bg-[#102C57] px-5 py-2 font-bold text-white hover:bg-[#0c2242] transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#EA5C2B]" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-3.5 w-3.5 text-[#EA5C2B]" />
                  <span>Submit Claim Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
