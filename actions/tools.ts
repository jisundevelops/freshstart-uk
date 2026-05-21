"use server";

import { PublishStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { cacheKey, cacheGetOrSet } from "@/lib/redis";
import { toActionResult } from "@/lib/errors";

export async function getPublishedTools() {
  return toActionResult(async () =>
    cacheGetOrSet(
      cacheKey("tools", "published"),
      () =>
        prisma.tool.findMany({
          where: { status: PublishStatus.PUBLISHED },
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
          select: {
            id: true,
            slug: true,
            name: true,
            description: true,
            href: true,
            icon: true,
            category: true,
            featured: true,
          },
        }),
      600
    )
  );
}
