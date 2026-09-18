"use client";

import React from "react";

interface CountryFlagProps {
  code?: string;
  countryCode?: string;
  name?: string;
  countryName?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CountryFlag({
  code,
  countryCode,
  name,
  countryName,
  size = "md",
  className,
}: CountryFlagProps) {
  const rawCode = (code || countryCode || "").trim().toLowerCase();
  const displayName = name || countryName || code || countryCode || "Country";

  const sizeClasses = {
    sm: "h-3.5 w-5 rounded-xs",
    md: "h-5 w-7 rounded-xs",
    lg: "h-6 w-9 rounded-xs",
  }[size];

  const defaultClasses = `object-cover shadow-2xs border border-slate-200/80 inline-block align-middle shrink-0 ${sizeClasses}`;

  return (
    <img
      src={`https://flagcdn.com/w40/${rawCode || "un"}.png`}
      alt={`${displayName} Flag`}
      title={displayName}
      className={className || defaultClasses}
      loading="lazy"
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = "none";
      }}
    />
  );
}
