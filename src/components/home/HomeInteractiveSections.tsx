"use client";

import { DeferredSection } from "@/components/performance/DeferredSection";
import { CostCalculatorWidget } from "@/components/home/CostCalculatorWidget";

export function DeferredCostCalculator() {
  return (
    <DeferredSection minHeight={720}>
      <CostCalculatorWidget />
    </DeferredSection>
  );
}
