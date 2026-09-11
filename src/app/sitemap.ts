import { MetadataRoute } from "next";
import { COUNTRIES, PROGRAMS, FEATURED_UNIVERSITIES } from "@/lib/data/masterData";
import { TEST_PREP_EXAMS } from "@/lib/data/testPrepData";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://studyabroadvista.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Core Static Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/test-prep`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/cost-calculator`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/articles`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/sitemap`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/terms-of-service`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/refund-policy`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${BASE_URL}/dpdp-consent`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  // 19 Destination Country Hubs
  const countryPages: MetadataRoute.Sitemap = COUNTRIES.map((c) => ({
    url: `${BASE_URL}/study-in-${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // 8 Program Disciplines
  const programPages: MetadataRoute.Sitemap = PROGRAMS.map((p) => ({
    url: `${BASE_URL}/programs/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // 9 Test Prep Blueprints
  const testPrepPages: MetadataRoute.Sitemap = TEST_PREP_EXAMS.map((t) => ({
    url: `${BASE_URL}/test-prep/${t.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // Featured Universities
  const universityPages: MetadataRoute.Sitemap = FEATURED_UNIVERSITIES.map((u) => ({
    url: `${BASE_URL}/universities/${u.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...countryPages,
    ...programPages,
    ...testPrepPages,
    ...universityPages,
  ];
}
