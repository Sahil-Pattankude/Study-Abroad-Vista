import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, firstName, lastName, role, phone, organization, marketingOptIn } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    // Create user via Supabase Admin API:
    // email_confirm: true immediately marks user as confirmed without sending any verification email!
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: email.trim(),
      password: password,
      email_confirm: true,
      user_metadata: {
        name: name || `${firstName || ""} ${lastName || ""}`.trim(),
        first_name: firstName,
        last_name: lastName,
        role: role || "student",
        phone: phone ? `+91${phone}` : "",
        organization: organization || "",
        dpdp_consent: true,
        marketing_opt_in: !!marketingOptIn,
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name,
        role: data.user.user_metadata?.role,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal server error." },
      { status: 500 }
    );
  }
}
