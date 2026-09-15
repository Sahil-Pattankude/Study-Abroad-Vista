import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const EXACT_REDIRECTS: Record<string, string> = {
  "/programs/germany-ausbildung": "/programs/ausbildung",
  "/programs/nursing-healthcare": "/programs/nursing",
  "/programs/bachelors-ug": "/programs/bachelors",
  "/programs/mbbs-medicine": "/programs/mbbs",
  "/programs/mba-management": "/programs/mba",
  "/programs/masters-stem": "/programs/ms",
  "/programs/stem-masters": "/programs/ms",
  "/programs/emba-executive": "/programs/emba",
  "/programs/executive-mba": "/programs/emba",
  "/programs/phd-doctoral": "/programs/phd",
  "/study-in-united-kingdom": "/study-in-uk",
  "/study-in-united-states": "/study-in-usa",
  "/study-in-america": "/study-in-usa",
  "/study-in-britain": "/study-in-uk",
  "/study-in-holland": "/study-in-netherlands",
  "/study-in-dubai": "/study-in-uae",
  "/study-in-united-arab-emirates": "/study-in-uae",
  "/study-in-nz": "/study-in-new-zealand",
  "/masters-abroad": "/programs/ms",
  "/mba-abroad": "/programs/mba",
  "/executive-mba": "/programs/emba",
  "/mba-healthcare": "/programs/mba",
  "/mbbs-abroad": "/programs/mbbs",
  "/nursing-abroad": "/programs/nursing",
  "/bachelors-abroad": "/programs/bachelors",
  "/germany-ausbildung": "/programs/ausbildung",
  "/phd-abroad": "/programs/phd",
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  let pathname = url.pathname;

  // Ignore static assets, api routes, and Next.js internal files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/images") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Remove trailing slash if longer than 1 char
  if (pathname.length > 1 && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }

  // Check exact redirect mapping
  if (EXACT_REDIRECTS[pathname]) {
    url.pathname = EXACT_REDIRECTS[pathname];
    return NextResponse.redirect(url, 308);
  }

  // Decode URI component to check for parenthetical long-tail tracks
  let decoded = pathname;
  try {
    decoded = decodeURIComponent(pathname).toLowerCase();
  } catch {
    decoded = pathname.toLowerCase();
  }

  // 1. USA Elite MBA (Harvard, Stanford, Wharton)
  if (decoded.includes("harvard") || decoded.includes("stanford") || decoded.includes("wharton")) {
    url.pathname = "/study-in-usa/mba";
    return NextResponse.redirect(url, 308);
  }

  // 2. UK Nursing & Healthcare (NMC nursing / GMC doctors)
  if (decoded.includes("nmc-nursing") || decoded.includes("gmc-doctor") || decoded.includes("gmc")) {
    url.pathname = "/study-in-uk/nursing";
    return NextResponse.redirect(url, 308);
  }

  // 3. Australia Nursing (AHPRA Stream B / Nursing / Medical Board)
  if (
    decoded.includes("australia") &&
    (decoded.includes("ahpra") || decoded.includes("stream-b") || decoded.includes("medical-board"))
  ) {
    url.pathname = "/study-in-australia/nursing";
    return NextResponse.redirect(url, 308);
  }

  // 4. Germany TU9 Masters
  if (decoded.includes("germany") && decoded.includes("tu9")) {
    url.pathname = "/study-in-germany/ms";
    return NextResponse.redirect(url, 308);
  }

  // 5. USA RN License / Nursing
  if (decoded.includes("united-states") && (decoded.includes("us-rn") || decoded.includes("rn-license") || decoded.includes("nclex"))) {
    url.pathname = "/study-in-usa/nursing";
    return NextResponse.redirect(url, 308);
  }

  // 6. Canada Top Universities (U of T, McGill, UBC)
  if (decoded.includes("canada") && (decoded.includes("mcgill") || decoded.includes("u-of-t") || decoded.includes("ubc"))) {
    url.pathname = "/study-in-canada/ms";
    return NextResponse.redirect(url, 308);
  }

  // 7. UK NHS Doctor Registration
  if (decoded.includes("united-kingdom") && decoded.includes("nhs-doctor")) {
    url.pathname = "/study-in-uk/mbbs";
    return NextResponse.redirect(url, 308);
  }

  // 8. Singapore MBA (NUS / NTU MBA)
  if (decoded.includes("singapore") && decoded.includes("mba")) {
    url.pathname = "/study-in-singapore/mba";
    return NextResponse.redirect(url, 308);
  }

  // 9. Singapore Masters (NUS / NTU)
  if (decoded.includes("singapore") && (decoded.includes("nus") || decoded.includes("ntu"))) {
    url.pathname = "/study-in-singapore/ms";
    return NextResponse.redirect(url, 308);
  }

  // 10. Canada NNAS Provincial RN
  if (decoded.includes("canada") && decoded.includes("nnas")) {
    url.pathname = "/study-in-canada/nursing";
    return NextResponse.redirect(url, 308);
  }

  // 11. Ireland NMBI / Medical Council
  if (decoded.includes("ireland") && (decoded.includes("nmbi") || decoded.includes("medical-council"))) {
    url.pathname = "/study-in-ireland/nursing";
    return NextResponse.redirect(url, 308);
  }

  // 12. France / Europe (INSEAD, HEC Paris)
  if (decoded.includes("france") && (decoded.includes("insead") || decoded.includes("hec"))) {
    url.pathname = "/study-in-france/mba";
    return NextResponse.redirect(url, 308);
  }

  // 13. UK Top Business Schools (LBS, Oxford, Cambridge)
  if (decoded.includes("united-kingdom") && (decoded.includes("lbs") || decoded.includes("oxford") || decoded.includes("cambridge"))) {
    url.pathname = "/study-in-uk/mba";
    return NextResponse.redirect(url, 308);
  }

  // 14. USA Top 30 STEM MS
  if (decoded.includes("united-states") && (decoded.includes("top-30-stem") || decoded.includes("top 30 stem") || (decoded.includes("top") && decoded.includes("stem")))) {
    url.pathname = "/study-in-usa/ms";
    return NextResponse.redirect(url, 308);
  }

  // 15. USA 5,000+ Universities (Undergraduate)
  if (decoded.includes("united-states") && (decoded.includes("5,000") || decoded.includes("5000"))) {
    url.pathname = "/study-in-usa/bachelors";
    return NextResponse.redirect(url, 308);
  }

  // 16. Ireland All Public Universities (MS)
  if (decoded.includes("ireland") && (decoded.includes("all-public") || decoded.includes("all public"))) {
    url.pathname = "/study-in-ireland/ms";
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
