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
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
    ];
  },
  async redirects() {
    return [
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
