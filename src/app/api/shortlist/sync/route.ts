import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * POST /api/shortlist/sync
 * Body: { userId, email, slugs: string[] }
 * Merges cookie shortlist items with any existing shortlists in the Supabase backend.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, email, slugs } = body;

    if (!userId && !email) {
      return NextResponse.json(
        { success: false, error: "userId or email is required" },
        { status: 400 },
      );
    }

    const incomingSlugs: string[] = Array.isArray(slugs)
      ? slugs.filter(Boolean)
      : [];

    let targetUser: any = null;
    if (userId) {
      const { data, error } =
        await supabaseAdmin.auth.admin.getUserById(userId);
      if (error) throw error;
      targetUser = data.user;
    } else if (email) {
      const { data } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 100,
      });
      targetUser = data.users.find(
        (u) => u.email?.toLowerCase() === email.toLowerCase(),
      );
    }

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    const currentShortlists: string[] = Array.isArray(
      targetUser.user_metadata?.shortlists,
    )
      ? targetUser.user_metadata.shortlists
      : [];

    const mergedShortlists = Array.from(
      new Set([...currentShortlists, ...incomingSlugs]),
    );

    await supabaseAdmin.auth.admin.updateUserById(targetUser.id, {
      user_metadata: {
        ...targetUser.user_metadata,
        shortlists: mergedShortlists,
      },
    });

    // Also upsert rows into public.student_shortlists table
    if (mergedShortlists.length > 0) {
      try {
        const rows = mergedShortlists.map((s) => ({
          user_id: targetUser.id,
          user_email: targetUser.email,
          university_slug: s,
        }));
        await supabaseAdmin
          .from("student_shortlists")
          .upsert(rows, { onConflict: "user_email,university_slug" });
      } catch {
        // ignore if table not ready
      }
    }

    return NextResponse.json({
      success: true,
      shortlists: mergedShortlists,
    });
  } catch (error: any) {
    console.error("POST /api/shortlist/sync error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to sync shortlist" },
      { status: 500 },
    );
  }
}
