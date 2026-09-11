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
        destination: "/programs/masters-stem",
      },
      {
        source: "/mba-abroad",
        destination: "/programs/mba-management",
      },
      {
        source: "/mbbs-abroad",
        destination: "/programs/mbbs-medicine",
      },
      {
        source: "/nursing-abroad",
        destination: "/programs/nursing-healthcare",
      },
      {
        source: "/germany-ausbildung",
        destination: "/programs/germany-ausbildung",
      },
      {
        source: "/bachelors-abroad",
        destination: "/programs/bachelors-ug",
      },
    ];
  },
};

export default nextConfig;
