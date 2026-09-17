import { NextRequest, NextResponse } from "next/server";
import { getGeminiModel } from "@/lib/gemini/client";
import { COUNTRIES, PROGRAMS } from "@/lib/data/masterData";

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If no API key configured yet, provide domain-aware fallback response based on Master Data
    if (!apiKey) {
      const lower = message.toLowerCase();
      let reply = "Hello! I am your StudyAbroad Vista AI Counsellor. I'm currently running in preview mode while the Gemini API key is being linked.";

      if (lower.includes("germany") || lower.includes("free")) {
        reply = "Germany offers 0 tuition fees at almost all public universities for both Bachelor's and Master's degrees! You only need a blocked account of approx. €11,904 (approx. ₹10.5 Lakhs) for living expenses, and you get an 18-month post-study work visa.";
      } else if (lower.includes("mbbs") || lower.includes("doctor") || lower.includes("medicine")) {
        reply = "For Indian medical aspirants, we recommend NMC & WHO compliant universities in Russia, Uzbekistan, Kazakhstan, Georgia, and the Philippines. Total packages range from ₹18 to ₹35 Lakhs including hostel and food, with English medium curriculum.";
      } else if (lower.includes("ausbildung")) {
        reply = "Germany's Ausbildung is a government-recognized 3-year dual vocational training program. There are zero tuition fees, and you receive a monthly stipend of €1,000–€1,400 while training in Healthcare, IT, or Engineering. You need German language proficiency (B1/B2 level).";
      } else if (lower.includes("usa") || lower.includes("us") || lower.includes("stem")) {
        reply = "The USA is the world leader in STEM master's and MBA programs. STEM-designated degree graduates are eligible for up to 3 years of OPT (Optional Practical Training) work authorization.";
      } else if (lower.includes("uk") || lower.includes("england")) {
        reply = "The UK offers 1-year master's degrees which significantly reduce living costs, followed by a 2-year post-study Graduate Route work visa.";
      } else {
        reply = `I can help guide you across our 19 destinations (${COUNTRIES.map(c => c.name).slice(0, 5).join(", ")}, etc.) and 6 programs (${PROGRAMS.map(p => p.name).slice(0, 4).join(", ")}). What degree level, budget, or destination do you have in mind?`;
      }

      return NextResponse.json({
        reply,
        model: "studyabroad-rule-engine-preview",
        suggestedNext: [
          "Tell me about Germany free tuition",
          "What are the best MBBS options?",
          "How does Germany Ausbildung work?",
          "Can I work part-time in the UK or Ireland?"
        ]
      });
    }

    // Prepare system instructions with Vista master data context
    const systemPrompt = `
You are the StudyAbroad Vista AI Counsellor, an authoritative, warm, and guiding study abroad advisor for Indian students and working professionals.
You operate on behalf of Dnyanal Educon Pvt. Ltd.

Key Knowledge Base:
- 19 Destinations:
  - Tier 1: USA (3-yr STEM OPT, ₹25-45L), UK (1-yr Master's, 2-yr PSW), Canada (PGWP up to 3 yrs), Australia (Subclass 485), Ireland (Tech hub of Europe, 2-yr PSW), New Zealand.
  - Tier 2: Germany (0 tuition at public universities, 18-mo jobseeker visa), France (5-yr post-study Schengen visa for Master's), Italy (DSU regional scholarship waivers), Netherlands, Singapore, Malaysia, UAE.
  - Tier 3 (MBBS/Medical): Russia, Uzbekistan, Kazakhstan, Kyrgyzstan, Georgia, Philippines (NMC/WHO compliant, English medium, total packages ₹18-35L).
- 6 Programs: Master's (MS/MSc), MBA, MBBS, Bachelor's, Nursing, Germany Ausbildung.
- Currencies converted accurately to INR.
- Tone: Warm, guiding, direct, transparent, and encouraging. Never give false legal visa guarantees.
    `;

    const model = getGeminiModel(process.env.GEMINI_MODEL || "gemini-1.5-flash", systemPrompt);

    // Build chat history
    const chat = model.startChat({
      history: (history || []).map((h: { role: string; text: string }) => ({
        role: h.role === "user" ? "user" : "model",
        parts: [{ text: h.text }],
      })),
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const replyText = response.text();

    return NextResponse.json({
      reply: replyText,
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
    });
  } catch (error: unknown) {
    console.error("AI Counsellor Error:", error);
    return NextResponse.json(
      { 
        error: "Failed to generate AI response",
        fallback: "Our AI Counsellor is momentarily unavailable. Please select one of our curated guides or book a consultation." 
      },
      { status: 500 }
    );
  }
}
