import { supabase } from "./client";
import { supabaseAdmin } from "./server";
import { COUNTRIES, FEATURED_UNIVERSITIES } from "@/lib/data/masterData";
import { Country, University, CourseItem } from "@/types";
import {
  getSanityUniversities,
  getSanityCountries,
} from "@/lib/sanity/fetchers";

export async function fetchLiveCountries(): Promise<Country[]> {
  let list: Country[] = [];

  // 1. Fetch Supabase Countries
  try {
    const client = typeof window === "undefined" ? supabaseAdmin : supabase;
    const { data, error } = await client
      .from("countries")
      .select("*")
      .eq("is_active", true);
    if (!error && data && data.length > 0) {
      list = data.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        code: c.code,
        tier: c.tier,
        flagEmoji: c.flag_emoji || "🌐",
        currency: c.currency,
        currencySymbol: c.currency_symbol,
        exchangeRateToINR: Number(c.exchange_rate_inr) || 85.0,
        popularPrograms: c.popular_programs || ["ms", "mba"],
        avgTuitionINR: c.avg_tuition_inr || "₹15 - 30 Lakhs / yr",
        avgLivingCostINR: c.avg_living_cost_inr || "₹8 - 12 Lakhs / yr",
        postStudyWorkVisa: c.post_study_work_visa || "1 to 2 Years",
        topIntakes: c.top_intakes || ["Fall (Sep)", "Spring (Jan)"],
        heroTagline: c.hero_tagline || `Study in ${c.name}`,
        overview: c.overview || `Overview for ${c.name}`,
        safetyRating: Number(c.safety_rating) || 4.5,
      }));
    }
  } catch (err) {
    console.warn("Supabase countries fetch fallback:", err);
  }

  if (list.length === 0) {
    list = [...COUNTRIES];
  }

  // 2. Merge Sanity CMS Countries (Prepend / update by slug)
  try {
    const sanityCountries = await getSanityCountries();
    if (sanityCountries && sanityCountries.length > 0) {
      const map = new Map<string, Country>();

      sanityCountries.forEach((sc: any) => {
        const slugStr =
          typeof sc.slug === "string" ? sc.slug : sc.slug?.current;
        if (slugStr) {
          map.set(slugStr, {
            id: sc._id,
            name: sc.name,
            slug: slugStr,
            code: sc.code || "GLOBAL",
            tier: sc.tier || "Tier 1",
            flagEmoji: sc.flagEmoji || "🌐",
            currency: sc.currency || "USD",
            currencySymbol: sc.currencySymbol || "$",
            exchangeRateToINR: Number(sc.exchangeRateToINR) || 85.0,
            popularPrograms: ["ms", "mba"],
            avgTuitionINR: sc.avgTuitionINR || "₹15 - 30 Lakhs / yr",
            avgLivingCostINR: sc.avgLivingCostINR || "₹8 - 12 Lakhs / yr",
            postStudyWorkVisa: sc.postStudyWorkVisa || "1 to 3 Years",
            topIntakes: ["Fall (Sep)", "Spring (Jan)"],
            heroTagline: sc.heroTagline || `Study in ${sc.name}`,
            overview: sc.overview || `Overview for ${sc.name}`,
            safetyRating: Number(sc.safetyRating) || 4.5,
          });
        }
      });

      // Append existing countries if not already covered by Sanity
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
  const uniMap = new Map<string, University>();

  // 1. Static Master Data Fallback Base
  FEATURED_UNIVERSITIES.forEach((u) => {
    uniMap.set(u.slug, u);
  });

  // 2. Fetch Supabase Universities & Merge
  try {
    const client = typeof window === "undefined" ? supabaseAdmin : supabase;
    const { data, error } = await client.from("universities").select("*");
    if (!error && data && data.length > 0) {
      data.forEach((u: any) => {
        if (u.slug) {
          uniMap.set(u.slug, {
            id: u.id || u.slug,
            name: u.name,
            slug: u.slug,
            country: u.country_id?.toUpperCase() || "Global",
            countrySlug: u.country_id || "global",
            city: u.city,
            rankingGlobal: u.ranking_global || 100,
            rankingNational: u.ranking_national || 10,
            programsOffered: u.programs_offered || ["ms", "mba"],
            tuitionFeeRangeINR:
              u.tuition_fee_range_inr || "₹15 - 30 Lakhs / yr",
            ieltsMinScore: Number(u.ielts_min_score) || 6.5,
            greGmatRequired: u.gre_gmat_required || false,
            intakes: u.intakes || ["Fall (Sep)", "Spring (Jan)"],
            acceptanceRate: u.acceptance_rate || 30,
            nmcCompliant: u.nmc_compliant || false,
            postStudyWorkMonths: u.post_study_work_months || 24,
            featured: u.featured || true,
            claimed_status: u.claimed_status || "unclaimed",
          });
        }
      });
    }
  } catch (err) {
    console.warn("Supabase universities fetch fallback to masterData:", err);
  }

  // 3. Merge Sanity CMS Universities
  try {
    const sanityUnis = await getSanityUniversities();
    if (sanityUnis && sanityUnis.length > 0) {
      sanityUnis.forEach((su: any) => {
        const slugStr =
          typeof su.slug === "string" ? su.slug : su.slug?.current;
        if (slugStr) {
          uniMap.set(slugStr, {
            id: su._id,
            name: su.name,
            slug: slugStr,
            country: su.country ? su.country.toUpperCase() : "Global",
            countrySlug: su.country || "global",
            city: su.city || "Campus City",
            rankingGlobal: su.rankingGlobal || 100,
            rankingNational: su.rankingNational || 1,
            programsOffered: ["ms", "mba"],
            tuitionFeeRangeINR: su.tuitionFeeRangeINR || "₹15 - 30 Lakhs / yr",
            ieltsMinScore: Number(su.ieltsMinScore) || 6.5,
            greGmatRequired: su.greGmatRequired || false,
            intakes: ["Fall (Aug/Sep)", "Spring (Jan)"],
            acceptanceRate: su.acceptanceRate || 30,
            postStudyWorkMonths: su.postStudyWorkMonths || 24,
            featured: su.featured ?? true,
          });
        }
      });
    }
  } catch (err) {
    console.warn("Sanity universities fetch fallback:", err);
  }

  return Array.from(uniMap.values());
}

export interface ClaimItem {
  id: string;
  universityId: string;
  universityName: string;
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
      const { data, error } = await supabaseAdmin
        .from("university_claims")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((c: any) => ({
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

  return [
    {
      id: "claim-101",
      universityId: "tum",
      universityName: "Technical University of Munich (TUM)",
      applicantName: "Dr. Sahil Pattankude",
      officialEmail: "admissions@tum.de",
      designation: "Director of International Admissions",
      status: "approved",
      createdAt: "Just now",
    },
  ];
}

export async function fetchLiveCourses(): Promise<CourseItem[]> {
  const courseMap = new Map<string, CourseItem>();

  // 0. Seed explicit base courses
  const baseCourses: CourseItem[] = [
    {
      id: "tum-data-eng",
      slug: "msc-data-engineering",
      name: "M.Sc. in Data Engineering and Analytics",
      universityName: "Technical University of Munich (TUM)",
      universitySlug: "technical-university-of-munich",
      city: "Munich",
      country: "Germany",
      flagEmoji: "🇩🇪",
      level: "Postgraduate (Master's)",
      duration: "2 Years (4 Semesters)",
      tuitionFeeINR: "€0 (Public University)",
      tuitionFeeLocal: "€0 / yr (Semester Fee ~€150)",
      ieltsMinScore: 6.5,
      greGmatRequired: false,
      postStudyWorkMonths: 18,
      intakeDeadline: "May 31, 2026 (Winter Intake)",
      roiScore: 98,
      coreModules: [
        "Distributed Systems",
        "Big Data Analytics",
        "Machine Learning",
        "Database Internals",
        "Cloud Infrastructure",
      ],
    },
    {
      id: "tum-robotics",
      slug: "msc-robotics-cognition",
      name: "M.Sc. in Robotics, Cognition, Intelligence",
      universityName: "Technical University of Munich (TUM)",
      universitySlug: "technical-university-of-munich",
      city: "Munich",
      country: "Germany",
      flagEmoji: "🇩🇪",
      level: "Postgraduate (Master's)",
      duration: "2 Years (4 Semesters)",
      tuitionFeeINR: "€0 (Public University)",
      tuitionFeeLocal: "€0 / yr (Semester Fee ~€150)",
      ieltsMinScore: 6.5,
      greGmatRequired: false,
      postStudyWorkMonths: 18,
      intakeDeadline: "May 31, 2026 (Winter Intake)",
      roiScore: 96,
      coreModules: [
        "Autonomous Systems",
        "Computer Vision",
        "Cognitive Systems",
        "Control Theory",
        "Embedded Systems",
      ],
    },
    {
      id: "stanford-cs",
      slug: "ms-computer-science",
      name: "MS in Computer Science",
      universityName: "Stanford University",
      universitySlug: "stanford-university",
      city: "Stanford, CA",
      country: "USA",
      flagEmoji: "🇺🇸",
      level: "Postgraduate (Master's)",
      duration: "2 Years",
      tuitionFeeINR: "₹48 - 58 Lakhs / yr",
      tuitionFeeLocal: "$58,746 / yr",
      ieltsMinScore: 7.5,
      greGmatRequired: true,
      postStudyWorkMonths: 36,
      intakeDeadline: "December 15, 2025 (Fall Intake)",
      roiScore: 99,
      coreModules: [
        "Artificial Intelligence",
        "Deep Learning",
        "Systems Architecture",
        "Cybersecurity",
        "Quantum Computing",
      ],
    },
    {
      id: "oxford-cs",
      slug: "msc-advanced-cs",
      name: "M.Sc. in Advanced Computer Science",
      universityName: "University of Oxford",
      universitySlug: "university-of-oxford",
      city: "Oxford",
      country: "United Kingdom",
      flagEmoji: "🇬🇧",
      level: "Postgraduate (Master's)",
      duration: "1 Year (Full-time)",
      tuitionFeeINR: "₹34 - 42 Lakhs / yr",
      tuitionFeeLocal: "£33,970 / yr",
      ieltsMinScore: 7.5,
      greGmatRequired: false,
      postStudyWorkMonths: 24,
      intakeDeadline: "January 8, 2026 (Fall Intake)",
      roiScore: 97,
      coreModules: [
        "Advanced Machine Learning",
        "Quantum Information",
        "Formal Verification",
        "Computational Complexity",
        "Algorithms",
      ],
    },
    {
      id: "tum-mgmt",
      slug: "msc-management-technology",
      name: "M.Sc. in Management & Technology",
      universityName: "Technical University of Munich (TUM)",
      universitySlug: "technical-university-of-munich",
      city: "Munich",
      country: "Germany",
      flagEmoji: "🇩🇪",
      level: "Postgraduate (Master's)",
      duration: "2 Years (4 Semesters)",
      tuitionFeeINR: "€0 (Public University)",
      tuitionFeeLocal: "€0 / yr (Semester Fee ~€150)",
      ieltsMinScore: 6.5,
      greGmatRequired: false,
      postStudyWorkMonths: 18,
      intakeDeadline: "May 31, 2026 (Winter Intake)",
      roiScore: 94,
      coreModules: [
        "Technology Strategy",
        "Corporate Finance",
        "Innovation Management",
        "Entrepreneurship",
        "Digital Transformation",
      ],
    },
  ];

  baseCourses.forEach((c) => {
    courseMap.set(c.slug, c);
    courseMap.set(c.id, c);
  });

  // 1. Fetch live universities from Supabase / CMS / masterData
  const universities = await fetchLiveUniversities();

  // Flag map for quick lookup
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

  // 2. Build course catalog dynamically from fetched universities
  universities.forEach((u) => {
    const countryFlag = flagMap[u.countrySlug?.toLowerCase() || ""] || "🌐";

    u.programsOffered.forEach((prog) => {
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
        programTitle = `${prog.toUpperCase()} Program`;
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

  // 3. Direct fetch from Supabase `courses` table if user has added custom course rows
  try {
    const client = typeof window === "undefined" ? supabaseAdmin : supabase;
    const { data, error } = await client.from("courses").select("*");
    if (!error && data && data.length > 0) {
      data.forEach((c: any) => {
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
