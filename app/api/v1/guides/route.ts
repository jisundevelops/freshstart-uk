import { PublishStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { apiSuccess } from "@/lib/api/response";
import { createApiHandler } from "@/lib/api/handler";
import { cacheKey, cacheGetOrSet } from "@/lib/redis";
import { listGuidesSchema } from "@/lib/validations/content";
import { ValidationError } from "@/lib/errors";

export const GET = createApiHandler(
  async (request) => {
    const params = Object.fromEntries(request.nextUrl.searchParams);
    const parsed = listGuidesSchema.safeParse(params);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.message);
    }
    const { category, featured, limit } = parsed.data;

    const guides = await cacheGetOrSet(
      cacheKey("guides", `api:${category ?? "all"}:${featured ?? "any"}:${limit}`),
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
            slug: true,
            title: true,
            excerpt: true,
            category: true,
            featured: true,
            publishedAt: true,
          },
        }),
      600
    );

    return apiSuccess({ guides });
  },
  { rateLimit: "api" }
);
