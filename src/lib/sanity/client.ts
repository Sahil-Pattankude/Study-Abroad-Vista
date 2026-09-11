import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder-id",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  useCdn: true, // `false` if you want to ensure fresh data
});

/**
 * Standard GROQ Queries for StudyAbroad Vista Content Lake
 */
export const queries = {
  allArticles: `*[_type == "article"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    country,
    programCategory,
    summary,
    mainImage,
    publishedAt,
    estimatedReadTime
  }`,
  pillarGuidesByCountry: `*[_type == "pillarGuide" && country == $country][0] {
    _id,
    title,
    "slug": slug.current,
    country,
    heroSubtitle,
    overview,
    costOfLiving,
    visaWorkRights,
    topSpecializations,
    faqs,
    updatedAt
  }`,
};
