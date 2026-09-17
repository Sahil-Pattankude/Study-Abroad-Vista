"use client";

import { useState, useEffect } from "react";
import { Star, CheckCircle2, ArrowRight, Lock, ShieldCheck, Building2 } from "lucide-react";
import { useHomeModals } from "@/components/home/HomeClientContext";
import { useAuth } from "@/lib/auth/AuthContext";
import { ClaimProfileModal } from "@/components/university/ClaimProfileModal";

interface UniversityActionsProps {
  universityId?: string;
  universitySlug: string;
  universityName: string;
  countrySlug: string;
  claimedStatus?: string;
}

export function UniversityActions({
  universityId,
  universitySlug,
  universityName,
  countrySlug,
  claimedStatus = "unclaimed",
}: UniversityActionsProps) {
  const { openLeadModal, openAuthModal } = useHomeModals();
  const { isLoggedIn } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isShortlisted, setIsShortlisted] = useState(false);
  const [showSyncPrompt, setShowSyncPrompt] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [currentClaimStatus, setCurrentClaimStatus] = useState(claimedStatus);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = JSON.parse(localStorage.getItem("vista_saved_shortlist") || "[]");
      if (Array.isArray(stored) && stored.includes(universitySlug)) {
        setIsShortlisted(true);
      }
    } catch {
      // ignore
    }
  }, [universitySlug]);

  const toggleShortlist = () => {
    try {
      const stored = JSON.parse(localStorage.getItem("vista_saved_shortlist") || "[]");
      let updated: string[] = [];
      if (stored.includes(universitySlug)) {
        updated = stored.filter((s: string) => s !== universitySlug);
        setIsShortlisted(false);
        setShowSyncPrompt(false);
      } else {
        updated = [...stored, universitySlug];
        setIsShortlisted(true);
        
        // Show sync prompt if student is in guest mode (not logged in)
        if (!isLoggedIn) {
          setShowSyncPrompt(true);
        }
      }
      localStorage.setItem("vista_saved_shortlist", JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent("vista_shortlist_updated"));
    } catch (e) {
      console.warn("Shortlist toggle error:", e);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        {currentClaimStatus === "verified" ? (
          <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Verified Institution
          </span>
        ) : (
          <button
            onClick={() => setIsClaimModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 px-3.5 py-2 text-xs font-bold text-[#102C57] transition hover:bg-indigo-100 hover:border-indigo-300 cursor-pointer shadow-2xs"
          >
            <ShieldCheck className="h-4 w-4 text-[#EA5C2B]" />
            <span>Claim Profile</span>
          </button>
        )}

        <button
          onClick={toggleShortlist}
          className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-bold transition shadow-xs ${
            isShortlisted
              ? "border-amber-300 bg-amber-50 text-amber-900"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          <Star className={`h-4 w-4 ${isShortlisted ? "fill-amber-500 text-amber-500" : "text-slate-400"}`} />
          <span>{isShortlisted ? "Shortlisted ✓" : "★ Shortlist"}</span>
        </button>

        <button
          onClick={() => openLeadModal(countrySlug)}
          className="flex items-center gap-1.5 rounded-xl bg-[#EA5C2B] px-5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#d94f20] active:scale-98 cursor-pointer"
        >
          <span>Apply via Vista</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      {showSyncPrompt && !isLoggedIn && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50/90 p-2.5 text-xs text-amber-900 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Lock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            <span className="text-[11px] font-medium">
              Saved to guest session! Sign in to sync across devices & track application deadlines.
            </span>
          </div>
          <button
            onClick={openAuthModal}
            className="shrink-0 rounded-lg bg-[#102C57] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#0c2242] transition"
          >
            Save to Profile →
          </button>
        </div>
      )}

      {/* Claim Profile Interactive Modal */}
      <ClaimProfileModal
        universityId={universityId || universitySlug}
        universityName={universityName}
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        onSubmitted={() => setCurrentClaimStatus("pending")}
      />
    </div>
  );
}
