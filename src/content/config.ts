import { defineCollection, z } from 'astro:content';

export const collections = {
  services: defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      icon: z.string().optional(),
      order: z.number().optional(),
      image: z.string().optional(),
    }),
    // Markdoc is automatically detected for .mdoc files
  }),
  portfolio: defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      category: z.string().optional(),
      date: z.string().optional(),
      featured: z.boolean().optional(),
      images: z.array(z.string()).optional(),
    }),
  }),
};
