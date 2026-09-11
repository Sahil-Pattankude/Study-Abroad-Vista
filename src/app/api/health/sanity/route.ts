import { NextResponse } from "next/server";
import { client } from "@/lib/sanity/client";

export async function GET() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "1z6ctbcw";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

  try {
    const documents = await client.fetch("*[_type != null][0...10]");
    return NextResponse.json({
      status: "connected",
      message: "Sanity.io Content Lake is reachable and healthy.",
      config: {
        projectId,
        dataset,
        apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
      },
      stats: {
        documentsFound: documents.length,
        documentTypes: [...new Set(documents.map((d: { _type?: string }) => d._type))],
      },
      note: documents.length === 0 ? "Connected successfully, but 0 documents are currently published in this Sanity dataset." : undefined,
    });
  } catch (error: unknown) {
    const err = error as Error;
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to connect to Sanity.io",
        error: err.message,
        config: {
          projectId,
          dataset,
        },
      },
      { status: 502 }
    );
  }
}
