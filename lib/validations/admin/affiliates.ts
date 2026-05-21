import { AffiliateCategory, PublishStatus } from "@prisma/client";
import { z } from "zod";
import { slugSchema } from "./shared";

export const affiliateFormSchema = z.object({
  name: z.string().min(2).max(120),
  slug: slugSchema,
  description: z.string().min(5).max(500),
  url: z.string().url(),
  category: z.nativeEnum(AffiliateCategory),
  logoUrl: z.string().url().optional().or(z.literal("")),
  promoCode: z.string().max(40).optional().or(z.literal("")),
  featured: z.boolean(),
  sortOrder: z.coerce.number().int().min(0).max(999),
  status: z.nativeEnum(PublishStatus),
});

export type AffiliateFormInput = z.infer<typeof affiliateFormSchema>;
