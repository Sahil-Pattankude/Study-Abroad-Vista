import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) {
      console.error("Supabase admin fetch leads error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      leads: data || [],
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Failed to fetch leads" }, { status: 500 });
  }
}
