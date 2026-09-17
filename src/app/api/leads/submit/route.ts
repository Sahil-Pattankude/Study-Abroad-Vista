import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/server";

const leadSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  countryTarget: z.string().optional(),
  programTarget: z.string().min(1, "Please select a study stream"),
  highestEducation: z.string().optional(),
  budgetRangeINR: z.string().optional(),
  intakeYear: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = leadSchema.parse(body);

    // Attempt to store in Supabase PostgreSQL
    let dbRecord = null;
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
        const payload = {
          full_name: validated.fullName,
          email: validated.email,
          phone: validated.phone,
          country_target: validated.countryTarget || "germany",
          program_target: validated.programTarget || "ms",
          highest_education: validated.highestEducation || null,
          budget_range_inr: validated.budgetRangeINR || "15-25Lakhs",
          intake_year: validated.intakeYear || "Fall 2026",
          status: "raw",
        };

        const { data, error } = await supabaseAdmin.from("leads").insert([payload]).select();

        if (error) {
          console.error("Supabase admin insert error:", error);
          // Fallback to client if admin key issue
          const { supabase } = await import("@/lib/supabase/client");
          const { data: fbData, error: fbErr } = await supabase.from("leads").insert([payload]).select();
          if (fbErr) {
            console.error("Supabase fallback insert error:", fbErr);
          } else if (fbData && fbData.length > 0) {
            dbRecord = fbData[0];
          }
        } else if (data && data.length > 0) {
          dbRecord = data[0];
        }
      }
    } catch (dbErr) {
      console.warn("Database storage exception:", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Lead submitted successfully. An admission counsellor will reach out within 24 hours.",
      lead: validated,
      dbData: dbRecord,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to process inquiry" }, { status: 500 });
  }
}
