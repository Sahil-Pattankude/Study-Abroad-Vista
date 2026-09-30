import { supabase } from "./client";
import { supabaseAdmin } from "./server";
import { Country, University, CourseItem, Program, Specialisation } from "@/types";
import {
  mapSupabaseCountry,
  mapSanityCountry,
  mapSupabaseUniversity,
  mapSanityUniversity,
} from "@/lib/data/mappers";
import {
  getSanityUniversities,
  getSanityCountries,
} from "@/lib/sanity/fetchers";

async function queryWithTimeout<T>(
  promiseFactory: () => PromiseLike<T>,
  timeoutMs = 2500,
): Promise<T | null> {
  let timeoutHandle: any;
  const timeoutPromise = new Promise<null>((resolve) => {
    timeoutHandle = setTimeout(() => resolve(null), timeoutMs);
  });

  try {
    const result = await Promise.race([promiseFactory(), timeoutPromise]);
    return result as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutHandle);
  }
}

export async function fetchLiveCountries(): Promise<Country[]> {
  // Client-side browser request: fetch via internal API route to bypass browser RLS constraints
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/countries");
      if (res.ok) {
        const json = await res.json();
        if (
          json.countries &&
          Array.isArray(json.countries) &&
          json.countries.length > 0
        ) {
          return json.countries;
        }
      }
    } catch (err) {
      console.warn("Client fetch /api/countries error:", err);
    }
  }

  let list: Country[] = [];

  // Server-side: Direct Supabase query using supabaseAdmin
  try {
    const client = typeof window === "undefined" ? supabaseAdmin : supabase;
    const response = await queryWithTimeout(
      () => client.from("countries").select("*").eq("is_active", true),
      2500,
    );
    if (
      response &&
      !(response as any).error &&
      (response as any).data &&
      (response as any).data.length > 0
    ) {
      list = (response as any).data.map(mapSupabaseCountry);
    }
  } catch (err) {
    console.warn("Supabase countries fetch error:", err);
  }

  // 2. Merge Sanity CMS Countries (Prepend / update by slug)
  try {
    const sanityCountries = await queryWithTimeout(
      () => getSanityCountries(),
      2000,
    );
    if (sanityCountries && sanityCountries.length > 0) {
      const map = new Map<string, Country>();

      sanityCountries.forEach((sc: any) => {
        const mapped = mapSanityCountry(sc);
        if (mapped) {
          map.set(mapped.slug, mapped);
        }
      });

      list.forEach((c) => {
        if (!map.has(c.slug)) {
          map.set(c.slug, c);
        }
      });

      list = Array.from(map.values());
    }
  } catch (err) {
    console.warn("Sanity countries fetch error:", err);
  }

  return list;
}

export async function fetchLiveUniversities(): Promise<University[]> {
  // Client-side browser request: fetch via internal API route to bypass browser RLS constraints
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/universities");
      if (res.ok) {
        const json = await res.json();
        if (
          json.universities &&
          Array.isArray(json.universities) &&
          json.universities.length > 0
        ) {
          return json.universities;
        }
      }
    } catch (err) {
      console.warn("Client fetch /api/universities error:", err);
    }
  }

  const uniMap = new Map<string, University>();

  // Server-side: Direct Supabase query using supabaseAdmin
  try {
    const client = typeof window === "undefined" ? supabaseAdmin : supabase;
    const response = await queryWithTimeout(
      () => client.from("universities").select("*"),
      2500,
    );
    if (
      response &&
      !(response as any).error &&
      (response as any).data &&
      (response as any).data.length > 0
    ) {
      (response as any).data.forEach((u: any) => {
        const mapped = mapSupabaseUniversity(u);
        if (mapped) {
          uniMap.set(mapped.slug, mapped);
        }
      });
    }
  } catch (err) {
    console.warn("Supabase universities fetch error:", err);
  }

  // 2. Merge Sanity CMS Universities
  try {
    const sanityUnis = await queryWithTimeout(
      () => getSanityUniversities(),
      2000,
    );
    if (sanityUnis && sanityUnis.length > 0) {
      sanityUnis.forEach((su: any) => {
        const mapped = mapSanityUniversity(su);
        if (mapped) {
          uniMap.set(mapped.slug, mapped);
        }
      });
    }
  } catch (err) {
    console.warn("Sanity universities fetch fallback:", err);
  }

  return Array.from(uniMap.values());
}

export async function fetchLivePrograms(): Promise<Program[]> {
  // Client-side browser request: fetch via internal API route to bypass browser RLS constraints
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("/api/programs");
      if (res.ok) {
        const json = await res.json();
        if (
          json.programs &&
          Array.isArray(json.programs) &&
          json.programs.length > 0
        ) {
          return json.programs;
        }
      }
    } catch (err) {
      console.warn("Client fetch /api/programs error:", err);
    }
  }

  // Server-side: Direct Supabase query using supabaseAdmin
  try {
    const client = typeof window === "undefined" ? supabaseAdmin : supabase;
    const response = await queryWithTimeout(
      () => client.from("programs").select("*"),
      2500,
    );
    if (
      response &&
      !(response as any).error &&
      (response as any).data &&
      (response as any).data.length > 0
    ) {
      return (response as any).data.map((p: any) => ({
        id: p.id || p.slug,
        name: p.name,
        slug: p.slug,
        level: p.level || "Postgraduate",
        duration: p.duration || "2 Years",
        keyFields: Array.isArray(p.key_fields) ? p.key_fields : [],
        topDestinations: Array.isArray(p.top_destinations)
          ? p.top_destinations
          : [],
        summary: p.summary || "",
        roiScore: Number(p.roi_score) || 90,
      }));
    }
  } catch (err) {
    console.warn("Supabase programs fetch error:", err);
  }
  return [];
}

export const COUNTRY_ALIASES: Record<string, string> = {
  "united-states": "usa",
  "united-kingdom": "uk",
  america: "usa",
  britain: "uk",
  england: "uk",
  holland: "netherlands",
  dubai: "uae",
  "united-arab-emirates": "uae",
  nz: "new-zealand",
};

export const PROGRAM_ALIASES: Record<string, string> = {
  "emba-executive": "emba",
  "executive-mba": "emba",
  "emba-abroad": "emba",
  "masters-stem": "ms",
  "stem-masters": "ms",
  masters: "ms",
  "masters-abroad": "ms",
  "mba-management": "mba",
  "mba-abroad": "mba",
  "mbbs-medicine": "mbbs",
  medicine: "mbbs",
  "mbbs-abroad": "mbbs",
  "nursing-healthcare": "nursing",
  "nursing-abroad": "nursing",
  "germany-ausbildung": "ausbildung",
  "ausbildung-germany": "ausbildung",
  "bachelors-ug": "bachelors",
  undergraduate: "bachelors",
  "bachelors-abroad": "bachelors",
  "phd-doctoral": "phd",
  "phd-research": "phd",
  "phd-abroad": "phd",
  doctoral: "phd",
};

export async function getLiveCountryBySlug(
  slug: string,
): Promise<Country | undefined> {
  if (!slug) return undefined;
  let normalized = slug.toLowerCase().trim();
  if (normalized.startsWith("study-in-")) {
    normalized = normalized.replace("study-in-", "");
  }
  const canonical = COUNTRY_ALIASES[normalized] || normalized;
  const countries = await fetchLiveCountries();
  return countries.find((c) => c.slug === canonical || c.id === canonical);
}

export async function getLiveProgramBySlug(
  slug: string,
): Promise<Program | undefined> {
  if (!slug) return undefined;
  const normalized = slug.toLowerCase().trim();
  const canonical = PROGRAM_ALIASES[normalized] || normalized;
  const programs = await fetchLivePrograms();
  return programs.find((p) => p.slug === canonical || p.id === canonical);
}

export async function getLiveUniversityBySlug(
  slug: string,
): Promise<University | undefined> {
  if (!slug) return undefined;
  const normalized = slug.toLowerCase().trim();
  const universities = await fetchLiveUniversities();
  return universities.find(
    (u) =>
      u.slug.toLowerCase() === normalized || u.id?.toLowerCase() === normalized,
  );
}

export interface ClaimItem {
  id: string;
  universityId: string;
  universityName: string;
  countryName?: string;
  applicantName: string;
  officialEmail: string;
  designation: string;
  proofDocumentUrl?: string;
  status: string;
  createdAt: string;
  userId?: string;
}

export async function fetchLiveClaims(): Promise<ClaimItem[]> {
  try {
    if (typeof window !== "undefined") {
      const res = await fetch("/api/claims", { cache: "no-store" });
      const json = await res.json();
      if (json.success && json.claims && json.claims.length > 0) {
        return json.claims;
      }
    } else {
      const response = await queryWithTimeout(
        () =>
          supabaseAdmin
            .from("university_claims")
            .select("*")
            .order("created_at", { ascending: false }),
        2000,
      );

      if (
        response &&
        !(response as any).error &&
        (response as any).data &&
        (response as any).data.length > 0
      ) {
        return (response as any).data.map((c: any) => ({
          id: c.id,
          universityId: c.university_id,
          universityName: c.university_name,
          applicantName: c.applicant_name,
          officialEmail: c.official_email,
          designation: c.designation || "Admissions Representative",
          proofDocumentUrl: c.proof_document_url,
          status: c.verification_status || "pending",
          createdAt: new Date(c.created_at || Date.now()).toLocaleDateString(),
        }));
      }
    }
  } catch (err) {
    console.warn("Supabase claims fetch error:", err);
  }

  return [];
}

export async function fetchLiveCourses(): Promise<CourseItem[]> {
  const courseMap = new Map<string, CourseItem>();

  // 1. Fetch live universities from Supabase
  const universities = await fetchLiveUniversities();

  const flagMap: Record<string, string> = {
    germany: "🇩🇪",
    usa: "🇺🇸",
    uk: "🇬🇧",
    canada: "🇨🇦",
    ireland: "🇮🇪",
    australia: "🇦🇺",
    france: "🇫🇷",
    uzbekistan: "🇺🇿",
    global: "🌐",
  };

  // 2. Build course catalog dynamically from fetched Supabase universities
  universities.forEach((u) => {
    const countryFlag = flagMap[u.countrySlug?.toLowerCase() || ""] || "🌐";

    (u.programsOffered || []).forEach((prog) => {
      let programTitle = "";
      let level = "Postgraduate (Master's)";
      let duration = "2 Years";
      let coreModules = [
        "Core Academic Curriculum",
        "Applied Project",
        "Research Thesis",
        "Specialization Elective",
      ];

      if (prog === "ms") {
        programTitle = `M.Sc. in ${u.name.includes("Technical") ? "Engineering & Data Science" : "Computer Science & Analytics"}`;
        level = "Postgraduate (Master's)";
        duration = u.countrySlug === "uk" ? "1 Year (Full-time)" : "2 Years";
        coreModules = [
          "Machine Learning & AI",
          "Distributed Systems",
          "Cloud Computing",
          "Advanced Algorithms",
        ];
      } else if (prog === "mba") {
        programTitle = `Master of Business Administration (MBA)`;
        level = "Postgraduate (MBA)";
        duration = u.countrySlug === "uk" ? "1 Year" : "16 - 24 Months";
        coreModules = [
          "Strategic Leadership",
          "Corporate Finance",
          "Global Marketing",
          "Venture Capital & Innovation",
        ];
      } else if (prog === "mbbs") {
        programTitle = `Doctor of Medicine (MD / MBBS - NMC Compliant)`;
        level = "Undergraduate (Medicine)";
        duration = "6 Years (5 Yrs + 1 Yr Clinical)";
        coreModules = [
          "Human Anatomy",
          "Pathology & Histology",
          "Clinical Surgery",
          "Internal Medicine",
        ];
      } else if (prog === "bachelors") {
        programTitle = `Bachelor of Science (B.Sc.) in Computer Engineering`;
        level = "Undergraduate (Bachelor's)";
        duration = u.countrySlug === "usa" ? "4 Years" : "3 Years";
        coreModules = [
          "Computer Systems",
          "Linear Algebra",
          "Data Structures",
          "Software Engineering",
        ];
      } else if (prog === "nursing") {
        programTitle = `B.Sc. / M.Sc. in Nursing & Healthcare Leadership`;
        level = "Postgraduate / Undergraduate";
        duration = "2 - 3 Years";
        coreModules = [
          "Clinical Care",
          "Patient Safety",
          "Healthcare Management",
          "Pharmacology",
        ];
      } else if (prog === "ausbildung") {
        programTitle = `Pflegefachfrau/mann Dual Vocational Nursing Ausbildung`;
        level = "Vocational Diploma";
        duration = "3 Years (Paid Apprenticeship)";
        coreModules = [
          "General Nursing",
          "Anatomy & Physiology",
          "Clinical Practice",
          "Geriatric Care",
        ];
      } else {
        programTitle = `${String(prog).toUpperCase()} Program`;
      }

      const courseId = `${u.slug}-${prog}`;
      if (!courseMap.has(courseId)) {
        courseMap.set(courseId, {
          id: courseId,
          slug: `${prog}-${u.slug}`,
          name: programTitle,
          universityName: u.name,
          universitySlug: u.slug,
          city: u.city,
          country: u.country,
          flagEmoji: countryFlag,
          level,
          duration,
          tuitionFeeINR: u.tuitionFeeRangeINR,
          tuitionFeeLocal:
            u.countrySlug === "germany"
              ? "€0 / yr (Semester Fee ~€150)"
              : `${u.tuitionFeeRangeINR}`,
          ieltsMinScore: u.ieltsMinScore,
          greGmatRequired: u.greGmatRequired,
          postStudyWorkMonths: u.postStudyWorkMonths,
          intakeDeadline: u.intakes?.[0]
            ? `${u.intakes[0]} Intake`
            : "Fall Intake",
          roiScore: Math.min(
            99,
            85 +
              (u.rankingGlobal
                ? Math.max(0, 15 - Math.floor(u.rankingGlobal / 20))
                : 5),
          ),
          coreModules,
        });
      }
    });
  });

  // 3. Direct fetch from Supabase `courses` table
  try {
    const client = typeof window === "undefined" ? supabaseAdmin : supabase;
    const response = await queryWithTimeout(
      () => client.from("courses").select("*"),
      2000,
    );
    if (
      response &&
      !(response as any).error &&
      (response as any).data &&
      (response as any).data.length > 0
    ) {
      (response as any).data.forEach((c: any) => {
        if (c.slug) {
          courseMap.set(c.slug, {
            id: c.id || c.slug,
            slug: c.slug,
            name: c.name,
            universityName: c.university_name,
            universitySlug: c.university_slug || "global",
            city: c.city || "Campus City",
            country: c.country || "Global",
            flagEmoji: c.flag_emoji || "🌐",
            level: c.level || "Postgraduate",
            duration: c.duration || "2 Years",
            tuitionFeeINR: c.tuition_fee_inr || "₹15 - 30 Lakhs / yr",
            tuitionFeeLocal: c.tuition_fee_local || "Local Tuition",
            ieltsMinScore: Number(c.ielts_min_score) || 6.5,
            greGmatRequired: c.gre_gmat_required || false,
            postStudyWorkMonths: c.post_study_work_months || 24,
            intakeDeadline: c.intake_deadline || "Fall Intake",
            roiScore: c.roi_score || 90,
            coreModules: c.core_modules || ["Core Module 1", "Core Module 2"],
          });
        }
      });
    }
  } catch (err) {
    console.warn("Supabase courses table fetch notice:", err);
  }

  return Array.from(courseMap.values());
}

export const STATIC_SPECIALISATIONS: Specialisation[] = [
  // Anchor 1: Master's Degree (MS / MSc / MA)
  {
    id: "spec-ms-1",
    programSlug: "ms",
    anchorCategory: "Anchor 1 — Master's Degree (MS / MSc / MA)",
    name: "Computer Science, Data Science, AI/ML & Business Analytics",
    slug: "ms-cs-data-science-ai-ml",
    description:
      "Primary volume driver aligned to high-growth tech and analytical demand in global tech hubs.",
    focusAreas: [
      "Computer Science",
      "Data Science",
      "AI/ML",
      "Business Analytics",
    ],
    targetDestinations: [
      "USA",
      "Germany",
      "UK",
      "Canada",
      "Australia",
      "Ireland",
      "Netherlands",
    ],
    durationFormats: ["1 Year", "1.5 Years", "2 Years"],
    licensingPathways: [],
    contentInvestmentShare: "35%",
    isYearOneAnchor: true,
  },
  {
    id: "spec-ms-2",
    programSlug: "ms",
    anchorCategory: "Anchor 1 — Master's Degree (MS / MSc / MA)",
    name: "Core Engineering & Financial Engineering",
    slug: "ms-engineering-disciplines",
    description:
      "Traditional and quantitative STEM disciplines across premier technical institutions.",
    focusAreas: [
      "Electrical Engineering",
      "Mechanical Engineering",
      "Civil Engineering",
      "Chemical Engineering",
      "Aerospace Engineering",
      "Financial Engineering",
    ],
    targetDestinations: [
      "Germany",
      "USA",
      "UK",
      "Australia",
      "Canada",
      "Netherlands",
    ],
    durationFormats: ["1.5 Years", "2 Years"],
    licensingPathways: [],
    contentInvestmentShare: "35%",
    isYearOneAnchor: true,
  },
  {
    id: "spec-ms-3",
    programSlug: "ms",
    anchorCategory: "Anchor 1 — Master's Degree (MS / MSc / MA)",
    name: "Cybersecurity, FinTech & Software Engineering",
    slug: "ms-cybersecurity-fintech-swe",
    description:
      "High-demand applied computing, enterprise security, and financial technology engineering tracks.",
    focusAreas: ["Cybersecurity", "FinTech", "Software Engineering"],
    targetDestinations: [
      "USA",
      "UK",
      "Ireland",
      "Singapore",
      "Canada",
      "Australia",
    ],
    durationFormats: ["1 Year", "2 Years"],
    licensingPathways: [],
    contentInvestmentShare: "35%",
    isYearOneAnchor: true,
  },
  {
    id: "spec-ms-4",
    programSlug: "ms",
    anchorCategory: "Anchor 1 — Master's Degree (MS / MSc / MA)",
    name: "Finance, Economics & Public Health (MPH)",
    slug: "ms-finance-economics-mph",
    description:
      "Quantitative economic policy, corporate finance, and public health epidemiology tracks.",
    focusAreas: ["Finance", "Economics", "Public Health (MPH)"],
    targetDestinations: [
      "USA",
      "UK",
      "Canada",
      "Australia",
      "Netherlands",
      "Germany",
    ],
    durationFormats: ["1 Year", "2 Years"],
    licensingPathways: [],
    contentInvestmentShare: "35%",
    isYearOneAnchor: true,
  },
  {
    id: "spec-ms-5",
    programSlug: "ms",
    anchorCategory: "Anchor 1 — Master's Degree (MS / MSc / MA)",
    name: "Biotechnology, Biomedical Sciences & Bioinformatics",
    slug: "ms-biotech-biomedical-bioinformatics",
    description:
      "Cutting-edge life sciences, pharmaceutical development, and computational biology programs.",
    focusAreas: ["Biotechnology", "Biomedical Sciences", "Bioinformatics"],
    targetDestinations: [
      "Germany",
      "USA",
      "UK",
      "Canada",
      "Ireland",
      "Australia",
    ],
    durationFormats: ["2 Years"],
    licensingPathways: [],
    contentInvestmentShare: "35%",
    isYearOneAnchor: true,
  },

  // Anchor 2: MBA Abroad (Full-time)
  {
    id: "spec-mba-1",
    programSlug: "mba",
    anchorCategory: "Anchor 2 — MBA Abroad (Full-time)",
    name: "Full-time MBA Management & Functional Specializations",
    slug: "mba-fulltime-specializations",
    description:
      "Strategic management foundation across top business schools with accelerated 1-year and standard 2-year tracks.",
    focusAreas: [
      "Finance",
      "Marketing",
      "Human Resources (HR)",
      "Operations",
      "Business Analytics",
      "International Business",
      "Entrepreneurship",
      "Strategy",
      "Supply Chain Management",
    ],
    targetDestinations: [
      "USA",
      "UK",
      "France",
      "Germany",
      "Canada",
      "Australia",
      "Singapore",
      "Spain",
    ],
    durationFormats: [
      "1-year MBA (UK, Europe)",
      "2-year MBA (USA, Canada, Australia)",
    ],
    licensingPathways: [],
    contentInvestmentShare: "12%",
    isYearOneAnchor: true,
  },

  // Anchor 3: Executive MBA / Online MBA / Global MBA
  {
    id: "spec-emba-1",
    programSlug: "emba",
    anchorCategory: "Anchor 3 — Executive MBA / Online MBA / Global MBA",
    name: "Executive MBA (EMBA), Online MBA & Global Modular Programs",
    slug: "emba-global-online-modular",
    description:
      "High-value executive programs for working professionals with leadership DNA and flexible modular formats.",
    focusAreas: [
      "Global Executive MBA (INSEAD, Kellogg, Wharton, Booth, LBS, IMD, HEC, Warwick)",
      "Online MBA / Global MBA",
      "Part-time Executive Formats",
      "Weekend Executive Formats",
    ],
    targetDestinations: [
      "USA",
      "UK",
      "France",
      "Switzerland",
      "Singapore",
      "UAE",
      "Germany",
    ],
    durationFormats: ["12 Months", "15 Months", "18 Months", "21 Months"],
    licensingPathways: [],
    contentInvestmentShare: "13%",
    isYearOneAnchor: true,
  },

  // Anchor 4: MBA in Healthcare Management
  {
    id: "spec-mba-2",
    programSlug: "mba",
    anchorCategory: "Anchor 4 — MBA in Healthcare Management",
    name: "MBA in Healthcare Management & Hospital Administration",
    slug: "mba-healthcare-management",
    description:
      "Natural cross-vertical bridge connecting clinical medicine/nursing with modern hospital leadership.",
    focusAreas: [
      "Healthcare Management",
      "Hospital Administration",
      "Health Systems Management",
    ],
    targetDestinations: [
      "UK",
      "USA",
      "Canada",
      "Australia",
      "Germany",
      "Ireland",
      "Singapore",
      "UAE",
    ],
    durationFormats: ["1 Year", "2 Years"],
    licensingPathways: [],
    contentInvestmentShare: "Included in MBA + EMBA 25%",
    isYearOneAnchor: true,
  },

  // Anchor 5: MBBS / Medical Abroad
  {
    id: "spec-mbbs-1",
    programSlug: "mbbs",
    anchorCategory: "Anchor 5 — MBBS / Medical Abroad",
    name: "MBBS & Medical Education Abroad (NMC Approved)",
    slug: "mbbs-medicine-abroad-pathways",
    description:
      "NMC-compliant global medical colleges with structured licensing and residency pathways for Indian aspirants.",
    focusAreas: [
      "MBBS Abroad (Primary Vertical)",
      "Doctor of Medicine (MD)",
      "Bachelor of Dental Surgery (BDS)",
    ],
    targetDestinations: [
      "Georgia",
      "Uzbekistan",
      "Russia",
      "Philippines",
      "Kazakhstan",
      "UK",
      "Nepal",
    ],
    durationFormats: ["5 Years + 1 Year Internship", "6 Years"],
    licensingPathways: [
      "PLAB (UK)",
      "USMLE (USA)",
      "AMC (Australia)",
      "MCCQE (Canada)",
      "NExT (India)",
    ],
    contentInvestmentShare: "20%",
    isYearOneAnchor: true,
  },

  // Anchor 6: Nursing & Allied Health (Career Migration)
  {
    id: "spec-nursing-1",
    programSlug: "nursing",
    anchorCategory: "Anchor 6 — Nursing & Allied Health (Career Migration)",
    name: "BSc Nursing Abroad & Global Career Migration Pathways",
    slug: "nursing-bsc-career-migration",
    description:
      "Targeted career-migration pathway focusing on study, licensing exams, and immediate nursing workforce integration.",
    focusAreas: [
      "BSc Nursing Abroad",
      "Nursing Ausbildung (Germany)",
      "Career Migration Pathways (UK NHS, Ireland HSE, Australia AHPRA, US NCLEX-RN)",
    ],
    targetDestinations: [
      "UK",
      "Ireland",
      "Germany",
      "Australia",
      "USA",
      "Canada",
      "New Zealand",
    ],
    durationFormats: ["3 Years", "4 Years"],
    licensingPathways: [
      "NCLEX-RN (USA)",
      "NMC UK CBT/OSCE",
      "AHPRA (Australia)",
      "OET (Occupational English Test)",
    ],
    contentInvestmentShare: "12%",
    isYearOneAnchor: true,
  },
  {
    id: "spec-nursing-2",
    programSlug: "nursing",
    anchorCategory: "Anchor 6 — Nursing & Allied Health (Career Migration)",
    name: "Allied Health Sciences & Rehabilitation",
    slug: "allied-health-sciences",
    description:
      "High-demand paramedical and allied healthcare clinical professions worldwide.",
    focusAreas: ["Physiotherapy", "Radiology", "Occupational Therapy"],
    targetDestinations: ["UK", "Australia", "Ireland", "Canada", "Germany"],
    durationFormats: ["3 Years", "4 Years"],
    licensingPathways: ["HCPC (UK)", "AHPRA (Australia)"],
    contentInvestmentShare: "12%",
    isYearOneAnchor: true,
  },

  // Anchor 7: Bachelor's Degree Abroad (Focused Niches)
  {
    id: "spec-bachelors-1",
    programSlug: "bachelors",
    anchorCategory: "Anchor 7 — Bachelor's Degree Abroad (Focused Niches)",
    name: "Undergraduate Degree Tracks & High-Value Professional Niches",
    slug: "bachelors-focused-niches",
    description:
      "Selective high-ROI undergraduate degree tracks and specialized vocational leadership niches.",
    focusAreas: [
      "BSc / BA / BBA / BEng at Reputed Universities",
      "Hotel Management Abroad (+75% YoY)",
      "Fashion / Interior / Product Design Abroad",
      "Pilot Training / Aviation Abroad",
      "Culinary Arts (Le Cordon Bleu, ICE, ICMS)",
    ],
    targetDestinations: [
      "UK",
      "USA",
      "Canada",
      "Australia",
      "Switzerland",
      "France",
      "Germany",
      "Ireland",
    ],
    durationFormats: [
      "3 Years (UK/Europe/Australia)",
      "4 Years (USA/Canada)",
    ],
    licensingPathways: [],
    contentInvestmentShare: "3%",
    isYearOneAnchor: true,
  },

  // Anchor 8: Germany Ausbildung (Vocational + Employment)
  {
    id: "spec-ausbildung-1",
    programSlug: "ausbildung",
    anchorCategory:
      "Anchor 8 — Germany Ausbildung (Vocational + Employment)",
    name: "Dual Vocational Training & Guaranteed Employment (Ausbildung)",
    slug: "ausbildung-germany-vocational",
    description:
      "Tuition-free German dual vocational training with monthly stipend (€1,000–€1,400/mo) and direct transition to permanent residency.",
    focusAreas: [
      "Nursing Ausbildung (Pflegefachkraft)",
      "IT Ausbildung (Fachinformatiker)",
      "Mechatronics / Automotive Ausbildung (Kraftfahrzeugmechatroniker)",
      "Hospitality Ausbildung (Hotelfachmann/-frau)",
      "Retail / Business Ausbildung (Kaufmann/-frau)",
    ],
    targetDestinations: ["Germany"],
    durationFormats: ["3 Years (Dual System: 50% Theory + 50% Paid Work)"],
    licensingPathways: [
      "B2 German Certificate (Goethe/Telc)",
      "German State Chamber Examination (IHK/HWK)",
    ],
    contentInvestmentShare: "5%",
    isYearOneAnchor: true,
  },
];

export async function fetchLiveSpecialisations(): Promise<Specialisation[]> {
  try {
    const client = typeof window === "undefined" ? supabaseAdmin : supabase;
    const response = await queryWithTimeout(
      () => client.from("specialisations").select("*"),
      2000,
    );
    if (
      response &&
      !(response as any).error &&
      (response as any).data &&
      (response as any).data.length > 0
    ) {
      return (response as any).data.map((s: any) => ({
        id: s.id,
        programSlug: s.program_slug,
        anchorCategory: s.anchor_category,
        name: s.name,
        slug: s.slug,
        description: s.description || "",
        focusAreas: Array.isArray(s.focus_areas) ? s.focus_areas : [],
        targetDestinations: Array.isArray(s.target_destinations)
          ? s.target_destinations
          : [],
        durationFormats: Array.isArray(s.duration_formats)
          ? s.duration_formats
          : [],
        licensingPathways: Array.isArray(s.licensing_pathways)
          ? s.licensing_pathways
          : [],
        contentInvestmentShare: s.content_investment_share || "",
        isYearOneAnchor: s.is_year_one_anchor ?? true,
      }));
    }
  } catch (err) {
    console.warn("Supabase specialisations fetch error:", err);
  }

  return STATIC_SPECIALISATIONS;
}

export async function getSpecialisationsByProgramSlug(
  programSlug: string,
): Promise<Specialisation[]> {
  const all = await fetchLiveSpecialisations();
  const normalized = programSlug.toLowerCase().trim();
  const canonical = PROGRAM_ALIASES[normalized] || normalized;
  return all.filter(
    (s) =>
      s.programSlug.toLowerCase() === canonical ||
      s.slug.toLowerCase().includes(canonical),
  );
}

