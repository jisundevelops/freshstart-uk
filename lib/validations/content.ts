import { AffiliateCategory, PublishStatus } from "@prisma/client";
import { z } from "zod";

export const slugParamSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

export const listGuidesSchema = z.object({
  category: z.string().max(50).optional(),
  featured: z.coerce.boolean().optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const listBlogSchema = z.object({
  featured: z.coerce.boolean().optional(),
  tag: z.string().max(50).optional(),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const listAffiliatesSchema = z.object({
  category: z.nativeEnum(AffiliateCategory).optional(),
  featured: z.coerce.boolean().optional(),
});

export const publishStatusSchema = z.nativeEnum(PublishStatus);
