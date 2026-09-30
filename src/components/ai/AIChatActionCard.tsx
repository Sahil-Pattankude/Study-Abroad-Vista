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
      <div className="mt-2.5 flex items-center justify-between rounded-2xl border border-[#D9CFB8]/80 bg-[#F5EFE0] p-3.5 text-[#103B47] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1D5A6C] text-white shrink-0 shadow-xs">
            <Calculator className="h-4 w-4 text-[#D89A3E]" />
          </div>
          <div>
            <h5 className="text-xs font-serif font-bold text-[#103B47]">
              Estimate Living & Tuition Costs
            </h5>
            <p className="text-[10px] text-[#103B47]/70 font-medium">
              Calculate Blocked Account & INR expenses for {country}
            </p>
          </div>
        </div>
        <Link
          href={`/cost-calculator?country=${encodeURIComponent(country.toLowerCase())}`}
          className="min-h-[44px] inline-flex items-center gap-1 rounded-xl bg-[#103B47] px-3.5 py-2 text-[11px] font-bold text-white shadow-xs hover:bg-[#1D5A6C] transition"
        >
          <span>Calculate</span>{" "}
          <ArrowRight className="h-3.5 w-3.5 text-[#D89A3E]" />
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
      <div className="mt-2.5 flex items-center justify-between rounded-2xl border border-[#D9CFB8]/80 bg-[#F5EFE0] p-3.5 text-[#103B47] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#103B47] text-white shrink-0 shadow-xs">
            <Search className="h-4 w-4 text-[#D89A3E]" />
          </div>
          <div>
            <h5 className="text-xs font-serif font-bold text-[#103B47]">
              Explore Matching Programs
            </h5>
            <p className="text-[10px] text-[#103B47]/70 font-medium">
              Browse verified institutions for {query}
            </p>
          </div>
        </div>
        <Link
          href={targetUrl}
          className="min-h-[44px] inline-flex items-center gap-1 rounded-xl bg-[#103B47] px-3.5 py-2 text-[11px] font-bold text-white shadow-xs hover:bg-[#1D5A6C] transition"
        >
          <span>View Listings</span>{" "}
          <ExternalLink className="h-3.5 w-3.5 text-[#D89A3E]" />
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
      <div className="mt-2.5 flex items-center justify-between rounded-2xl border border-[#D9CFB8]/80 bg-[#F5EFE0] p-3.5 text-[#103B47] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1D5A6C] text-white shrink-0 shadow-xs">
            <BookmarkPlus className="h-4 w-4 text-[#D89A3E]" />
          </div>
          <div>
            <h5 className="text-xs font-serif font-bold text-[#103B47]">
              Add to Watchlist
            </h5>
            <p className="text-[10px] text-[#103B47]/70 font-medium truncate max-w-[160px] sm:max-w-xs">
              {name}
            </p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={shortlistSaved}
          className="min-h-[44px] inline-flex items-center gap-1 rounded-xl bg-[#D89A3E] px-3.5 py-2 text-[11px] font-bold text-[#103B47] shadow-xs hover:bg-[#EBC783] disabled:bg-emerald-700 disabled:text-white transition cursor-pointer"
        >
          {shortlistSaved ? "Saved ✓" : "Save to Shortlist"}
        </button>
      </div>
    );
  }

  if (action.type === "BOOK_CALL") {
    const country = action.payload.country || "Global";
    return (
      <div className="mt-2.5 flex items-center justify-between rounded-2xl border border-[#D9CFB8] bg-[#F5EFE0] p-3.5 text-[#103B47] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#103B47] text-[#D89A3E] shrink-0 shadow-xs">
            <PhoneCall className="h-4 w-4" />
          </div>
          <div>
            <h5 className="text-xs font-serif font-bold text-[#103B47]">
              Book 1-on-1 Profile Evaluation
            </h5>
            <p className="text-[10px] text-[#103B47]/70 font-medium">
              Connect with an authorized counsellor for {country}
            </p>
          </div>
        </div>
        <button
          onClick={() => onOpenLeadModal?.(country)}
          className="min-h-[44px] inline-flex items-center gap-1 rounded-xl bg-[#D89A3E] px-3.5 py-2 text-[11px] font-bold text-[#103B47] shadow-xs hover:bg-[#EBC783] transition cursor-pointer"
        >
          <span>Book Call</span> <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return null;
}
