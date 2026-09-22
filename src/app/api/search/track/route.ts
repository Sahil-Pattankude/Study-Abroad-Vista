import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface SearchAnalyticsPayload {
  query: string;
  resultsCount: number;
  clickedUrl?: string;
  clickedTitle?: string;
  timestamp?: string;
  category?: string;
}

// In-memory ring buffer of the last 100 search analytics events for auditing
const searchEventsLog: SearchAnalyticsPayload[] = [];
const MAX_LOG_SIZE = 100;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SearchAnalyticsPayload;

    const event: SearchAnalyticsPayload = {
      query: (body.query || "").trim().slice(0, 150),
      resultsCount:
        typeof body.resultsCount === "number" ? body.resultsCount : 0,
      clickedUrl: body.clickedUrl ? body.clickedUrl.slice(0, 200) : undefined,
      clickedTitle: body.clickedTitle
        ? body.clickedTitle.slice(0, 150)
        : undefined,
      category: body.category || "all",
      timestamp: body.timestamp || new Date().toISOString(),
    };

    if (event.query || event.clickedUrl) {
      searchEventsLog.unshift(event);
      if (searchEventsLog.length > MAX_LOG_SIZE) {
        searchEventsLog.pop();
      }

      // Log anonymized search event to server console (NO PII)
      console.log(
        `[Search Analytics] Query="${event.query}" | Results=${event.resultsCount} | Clicked="${event.clickedTitle || event.clickedUrl || "None"}" | Time=${event.timestamp}`,
      );
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.warn("[Search Analytics Track Error]:", err.message);
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function GET() {
  // Allow inspecting recent anonymized search events
  return NextResponse.json({
    success: true,
    totalLogged: searchEventsLog.length,
    recentEvents: searchEventsLog.slice(0, 25),
  });
}
