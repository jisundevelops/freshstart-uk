import { PublishStatus } from "@prisma/client";
import { z } from "zod";

export const publishStatusSchema = z.nativeEnum(PublishStatus);

export const seoFieldsSchema = z.object({
  metaTitle: z.string().max(120).optional().or(z.literal("")),
  metaDesc: z.string().max(320).optional().or(z.literal("")),
  ogImage: z.string().url().optional().or(z.literal("")),
});

export const slugSchema = z
  .string()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
