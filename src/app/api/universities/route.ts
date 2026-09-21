import { NextResponse } from "next/server";
import { fetchLiveUniversities } from "@/lib/supabase/dataFetchers";

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
