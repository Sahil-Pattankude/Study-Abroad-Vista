import { defineField, defineType } from "sanity";

export const country = defineType({
  name: "country",
  title: "Country Destination Guide",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Country Name",
      type: "string",
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: "slug",
      title: "URL Slug (e.g. usa, uk, germany)",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "code",
      title: "Country ISO Code (e.g. US, GB, DE)",
      type: "string",
      validation: (Rule) => Rule.required().max(5),
    }),
    defineField({
      name: "tier",
      title: "Destination Tier Category",
      type: "string",
      options: {
        list: [
          { title: "Tier 1 (High Demand)", value: "Tier 1" },
          { title: "Tier 2 (Affordable / Low-Fee)", value: "Tier 2" },
          { title: "Tier 3 (Medical / Low-Cost)", value: "Tier 3" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "flagEmoji",
      title: "Flag Emoji",
      type: "string",
      initialValue: "🌐",
    }),
    defineField({
      name: "currency",
      title: "Currency Code (e.g. USD, EUR, GBP)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "currencySymbol",
      title: "Currency Symbol (e.g. $, €, £)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "exchangeRateToINR",
      title: "Exchange Rate to INR",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "avgTuitionINR",
      title: "Average Tuition Fee Range in INR",
      type: "string",
      description: "e.g., ₹25 - 45 Lakhs / yr",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "avgLivingCostINR",
      title: "Average Annual Living Cost in INR",
      type: "string",
      description: "e.g., ₹10 - 15 Lakhs / yr",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "postStudyWorkVisa",
      title: "Post-Study Work Visa Duration / Policy",
      type: "string",
      description: "e.g., 1 to 3 Years (STEM OPT)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroTagline",
      title: "Pillar Hero Tagline",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "overview",
      title: "Country Overview & Admissions Summary",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "safetyRating",
      title: "Safety & Quality Score (out of 5)",
      type: "number",
      initialValue: 4.5,
    }),
    defineField({
      name: "flagIcon",
      title: "Country Flag / Graphic Banner",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "tier",
    },
  },
});
