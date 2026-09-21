// ============================================================
// Loading placeholders for backend-fetched homepage sections.
// Card heights mirror the real cards so nothing shifts when the
// data streams in.
// ============================================================

function ShimmerBar({ className }: { className: string }) {
  return <div className={`rounded bg-slate-200/80 ${className}`} />;
}

function CountryCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShimmerBar className="h-6 w-9" />
            <div className="space-y-1.5">
              <ShimmerBar className="h-4 w-28" />
              <ShimmerBar className="h-2.5 w-20" />
            </div>
          </div>
          <ShimmerBar className="h-5 w-20 rounded-full" />
        </div>

        <div className="mt-3.5 space-y-1.5">
          <ShimmerBar className="h-3 w-full" />
          <ShimmerBar className="h-3 w-4/5" />
        </div>

        <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <ShimmerBar className="h-3 w-24" />
              <ShimmerBar className="h-3 w-24" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
        <ShimmerBar className="h-2.5 w-28" />
        <ShimmerBar className="h-3 w-24" />
      </div>
    </div>
  );
}

export function CountryCardsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      aria-busy="true"
      aria-label="Loading destinations"
    >
      {Array.from({ length: count }).map((_, i) => (
        <CountryCardSkeleton key={i} />
      ))}
    </div>
  );
}

function UniversityCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <ShimmerBar className="h-10 w-10 rounded-xl" />
          <ShimmerBar className="h-5 w-24 rounded-full" />
        </div>
        <ShimmerBar className="h-5 w-16 rounded-full" />
      </div>

      <ShimmerBar className="mt-4 h-4 w-3/4" />
      <ShimmerBar className="mt-1.5 h-3 w-1/2" />

      <div className="mt-4 space-y-2 border-t border-slate-200/60 pt-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex justify-between">
            <ShimmerBar className="h-3 w-20" />
            <ShimmerBar className="h-3 w-24" />
          </div>
        ))}
      </div>

      <ShimmerBar className="mt-5 h-8 w-full rounded-xl" />
    </div>
  );
}

export function UniversityCardsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      aria-busy="true"
      aria-label="Loading universities"
    >
      {Array.from({ length: count }).map((_, i) => (
        <UniversityCardSkeleton key={i} />
      ))}
    </div>
  );
}
