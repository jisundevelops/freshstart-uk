import { PublishStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { apiSuccess } from "@/lib/api/response";
import { createApiHandler } from "@/lib/api/handler";
import { cacheKey, cacheGetOrSet } from "@/lib/redis";
import { listAffiliatesSchema } from "@/lib/validations/content";
import { ValidationError } from "@/lib/errors";

export const GET = createApiHandler(
  async (request) => {
    const params = Object.fromEntries(request.nextUrl.searchParams);
    const parsed = listAffiliatesSchema.safeParse(params);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.message);
    }
    const { category, featured } = parsed.data;

    const affiliates = await cacheGetOrSet(
      cacheKey(
        "affiliates",
        `api:${category ?? "all"}:${featured ?? "any"}`
      ),
      () =>
        prisma.affiliateLink.findMany({
          where: {
            status: PublishStatus.PUBLISHED,
            ...(category ? { category } : {}),
            ...(featured !== undefined ? { featured } : {}),
          },
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
          select: {
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

    return apiSuccess({ affiliates });
  },
  { rateLimit: "api" }
);
