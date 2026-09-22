"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function BuyerDashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/portal/buyer");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <Loader2 className="h-8 w-8 animate-spin text-[#102C57]" />
      <p className="mt-3 text-xs font-semibold text-slate-500">
        Redirecting to B2B Consultant Workspace...
      </p>
    </div>
  );
}
