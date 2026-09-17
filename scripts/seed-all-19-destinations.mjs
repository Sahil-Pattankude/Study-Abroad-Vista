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

const ALL_19_COUNTRIES = [
  // Tier 1
  { id: "usa", name: "United States", slug: "usa", code: "US", tier: "Tier 1", flagEmoji: "🇺🇸", currency: "USD", currencySymbol: "$", exchangeRateToINR: 87.0, avgTuitionINR: "₹25 - 45 Lakhs / yr", avgLivingCostINR: "₹10 - 15 Lakhs / yr", postStudyWorkVisa: "1 to 3 Years (STEM OPT)", heroTagline: "World leader in STEM research, Ivy League prestige, and 3-year STEM OPT.", overview: "Home to the world's most prestigious universities and tech hubs in Silicon Valley, Boston, and New York.", safetyRating: 4.5 },
  { id: "uk", name: "United Kingdom", slug: "uk", code: "GB", tier: "Tier 1", flagEmoji: "🇬🇧", currency: "GBP", currencySymbol: "£", exchangeRateToINR: 110.0, avgTuitionINR: "₹18 - 32 Lakhs / yr", avgLivingCostINR: "₹10 - 14 Lakhs / yr", postStudyWorkVisa: "2 Years (Graduate Route)", heroTagline: "1-year fast-track master’s degrees and globally renowned Russell Group institutions.", overview: "Historic academia combined with vibrant global commercial and financial capitals.", safetyRating: 4.7 },
  { id: "canada", name: "Canada", slug: "canada", code: "CA", tier: "Tier 1", flagEmoji: "🇨🇦", currency: "CAD", currencySymbol: "C$", exchangeRateToINR: 62.0, avgTuitionINR: "₹16 - 28 Lakhs / yr", avgLivingCostINR: "₹9 - 13 Lakhs / yr", postStudyWorkVisa: "Up to 3 Years (PGWP)", heroTagline: "Clear PR pathways, world-class education, and welcoming multicultural communities.", overview: "A premier destination offering top universities and high post-study work authorization.", safetyRating: 4.8 },
  { id: "australia", name: "Australia", slug: "australia", code: "AU", tier: "Tier 1", flagEmoji: "🇦🇺", currency: "AUD", currencySymbol: "A$", exchangeRateToINR: 56.0, avgTuitionINR: "₹20 - 35 Lakhs / yr", avgLivingCostINR: "₹11 - 15 Lakhs / yr", postStudyWorkVisa: "2 to 4 Years (Subclass 485)", heroTagline: "Group of Eight universities, exceptional lifestyle, and robust healthcare careers.", overview: "High standard of living, high minimum wage for student work, and strong post-graduation demand.", safetyRating: 4.8 },
  { id: "ireland", name: "Ireland", slug: "ireland", code: "IE", tier: "Tier 1", flagEmoji: "🇮🇪", currency: "EUR", currencySymbol: "€", exchangeRateToINR: 92.0, avgTuitionINR: "₹14 - 24 Lakhs / yr", avgLivingCostINR: "₹8 - 12 Lakhs / yr", postStudyWorkVisa: "2 Years (Third Level Scheme)", heroTagline: "Silicon Docks of Europe, hosting European HQs of Google, Apple, Meta & Pfizer.", overview: "The only English-speaking tech hub in the Eurozone with top ROI and high placement rates.", safetyRating: 4.9 },
  { id: "new-zealand", name: "New Zealand", slug: "new-zealand", code: "NZ", tier: "Tier 1", flagEmoji: "🇳🇿", currency: "NZD", currencySymbol: "NZ$", exchangeRateToINR: 50.0, avgTuitionINR: "₹16 - 26 Lakhs / yr", avgLivingCostINR: "₹9 - 13 Lakhs / yr", postStudyWorkVisa: "Up to 3 Years", heroTagline: "Scenic, safe, and progressive with all 8 universities ranked in the global top 3%.", overview: "Excellent work-life balance, high global rankings, and student protection frameworks.", safetyRating: 4.9 },

  // Tier 2
  { id: "germany", name: "Germany", slug: "germany", code: "DE", tier: "Tier 2", flagEmoji: "🇩🇪", currency: "EUR", currencySymbol: "€", exchangeRateToINR: 92.0, avgTuitionINR: "₹0 - 4 Lakhs / yr (Free at Public Universities)", avgLivingCostINR: "₹8 - 11 Lakhs / yr (Blocked Account)", postStudyWorkVisa: "18 Months Jobseeker Visa", heroTagline: "Zero tuition fees at public universities and the industrial powerhouse of Europe.", overview: "Unmatched automotive, robotics, and engineering careers with virtually free education.", safetyRating: 4.8 },
  { id: "france", name: "France", slug: "france", code: "FR", tier: "Tier 2", flagEmoji: "🇫🇷", currency: "EUR", currencySymbol: "€", exchangeRateToINR: 92.0, avgTuitionINR: "₹10 - 22 Lakhs / yr", avgLivingCostINR: "₹7 - 10 Lakhs / yr", postStudyWorkVisa: "2 Years (5-year Schengen visa for Indian Master's alumni)", heroTagline: "Top global business schools (INSEAD, HEC) and special 5-year post-study Schengen visa.", overview: "World capital of luxury management, aerospace, and globally ranked business schools.", safetyRating: 4.6 },
  { id: "italy", name: "Italy", slug: "italy", code: "IT", tier: "Tier 2", flagEmoji: "🇮🇹", currency: "EUR", currencySymbol: "€", exchangeRateToINR: 92.0, avgTuitionINR: "₹2 - 8 Lakhs / yr (Regional DSU Scholarships)", avgLivingCostINR: "₹6 - 9 Lakhs / yr", postStudyWorkVisa: "12 Months", heroTagline: "Affordable European education with 100% regional tuition waivers (DSU scholarships).", overview: "Europe's historic cradle of design, architecture, engineering, and medical studies via IMAT.", safetyRating: 4.5 },
  { id: "netherlands", name: "Netherlands", slug: "netherlands", code: "NL", tier: "Tier 2", flagEmoji: "🇳🇱", currency: "EUR", currencySymbol: "€", exchangeRateToINR: 92.0, avgTuitionINR: "₹12 - 20 Lakhs / yr", avgLivingCostINR: "₹9 - 13 Lakhs / yr", postStudyWorkVisa: "1 Year Orientation Year (Zoekjaar)", heroTagline: "Over 2,100 English-taught programs and the European hub for tech and international law.", overview: "95% English proficiency among locals, cutting-edge research, and liberal work culture.", safetyRating: 4.8 },
  { id: "singapore", name: "Singapore", slug: "singapore", code: "SG", tier: "Tier 2", flagEmoji: "🇸🇬", currency: "SGD", currencySymbol: "S$", exchangeRateToINR: 65.0, avgTuitionINR: "₹18 - 32 Lakhs / yr", avgLivingCostINR: "₹10 - 15 Lakhs / yr", postStudyWorkVisa: "1 to 2 Years (Tuition Grant Bond Option)", heroTagline: "Asia’s premier financial hub with NUS and NTU consistently ranked in global top 15.", overview: "Unmatched safety, clean infrastructure, and proximity to India with global corporate exposure.", safetyRating: 5.0 },
  { id: "malaysia", name: "Malaysia", slug: "malaysia", code: "MY", tier: "Tier 2", flagEmoji: "🇲🇾", currency: "MYR", currencySymbol: "RM", exchangeRateToINR: 19.5, avgTuitionINR: "₹4 - 8 Lakhs / yr", avgLivingCostINR: "₹3 - 5 Lakhs / yr", postStudyWorkVisa: "Employment Pass Sponsorship", heroTagline: "High-value UK and Australian twin degrees (Monash, Nottingham) at 1/3rd the cost.", overview: "Extremely affordable, culturally friendly, and top international branch campuses.", safetyRating: 4.6 },
  { id: "uae", name: "United Arab Emirates", slug: "uae", code: "AE", tier: "Tier 2", flagEmoji: "🇦🇪", currency: "AED", currencySymbol: "AED", exchangeRateToINR: 23.7, avgTuitionINR: "₹12 - 24 Lakhs / yr", avgLivingCostINR: "₹8 - 12 Lakhs / yr", postStudyWorkVisa: "Green Visa & Golden Visa pathways", heroTagline: "Zero income tax, 3.5 hours flight from India, and prestigious Dubai/Abu Dhabi campuses.", overview: "Fast-growing global trade nexus offering world-class campuses like NYU Abu Dhabi and Wollongong.", safetyRating: 4.9 },

  // Tier 3 - Medical Hubs
  { id: "russia", name: "Russia", slug: "russia", code: "RU", tier: "Tier 3", flagEmoji: "🇷🇺", currency: "RUB", currencySymbol: "₽", exchangeRateToINR: 0.95, avgTuitionINR: "₹3 - 6 Lakhs / yr", avgLivingCostINR: "₹2 - 3.5 Lakhs / yr", postStudyWorkVisa: "Medical Internship / Residency", heroTagline: "Over 30 years of medical trust for Indian doctors with NMC/WHO recognized universities.", overview: "Oldest medical study destination for Indians with high clinical exposure and low total costs.", safetyRating: 4.2 },
  { id: "uzbekistan", name: "Uzbekistan", slug: "uzbekistan", code: "UZ", tier: "Tier 3", flagEmoji: "🇺🇿", currency: "UZS", currencySymbol: "UZS", exchangeRateToINR: 0.0068, avgTuitionINR: "₹2.8 - 4.5 Lakhs / yr", avgLivingCostINR: "₹1.5 - 2.5 Lakhs / yr", postStudyWorkVisa: "Clinical Internship", heroTagline: "Affordable 5+1 year NMC compliant medical curriculum with dedicated Indian food messes.", overview: "Modernized medical academies with English medium and high FMGE pass-rate focus.", safetyRating: 4.7 },
  { id: "kazakhstan", name: "Kazakhstan", slug: "kazakhstan", code: "KZ", tier: "Tier 3", flagEmoji: "🇰🇿", currency: "KZT", currencySymbol: "₸", exchangeRateToINR: 0.17, avgTuitionINR: "₹3.2 - 5 Lakhs / yr", avgLivingCostINR: "₹2 - 3 Lakhs / yr", postStudyWorkVisa: "Clinical Internship", heroTagline: "National universities with 5-year English medium medical programs and top infrastructure.", overview: "Central Asia's largest economy with premier national medical universities like Kazakh National.", safetyRating: 4.6 },
  { id: "kyrgyzstan", name: "Kyrgyzstan", slug: "kyrgyzstan", code: "KG", tier: "Tier 3", flagEmoji: "🇰🇬", currency: "KGS", currencySymbol: "сом", exchangeRateToINR: 1.0, avgTuitionINR: "₹2.5 - 3.8 Lakhs / yr", avgLivingCostINR: "₹1.5 - 2.2 Lakhs / yr", postStudyWorkVisa: "Clinical Internship", heroTagline: "Most economical MBBS packages (total package under ₹18-22 Lakhs including hostel).", overview: "Budget-friendly destination with large Indian student communities in Bishkek and Osh.", safetyRating: 4.3 },
  { id: "georgia", name: "Georgia", slug: "georgia", code: "GE", tier: "Tier 3", flagEmoji: "🇬🇪", currency: "GEL", currencySymbol: "₾", exchangeRateToINR: 31.5, avgTuitionINR: "₹4 - 7 Lakhs / yr", avgLivingCostINR: "₹2.5 - 4 Lakhs / yr", postStudyWorkVisa: "USMLE / PLAB Clinical Prep", heroTagline: "European medical curriculum (WFME & ECFMG accredited) with USMLE clinical rotations.", overview: "Bridging Europe and Asia with high-grade European healthcare standards and English tuition.", safetyRating: 4.8 },
  { id: "philippines", name: "Philippines", slug: "philippines", code: "PH", tier: "Tier 3", flagEmoji: "🇵🇭", currency: "PHP", currencySymbol: "₱", exchangeRateToINR: 1.5, avgTuitionINR: "₹3.5 - 6 Lakhs / yr", avgLivingCostINR: "₹2 - 3.5 Lakhs / yr", postStudyWorkVisa: "USMLE Pathway / Clinical Practice", heroTagline: "US-pattern MD curriculum with 100% English medium across everyday life and hospitals.", overview: "Tropical climate with identical disease patterns to India, preparing students for FMGE and USMLE.", safetyRating: 4.4 }
];

async function seedAll19Destinations() {
  console.log(`🚀 Seeding ALL ${ALL_19_COUNTRIES.length} Destinations & Pillar Guides into Sanity Studio...`);

  try {
    for (const c of ALL_19_COUNTRIES) {
      // 1. Country Document
      const countryDoc = {
        _type: "country",
        _id: `country-${c.slug}`,
        name: c.name,
        slug: { _type: "slug", current: c.slug },
        code: c.code,
        tier: c.tier,
        flagEmoji: c.flagEmoji,
        currency: c.currency,
        currencySymbol: c.currencySymbol,
        exchangeRateToINR: c.exchangeRateToINR,
        avgTuitionINR: c.avgTuitionINR,
        avgLivingCostINR: c.avgLivingCostINR,
        postStudyWorkVisa: c.postStudyWorkVisa,
        heroTagline: c.heroTagline,
        overview: c.overview,
        safetyRating: c.safetyRating,
      };

      await client.createOrReplace(countryDoc);
      console.log(`✅ [Country Document] ${c.flagEmoji} ${c.name}`);

      // 2. Country Pillar Master Guide Document
      const pillarDoc = {
        _type: "pillarGuide",
        _id: `pillar-${c.slug}`,
        title: `Study in ${c.name}: Master Pillar Guide 2026-2027`,
        slug: { _type: "slug", current: `study-in-${c.slug}` },
        country: c.slug,
        heroSubtitle: c.heroTagline,
        overview: c.overview,
        costOfLivingINR: `${c.avgLivingCostINR} (${c.currencySymbol} Living Budget)`,
        visaWorkRights: `${c.postStudyWorkVisa} post-graduation work rights.`,
        faqs: [
          {
            _key: `faq-1-${c.slug}`,
            question: `What are the average tuition fees in ${c.name}?`,
            answer: `Average tuition fees in ${c.name} range around ${c.avgTuitionINR}, depending on public vs private institution status.`,
          },
          {
            _key: `faq-2-${c.slug}`,
            question: `What is the post-study work visa policy for ${c.name}?`,
            answer: `International students in ${c.name} receive ${c.postStudyWorkVisa} post-graduation work authorization.`,
          },
        ],
      };

      await client.createOrReplace(pillarDoc);
      console.log(`✅ [Pillar Master Guide] 📖 Study in ${c.name}`);
    }

    console.log(`🎉 SUCCESS: ALL 19 DESTINATIONS AND 19 PILLAR GUIDES SEEDED IN SANITY STUDIO!`);
  } catch (err) {
    console.error("❌ Batch Seeding Error:", err);
  }
}

seedAll19Destinations();
