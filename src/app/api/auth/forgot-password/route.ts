import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // 1. Generate password recovery link via Supabase Admin
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: "recovery",
      email: trimmedEmail,
      options: {
        redirectTo: `${origin}/reset-password?email=${encodeURIComponent(trimmedEmail)}`,
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message || "Unable to find an account with that email." },
        { status: 400 }
      );
    }

    const actionLink = data.properties?.action_link || "";
    const emailOtp = data.properties?.email_otp || "";

    return NextResponse.json({
      success: true,
      email: trimmedEmail,
      actionLink,
      emailOtp,
      directResetUrl: `/reset-password?email=${encodeURIComponent(trimmedEmail)}`,
      message: "Password reset link generated successfully.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal server error." },
      { status: 500 }
    );
  }
}
