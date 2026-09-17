// ============================================================
// StudyAbroad Vista - Core Domain Types
// ============================================================

export type TierCategory = "Tier 1" | "Tier 2" | "Tier 3";

export type ProgramCategory = 
  | "ms" 
  | "mba" 
  | "emba"
  | "mbbs" 
  | "bachelors" 
  | "nursing" 
  | "phd"
  | "ausbildung";

export interface Country {
  id: string;
  name: string;
  slug: string;
  code: string;
  tier: TierCategory;
  flagEmoji: string;
  currency: string;
  currencySymbol: string;
  exchangeRateToINR: number;
  popularPrograms: ProgramCategory[];
  avgTuitionINR: string;
  avgLivingCostINR: string;
  postStudyWorkVisa: string;
  topIntakes: string[];
  heroTagline: string;
  overview: string;
  safetyRating: number; // out of 5
}

export interface Program {
  id: string;
  name: string;
  slug: ProgramCategory;
  level: "Postgraduate" | "Undergraduate" | "Vocational" | "Doctoral" | "Executive";
  duration: string;
  keyFields: string[];
  topDestinations: string[];
  summary: string;
  roiScore: number; // out of 100
}

export interface University {
  id: string;
  name: string;
  slug: string;
  country: string;
  countrySlug: string;
  city: string;
  rankingGlobal: number;
  rankingNational?: number;
  programsOffered: ProgramCategory[];
  tuitionFeeRangeINR: string;
  ieltsMinScore: number;
  toeflMinScore?: number;
  greGmatRequired: boolean;
  intakes: string[];
  acceptanceRate: number; // percentage
  nmcCompliant?: boolean; // For MBBS
  postStudyWorkMonths: number;
  featured: boolean;
  logoUrl?: string;
  bannerUrl?: string;
  claimed_status?: "claimed" | "unclaimed" | "verified";
  claimed_by_user_id?: string;
  tierBadge?: "Platinum Partner" | "Gold Partner" | "Silver Partner";
}

export interface LeadSubmission {
  fullName: string;
  email: string;
  phone: string;
  countryTarget: string;
  programTarget: ProgramCategory;
  highestEducation: string;
  budgetRangeINR: string;
  intakeYear: string;
  ieltsScore?: string;
  utmSource?: string;
  utmCampaign?: string;
}

export interface AIChatMessage {
  id: string;
  role: "user" | "model" | "system";
  text: string;
  timestamp: string;
  suggestedActions?: {
    label: string;
    action: string;
    payload?: Record<string, unknown>;
  }[];
}

export interface ComparisonItem {
  id: string;
  name: string;
  country: string;
  fees: string;
  ranking: string;
  workVisa: string;
  ielts: string;
}

export interface CourseItem {
  id: string;
  slug: string;
  name: string;
  universityName: string;
  universitySlug: string;
  city: string;
  country: string;
  flagEmoji: string;
  level: string;
  duration: string;
  tuitionFeeINR: string;
  tuitionFeeLocal: string;
  ieltsMinScore: number | string;
  greGmatRequired: boolean;
  postStudyWorkMonths: number;
  intakeDeadline: string;
  roiScore: number;
  coreModules: string[];
}
