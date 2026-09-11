import { defineField, defineType } from "sanity";

export const pillarGuide = defineType({
  name: "pillarGuide",
  title: "Country Pillar Master Guide",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Guide Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "country",
      title: "Country Slug",
      type: "string",
      description: "Must match standard country slug (e.g. germany, usa, uk, ireland, canada, australia)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "overview",
      title: "Admissions & System Overview",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "costOfLivingINR",
      title: "Cost of Living Summary (INR)",
      type: "string",
      description: "e.g., ₹85,000 to ₹1.1 Lakh/month",
    }),
    defineField({
      name: "visaWorkRights",
      title: "Post-Study Work Visa Tenure & Rights",
      type: "string",
      description: "e.g., 18-Month Job Seeker Visa / 2-Year Graduate Route",
    }),
    defineField({
      name: "faqs",
      title: "Frequently Asked Questions",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "question", type: "string", title: "Question" },
            { name: "answer", type: "text", title: "Answer", rows: 3 },
          ],
        },
      ],
    }),
    defineField({
      name: "updatedAt",
      title: "Last Updated",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "country",
    },
  },
});
