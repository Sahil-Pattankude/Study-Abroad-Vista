import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://studyabroadvista.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/buyer/dashboard/", "/university/dashboard/", "/account/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
