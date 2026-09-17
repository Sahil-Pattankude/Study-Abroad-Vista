import { NextResponse } from "next/server";
import { fetchLiveUniversities, fetchLiveCourses } from "@/lib/supabase/dataFetchers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.toLowerCase() || searchParams.get("q")?.toLowerCase() || "";
    const country = searchParams.get("country")?.toLowerCase() || "";

    const courses = await fetchLiveCourses();

    let filtered = courses;
    if (query) {
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          c.universityName.toLowerCase().includes(query) ||
          c.country.toLowerCase().includes(query) ||
          c.level.toLowerCase().includes(query)
      );
    }

    if (country) {
      filtered = filtered.filter((c) => c.country.toLowerCase().includes(country));
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      courses: filtered,
    });
  } catch (error: any) {
    console.error("API /api/courses error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
