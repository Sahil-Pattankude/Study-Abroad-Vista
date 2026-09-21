import { NextResponse } from "next/server";
import {
  fetchLiveCountries,
  fetchLivePrograms,
  fetchLiveUniversities,
} from "@/lib/supabase/dataFetchers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [countries, programs, universities] = await Promise.all([
      fetchLiveCountries(),
      fetchLivePrograms(),
      fetchLiveUniversities(),
    ]);

    return NextResponse.json({
      success: true,
      countries,
      programs,
      universities,
    });
  } catch (error: any) {
    console.error("API /api/catalog error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch catalog data",
      },
      { status: 500 },
    );
  }
}
