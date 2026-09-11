"use client";

import dynamic from "next/dynamic";
import { DeferredSection } from "@/components/performance/DeferredSection";

const CostCalculatorWidget = dynamic(
  () => import("@/components/home/CostCalculatorWidget").then((module) => module.CostCalculatorWidget),
  { ssr: false },
);

export function DeferredCostCalculator() {
  return (
    <DeferredSection minHeight={720}>
      <CostCalculatorWidget />
    </DeferredSection>
  );
}
