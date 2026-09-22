"use client";

import Link from "next/link";
import { Building2, GraduationCap } from "lucide-react";

interface CompareNavHeaderProps {
  activeTab: "universities" | "courses";
}

export function CompareNavHeader({ activeTab }: CompareNavHeaderProps) {
  return (
    <div className="bg-slate-900 border-b border-slate-800 py-4 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#EA5C2B]">
            Multi-Item Comparison Engine • Template T-09
          </span>
          <h2 className="text-xl font-black text-white mt-0.5">
            Side-by-Side Comparison Matrix
          </h2>
        </div>

        <div className="inline-flex rounded-2xl bg-slate-800 p-1.5 border border-slate-700/80 shrink-0 self-start sm:self-auto">
          <Link
            href="/compare/universities"
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
              activeTab === "universities"
                ? "bg-[#102C57] text-white shadow-md border border-indigo-400/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Building2 className="h-4 w-4 text-[#EA5C2B]" />
            <span>🏛️ Compare Universities</span>
          </Link>

          <Link
            href="/compare/courses"
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition cursor-pointer ${
              activeTab === "courses"
                ? "bg-[#102C57] text-white shadow-md border border-indigo-400/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <GraduationCap className="h-4 w-4 text-[#EA5C2B]" />
            <span>🎓 Compare Courses & Degrees</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
