import { NextResponse } from "next/server";
import { getLatestArticles } from "@/lib/sanity/fetchers";

export async function GET() {
  const articles = await getLatestArticles();
  return NextResponse.json(articles);
}
