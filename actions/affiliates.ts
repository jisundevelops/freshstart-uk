"use server";

import { AffiliateCategory, PublishStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { cacheKey, cacheGetOrSet } from "@/lib/redis";
import { listAffiliatesSchema } from "@/lib/validations/content";
import { toActionResult, ValidationError } from "@/lib/errors";

export async function getAffiliateLinks(input?: {
  category?: AffiliateCategory;
  featured?: boolean;
}) {
  return toActionResult(async () => {
    const parsed = listAffiliatesSchema.safeParse(input ?? {});
    if (!parsed.success) {
      throw new ValidationError(parsed.error.message);
    }

    const { category, featured } = parsed.data;
    const cacheId = `${category ?? "all"}:${featured ?? "any"}`;

    return cacheGetOrSet(
      cacheKey("affiliates", cacheId),
      () =>
        prisma.affiliateLink.findMany({
          where: {
            status: PublishStatus.PUBLISHED,
            ...(category ? { category } : {}),
            ...(featured !== undefined ? { featured } : {}),
          },
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
          select: {
            id: true,
            slug: true,
            name: true,
            description: true,
            url: true,
            category: true,
            logoUrl: true,
            promoCode: true,
            featured: true,
          },
        }),
      900
    );
  });
}

export async function getBanks() {
  return getAffiliateLinks({ category: AffiliateCategory.BANK });
}

export async function getSimProviders() {
  return getAffiliateLinks({ category: AffiliateCategory.SIM });
}
