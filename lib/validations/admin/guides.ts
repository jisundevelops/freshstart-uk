import { z } from "zod";
import { publishStatusSchema, seoFieldsSchema, slugSchema } from "./shared";

export const guideFormSchema = z.object({
  title: z.string().min(3).max(200),
  slug: slugSchema,
  excerpt: z.string().min(10).max(500),
  content: z.string().min(1),
  category: z.string().min(1).max(50),
  coverImage: z.string().url().optional().or(z.literal("")),
  status: publishStatusSchema,
  featured: z.boolean(),
  sortOrder: z.coerce.number().int().min(0).max(999),
  seo: seoFieldsSchema.optional(),
});

export type GuideFormInput = z.infer<typeof guideFormSchema>;
