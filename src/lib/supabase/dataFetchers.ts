import { supabase } from "./client";
import { supabaseAdmin } from "./server";
import { Country, University, CourseItem, Program } from "@/types";
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
  let list: Country[] = [];

  // 1. Fetch Supabase Countries directly (no static masterData fallback)
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
  const uniMap = new Map<string, University>();

  // 1. Fetch Supabase Universities directly (no static masterData fallback)
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
