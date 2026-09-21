import { supabaseAdmin } from "@/lib/supabase/server";

// Known official domain map for domain verification fallback
export const DOMAIN_MAP: Record<string, string> = {
  "georgia-tech": "gatech.edu",
  gatech: "gatech.edu",
  "technical-university-of-munich": "tum.de",
  tum: "tum.de",
  "university-of-stanford": "stanford.edu",
  "stanford-university": "stanford.edu",
  stanford: "stanford.edu",
  "university-of-oxford": "ox.ac.uk",
  oxford: "ox.ac.uk",
  "university-of-melbourne": "unimelb.edu.au",
  unimelb: "unimelb.edu.au",
  "university-of-toronto": "utoronto.ca",
  utoronto: "utoronto.ca",
  "university-of-manchester": "manchester.ac.uk",
  manchester: "manchester.ac.uk",
  "trinity-college-dublin": "tcd.ie",
  tcd: "tcd.ie",
  "tashkent-medical-academy": "tma.uz",
  tashkent: "tma.uz",
  "sorbonne-university": "sorbonne-universite.fr",
  sorbonne: "sorbonne-universite.fr",
  "hec-paris": "hec.fr",
  "polytechnique-paris": "polytechnique.edu",
  polytechnique: "polytechnique.edu",
  "essec-business-school": "essec.edu",
  essec: "essec.edu",
  "psl-university": "psl.eu",
  psl: "psl.eu",
  "tu-delft": "tudelft.nl",
  tudelft: "tudelft.nl",
  "sapienza-university-of-rome": "uniroma1.it",
  sapienza: "uniroma1.it",
  "national-university-of-singapore": "nus.edu.sg",
  nus: "nus.edu.sg",
  "university-of-auckland": "auckland.ac.nz",
  auckland: "auckland.ac.nz",
};

function normalizeDomain(raw: string): string {
  return raw.includes("@")
    ? raw.split("@")[1].toLowerCase().trim()
    : raw.toLowerCase().trim();
}

/**
 * Resolves the institutional domain a claim's email must match:
 * Supabase first, then masterData, then the static DOMAIN_MAP.
 * Returns "" when the university's domain is unknown.
 */
export async function resolveExpectedDomain(
  universityId: string,
  universityName: string,
): Promise<string> {
  const uniKey = (universityId || universityName || "").toLowerCase().trim();

  try {
    const { data: uniData } = await supabaseAdmin
      .from("universities")
      .select("*")
      .or(
        `slug.eq.${universityId},id.eq.${universityId},name.ilike.%${universityName}%`,
      )
      .maybeSingle();

    if (uniData) {
      const raw =
        uniData.official_email_domain || uniData.official_email_address || "";
      const domain = normalizeDomain(raw);
      if (domain) return domain;
    }
  } catch {
    // ignore db lookup failure, fall through to static sources
  }

  for (const [key, domain] of Object.entries(DOMAIN_MAP)) {
    if (uniKey.includes(key)) return domain;
  }

  return "";
}

/**
 * Returns an error message when the applicant's email domain does not
 * belong to the institution, or null when the check passes (including
 * when the expected domain is unknown).
 */
export async function checkClaimEmailDomain(
  universityId: string,
  universityName: string,
  officialEmail: string,
): Promise<string | null> {
  const expectedDomain = await resolveExpectedDomain(
    universityId,
    universityName,
  );
  const applicantDomain = (officialEmail.split("@")[1] || "")
    .toLowerCase()
    .trim();

  if (
    expectedDomain &&
    applicantDomain &&
    applicantDomain !== expectedDomain &&
    !applicantDomain.endsWith("." + expectedDomain)
  ) {
    return `Verification Failed: Your email domain (@${applicantDomain}) does not match the official institutional domain (@${expectedDomain}) for ${universityName}. Please use your official university email.`;
  }

  return null;
}
