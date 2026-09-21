import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  try {
    const { data: currentUnis, error } = await supabaseAdmin
      .from("universities")
      .select("id, name, slug, country_id, city, ranking_global")
      .limit(100);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Universities are synced directly with live database.",
      total: currentUnis?.length || 0,
      universities: currentUnis,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 },
    );
  }
}
