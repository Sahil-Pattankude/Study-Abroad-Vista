import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { claimId, universityId, userId, action } = body;

    if (!claimId || !action) {
      return NextResponse.json(
        {
          error: "Claim ID and action ('approved' | 'rejected') are required.",
        },
        { status: 400 },
      );
    }

    const newStatus = action === "approved" ? "approved" : "rejected";

    const isValidUuid = (id: any) =>
      typeof id === "string" &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        id,
      );

    const validUserId = isValidUuid(userId) ? userId : null;

    // Known slug alias mapping
    const SLUG_ALIAS_MAP: Record<string, string> = {
      utoronto: "university-of-toronto",
      tum: "technical-university-of-munich",
      gatech: "georgia-tech",
      oxford: "university-of-oxford",
      stanford: "stanford-university",
      manchester: "university-of-manchester",
      tcd: "trinity-college-dublin",
      unimelb: "university-of-melbourne",
      tashkent: "tashkent-medical-academy",
      sorbonne: "sorbonne-university",
      hec: "hec-paris",
      polytechnique: "polytechnique-paris",
      essec: "essec-business-school",
      psl: "psl-university",
      tudelft: "tu-delft",
      sapienza: "sapienza-university-of-rome",
      nus: "national-university-of-singapore",
      auckland: "university-of-auckland",
    };

    // 1. Fetch existing claim record if available
    let claimRecord: any = null;
    try {
      if (isValidUuid(claimId)) {
        const { data } = await supabaseAdmin
          .from("university_claims")
          .select("*")
          .eq("id", claimId)
          .maybeSingle();
        claimRecord = data;
      }
    } catch (e) {
      console.warn("Could not fetch claim record:", e);
    }

    // 2. Update claim status in Supabase university_claims table
    try {
      if (isValidUuid(claimId)) {
        await supabaseAdmin
          .from("university_claims")
          .update({
            verification_status: newStatus,
            reviewed_at: new Date().toISOString(),
          })
          .eq("id", claimId);
      } else if (universityId) {
        await supabaseAdmin
          .from("university_claims")
          .update({
            verification_status: newStatus,
            reviewed_at: new Date().toISOString(),
          })
          .eq("university_id", universityId);
      }

      // 3. If approved, link university ownership in universities table
      if (newStatus === "approved") {
        const rawUniId = (universityId || claimRecord?.university_id || "")
          .toLowerCase()
          .trim();
        const rawUniName = (
          body.universityName ||
          claimRecord?.university_name ||
          ""
        ).trim();
        const rawEmail = (
          claimRecord?.official_email ||
          body.officialEmail ||
          ""
        )
          .trim()
          .toLowerCase();
        const emailDomain = rawEmail.includes("@")
          ? rawEmail.split("@")[1].trim()
          : "";

        const normalizedSlug = SLUG_ALIAS_MAP[rawUniId] || rawUniId;
        const targetUserId =
          validUserId ||
          (isValidUuid(claimRecord?.user_id) ? claimRecord.user_id : null);

        const updateData: Record<string, any> = {
          claimed_status: "verified",
          updated_at: new Date().toISOString(),
        };
        if (targetUserId) {
          updateData.claimed_by_user_id = targetUserId;
        }

        // Strategy A: Update by normalized slug
        if (normalizedSlug) {
          const { data, error } = await supabaseAdmin
            .from("universities")
            .update(updateData)
            .eq("slug", normalizedSlug)
            .select();
          console.log(
            "Approval update by slug:",
            normalizedSlug,
            "Result:",
            data?.length,
            error?.message,
          );
        }

        // Strategy B: Update by alias/raw id
        if (rawUniId && rawUniId !== normalizedSlug) {
          await supabaseAdmin
            .from("universities")
            .update(updateData)
            .eq("slug", rawUniId);
        }

        // Strategy C: Update by official email domain
        if (emailDomain) {
          await supabaseAdmin
            .from("universities")
            .update(updateData)
            .eq("official_email_domain", emailDomain);
        }

        // Strategy D: Update by name (ilike)
        if (rawUniName) {
          await supabaseAdmin
            .from("universities")
            .update(updateData)
            .ilike("name", `%${rawUniName}%`);
        }

        // If user ID provided, upgrade user metadata role to university
        if (targetUserId) {
          await supabaseAdmin.auth.admin.updateUserById(targetUserId, {
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
      { status: 500 },
    );
  }
}
