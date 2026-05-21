"use server";

import { PublishStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { cacheKey, cacheGetOrSet } from "@/lib/redis";
import { listBlogSchema } from "@/lib/validations/content";
import { toActionResult, ValidationError } from "@/lib/errors";

export async function getPublishedBlogPosts(input?: {
  featured?: boolean;
  tag?: string;
  limit?: number;
}) {
  return toActionResult(async () => {
    const parsed = listBlogSchema.safeParse(input ?? {});
    if (!parsed.success) {
      throw new ValidationError(parsed.error.message);
    }

    const { featured, tag, limit } = parsed.data;
    const cacheId = `${featured ?? "any"}:${tag ?? "all"}:${limit}`;

    return cacheGetOrSet(
      cacheKey("blog", cacheId),
      () =>
        prisma.blogPost.findMany({
          where: {
            status: PublishStatus.PUBLISHED,
            ...(featured !== undefined ? { featured } : {}),
            ...(tag ? { tags: { has: tag } } : {}),
          },
          orderBy: { publishedAt: "desc" },
          take: limit,
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            authorName: true,
            coverImage: true,
            tags: true,
            featured: true,
            publishedAt: true,
          },
        }),
      600
    );
  });
}

export async function getBlogPostBySlug(slug: string) {
  return toActionResult(async () => {
    const post = await cacheGetOrSet(
      cacheKey("blog", `slug:${slug}`),
      () =>
        prisma.blogPost.findFirst({
          where: { slug, status: PublishStatus.PUBLISHED },
        }),
      600
    );

    if (!post) {
      throw new ValidationError("Blog post not found");
    }

    return post;
  });
}
