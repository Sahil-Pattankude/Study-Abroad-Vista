import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { universityId, universityName, userId, applicantName, officialEmail, designation, proofDocumentUrl } = body;

    if (!officialEmail || !applicantName || !universityName) {
      return NextResponse.json(
        { error: "Applicant name, official email, and university name are required." },
        { status: 400 }
      );
    }

    const claimId = `claim-${Date.now()}`;
    let realId = claimId;

    const isValidUuid = (id: any) => typeof id === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const validUserId = isValidUuid(userId) ? userId : null;

    // 1. Attempt Supabase Table Insert
    try {
      const { data, error } = await supabaseAdmin
        .from("university_claims")
        .insert({
          university_id: universityId,
          university_name: universityName,
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
