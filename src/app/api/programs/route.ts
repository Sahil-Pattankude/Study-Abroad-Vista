import { NextResponse } from "next/server";
import { fetchLivePrograms } from "@/lib/supabase/dataFetchers";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const programs = await fetchLivePrograms();
    return NextResponse.json({
      success: true,
      count: programs.length,
      programs,
    });
  } catch (error: any) {
    console.error("API /api/programs error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch programs" },
      { status: 500 },
    );
  }
}
