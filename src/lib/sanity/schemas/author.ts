import { defineField, defineType } from "sanity";

export const author = defineType({
  name: "author",
  title: "Author / Admissions Strategist",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Designation / Role",
      type: "string",
      description: "e.g., Senior Admissions Strategist, Dnyanal Educon",
    }),
    defineField({
      name: "avatar",
      title: "Avatar / Profile Photo",
      type: "image",
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: "bio",
      title: "Short Biography",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "role",
      media: "avatar",
    },
  },
});
