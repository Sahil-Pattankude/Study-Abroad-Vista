"use client";

import { DeferredSection } from "@/components/performance/DeferredSection";
import { CostCalculatorWidget } from "@/components/home/CostCalculatorWidget";

export function DeferredCostCalculator() {
  return (
    <DeferredSection minHeight={600}>
      <section className="py-16 sm:py-20 bg-slate-50/70 border-y border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <CostCalculatorWidget />
        </div>
      </section>
    </DeferredSection>
  );
}
