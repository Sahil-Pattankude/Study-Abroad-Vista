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
  const input =
    `${code || ""} ${countryCode || ""} ${name || ""} ${countryName || ""}`
      .toLowerCase()
      .replace(/[\-_]/g, " ")
      .trim();

  let raw = "";

  if (input.includes("canada") || input === "ca" || input === "can") raw = "ca";
  else if (
    input.includes("netherland") ||
    input.includes("holland") ||
    input.includes("dutch") ||
    input === "nl" ||
    input === "nld"
  )
    raw = "nl";
  else if (
    input.includes("germany") ||
    input.includes("german") ||
    input.includes("deutschland") ||
    input === "de" ||
    input === "deu"
  )
    raw = "de";
  else if (
    input.includes("united kingdom") ||
    input.includes("uk") ||
    input.includes("britain") ||
    input.includes("england") ||
    input === "gb" ||
    input === "gbr"
  )
    raw = "gb";
  else if (
    input.includes("united states") ||
    input.includes("usa") ||
    input.includes("america") ||
    input === "us"
  )
    raw = "us";
  else if (input.includes("australia") || input === "au" || input === "aus")
    raw = "au";
  else if (input.includes("new zealand") || input === "nz" || input === "nzl")
    raw = "nz";
  else if (
    input.includes("ireland") ||
    input.includes("irish") ||
    input === "ie" ||
    input === "irl"
  )
    raw = "ie";
  else if (
    input.includes("france") ||
    input.includes("french") ||
    input === "fr" ||
    input === "fra"
  )
    raw = "fr";
  else if (
    input.includes("italy") ||
    input.includes("italian") ||
    input === "it" ||
    input === "ita"
  )
    raw = "it";
  else if (input.includes("singapore") || input === "sg" || input === "sgp")
    raw = "sg";
  else if (input.includes("malaysia") || input === "my" || input === "mys")
    raw = "my";
  else if (
    input.includes("united arab emirates") ||
    input.includes("emirates") ||
    input.includes("uae") ||
    input.includes("dubai") ||
    input === "ae" ||
    input === "are"
  )
    raw = "ae";
  else if (input.includes("russia") || input === "ru" || input === "rus")
    raw = "ru";
  else if (
    input.includes("uzbekistan") ||
    input.includes("uzbek") ||
    input === "uz" ||
    input === "uzb"
  )
    raw = "uz";
  else if (
    input.includes("kazakhstan") ||
    input.includes("kazakh") ||
    input === "kz" ||
    input === "kaz"
  )
    raw = "kz";
  else if (
    input.includes("kyrgyzstan") ||
    input.includes("kyrgyz") ||
    input === "kg" ||
    input === "kgz"
  )
    raw = "kg";
  else if (
    input.includes("georgia") ||
    input.includes("georgian") ||
    input === "ge" ||
    input === "geo"
  )
    raw = "ge";
  else if (
    input.includes("philippines") ||
    input.includes("filipino") ||
    input === "ph" ||
    input === "phl"
  )
    raw = "ph";
  else if (input.includes("india") || input === "in" || input === "ind")
    raw = "in";
  else {
    const directCode = (code || countryCode || "").trim().toLowerCase();
    raw = directCode.length === 2 ? directCode : "";
  }

  const sizeClasses = {
    sm: "h-[14px] w-[20px]",
    md: "h-[18px] w-[26px]",
    lg: "h-[24px] w-[34px]",
  }[size];

  const containerClasses = `inline-flex items-center justify-center shrink-0 overflow-hidden rounded-[3px] border border-slate-300/80 shadow-[0_1px_2px_rgba(0,0,0,0.1)] align-middle ${sizeClasses} ${className || ""}`;

  // Embedded SVG Flags for 100% offline & cross-platform rendering
  const renderSVG = () => {
    switch (raw) {
      case "ca":
        return (
          <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
            <path fill="#d80027" d="M0 0h160v480H0zM480 0h160v480H480z" />
            <path fill="#f0f0f0" d="M160 0h320v480H160z" />
            <path
              fill="#d80027"
              d="m320 110 18 42 36-12-14 36 34 16-38 18 10 38-34-16-12 88h-4l-12-88-34 16 10-38-38-18 34-16-14-36 36 12z"
            />
          </svg>
        );
      case "nl":
        return (
          <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
            <path fill="#21468b" d="M0 320h640v160H0z" />
            <path fill="#fff" d="M0 160h640v160H0z" />
            <path fill="#ae1c28" d="M0 0h640v160H0z" />
          </svg>
        );
      case "de":
        return (
          <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
            <path fill="#ffce00" d="M0 320h640v160H0z" />
            <path fill="#d00" d="M0 160h640v160H0z" />
            <path fill="#000" d="M0 0h640v160H0z" />
          </svg>
        );
      case "us":
        return (
          <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
            <path fill="#bd3d44" d="M0 0h640v480H0z" />
            <path
              stroke="#fff"
              strokeWidth="37"
              d="M0 55h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640"
            />
            <path fill="#192f5d" d="M0 0h260v260H0z" />
            <circle cx="50" cy="50" r="10" fill="#fff" />
            <circle cx="130" cy="50" r="10" fill="#fff" />
            <circle cx="210" cy="50" r="10" fill="#fff" />
            <circle cx="90" cy="90" r="10" fill="#fff" />
            <circle cx="170" cy="90" r="10" fill="#fff" />
            <circle cx="50" cy="130" r="10" fill="#fff" />
            <circle cx="130" cy="130" r="10" fill="#fff" />
            <circle cx="210" cy="130" r="10" fill="#fff" />
            <circle cx="90" cy="170" r="10" fill="#fff" />
            <circle cx="170" cy="170" r="10" fill="#fff" />
            <circle cx="50" cy="210" r="10" fill="#fff" />
            <circle cx="130" cy="210" r="10" fill="#fff" />
            <circle cx="210" cy="210" r="10" fill="#fff" />
          </svg>
        );
      case "gb":
        return (
          <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
            <path fill="#012169" d="M0 0h640v480H0z" />
            <path
              fill="#fff"
              d="m75 0 245 180L565 0h75v60L435 240l205 180v60h-75L320 300 75 480H0v-60l205-180L0 60V0z"
            />
            <path
              fill="#c8102e"
              d="m0 0 270 200h-50L0 35zm640 0L370 200h50l220-165zM0 480l270-200h-50L0 445zm640 0L370 280h50l220 165z"
            />
            <path fill="#fff" d="M240 0h160v480H240zM0 160h640v160H0z" />
            <path fill="#c8102e" d="M270 0h100v480H270zM0 190h640v100H0z" />
          </svg>
        );
      case "au":
        return (
          <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
            <path fill="#00008b" d="M0 0h640v480H0z" />
            <g transform="scale(0.5)">
              <path fill="#012169" d="M0 0h640v480H0z" />
              <path
                fill="#fff"
                d="m75 0 245 180L565 0h75v60L435 240l205 180v60h-75L320 300 75 480H0v-60l205-180L0 60V0z"
              />
              <path
                fill="#c8102e"
                d="m0 0 270 200h-50L0 35zm640 0L370 200h50l220-165zM0 480l270-200h-50L0 445zm640 0L370 280h50l220 165z"
              />
              <path fill="#fff" d="M240 0h160v480H240zM0 160h640v160H0z" />
              <path fill="#c8102e" d="M270 0h100v480H270zM0 190h640v100H0z" />
            </g>
            <circle cx="160" cy="360" r="28" fill="#fff" />
            <circle cx="480" cy="120" r="14" fill="#fff" />
            <circle cx="560" cy="200" r="14" fill="#fff" />
            <circle cx="480" cy="380" r="14" fill="#fff" />
            <circle cx="420" cy="240" r="14" fill="#fff" />
            <circle cx="510" cy="280" r="8" fill="#fff" />
          </svg>
        );
      case "nz":
        return (
          <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
            <path fill="#00247d" d="M0 0h640v480H0z" />
            <g transform="scale(0.5)">
              <path fill="#012169" d="M0 0h640v480H0z" />
              <path
                fill="#fff"
                d="m75 0 245 180L565 0h75v60L435 240l205 180v60h-75L320 300 75 480H0v-60l205-180L0 60V0z"
              />
              <path
                fill="#c8102e"
                d="m0 0 270 200h-50L0 35zm640 0L370 200h50l220-165zM0 480l270-200h-50L0 445zm640 0L370 280h50l220 165z"
              />
              <path fill="#fff" d="M240 0h160v480H240zM0 160h640v160H0z" />
              <path fill="#c8102e" d="M270 0h100v480H270zM0 190h640v100H0z" />
            </g>
            <circle cx="480" cy="120" r="14" fill="#fff" />
            <circle cx="480" cy="120" r="10" fill="#d80027" />
            <circle cx="550" cy="200" r="14" fill="#fff" />
            <circle cx="550" cy="200" r="10" fill="#d80027" />
            <circle cx="480" cy="360" r="16" fill="#fff" />
            <circle cx="480" cy="360" r="12" fill="#d80027" />
            <circle cx="420" cy="240" r="14" fill="#fff" />
            <circle cx="420" cy="240" r="10" fill="#d80027" />
          </svg>
        );
      case "ie":
        return (
          <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
            <path fill="#169b62" d="M0 0h213v480H0z" />
            <path fill="#fff" d="M213 0h214v480H213z" />
            <path fill="#ff883e" d="M427 0h213v480H427z" />
          </svg>
        );
      case "fr":
        return (
          <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
            <path fill="#002654" d="M0 0h213v480H0z" />
            <path fill="#fff" d="M213 0h214v480H213z" />
            <path fill="#ce1126" d="M427 0h213v480H427z" />
          </svg>
        );
      case "it":
        return (
          <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
            <path fill="#009246" d="M0 0h213v480H0z" />
            <path fill="#fff" d="M213 0h214v480H213z" />
            <path fill="#ce2b37" d="M427 0h213v480H427z" />
          </svg>
        );
      case "sg":
        return (
          <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
            <path fill="#df0000" d="M0 0h640v240H0z" />
            <path fill="#fff" d="M0 240h640v240H0z" />
            <circle cx="120" cy="120" r="60" fill="#fff" />
            <circle cx="140" cy="120" r="54" fill="#df0000" />
          </svg>
        );
      case "ae":
        return (
          <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
            <path fill="#00732f" d="M160 0h480v160H160z" />
            <path fill="#fff" d="M160 160h480v160H160z" />
            <path fill="#000" d="M160 320h480v160H160z" />
            <path fill="#f00" d="M0 0h160v480H0z" />
          </svg>
        );
      case "my":
        return (
          <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
            <path fill="#cc0000" d="M0 0h640v480H0z" />
            <path
              stroke="#fff"
              strokeWidth="34"
              d="M0 34h640M0 102h640M0 170h640M0 238h640M0 306h640M0 374h640M0 442h640"
            />
            <path fill="#000066" d="M0 0h320v240H0z" />
            <circle cx="160" cy="120" r="60" fill="#ffcc00" />
            <circle cx="180" cy="120" r="50" fill="#000066" />
          </svg>
        );
      case "ru":
        return (
          <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
            <path fill="#fff" d="M0 0h640v160H0z" />
            <path fill="#0039a6" d="M0 160h640v160H0z" />
            <path fill="#d52b1e" d="M0 320h640v160H0z" />
          </svg>
        );
      case "uz":
        return (
          <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
            <path fill="#0099b5" d="M0 0h640v160H0z" />
            <path fill="#ce1126" d="M0 155h640v10H0zM0 315h640v10H0z" />
            <path fill="#fff" d="M0 165h640v150H0z" />
            <path fill="#1eb53a" d="M0 325h640v155H0z" />
            <circle cx="80" cy="80" r="30" fill="#fff" />
            <circle cx="90" cy="80" r="26" fill="#0099b5" />
          </svg>
        );
      case "ge":
        return (
          <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
            <path fill="#fff" d="M0 0h640v480H0z" />
            <path fill="#f00" d="M260 0h120v480H260zM0 180h640v120H0z" />
            <path
              fill="#f00"
              d="M110 70h40v60h-40zM100 80h60v40h-60zm370 0h40v60h-40zm-10 10h60v40h-60zM110 350h40v60h-40zm-10 10h60v40h-60zm370 0h40v60h-40zm-10 10h60v40h-60z"
            />
          </svg>
        );
      case "kz":
        return (
          <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
            <path fill="#00afca" d="M0 0h640v480H0z" />
            <circle cx="320" cy="240" r="60" fill="#ffcc00" />
            <path
              fill="#00afca"
              d="M300 240a20 20 0 1 0 40 0 20 20 0 1 0-40 0z"
            />
            <path fill="#ffcc00" d="m260 270 60 20 60-20-60 10z" />
          </svg>
        );
      case "kg":
        return (
          <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
            <path fill="#e8112d" d="M0 0h640v480H0z" />
            <circle cx="320" cy="240" r="70" fill="#ffcc00" />
            <circle cx="320" cy="240" r="50" fill="#e8112d" />
            <path
              stroke="#ffcc00"
              strokeWidth="8"
              d="M290 210c20 20 40 40 60 60M290 270c20-20 40-40 60-60"
            />
          </svg>
        );
      case "ph":
        return (
          <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
            <path fill="#0038a8" d="M0 0h640v240H0z" />
            <path fill="#ce1126" d="M0 240h640v240H0z" />
            <path fill="#fff" d="m0 0 280 240L0 480z" />
            <circle cx="95" cy="240" r="32" fill="#fcd116" />
          </svg>
        );
      case "in":
        return (
          <svg viewBox="0 0 640 480" className="w-full h-full object-cover">
            <path fill="#f93" d="M0 0h640v160H0z" />
            <path fill="#fff" d="M0 160h640v160H0z" />
            <path fill="#128807" d="M0 320h640v160H0z" />
            <circle
              cx="320"
              cy="240"
              r="40"
              fill="none"
              stroke="#000080"
              strokeWidth="6"
            />
            <circle cx="320" cy="240" r="10" fill="#000080" />
          </svg>
        );
      default:
        return (
          <span className="flex h-full w-full items-center justify-center bg-slate-100 text-[10px] font-bold text-slate-600">
            {raw ? raw.toUpperCase() : "🌐"}
          </span>
        );
    }
  };

  return (
    <span
      className={containerClasses}
      title={name || countryName || code || countryCode || raw.toUpperCase()}
    >
      {renderSVG()}
    </span>
  );
}
