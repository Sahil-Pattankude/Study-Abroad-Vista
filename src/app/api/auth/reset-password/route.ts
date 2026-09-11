import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long." },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // 1. List users to find target user ID
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) {
      return NextResponse.json({ error: listError.message }, { status: 400 });
    }

    const targetUser = usersData.users.find(
      (u) => u.email?.toLowerCase() === trimmedEmail
    );

    if (!targetUser) {
      return NextResponse.json(
        { error: "No account found matching this email address." },
        { status: 404 }
      );
    }

    // 2. Update user's password directly
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      targetUser.id,
      { password: password }
    );

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Internal server error." },
      { status: 500 }
    );
  }
}
