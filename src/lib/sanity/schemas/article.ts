import { defineField, defineType } from "sanity";

export const article = defineType({
  name: "article",
  title: "Admissions Article & Visa Guide",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Article Title",
      type: "string",
      validation: (Rule) => Rule.required().max(120),
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
      name: "tag",
      title: "Display Tag",
      type: "string",
      description: "e.g., Germany • Vocational, Medical • NMC Guidelines, Visa • Work Rights",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "country",
      title: "Primary Country",
      type: "string",
      options: {
        list: [
          { title: "United States", value: "usa" },
          { title: "United Kingdom", value: "uk" },
          { title: "Canada", value: "canada" },
          { title: "Australia", value: "australia" },
          { title: "Germany", value: "germany" },
          { title: "Ireland", value: "ireland" },
          { title: "New Zealand", value: "new-zealand" },
          { title: "France", value: "france" },
          { title: "Italy", value: "italy" },
          { title: "Netherlands", value: "netherlands" },
          { title: "Singapore", value: "singapore" },
          { title: "Malaysia", value: "malaysia" },
          { title: "United Arab Emirates", value: "uae" },
          { title: "Russia", value: "russia" },
          { title: "Uzbekistan", value: "uzbekistan" },
          { title: "Kazakhstan", value: "kazakhstan" },
          { title: "Kyrgyzstan", value: "kyrgyzstan" },
          { title: "Georgia", value: "georgia" },
          { title: "Philippines", value: "philippines" },
          { title: "Global / General", value: "global" },
        ],
      },
    }),
    defineField({
      name: "programCategory",
      title: "Program Category",
      type: "string",
      options: {
        list: [
          { title: "Master's (MS/MSc)", value: "ms" },
          { title: "MBA & Management", value: "mba" },
          { title: "MBBS & Medicine", value: "mbbs" },
          { title: "Bachelor's / UG", value: "bachelors" },
          { title: "Nursing", value: "nursing" },
          { title: "Germany Ausbildung", value: "ausbildung" },
          { title: "All Programs", value: "all" },
        ],
      },
    }),
    defineField({
      name: "excerpt",
      title: "Summary / Excerpt",
      type: "text",
      rows: 3,
      description: "Short description displayed on article cards across the website.",
      validation: (Rule) => Rule.required().max(250),
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative Text (Accessibility & SEO)",
        },
      ],
    }),
    defineField({
      name: "estimatedReadTime",
      title: "Estimated Read Time",
      type: "string",
      description: "e.g., 6 min read",
      initialValue: "5 min read",
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "author",
      title: "Author / Expert",
      type: "reference",
      to: [{ type: "author" }],
    }),
    defineField({
      name: "body",
      title: "Article Content (Rich Text)",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "tag",
      media: "coverImage",
    },
  },
});
