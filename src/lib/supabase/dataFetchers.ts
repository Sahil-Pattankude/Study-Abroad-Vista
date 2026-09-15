import { supabase } from "./client";
import { COUNTRIES, FEATURED_UNIVERSITIES, Country, University } from "@/lib/data/masterData";

export async function fetchLiveCountries(): Promise<Country[]> {
  try {
    const { data, error } = await supabase.from("countries").select("*").eq("is_active", true);
    if (!error && data && data.length > 0) {
      return data.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        code: c.code,
        tier: c.tier,
        flagEmoji: c.flag_emoji || "🌐",
        currency: c.currency,
        currencySymbol: c.currency_symbol,
        exchangeRateToINR: Number(c.exchange_rate_inr) || 85.0,
        avgTuitionINR: c.avg_tuition_inr || "₹15 - 30 Lakhs / yr",
        avgLivingCostINR: c.avg_living_cost_inr || "₹8 - 12 Lakhs / yr",
        postStudyWorkVisa: c.post_study_work_visa || "1 to 2 Years",
        heroTagline: c.hero_tagline || `Study in ${c.name}`,
        overview: c.overview || `Overview for ${c.name}`,
        safetyRating: Number(c.safety_rating) || 4.5,
      }));
    }
  } catch (err) {
    console.warn("Supabase countries fetch fallback to masterData:", err);
  }
  return COUNTRIES;
}

export async function fetchLiveUniversities(): Promise<University[]> {
  try {
    const { data, error } = await supabase.from("universities").select("*");
    if (!error && data && data.length > 0) {
      return data.map((u: any) => ({
        id: u.id,
        name: u.name,
        slug: u.slug,
        country: u.country_id?.toUpperCase() || "Global",
        countrySlug: u.country_id || "global",
        city: u.city,
        rankingGlobal: u.ranking_global || 100,
        rankingNational: u.ranking_national || 10,
        programsOffered: u.programs_offered || ["ms", "mba"],
        tuitionFeeRangeINR: u.tuition_fee_range_inr || "₹15 - 30 Lakhs / yr",
        ieltsMinScore: Number(u.ielts_min_score) || 6.5,
        greGmatRequired: u.gre_gmat_required || false,
        acceptanceRate: u.acceptance_rate || 30,
        nmcCompliant: u.nmc_compliant || false,
        postStudyWorkMonths: u.post_study_work_months || 24,
        featured: u.featured || true,
      }));
    }
  } catch (err) {
    console.warn("Supabase universities fetch fallback to masterData:", err);
  }
  return FEATURED_UNIVERSITIES;
}
