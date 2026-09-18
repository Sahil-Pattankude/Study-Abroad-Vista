import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { FEATURED_UNIVERSITIES } from "@/lib/data/masterData";

export async function GET() {
  try {
    const VALID_PROGRAM_ENUMS = new Set([
      "ms",
      "mba",
      "mbbs",
      "bachelors",
      "nursing",
      "ausbildung",
    ]);

    const buildRows = (
      emailField?: "official_email_domain" | "official_email_address",
    ) => {
      return FEATURED_UNIVERSITIES.map((u) => {
        const filteredPrograms = (u.programsOffered || ["ms"]).filter((p) =>
          VALID_PROGRAM_ENUMS.has(p as string),
        );

        // Extract clean domain only (e.g. "admissions@utoronto.ca" -> "utoronto.ca")
        const rawEmailOrDomain =
          u.official_email_domain || u.official_email_address || "";
        const domainOnly = rawEmailOrDomain.includes("@")
          ? rawEmailOrDomain.split("@")[1].toLowerCase().trim()
          : rawEmailOrDomain.toLowerCase().trim();

        const row: Record<string, any> = {
          name: u.name,
          slug: u.slug,
          country_id:
            u.countrySlug ||
            u.country.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          city: u.city,
          ranking_global: u.rankingGlobal,
          ranking_national: u.rankingNational || 1,
          programs_offered:
            filteredPrograms.length > 0 ? filteredPrograms : ["ms"],
          tuition_fee_range_inr: u.tuitionFeeRangeINR,
          ielts_min_score: u.ieltsMinScore || 6.5,
          gre_gmat_required: !!u.greGmatRequired,
          intakes: u.intakes || ["Fall (September)"],
          acceptance_rate: u.acceptanceRate || 30,
          post_study_work_months: u.postStudyWorkMonths || 24,
          featured: !!u.featured,
          claimed_status: "unclaimed",
        };

        if (emailField === "official_email_domain") {
          row.official_email_domain = domainOnly;
        } else if (emailField === "official_email_address") {
          row.official_email_address = domainOnly;
        }

        return row;
      });
    };

    // 1. Primary attempt: write clean domain to official_email_domain
    let rows = buildRows("official_email_domain");
    let result = await supabaseAdmin
      .from("universities")
      .upsert(rows, { onConflict: "slug" })
      .select();

    // 2. Fallback attempt: if official_email_domain column doesn't exist, try official_email_address
    if (
      result.error &&
      result.error.message.includes("official_email_domain")
    ) {
      rows = buildRows("official_email_address");
      result = await supabaseAdmin
        .from("universities")
        .upsert(rows, { onConflict: "slug" })
        .select();
    }

    // 3. Last fallback: upsert without email column if neither is in the schema cache
    if (
      result.error &&
      (result.error.message.includes("official_email_address") ||
        result.error.message.includes("schema cache"))
    ) {
      rows = buildRows();
      result = await supabaseAdmin
        .from("universities")
        .upsert(rows, { onConflict: "slug" })
        .select();
    }

    if (result.error) {
      return NextResponse.json(
        { success: false, error: result.error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully synced ${rows.length} universities into Supabase with clean domain names!`,
      count: result.data?.length || rows.length,
      universities: result.data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message },
      { status: 500 },
    );
  }
}
