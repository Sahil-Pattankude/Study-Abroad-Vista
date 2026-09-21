import { Inbox } from "lucide-react";

interface SectionEmptyProps {
  title?: string;
  message?: string;
}

/** Backend responded successfully but has no rows to show. */
export function SectionEmpty({
  title = "Nothing to show yet",
  message = "There is no published content for this section right now.",
}: SectionEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 px-6 py-14 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-200/70">
        <Inbox className="h-5 w-5 text-slate-500" />
      </div>
      <h3 className="mt-4 text-base font-extrabold text-[#102C57]">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p>
    </div>
  );
}
