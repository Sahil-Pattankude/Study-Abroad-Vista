"use client";

import Link from "next/link";
import {
  Calculator,
  Search,
  BookmarkPlus,
  PhoneCall,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { addToShortlist } from "@/lib/cookies/shortlist";
import { useAuth } from "@/lib/auth/AuthContext";
import { useState } from "react";

export interface ParsedAction {
  type:
    "CALCULATE_COST" | "SEARCH_UNIVERSITIES" | "SAVE_SHORTLIST" | "BOOK_CALL";
  payload: Record<string, string>;
}

export function parseMessageActions(rawText: string): {
  cleanText: string;
  actions: ParsedAction[];
} {
  const actions: ParsedAction[] = [];
  const actionRegex = /\[\[ACTION:([A-Z_]+):({.*?})\]\]/g;

  let match;
  while ((match = actionRegex.exec(rawText)) !== null) {
    try {
      const type = match[1] as ParsedAction["type"];
      const payload = JSON.parse(match[2]);
      actions.push({ type, payload });
    } catch {
      // ignore parse error
    }
  }

  const cleanText = rawText.replace(actionRegex, "").trim();
  return { cleanText, actions };
}

interface AIChatActionCardProps {
  action: ParsedAction;
  onOpenLeadModal?: (country?: string) => void;
}

export function AIChatActionCard({
  action,
  onOpenLeadModal,
}: AIChatActionCardProps) {
  const { user } = useAuth();
  const [shortlistSaved, setShortlistSaved] = useState(false);

  if (action.type === "CALCULATE_COST") {
    const country = action.payload.country || "Germany";
    return (
      <div className="mt-2.5 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/90 p-3 text-emerald-950 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Calculator className="h-4 w-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-emerald-900">
              Estimate Living & Tuition Costs
            </h5>
            <p className="text-[10px] text-emerald-700">
              Calculate Blocked Account & INR expenses for {country}
            </p>
          </div>
        </div>
        <Link
          href={`/cost-calculator?country=${encodeURIComponent(country.toLowerCase())}`}
          className="inline-flex items-center gap-1 rounded-lg bg-emerald-700 px-2.5 py-1.5 text-[11px] font-bold text-white shadow-xs hover:bg-emerald-800 transition"
        >
          Calculate <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    );
  }

  if (action.type === "SEARCH_UNIVERSITIES") {
    const query =
      action.payload.query || action.payload.country || "Universities";
    const country = action.payload.country;
    const targetUrl = country
      ? `/destinations/${encodeURIComponent(country.toLowerCase())}`
      : `/universities?search=${encodeURIComponent(query)}`;

    return (
      <div className="mt-2.5 flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50/90 p-3 text-indigo-950 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#102C57] text-white">
            <Search className="h-4 w-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-[#102C57]">
              Explore Matching Programs
            </h5>
            <p className="text-[10px] text-indigo-700">
              Browse verified institutions for {query}
            </p>
          </div>
        </div>
        <Link
          href={targetUrl}
          className="inline-flex items-center gap-1 rounded-lg bg-[#102C57] px-2.5 py-1.5 text-[11px] font-bold text-white shadow-xs hover:bg-[#0c2242] transition"
        >
          View Listings <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
    );
  }

  if (action.type === "SAVE_SHORTLIST") {
    const name = action.payload.name || "Target University";
    const slug = action.payload.slug || "university";

    const handleSave = () => {
      addToShortlist(slug, user);
      setShortlistSaved(true);
    };

    return (
      <div className="mt-2.5 flex items-center justify-between rounded-xl border border-amber-200 bg-amber-50/90 p-3 text-amber-950 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EA5C2B] text-white">
            <BookmarkPlus className="h-4 w-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-amber-950">
              Add to Watchlist
            </h5>
            <p className="text-[10px] text-amber-800">{name}</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={shortlistSaved}
          className="inline-flex items-center gap-1 rounded-lg bg-[#EA5C2B] px-2.5 py-1.5 text-[11px] font-bold text-white shadow-xs hover:bg-[#d44d1f] disabled:bg-emerald-600 transition"
        >
          {shortlistSaved ? "Saved ✓" : "Save to Shortlist"}
        </button>
      </div>
    );
  }

  if (action.type === "BOOK_CALL") {
    const country = action.payload.country || "Global";
    return (
      <div className="mt-2.5 flex items-center justify-between rounded-xl border border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50 p-3 text-slate-800 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EA5C2B] text-white shadow-xs">
            <PhoneCall className="h-4 w-4" />
          </div>
          <div>
            <h5 className="text-xs font-bold text-slate-900">
              Book 1-on-1 Profile Evaluation
            </h5>
            <p className="text-[10px] text-slate-600">
              Connect with an authorized counsellor for {country}
            </p>
          </div>
        </div>
        <button
          onClick={() => onOpenLeadModal?.(country)}
          className="inline-flex items-center gap-1 rounded-lg bg-[#EA5C2B] px-2.5 py-1.5 text-[11px] font-bold text-white shadow-xs hover:bg-[#d44d1f] transition"
        >
          Book Call <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    );
  }

  return null;
}
