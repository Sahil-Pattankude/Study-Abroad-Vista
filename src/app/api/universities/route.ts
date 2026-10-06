import { NextResponse } from "next/server";
import { fetchLiveUniversities } from "@/lib/supabase/dataFetchers";
import { supabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country")?.toLowerCase() || "";
    const query =
      searchParams.get("query")?.toLowerCase() ||
      searchParams.get("q")?.toLowerCase() ||
      "";

    let universities = await fetchLiveUniversities();

    if (country) {
      universities = universities.filter(
        (u) =>
          u.countrySlug?.toLowerCase() === country ||
          u.country?.toLowerCase() === country,
      );
    }

    if (query) {
      universities = universities.filter(
        (u) =>
          u.name.toLowerCase().includes(query) ||
          u.city.toLowerCase().includes(query) ||
          u.country.toLowerCase().includes(query),
      );
    }

    return NextResponse.json({
      success: true,
      count: universities.length,
      universities,
    });
  } catch (error: any) {
    console.error("API /api/universities error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch universities",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      slug,
      country_id,
      city,
      ranking_global,
      ranking_national,
      tuition_fee_range_inr,
      ielts_min_score,
      acceptance_rate,
      post_study_work_months,
      living_cost_monthly_inr,
      hero_image,
      badge,
    } = body;

    if (!name || !country_id) {
      return NextResponse.json(
        { success: false, error: "name and country_id are required" },
        { status: 400 },
      );
    }

    const finalSlug = (
      slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-")
    ).trim();

    const { data, error } = await supabaseAdmin
      .from("universities")
      .upsert(
        {
          name: name.trim(),
          slug: finalSlug,
          country_id: country_id.toLowerCase().trim(),
          city: city?.trim() || "Campus City",
          ranking_global: Number(ranking_global) || 120,
          ranking_national: Number(ranking_national) || 12,
          programs_offered: ["ms", "mba", "bachelors"],
          tuition_fee_range_inr:
            tuition_fee_range_inr?.trim() || "₹14 - 28 Lakhs / yr",
          ielts_min_score: Number(ielts_min_score) || 6.5,
          gre_gmat_required: false,
          intakes: ["Fall (Sep)", "Spring (Jan)"],
          acceptance_rate: Number(acceptance_rate) || 35,
          nmc_compliant: false,
          post_study_work_months: Number(post_study_work_months) || 24,
          claimed_status: "verified",
          featured: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "slug" },
      )
      .select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "University saved to database successfully",
      university: data?.[0],
    });
  } catch (error: any) {
    console.error("POST /api/universities error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to save university" },
      { status: 500 },
    );
  }
}
