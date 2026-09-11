"use client";

import { useState } from "react";

export function CountryGridTabs() {
  const [activeTab, setActiveTab] = useState<string>("Anchor Six");

  const handleTab = (tab: string) => {
    setActiveTab(tab);
    const items = document.querySelectorAll<HTMLElement>("[data-country-tier]");
    items.forEach((item) => {
      const tier = item.getAttribute("data-country-tier");
      const isAnchor = item.getAttribute("data-is-anchor") === "true";
      if (tab === "All") {
        item.style.display = "";
      } else if (tab === "Anchor Six") {
        item.style.display = isAnchor ? "" : "none";
      } else {
        item.style.display = tier === tab ? "" : "none";
      }
    });
  };

  return (
    <div className="flex flex-wrap gap-1.5 rounded-xl bg-slate-100 p-1.5">
      {(["Anchor Six", "All", "Tier 1", "Tier 2", "Tier 3"] as const).map((tab) => (
        <button
          key={tab}
          onClick={() => handleTab(tab)}
          className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
            activeTab === tab
              ? "bg-white text-[#102C57] shadow-sm"
              : "text-slate-600 hover:text-[#102C57]"
          }`}
        >
          {tab === "Anchor Six" ? "Anchor Six (6)" : tab === "All" ? "All (19)" : tab}
        </button>
      ))}
    </div>
  );
}
