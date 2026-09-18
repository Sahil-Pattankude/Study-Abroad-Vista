import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { FEATURED_UNIVERSITIES } from "@/lib/data/masterData";

// Known official domain map for domain verification fallback
const DOMAIN_MAP: Record<string, string> = {
  "georgia-tech": "gatech.edu",
  "gatech": "gatech.edu",
  "technical-university-of-munich": "tum.de",
  "tum": "tum.de",
  "university-of-stanford": "stanford.edu",
  "stanford-university": "stanford.edu",
  "stanford": "stanford.edu",
  "university-of-oxford": "ox.ac.uk",
  "oxford": "ox.ac.uk",
  "university-of-melbourne": "unimelb.edu.au",
  "unimelb": "unimelb.edu.au",
  "university-of-toronto": "utoronto.ca",
  "utoronto": "utoronto.ca",
  "university-of-manchester": "manchester.ac.uk",
  "manchester": "manchester.ac.uk",
  "trinity-college-dublin": "tcd.ie",
  "tcd": "tcd.ie",
  "tashkent-medical-academy": "tma.uz",
  "tashkent": "tma.uz",
  "sorbonne-university": "sorbonne-universite.fr",
  "sorbonne": "sorbonne-universite.fr",
  "hec-paris": "hec.fr",
  "polytechnique-paris": "polytechnique.edu",
  "polytechnique": "polytechnique.edu",
  "essec-business-school": "essec.edu",
  "essec": "essec.edu",
  "psl-university": "psl.eu",
  "psl": "psl.eu",
  "tu-delft": "tudelft.nl",
  "tudelft": "tudelft.nl",
  "sapienza-university-of-rome": "uniroma1.it",
  "sapienza": "uniroma1.it",
  "national-university-of-singapore": "nus.edu.sg",
  "nus": "nus.edu.sg",
  "university-of-auckland": "auckland.ac.nz",
  "auckland": "auckland.ac.nz",
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { universityId, universityName, countryId, countrySlug, countryName, userId, applicantName, officialEmail, designation, proofDocumentUrl } = body;

    if (!officialEmail || !applicantName || !universityName) {
      return NextResponse.json(
        { error: "Applicant name, official email, and university name are required." },
        { status: 400 }
      );
    }

    // 0. Verify claim official email against university's official_email_address / domain
    let registeredOfficialEmail = "";
    const uniKey = (universityId || universityName || "").toLowerCase().trim();

    // Query Supabase for registered official_email_address
    try {
      const { data: uniData } = await supabaseAdmin
        .from("universities")
        .select("official_email_address, slug, name")
        .or(`slug.eq.${universityId},id.eq.${universityId},name.ilike.%${universityName}%`)
        .maybeSingle();

      if (uniData && uniData.official_email_address) {
        registeredOfficialEmail = uniData.official_email_address;
      }
    } catch {
      // ignore db lookup failure
    }

    // Fallback to FEATURED_UNIVERSITIES in masterData
    if (!registeredOfficialEmail) {
      const matchedUni = FEATURED_UNIVERSITIES.find(
        u => u.id === universityId || u.slug === universityId || u.name.toLowerCase().includes(universityName.toLowerCase())
      );
      if (matchedUni && matchedUni.official_email_address) {
        registeredOfficialEmail = matchedUni.official_email_address;
      }
    }

    // Extract domains
    const applicantDomain = (officialEmail.split("@")[1] || "").toLowerCase().trim();
    let expectedDomain = (registeredOfficialEmail.split("@")[1] || "").toLowerCase().trim();

    if (!expectedDomain) {
      // Check DOMAIN_MAP
      for (const [key, domain] of Object.entries(DOMAIN_MAP)) {
        if (uniKey.includes(key)) {
          expectedDomain = domain;
          break;
        }
      }
    }

    // Perform domain verification check if expectedDomain is known
    if (expectedDomain && applicantDomain && applicantDomain !== expectedDomain && !applicantDomain.endsWith("." + expectedDomain)) {
      return NextResponse.json(
        { 
          error: `Verification Failed: Your email domain (@${applicantDomain}) does not match the official institutional domain (@${expectedDomain}) for ${universityName}. Please use your official university email.` 
        },
        { status: 400 }
      );
    }

    const claimId = `claim-${Date.now()}`;
    let realId = claimId;
    const finalCountryId = countryId || countrySlug || "global";

    const isValidUuid = (id: any) => typeof id === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const validUserId = isValidUuid(userId) ? userId : null;

    // 1. Attempt Supabase Table Insert
    try {
      const { data, error } = await supabaseAdmin
        .from("university_claims")
        .insert({
          university_id: universityId,
          university_name: universityName,
          country_id: finalCountryId,
          user_id: validUserId,
          applicant_name: applicantName,
          official_email: officialEmail,
          designation: designation || "Admissions Representative",
          proof_document_url: proofDocumentUrl || "",
          verification_status: "pending",
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (data && data.id) {
        realId = data.id;
      }
      if (error) {
        console.warn("Supabase claims insert fallback:", error.message);
      }
    } catch (err) {
      console.warn("Supabase claims table error:", err);
    }

    return NextResponse.json({
      success: true,
      claim: {
        id: realId,
        universityName,
        applicantName,
        officialEmail,
        status: "pending",
        message: "Claim request submitted successfully. Admin review pending in /admin queue.",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to submit claim request." },
      { status: 500 }
    );
  }
}
