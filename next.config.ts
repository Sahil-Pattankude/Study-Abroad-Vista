import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Program Aliases & Shortcuts
      {
        source: "/programs/emba-executive",
        destination: "/programs/emba",
        permanent: true,
      },
      {
        source: "/programs/executive-mba",
        destination: "/programs/emba",
        permanent: true,
      },
      {
        source: "/executive-mba",
        destination: "/programs/emba",
        permanent: true,
      },
      {
        source: "/mba-healthcare",
        destination: "/programs/mba",
        permanent: true,
      },
      {
        source: "/programs/masters-stem",
        destination: "/programs/ms",
        permanent: true,
      },
      {
        source: "/programs/stem-masters",
        destination: "/programs/ms",
        permanent: true,
      },
      {
        source: "/programs/mba-management",
        destination: "/programs/mba",
        permanent: true,
      },
      {
        source: "/programs/mbbs-medicine",
        destination: "/programs/mbbs",
        permanent: true,
      },
      {
        source: "/programs/nursing-healthcare",
        destination: "/programs/nursing",
        permanent: true,
      },
      {
        source: "/programs/bachelors-ug",
        destination: "/programs/bachelors",
        permanent: true,
      },
      {
        source: "/programs/germany-ausbildung",
        destination: "/programs/ausbildung",
        permanent: true,
      },
      {
        source: "/programs/phd-doctoral",
        destination: "/programs/phd",
        permanent: true,
      },

      // Program-first to Country-first Canonical Redirects (IA v1.0 Section 5 & Sitemap v1.0 Section 16)
      {
        source: "/masters-abroad/:slug",
        destination: "/study-in-:slug/masters",
        permanent: true,
      },
      {
        source: "/mba-abroad/:slug",
        destination: "/study-in-:slug/mba",
        permanent: true,
      },
      {
        source: "/mbbs-abroad/:slug",
        destination: "/study-in-:slug/mbbs",
        permanent: true,
      },
      {
        source: "/nursing-abroad/:slug",
        destination: "/study-in-:slug/nursing",
        permanent: true,
      },

      // Destination Synonyms & Typo Redirects
      {
        source: "/study-in-united-kingdom",
        destination: "/study-in-uk",
        permanent: true,
      },
      {
        source: "/study-in-united-states",
        destination: "/study-in-usa",
        permanent: true,
      },
      {
        source: "/study-in-america",
        destination: "/study-in-usa",
        permanent: true,
      },
      {
        source: "/study-in-britain",
        destination: "/study-in-uk",
        permanent: true,
      },
      {
        source: "/study-in-holland",
        destination: "/study-in-netherlands",
        permanent: true,
      },
      {
        source: "/study-in-dubai",
        destination: "/study-in-uae",
        permanent: true,
      },
      {
        source: "/study-in-united-arab-emirates",
        destination: "/study-in-uae",
        permanent: true,
      },
      {
        source: "/study-in-nz",
        destination: "/study-in-new-zealand",
        permanent: true,
      },

      // Tool Alias Redirects
      {
        source: "/deadlines",
        destination: "/deadline-tracker",
        permanent: true,
      },
      {
        source: "/scholarships/finder",
        destination: "/scholarships",
        permanent: true,
      },
      {
        source: "/eligibility-check",
        destination: "/eligibility-checker",
        permanent: true,
      },
      {
        source: "/loan-eligibility",
        destination: "/loan-calculator",
        permanent: true,
      },
      {
        source: "/currency-converter",
        destination: "/cost-calculator",
        permanent: true,
      },
      {
        source: "/gpa-converter",
        destination: "/eligibility-checker",
        permanent: true,
      },
      {
        source: "/my-shortlist",
        destination: "/dashboard/student",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/study-in-:slug/:program",
        destination: "/destinations/:slug/:program",
      },
      {
        source: "/study-in-:slug",
        destination: "/destinations/:slug",
      },
      {
        source: "/university/:slug",
        destination: "/universities/:slug",
      },
      {
        source: "/guides/:slug",
        destination: "/articles/:slug",
      },
      {
        source: "/guides/:pillar/:cluster",
        destination: "/articles/:cluster",
      },
      {
        source: "/masters-abroad",
        destination: "/programs/ms",
      },
      {
        source: "/mba-abroad",
        destination: "/programs/mba",
      },
      {
        source: "/mbbs-abroad",
        destination: "/programs/mbbs",
      },
      {
        source: "/nursing-abroad",
        destination: "/programs/nursing",
      },
      {
        source: "/germany-ausbildung",
        destination: "/programs/ausbildung",
      },
      {
        source: "/bachelors-abroad",
        destination: "/programs/bachelors",
      },
      {
        source: "/emba-abroad",
        destination: "/programs/emba",
      },
      {
        source: "/phd-abroad",
        destination: "/programs/phd",
      },
    ];
  },
};

export default nextConfig;
