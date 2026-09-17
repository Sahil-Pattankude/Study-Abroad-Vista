"use client";

import Link from "next/link";
import { Lock, Sparkles, X, CheckCircle2, Bot, ArrowRight, ShieldCheck } from "lucide-react";

interface AuthRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function AuthRequiredModal({
  isOpen,
  onClose,
  title = "AI Counsellor is reserved for logged-in members",
  description = "Please sign in or create a free student account to unlock 24/7 personalized AI admissions counselling, university shortlisting, and eligibility checks."
}: AuthRequiredModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition"
          aria-label="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Badge */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#102C57] text-white shadow-sm">
            <Lock className="h-5 w-5 text-[#EA5C2B]" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-[#EA5C2B]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#EA5C2B]">
              <Sparkles className="h-3 w-3" /> Member Access Required
            </span>
          </div>
        </div>

        {/* Headings */}
        <h3 className="mt-4 text-xl font-black text-[#102C57] sm:text-2xl font-serif">
          {title}
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-600">
          {description}
        </p>

        {/* Benefits List */}
        <div className="mt-5 space-y-2.5 rounded-2xl bg-slate-50 p-4 border border-slate-200/80 text-xs">
          <p className="font-bold text-[#102C57] text-[11px] uppercase tracking-wider">
            What you unlock with a free account:
          </p>
          <div className="flex items-start gap-2 text-slate-700">
            <CheckCircle2 className="h-4 w-4 text-[#17B978] shrink-0 mt-0.5" />
            <span><strong>Continuous 24/7 AI Guidance:</strong> Context-aware AI responses tailored to your profile.</span>
          </div>
          <div className="flex items-start gap-2 text-slate-700">
            <CheckCircle2 className="h-4 w-4 text-[#17B978] shrink-0 mt-0.5" />
            <span><strong>Saved Shortlists & History:</strong> Automatically save colleges, eligibility cutoffs, and chat transcripts.</span>
          </div>
          <div className="flex items-start gap-2 text-slate-700">
            <CheckCircle2 className="h-4 w-4 text-[#17B978] shrink-0 mt-0.5" />
            <span><strong>19 Launch Countries:</strong> Real tuition costs in ₹ Lakhs, visa rules, and scholarships.</span>
          </div>
        </div>

        {/* CTAs */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/signup"
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#EA5C2B] py-3 text-xs font-bold text-white shadow-md transition hover:bg-[#ff7240]"
          >
            Create Free Account (30s)
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/login"
            onClick={onClose}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-3 text-xs font-bold text-[#102C57] transition hover:bg-slate-50"
          >
            <Lock className="h-3.5 w-3.5 text-[#102C57]" />
            Sign In to Portal
          </Link>
        </div>

        {/* DPDP Privacy assurance */}
        <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
          <ShieldCheck className="h-3 w-3 text-emerald-600" />
          <span>100% Free · No spam · Protected under DPDP Act 2023</span>
        </div>
      </div>
    </div>
  );
}
