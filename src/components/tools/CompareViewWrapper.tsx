"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { CompareNavHeader } from "./CompareNavHeader";
import { UniversityCompareClient } from "./UniversityCompareClient";
import { CourseCompareClient } from "./CourseCompareClient";
import { Compass } from "lucide-react";

function CompareViewContent() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");
  const isCourses = tab === "courses" || tab === "programs";

  return (
    <div>
      <CompareNavHeader activeTab={isCourses ? "courses" : "universities"} />
      {isCourses ? <CourseCompareClient /> : <UniversityCompareClient />}
    </div>
  );
}

export function CompareViewWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-2">
            <Compass className="h-8 w-8 text-[#EA5C2B] animate-spin" />
            <p className="text-xs font-semibold text-slate-500">
              Loading Comparison Matrix...
            </p>
          </div>
        </div>
      }
    >
      <CompareViewContent />
    </Suspense>
  );
}
