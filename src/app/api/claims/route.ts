import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("university_claims")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase claims fetch error:", error.message);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const claims = (data || []).map((c: any) => ({
      id: c.id,
      universityId: c.university_id,
      universityName: c.university_name,
      applicantName: c.applicant_name,
      officialEmail: c.official_email,
      designation: c.designation || "Admissions Representative",
      proofDocumentUrl: c.proof_document_url,
      status: c.verification_status || "pending",
      createdAt: new Date(c.created_at || Date.now()).toLocaleDateString(),
      userId: c.user_id,
    }));

    return NextResponse.json({ success: true, count: claims.length, claims });
  } catch (err: any) {
    console.error("API /api/claims error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
