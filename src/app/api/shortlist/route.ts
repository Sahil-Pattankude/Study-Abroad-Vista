import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/shortlist?userId=... or ?email=...
 * Returns the list of shortlisted university slugs for a user from Supabase backend.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");

    if (!userId && !email) {
      return NextResponse.json(
        { success: false, error: "userId or email is required" },
        { status: 400 },
      );
    }

    let user: any = null;
    if (userId) {
      const { data, error } =
        await supabaseAdmin.auth.admin.getUserById(userId);
      if (error) throw error;
      user = data.user;
    } else if (email) {
      const { data } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 100,
      });
      user = data.users.find(
        (u) => u.email?.toLowerCase() === email.toLowerCase(),
      );
    }

    // Try reading from student_shortlists table first
    if (user?.email) {
      try {
        const { data: tableData } = await supabaseAdmin
          .from("student_shortlists")
          .select("university_slug")
          .eq("user_email", user.email);

        if (tableData && tableData.length > 0) {
          const slugs = tableData.map((r: any) => r.university_slug);
          return NextResponse.json({
            success: true,
            shortlists: slugs,
          });
        }
      } catch {
        // fallback to user_metadata
      }
    }

    const shortlists: string[] = Array.isArray(user?.user_metadata?.shortlists)
      ? user.user_metadata.shortlists
      : [];

    return NextResponse.json({
      success: true,
      shortlists,
    });
  } catch (error: any) {
    console.error("GET /api/shortlist error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch shortlist" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/shortlist
 * Body: { userId, email, slug }
 * Adds a university slug to the user's shortlist in the Supabase backend.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, email, slug } = body;

    if (!slug || (!userId && !email)) {
      return NextResponse.json(
        { success: false, error: "slug and userId/email are required" },
        { status: 400 },
      );
    }

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

    const updatedShortlists = Array.from(new Set([...currentShortlists, slug]));

    // 1. Update user_metadata in Supabase Auth
    await supabaseAdmin.auth.admin.updateUserById(targetUser.id, {
      user_metadata: {
        ...targetUser.user_metadata,
        shortlists: updatedShortlists,
      },
    });

    // 2. Try inserting row into public.student_shortlists table
    try {
      await supabaseAdmin.from("student_shortlists").upsert(
        {
          user_id: targetUser.id,
          user_email: targetUser.email,
          university_slug: slug,
        },
        { onConflict: "user_email,university_slug" },
      );
    } catch (e) {
      // Table may not be created yet; metadata is already saved
    }

    return NextResponse.json({
      success: true,
      shortlists: updatedShortlists,
    });
  } catch (error: any) {
    console.error("POST /api/shortlist error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to add to shortlist" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/shortlist
 * Body or query: { userId, email, slug }
 * Removes a university slug from the user's shortlist in the Supabase backend.
 */
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let userId = searchParams.get("userId");
    let email = searchParams.get("email");
    let slug = searchParams.get("slug");

    if (!slug) {
      try {
        const body = await request.json();
        userId = userId || body.userId;
        email = email || body.email;
        slug = body.slug;
      } catch {
        // ignore
      }
    }

    if (!slug || (!userId && !email)) {
      return NextResponse.json(
        { success: false, error: "slug and userId/email are required" },
        { status: 400 },
      );
    }

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

    const updatedShortlists = currentShortlists.filter((s) => s !== slug);

    // 1. Update user_metadata in Supabase Auth
    await supabaseAdmin.auth.admin.updateUserById(targetUser.id, {
      user_metadata: {
        ...targetUser.user_metadata,
        shortlists: updatedShortlists,
      },
    });

    // 2. Try deleting from public.student_shortlists table
    try {
      await supabaseAdmin
        .from("student_shortlists")
        .delete()
        .match({ user_email: targetUser.email, university_slug: slug });
    } catch {
      // ignore
    }

    return NextResponse.json({
      success: true,
      shortlists: updatedShortlists,
    });
  } catch (error: any) {
    console.error("DELETE /api/shortlist error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to remove from shortlist",
      },
      { status: 500 },
    );
  }
}
