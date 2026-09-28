import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { supabase } from "@/lib/supabase/client";

/**
 * API Route: /api/ai/chats
 * Handles auto-saving, retrieving, and managing AI Counsellor conversations (FR-AI-004)
 */

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const sessionId = searchParams.get("sessionId");

    const client = supabaseAdmin || supabase;

    if (sessionId) {
      const { data, error } = await client
        .from("counsellor_conversations")
        .select("*")
        .eq("session_id", sessionId)
        .maybeSingle();

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 },
        );
      }

      return NextResponse.json({ success: true, conversation: data });
    }

    if (email) {
      const { data, error } = await client
        .from("counsellor_conversations")
        .select("*")
        .eq("user_email", email.toLowerCase().trim())
        .order("updated_at", { ascending: false })
        .limit(20);

      if (error) {
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 },
        );
      }

      return NextResponse.json({ success: true, conversations: data || [] });
    }

    return NextResponse.json(
      { success: false, error: "email or sessionId parameter is required" },
      { status: 400 },
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      sessionId,
      userEmail,
      userName,
      userId,
      title,
      pageContext = {},
      messages = [],
      leadLevel = 1,
    } = body;

    if (!sessionId || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: "sessionId and messages array are required" },
        { status: 400 },
      );
    }

    // Auto-generate a title from the first user message if not supplied
    let derivedTitle = title;
    if (!derivedTitle) {
      const firstUserMsg = messages.find((m: any) => m.role === "user");
      if (firstUserMsg && firstUserMsg.text) {
        derivedTitle =
          firstUserMsg.text.length > 50
            ? firstUserMsg.text.substring(0, 47) + "..."
            : firstUserMsg.text;
      } else {
        derivedTitle = "Study Abroad Consultation";
      }
    }

    const client = supabaseAdmin || supabase;

    // Check if conversation with sessionId already exists
    const { data: existing } = await client
      .from("counsellor_conversations")
      .select("id")
      .eq("session_id", sessionId)
      .maybeSingle();

    const payload = {
      session_id: sessionId,
      user_email: userEmail ? userEmail.toLowerCase().trim() : null,
      user_name: userName || null,
      user_id: userId || null,
      title: derivedTitle,
      page_context: pageContext,
      messages: messages,
      lead_level: leadLevel,
      updated_at: new Date().toISOString(),
    };

    if (existing && existing.id) {
      const { data, error } = await client
        .from("counsellor_conversations")
        .update(payload)
        .eq("id", existing.id)
        .select()
        .single();

      if (error) {
        console.warn(
          "Could not update conversation in Supabase:",
          error.message,
        );
        return NextResponse.json({
          success: true,
          saved: false,
          notice: error.message,
        });
      }

      return NextResponse.json({
        success: true,
        saved: true,
        conversation: data,
      });
    } else {
      const { data, error } = await client
        .from("counsellor_conversations")
        .insert([{ ...payload, created_at: new Date().toISOString() }])
        .select()
        .single();

      if (error) {
        console.warn(
          "Could not insert conversation in Supabase:",
          error.message,
        );
        return NextResponse.json({
          success: true,
          saved: false,
          notice: error.message,
        });
      }

      return NextResponse.json({
        success: true,
        saved: true,
        conversation: data,
      });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "sessionId is required" },
        { status: 400 },
      );
    }

    const client = supabaseAdmin || supabase;
    const { error } = await client
      .from("counsellor_conversations")
      .delete()
      .eq("session_id", sessionId);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, deleted: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
