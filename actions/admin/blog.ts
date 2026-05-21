"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { sanitizeRichText } from "@/lib/admin/sanitize";
import { blogSeoKey, setSiteConfigJson } from "@/lib/admin/site-config";
import { requireAdminSession, requireWriteAccess } from "@/actions/admin/guard";
import { blogFormSchema, type BlogFormInput } from "@/lib/validations/admin/blog";
import { toActionResult, ValidationError } from "@/lib/errors";
import { cacheInvalidatePattern } from "@/lib/redis";
import { PublishStatus } from "@prisma/client";

async function invalidateBlogCaches() {
  await cacheInvalidatePattern("blog");
}

export async function listAdminBlogPosts() {
  return toActionResult(async () => {
    await requireAdminSession();
    return prisma.blogPost.findMany({ orderBy: { updatedAt: "desc" } });
  });
}

export async function getAdminBlogPost(id: string) {
  return toActionResult(async () => {
    await requireAdminSession();
    const post = await prisma.blogPost.findUnique({ where: { id } });
    if (!post) throw new ValidationError("Post not found");
    const { getSiteConfigJson } = await import("@/lib/admin/site-config");
    const seo = await getSiteConfigJson(blogSeoKey(id), {
      metaTitle: "",
      metaDesc: "",
      ogImage: "",
    });
    return { post, seo };
  });
}

export async function createBlogPost(input: BlogFormInput) {
  return toActionResult(async () => {
    await requireWriteAccess();
    const parsed = blogFormSchema.safeParse(input);
    if (!parsed.success) throw new ValidationError(parsed.error.message);
    const data = parsed.data;

    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: sanitizeRichText(data.content),
        authorName: data.authorName,
        coverImage: data.coverImage || null,
        tags: data.tags,
        status: data.status,
        featured: data.featured,
        publishedAt:
          data.status === PublishStatus.PUBLISHED ? new Date() : null,
      },
    });

    if (data.seo) await setSiteConfigJson(blogSeoKey(post.id), data.seo);
    await invalidateBlogCaches();
    revalidatePath("/blog");
    return { post };
  });
}

export async function updateBlogPost(id: string, input: BlogFormInput) {
  return toActionResult(async () => {
    await requireWriteAccess();
    const parsed = blogFormSchema.safeParse(input);
    if (!parsed.success) throw new ValidationError(parsed.error.message);
    const data = parsed.data;

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: sanitizeRichText(data.content),
        authorName: data.authorName,
        coverImage: data.coverImage || null,
        tags: data.tags,
        status: data.status,
        featured: data.featured,
        publishedAt:
          data.status === PublishStatus.PUBLISHED ? new Date() : null,
      },
    });

    if (data.seo) await setSiteConfigJson(blogSeoKey(id), data.seo);
    await invalidateBlogCaches();
    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    return { post };
  });
}

export async function deleteBlogPost(id: string) {
  return toActionResult(async () => {
    await requireWriteAccess();
    await prisma.blogPost.delete({ where: { id } });
    await invalidateBlogCaches();
    revalidatePath("/blog");
    return { deleted: true };
  });
}
