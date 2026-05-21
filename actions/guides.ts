"use server";

import { PublishStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { cacheKey, cacheGetOrSet, cacheInvalidatePattern } from "@/lib/redis";
import { listGuidesSchema } from "@/lib/validations/content";
import { toActionResult } from "@/lib/errors";
import { ValidationError } from "@/lib/errors";

export async function getPublishedGuides(input?: {
  category?: string;
  featured?: boolean;
  limit?: number;
}) {
  return toActionResult(async () => {
    const parsed = listGuidesSchema.safeParse(input ?? {});
    if (!parsed.success) {
      throw new ValidationError(parsed.error.message);
    }

    const { category, featured, limit } = parsed.data;
    const cacheId = `${category ?? "all"}:${featured ?? "any"}:${limit}`;

    return cacheGetOrSet(
      cacheKey("guides", cacheId),
      () =>
        prisma.guide.findMany({
          where: {
            status: PublishStatus.PUBLISHED,
            ...(category ? { category } : {}),
            ...(featured !== undefined ? { featured } : {}),
          },
          orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
          take: limit,
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            category: true,
            coverImage: true,
            featured: true,
            publishedAt: true,
          },
        }),
      600
    );
  });
}

export async function getGuideBySlug(slug: string) {
  return toActionResult(async () => {
    const guide = await cacheGetOrSet(
      cacheKey("guides", `slug:${slug}`),
      () =>
        prisma.guide.findFirst({
          where: { slug, status: PublishStatus.PUBLISHED },
        }),
      600
    );

    if (!guide) {
      throw new ValidationError("Guide not found");
    }

    return guide;
  });
}

export async function invalidateGuidesCache() {
  return toActionResult(async () => {
    await cacheInvalidatePattern("guides");
    return { invalidated: true };
  });
}
