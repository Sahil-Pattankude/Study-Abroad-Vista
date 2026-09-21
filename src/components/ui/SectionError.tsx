"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { AlertTriangle, RotateCw } from "lucide-react";

interface SectionErrorProps {
  title?: string;
  message?: string;
}

/**
 * Shown when a section's backend fetch fails. Retry re-runs the
 * server component via router.refresh(), so a transient Supabase
 * error can be recovered without a full page reload.
 */
export function SectionError({
  title = "Couldn't load this section",
  message = "We couldn't reach the server. Please try again.",
}: SectionErrorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-6 py-14 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EA5C2B]/10">
        <AlertTriangle className="h-5 w-5 text-[#EA5C2B]" />
      </div>
      <h3 className="mt-4 text-base font-extrabold text-[#102C57]">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p>
      <button
        type="button"
        onClick={() => startTransition(() => router.refresh())}
        disabled={isPending}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#102C57] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1a3d73] disabled:opacity-60"
      >
        <RotateCw className={`h-3.5 w-3.5 ${isPending ? "animate-spin" : ""}`} />
        {isPending ? "Retrying…" : "Try again"}
      </button>
    </div>
  );
}
