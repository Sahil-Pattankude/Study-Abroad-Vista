import { defineField, defineType } from "sanity";

export const program = defineType({
  name: "program",
  title: "Academic Program Discipline",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Program Discipline Name",
      type: "string",
      description: "e.g., Master's (MS / MSc), MBA & Management, Germany Ausbildung",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "level",
      title: "Degree Level",
      type: "string",
      options: {
        list: [
          { title: "Postgraduate", value: "Postgraduate" },
          { title: "Undergraduate", value: "Undergraduate" },
          { title: "Vocational Apprenticeship", value: "Vocational" },
          { title: "Executive Education", value: "Executive" },
          { title: "Doctoral Research", value: "Doctoral" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "duration",
      title: "Program Duration",
      type: "string",
      description: "e.g., 1 to 2 Years, 3 Years, 5 to 6 Years",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "keyFields",
      title: "Key Fields / Specializations",
      type: "array",
      of: [{ type: "string" }],
      description: "e.g., Data Science, AI, Automotive Engineering, Clinical Care",
    }),
    defineField({
      name: "topDestinations",
      title: "Top Destinations for Indian Students",
      type: "array",
      of: [{ type: "string" }],
      description: "e.g., USA, Germany, UK, Canada, Ireland",
    }),
    defineField({
      name: "summary",
      title: "Program Overview & ROI Summary",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "roiScore",
      title: "Career ROI Score (out of 100)",
      type: "number",
      description: "e.g., 94 for MS, 98 for Germany Ausbildung",
      initialValue: 90,
      validation: (Rule) => Rule.min(50).max(100),
    }),
    defineField({
      name: "iconImage",
      title: "Discipline Icon / Illustration",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "level",
      media: "iconImage",
    },
  },
});
