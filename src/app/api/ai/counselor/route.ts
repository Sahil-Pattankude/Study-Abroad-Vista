import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini/client";
import {
  buildSystemPrompt,
  getSmartFollowUpQuestions,
  AIPageContext,
  AIUserProfile,
} from "@/lib/gemini/counsellorKnowledge";

interface IncomingHistoryItem {
  role?: string;
  text?: string;
}

/**
 * Sanitizes and formats chat history to comply strictly with Google Generative AI requirements:
 * 1. Must start with role: 'user' (removes any leading 'model' messages, like the initial greeting).
 * 2. Roles must strictly alternate: 'user' -> 'model' -> 'user' -> 'model'...
 * 3. Drops empty turns or invalid roles.
 */
function sanitizeGeminiHistory(
  rawHistory: IncomingHistoryItem[],
): Array<{ role: "user" | "model"; parts: [{ text: string }] }> {
  if (!Array.isArray(rawHistory) || rawHistory.length === 0) {
    return [];
  }

  // 1. Filter out turns without valid text or role
  const validTurns = rawHistory
    .filter(
      (h) =>
        h &&
        typeof h.text === "string" &&
        h.text.trim().length > 0 &&
        (h.role === "user" || h.role === "model"),
    )
    .map((h) => ({
      role: h.role === "user" ? ("user" as const) : ("model" as const),
      text: (h.text || "").trim(),
    }));

  // 2. Drop any leading 'model' turns (Gemini requires the first turn to be 'user')
  while (validTurns.length > 0 && validTurns[0].role !== "user") {
    validTurns.shift();
  }

  if (validTurns.length === 0) {
    return [];
  }

  // 3. Ensure strictly alternating roles (merge adjacent turns with same role)
  const alternating: Array<{
    role: "user" | "model";
    parts: [{ text: string }];
  }> = [];

  for (const turn of validTurns) {
    if (alternating.length === 0) {
      alternating.push({
        role: turn.role,
        parts: [{ text: turn.text }],
      });
    } else {
      const lastIndex = alternating.length - 1;
      const last = alternating[lastIndex];

      if (last.role === turn.role) {
        // Merge consecutive turns with the same role
        last.parts[0].text = `${last.parts[0].text}\n${turn.text}`;
      } else {
        alternating.push({
          role: turn.role,
          parts: [{ text: turn.text }],
        });
      }
    }
  }

  return alternating;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      message,
      history = [],
      pageContext = {} as AIPageContext,
      userProfile = {} as AIUserProfile,
      shortlist = [],
    } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "A valid message string is required." },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Build intelligent follow-up suggestions for the client
    const suggestedNext = getSmartFollowUpQuestions(message, pageContext);

    // Detect consultation / high-intent triggers
    const lower = message.toLowerCase();
    const isConsultationIntent =
      lower.includes("apply") ||
      lower.includes("admission") ||
      lower.includes("contact") ||
      lower.includes("advisor") ||
      lower.includes("counsellor") ||
      lower.includes("counselor") ||
      lower.includes("call me") ||
      lower.includes("phone") ||
      lower.includes("whatsapp") ||
      lower.includes("scholarship apply") ||
      lower.includes("shortlist my profile");

    // If no API key configured, provide domain-aware fallback response
    if (!apiKey) {
      let reply =
        "Namaste! I am your StudyAbroad Vista AI Counsellor. I'm currently running in preview mode.";

      if (lower.includes("germany") || lower.includes("free")) {
        reply =
          "Germany offers **€0 tuition fees** at almost all 300+ public universities for Bachelor's and Master's degrees! You only need a blocked account of approx. **€11,904/year (~₹10.5 Lakhs)** for living expenses, and you get an **18-month post-study work visa**.";
      } else if (
        lower.includes("mbbs") ||
        lower.includes("doctor") ||
        lower.includes("medicine")
      ) {
        reply =
          "For Indian medical aspirants, we recommend **NMC & WHO compliant** universities in Russia, Uzbekistan, Kazakhstan, Georgia, and the Philippines. Total 6-year packages range from **₹18 to ₹35 Lakhs** (including hostel and food) with 100% English medium curriculum.";
      } else if (lower.includes("ausbildung")) {
        reply =
          "Germany's **Ausbildung** is a government-recognized 3-year dual vocational training program. There are **zero tuition fees**, and you receive a **monthly stipend of €1,000–€1,400 (~₹90k–₹1.25L)** while training in Healthcare, IT, or Engineering. German B1/B2 level is required.";
      } else if (
        lower.includes("usa") ||
        lower.includes("us") ||
        lower.includes("stem")
      ) {
        reply =
          "The USA is the world leader in STEM master's and MBA programs. STEM-designated degree graduates are eligible for up to **3 years of OPT** (Optional Practical Training) work authorization.";
      } else if (lower.includes("uk") || lower.includes("england")) {
        reply =
          "The UK offers **1-year master's degrees** which significantly reduce living costs, followed by a **2-year post-study Graduate Route work visa**.";
      } else {
        reply =
          "I can help guide you across our global destinations (USA, UK, Germany, Canada, Australia, Ireland, etc.) and programs (Master's, MBA, MBBS, Ausbildung, Bachelor's). What degree level, budget, or destination do you have in mind?";
      }

      return NextResponse.json({
        success: true,
        reply,
        model: "studyabroad-rule-engine-preview",
        suggestedNext,
        leadCapturePrompt: isConsultationIntent,
      });
    }

    // Prepare system instructions with dynamic context
    const systemPrompt = buildSystemPrompt(
      pageContext,
      userProfile,
      shortlist?.length,
    );

    const modelName = process.env.GEMINI_MODEL || "gemini-3.8-flash";
    const model = getGeminiModel(modelName, systemPrompt);

    // Format and sanitize previous conversation turns strictly for Gemini
    const formattedHistory = sanitizeGeminiHistory(history);

    const chat = model.startChat({
      history: formattedHistory,
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const replyText = response.text();

    return NextResponse.json({
      success: true,
      reply: replyText,
      model: modelName,
      suggestedNext,
      leadCapturePrompt: isConsultationIntent,
    });
  } catch (error: unknown) {
    console.error("AI Counsellor API Error:", error);
    const errMessage = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate AI response",
        details:
          process.env.NODE_ENV === "development" ? errMessage : undefined,
        fallback:
          "I experienced a temporary connection issue. You can ask again, explore our university catalog, or book a 1-on-1 advisor call.",
        suggestedNext: [
          "Which European countries have free tuition?",
          "Top NMC-compliant MBBS universities?",
          "How does Germany Ausbildung dual training work?",
          "Compare UK vs Ireland for MS in Computer Science",
        ],
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "StudyAbroad Vista AI Counsellor API",
    model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
    configured: Boolean(process.env.GEMINI_API_KEY),
    destinationsSupported: 19,
    programsSupported: 6,
  });
}
