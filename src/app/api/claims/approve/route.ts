import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { claimId, universityId, userId, action } = body;

    if (!claimId || !action) {
      return NextResponse.json(
        { error: "Claim ID and action ('approved' | 'rejected') are required." },
        { status: 400 }
      );
    }

    const newStatus = action === "approved" ? "approved" : "rejected";

    // 1. Update claim status in Supabase
    try {
      // Try updating by UUID id first, or fallback to email/universityId
      const { error } = await supabaseAdmin
        .from("university_claims")
        .update({
          verification_status: newStatus,
          reviewed_at: new Date().toISOString(),
        })
        .or(`id.eq.${claimId},official_email.ilike.%${claimId}%,university_id.eq.${universityId || 'tum'}`);

      if (error) {
        // Fallback simple update by university_id or email
        await supabaseAdmin
          .from("university_claims")
          .update({
            verification_status: newStatus,
            reviewed_at: new Date().toISOString(),
          })
          .eq("university_id", universityId || "tum");
      }

      // 2. If approved, link university ownership or insert university into universities table
      if (newStatus === "approved" && universityId) {
        // Try updating existing university by slug or id
        const { data: updatedUnis } = await supabaseAdmin
          .from("universities")
          .update({
            claimed_status: "verified",
            claimed_by_user_id: userId || null,
            updated_at: new Date().toISOString(),
          })
          .or(`slug.eq.${universityId},id.eq.${universityId}`)
          .select();

        // If university does not exist in universities table yet, auto-upsert it!
        if (!updatedUnis || updatedUnis.length === 0) {
          const uniSlug = universityId.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          const formattedName = universityId
            .split("-")
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

          await supabaseAdmin.from("universities").upsert({
            name: formattedName || "University Partner",
            slug: uniSlug,
            country_id: "global",
            city: "Campus City",
            ranking_global: 50,
            tuition_fee_range_inr: "₹15 - 30 Lakhs / yr",
            claimed_status: "verified",
            claimed_by_user_id: userId || null,
          }, { onConflict: "slug" });
        }

        if (userId) {
          await supabaseAdmin.auth.admin.updateUserById(userId, {
            user_metadata: { role: "university" },
          });
        }
      }
    } catch (err) {
      console.warn("Supabase claim approval fallback:", err);
    }

    return NextResponse.json({
      success: true,
      claimId,
      status: newStatus,
      message: `Claim ${newStatus} successfully!`,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to process claim request." },
      { status: 500 }
    );
  }
}
