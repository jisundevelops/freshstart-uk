import { z } from "zod";
import { publishStatusSchema, seoFieldsSchema, slugSchema } from "./shared";

export const blogFormSchema = z.object({
  title: z.string().min(3).max(200),
  slug: slugSchema,
  excerpt: z.string().min(10).max(500),
  content: z.string().min(1),
  authorName: z.string().min(1).max(100),
  coverImage: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string().min(1).max(40)).max(12),
  status: publishStatusSchema,
  featured: z.boolean(),
  seo: seoFieldsSchema.optional(),
});

export type BlogFormInput = z.infer<typeof blogFormSchema>;
