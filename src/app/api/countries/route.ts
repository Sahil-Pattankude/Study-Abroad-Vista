import { NextResponse } from "next/server";
import { fetchLiveCountries } from "@/lib/supabase/dataFetchers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const countries = await fetchLiveCountries();
    return NextResponse.json({
      success: true,
      count: countries.length,
      countries,
    });
  } catch (error: any) {
    console.error("API /api/countries error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch countries" },
      { status: 500 },
    );
  }
}
