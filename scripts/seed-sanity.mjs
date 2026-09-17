import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "1z6ctbcw";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_AUTH_TOKEN || process.env.SANITY_API_TOKEN;

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

const COUNTRIES = [
  {
    _type: "country",
    _id: "country-germany",
    name: "Germany",
    slug: { _type: "slug", current: "germany" },
    code: "DE",
    tier: "Tier 1",
    flagEmoji: "🇩🇪",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToINR: 90.0,
    avgTuitionINR: "€0 (Public Universities)",
    avgLivingCostINR: "₹8 - 12 Lakhs / yr",
    postStudyWorkVisa: "18 Months Job Seeking Visa",
    heroTagline: "Study in Germany: 0 Tuition & World-Class Engineering",
    overview: "Germany is Europe's leading destination for tuition-free higher education, boasting top-ranked technical universities and exceptional post-study work rights.",
    safetyRating: 4.8
  },
  {
    _type: "country",
    _id: "country-usa",
    name: "United States",
    slug: { _type: "slug", current: "usa" },
    code: "US",
    tier: "Tier 1",
    flagEmoji: "🇺🇸",
    currency: "USD",
    currencySymbol: "$",
    exchangeRateToINR: 86.5,
    avgTuitionINR: "₹20 - 45 Lakhs / yr",
    avgLivingCostINR: "₹12 - 18 Lakhs / yr",
    postStudyWorkVisa: "36 Months STEM OPT",
    heroTagline: "Study in USA: Unmatched Research & Career Mobility",
    overview: "The United States is home to IVY League institutions, cutting-edge STEM programs, and world-leading technology ecosystems.",
    safetyRating: 4.5
  },
  {
    _type: "country",
    _id: "country-france",
    name: "France",
    slug: { _type: "slug", current: "france" },
    code: "FR",
    tier: "Tier 2",
    flagEmoji: "🇫🇷",
    currency: "EUR",
    currencySymbol: "€",
    exchangeRateToINR: 90.0,
    avgTuitionINR: "₹3 - 15 Lakhs / yr",
    avgLivingCostINR: "₹7 - 11 Lakhs / yr",
    postStudyWorkVisa: "2 Years APS Visa",
    heroTagline: "Study in France: Excellence in Business & Innovation",
    overview: "France combines top-ranked European business schools (Grande Écoles) with affordable public university tuition and rich culture.",
    safetyRating: 4.6
  }
];

const UNIVERSITIES = [
  {
    _type: "university",
    _id: "uni-tum",
    name: "Technical University of Munich (TUM)",
    slug: { _type: "slug", current: "technical-university-of-munich" },
    country: "germany",
    city: "Munich",
    rankingGlobal: 28,
    rankingNational: 1,
    tuitionFeeRangeINR: "€0 (Public University)",
    ieltsMinScore: 6.5,
    greGmatRequired: false,
    acceptanceRate: 8,
    postStudyWorkMonths: 18,
    featured: true
  },
  {
    _type: "university",
    _id: "uni-stanford",
    name: "Stanford University",
    slug: { _type: "slug", current: "stanford-university" },
    country: "usa",
    city: "Stanford, California",
    rankingGlobal: 5,
    rankingNational: 2,
    tuitionFeeRangeINR: "₹45 - 65 Lakhs / yr",
    ieltsMinScore: 7.5,
    greGmatRequired: true,
    acceptanceRate: 4,
    postStudyWorkMonths: 36,
    featured: true
  },
  {
    _type: "university",
    _id: "uni-sorbonne",
    name: "Sorbonne University",
    slug: { _type: "slug", current: "sorbonne-university" },
    country: "france",
    city: "Paris",
    rankingGlobal: 59,
    rankingNational: 3,
    tuitionFeeRangeINR: "€2,770 - €3,770 / yr",
    ieltsMinScore: 6.5,
    greGmatRequired: false,
    acceptanceRate: 15,
    postStudyWorkMonths: 24,
    featured: true
  },
  {
    _type: "university",
    _id: "uni-hec-paris",
    name: "HEC Paris Business School",
    slug: { _type: "slug", current: "hec-paris" },
    country: "france",
    city: "Jouy-en-Josas, Paris",
    rankingGlobal: 10,
    rankingNational: 1,
    tuitionFeeRangeINR: "₹25 - 42 Lakhs / yr",
    ieltsMinScore: 7.0,
    greGmatRequired: true,
    acceptanceRate: 12,
    postStudyWorkMonths: 24,
    featured: true
  }
];

const PROGRAMS = [
  {
    _type: "program",
    _id: "prog-ms",
    name: "Master of Science (MS / MSc)",
    slug: { _type: "slug", current: "master-of-science" },
    level: "Postgraduate",
    duration: "1 - 2 Years",
    overview: "STEM degrees focusing on Data Science, AI, Robotics, Computer Science, and Engineering.",
    avgSalaryUSD: "$95,000 / yr",
    roiScore: 94
  },
  {
    _type: "program",
    _id: "prog-mba",
    name: "Master of Business Administration (MBA)",
    slug: { _type: "slug", current: "mba-management" },
    level: "Postgraduate",
    duration: "1 - 2 Years",
    overview: "Global management, strategy, finance, and leadership programs at top accreditation B-schools.",
    avgSalaryUSD: "$115,000 / yr",
    roiScore: 92
  }
];

async function seed() {
  console.log("🌱 Starting Full Sanity Studio Seeding...");
  try {
    for (const item of [...COUNTRIES, ...UNIVERSITIES, ...PROGRAMS]) {
      const res = await client.createOrReplace(item);
      console.log(`✅ Created/Updated [${res._type}]: ${res.name || res.title}`);
    }
    console.log("🎉 All Countries, Universities, and Programs successfully seeded into Sanity Studio!");
  } catch (err) {
    console.error("❌ Seed error:", err);
  }
}

seed();
