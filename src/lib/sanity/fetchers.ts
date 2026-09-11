import { client } from "./client";

export interface SanityAuthor {
  name: string;
  role?: string;
  bio?: string;
  avatar?: unknown;
}

export interface SanityArticle {
  _id: string;
  title: string;
  slug: string;
  tag: string;
  excerpt: string;
  date: string;
  readTime: string;
  country?: string;
  programCategory?: string;
  body?: unknown;
  author?: SanityAuthor;
}

export interface SanityPillarGuide {
  _id: string;
  title: string;
  slug: string;
  country: string;
  heroSubtitle?: string;
  overview?: string;
  costOfLivingINR?: string;
  visaWorkRights?: string;
  faqs?: Array<{ question: string; answer: string }>;
  updatedAt?: string;
}

export const FALLBACK_ARTICLES: SanityArticle[] = [
  {
    _id: "fb-1",
    title: "Germany Ausbildung 2027: Complete Dual Vocational Guide for Indian Students",
    slug: "germany-ausbildung-2027-guide",
    tag: "Germany • Vocational",
    readTime: "6 min read",
    excerpt: "How to secure €1,100/month monthly stipend with 0 tuition in German hospitals and tech firms.",
    date: "Sep 2026",
    country: "germany",
    programCategory: "ausbildung",
  },
  {
    _id: "fb-2",
    title: "NMC Foreign Medical Graduate Regulations: Essential Checklist for MBBS Abroad",
    slug: "nmc-fmgl-regulations-mbbs-abroad-checklist",
    tag: "Medical • NMC Guidelines",
    readTime: "8 min read",
    excerpt: "54-month course duration, 12-month internship, and CRMI clinical guidelines you must know before applying.",
    date: "Sep 2026",
    country: "uzbekistan",
    programCategory: "mbbs",
  },
  {
    _id: "fb-3",
    title: "UK Graduate Route vs Canada PGWP: Work Visa Rights Comparison in 2026-2027",
    slug: "uk-graduate-route-vs-canada-pgwp-comparison",
    tag: "Visa • Immigration",
    readTime: "5 min read",
    excerpt: "An in-depth breakdown of current visa tenure, PR eligibility, and post-study employment trends.",
    date: "Aug 2026",
    country: "uk",
    programCategory: "ms",
  },
  {
    _id: "fb-4",
    title: "How to Build a High-Probability SOP for Top US & German Universities",
    slug: "how-to-write-winning-sop-us-germany",
    tag: "Admissions • Prep",
    readTime: "7 min read",
    excerpt: "The 5 critical elements admissions committees evaluate in Indian engineering and MBA applicants.",
    date: "Aug 2026",
    country: "usa",
    programCategory: "ms",
  },
];

const LATEST_ARTICLES_QUERY = `*[_type == "article"] | order(publishedAt desc)[0...4] {
  _id,
  title,
  "slug": slug.current,
  tag,
  excerpt,
  "date": coalesce(publishedAt, _createdAt),
  "readTime": coalesce(estimatedReadTime, "5 min read"),
  country,
  programCategory,
  "author": author->{
    name,
    role,
    bio
  }
}`;

const ARTICLE_BY_SLUG_QUERY = `*[_type == "article" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  tag,
  excerpt,
  "date": coalesce(publishedAt, _createdAt),
  "readTime": coalesce(estimatedReadTime, "5 min read"),
  country,
  programCategory,
  body,
  "author": author->{
    name,
    role,
    bio
  }
}`;

const PILLAR_GUIDE_BY_COUNTRY_QUERY = `*[_type == "pillarGuide" && country == $country][0] {
  _id,
  title,
  "slug": slug.current,
  country,
  heroSubtitle,
  overview,
  costOfLivingINR,
  visaWorkRights,
  faqs,
  updatedAt
}`;

const ALL_ARTICLES_QUERY = `*[_type == "article"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  tag,
  excerpt,
  "date": coalesce(publishedAt, _createdAt),
  "readTime": coalesce(estimatedReadTime, "5 min read"),
  country,
  programCategory,
  "author": author->{
    name,
    role,
    bio
  }
}`;

export async function getAllArticles(): Promise<SanityArticle[]> {
  try {
    const data = await client.fetch(ALL_ARTICLES_QUERY, {}, {
      next: { revalidate: 60 },
    });
    if (Array.isArray(data) && data.length > 0) {
      const map = new Map<string, SanityArticle>();
      data.forEach((a: SanityArticle) => map.set(a.slug, a));
      FALLBACK_ARTICLES.forEach((fa) => {
        if (!map.has(fa.slug)) map.set(fa.slug, fa);
      });
      return Array.from(map.values());
    }
    return FALLBACK_ARTICLES;
  } catch (error) {
    console.warn("Sanity getAllArticles fetch failed, serving fallbacks:", error);
    return FALLBACK_ARTICLES;
  }
}

export async function getLatestArticles(): Promise<SanityArticle[]> {
  try {
    const data = await client.fetch(LATEST_ARTICLES_QUERY, {}, {
      // Revalidate ISR every 60 seconds
      next: { revalidate: 60 },
    });
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
    return FALLBACK_ARTICLES;
  } catch (error) {
    console.warn("Sanity article fetch failed, serving curated fallbacks:", error);
    return FALLBACK_ARTICLES;
  }
}

export async function getArticleBySlug(slug: string): Promise<SanityArticle | null> {
  try {
    const data = await client.fetch(ARTICLE_BY_SLUG_QUERY, { slug }, {
      next: { revalidate: 60 },
    });
    if (data) {
      return data;
    }
  } catch (error) {
    console.warn(`Sanity fetch for slug '${slug}' failed:`, error);
  }

  // Check fallback articles
  const fallback = FALLBACK_ARTICLES.find((a) => a.slug === slug);
  return fallback || null;
}

export async function getPillarGuideByCountry(countrySlug: string): Promise<SanityPillarGuide | null> {
  try {
    const data = await client.fetch(PILLAR_GUIDE_BY_COUNTRY_QUERY, { country: countrySlug.toLowerCase() }, {
      next: { revalidate: 60 },
    });
    if (data) {
      return data;
    }
  } catch (error) {
    console.warn(`Sanity pillarGuide fetch for '${countrySlug}' failed:`, error);
  }
  return null;
}
