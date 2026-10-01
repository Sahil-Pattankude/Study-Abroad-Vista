"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function StudentAccountDashboard() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/student");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FDFCF7] flex flex-col items-center justify-center p-4">
      <Loader2 className="h-8 w-8 animate-spin text-[#103B47]" />
      <p className="mt-3 text-xs font-semibold text-[#103B47]/70">
        Navigating to your student dashboard...
      </p>
    </div>
  );
}
