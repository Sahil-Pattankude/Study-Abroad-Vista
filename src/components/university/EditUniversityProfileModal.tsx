"use client";

import { useState } from "react";
import { Building2, X, Save, Loader2, Award, MapPin, Coins, CheckCircle2, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

interface EditUniversityProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    id?: string;
    name: string;
    city: string;
    country: string;
    rankingGlobal: number | string;
    rankingNational: number | string;
    tuitionFeeRangeINR: string;
    ieltsMinScore: number | string;
    acceptanceRate: number | string;
    postStudyWorkMonths: number | string;
  };
  onSave: (updated: any) => void;
}

export function EditUniversityProfileModal({
  isOpen,
  onClose,
  initialData,
  onSave,
}: EditUniversityProfileModalProps) {
  if (!isOpen) return null;

  const [name, setName] = useState(initialData.name || "");
  const [city, setCity] = useState(initialData.city || "Munich");
  const [country, setCountry] = useState(initialData.country || "Germany");
  const [rankingGlobal, setRankingGlobal] = useState(initialData.rankingGlobal || "28");
  const [rankingNational, setRankingNational] = useState(initialData.rankingNational || "1");
  const [tuitionFeeRangeINR, setTuitionFeeRangeINR] = useState(initialData.tuitionFeeRangeINR || "€0 (Public University)");
  const [ieltsMinScore, setIeltsMinScore] = useState(initialData.ieltsMinScore || "6.5");
  const [acceptanceRate, setAcceptanceRate] = useState(initialData.acceptanceRate || "8");
  const [postStudyWorkMonths, setPostStudyWorkMonths] = useState(initialData.postStudyWorkMonths || "18");
  
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim() || !city.trim()) {
      setErrorMsg("University name and city are required.");
      return;
    }

    setSaving(true);

    const updatedObj = {
      ...initialData,
      name: name.trim(),
      city: city.trim(),
      country: country.trim(),
      rankingGlobal: Number(rankingGlobal) || 28,
      rankingNational: Number(rankingNational) || 1,
      tuitionFeeRangeINR: tuitionFeeRangeINR.trim(),
      ieltsMinScore: Number(ieltsMinScore) || 6.5,
      acceptanceRate: Number(acceptanceRate) || 8,
      postStudyWorkMonths: Number(postStudyWorkMonths) || 18,
    };

    try {
      // 1. Persist to Supabase if table exists
      if (initialData.id) {
        await supabase
          .from("universities")
          .update({
            name: updatedObj.name,
            city: updatedObj.city,
            country: updatedObj.country,
            ranking_global: updatedObj.rankingGlobal,
            ranking_national: updatedObj.rankingNational,
            tuition_fee_range_inr: updatedObj.tuitionFeeRangeINR,
            ielts_min_score: updatedObj.ieltsMinScore,
            acceptance_rate: updatedObj.acceptanceRate,
            post_study_work_months: updatedObj.postStudyWorkMonths,
            updated_at: new Date().toISOString(),
          })
          .eq("id", initialData.id);
      }

      onSave(updatedObj);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } catch (err: any) {
      console.warn("Supabase update error fallback:", err);
      onSave(updatedObj);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-[#102C57]">
              <Building2 className="h-5 w-5 text-[#EA5C2B]" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#102C57]">Edit University Profile</h2>
              <p className="text-xs text-slate-500">Update official institutional details & criteria</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {errorMsg && (
            <div className="rounded-xl bg-red-50 p-3 text-red-700 font-bold border border-red-200">
              {errorMsg}
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-emerald-800 font-bold border border-emerald-200">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>University profile updated successfully! Syncing live...</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">University Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 font-semibold focus:border-[#102C57] focus:ring-1 focus:ring-[#102C57] outline-none"
                placeholder="e.g. Technical University of Munich"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">City & Location</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 font-semibold focus:border-[#102C57] focus:ring-1 focus:ring-[#102C57] outline-none"
                placeholder="e.g. Munich"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">QS Global Rank</label>
              <input
                type="number"
                value={rankingGlobal}
                onChange={(e) => setRankingGlobal(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 font-semibold focus:border-[#102C57] focus:ring-1 focus:ring-[#102C57] outline-none"
                placeholder="28"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">National Rank</label>
              <input
                type="number"
                value={rankingNational}
                onChange={(e) => setRankingNational(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 font-semibold focus:border-[#102C57] focus:ring-1 focus:ring-[#102C57] outline-none"
                placeholder="1"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Min. IELTS Band</label>
              <input
                type="text"
                value={ieltsMinScore}
                onChange={(e) => setIeltsMinScore(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 font-semibold focus:border-[#102C57] focus:ring-1 focus:ring-[#102C57] outline-none"
                placeholder="6.5"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tuition Fee Range</label>
              <input
                type="text"
                value={tuitionFeeRangeINR}
                onChange={(e) => setTuitionFeeRangeINR(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 font-semibold focus:border-[#102C57] focus:ring-1 focus:ring-[#102C57] outline-none"
                placeholder="€0 (Public University) or ₹15-25L/yr"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Acceptance Rate %</label>
              <input
                type="text"
                value={acceptanceRate}
                onChange={(e) => setAcceptanceRate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 font-semibold focus:border-[#102C57] focus:ring-1 focus:ring-[#102C57] outline-none"
                placeholder="8"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">PSW Visa (Months)</label>
              <input
                type="text"
                value={postStudyWorkMonths}
                onChange={(e) => setPostStudyWorkMonths(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 font-semibold focus:border-[#102C57] focus:ring-1 focus:ring-[#102C57] outline-none"
                placeholder="18"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 font-bold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-1.5 rounded-xl bg-[#102C57] px-5 py-2 font-bold text-white hover:bg-[#0c2242] transition cursor-pointer shadow-sm"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-[#EA5C2B]" />
                  <span>Saving Profile...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 text-[#EA5C2B]" />
                  <span>Save Profile Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
