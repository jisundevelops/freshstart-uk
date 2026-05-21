"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { sanitizeRichText } from "@/lib/admin/sanitize";
import { guideSeoKey, setSiteConfigJson } from "@/lib/admin/site-config";
import { requireAdminSession, requireWriteAccess } from "@/actions/admin/guard";
import { guideFormSchema, type GuideFormInput } from "@/lib/validations/admin/guides";
import { toActionResult, ValidationError } from "@/lib/errors";
import { cacheInvalidatePattern } from "@/lib/redis";
import { PublishStatus } from "@prisma/client";

async function invalidateGuideCaches() {
  await cacheInvalidatePattern("guides");
}

export async function listAdminGuides() {
  return toActionResult(async () => {
    await requireAdminSession();
    return prisma.guide.findMany({
      orderBy: [{ updatedAt: "desc" }],
    });
  });
}

export async function getAdminGuide(id: string) {
  return toActionResult(async () => {
    await requireAdminSession();
    const guide = await prisma.guide.findUnique({ where: { id } });
    if (!guide) throw new ValidationError("Guide not found");
    const { getSiteConfigJson } = await import("@/lib/admin/site-config");
    const seo = await getSiteConfigJson(guideSeoKey(id), {
      metaTitle: "",
      metaDesc: "",
      ogImage: "",
    });
    return { guide, seo };
  });
}

export async function createGuide(input: GuideFormInput) {
  return toActionResult(async () => {
    await requireWriteAccess();
    const parsed = guideFormSchema.safeParse(input);
    if (!parsed.success) throw new ValidationError(parsed.error.message);
    const data = parsed.data;
    const existing = await prisma.guide.findUnique({
      where: { slug: data.slug },
    });
    if (existing) throw new ValidationError("Slug already exists");

    const guide = await prisma.guide.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: sanitizeRichText(data.content),
        category: data.category,
        coverImage: data.coverImage || null,
        status: data.status,
        featured: data.featured,
        sortOrder: data.sortOrder,
        publishedAt:
          data.status === PublishStatus.PUBLISHED ? new Date() : null,
      },
    });

    if (data.seo) await setSiteConfigJson(guideSeoKey(guide.id), data.seo);
    await invalidateGuideCaches();
    revalidatePath("/guides");
    return { guide };
  });
}

export async function saveGuide(input: GuideFormInput) {
  return toActionResult(async () => {
    await requireWriteAccess();
    const parsed = guideFormSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.message);
    }
    const data = parsed.data;
    const content = sanitizeRichText(data.content);
    const publishedAt =
      data.status === PublishStatus.PUBLISHED ? new Date() : null;

    const guide = await prisma.guide.upsert({
      where: { slug: data.slug },
      create: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content,
        category: data.category,
        coverImage: data.coverImage || null,
        status: data.status,
        featured: data.featured,
        sortOrder: data.sortOrder,
        publishedAt,
      },
      update: {
        title: data.title,
        excerpt: data.excerpt,
        content,
        category: data.category,
        coverImage: data.coverImage || null,
        status: data.status,
        featured: data.featured,
        sortOrder: data.sortOrder,
        publishedAt,
      },
    });

    if (data.seo) {
      await setSiteConfigJson(guideSeoKey(guide.id), data.seo);
    }

    await invalidateGuideCaches();
    revalidatePath("/guides");
    revalidatePath(`/guides/${guide.slug}`);
    return { guide };
  });
}

export async function updateGuideById(id: string, input: GuideFormInput) {
  return toActionResult(async () => {
    await requireWriteAccess();
    const parsed = guideFormSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.message);
    }
    const data = parsed.data;
    const content = sanitizeRichText(data.content);

    const guide = await prisma.guide.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content,
        category: data.category,
        coverImage: data.coverImage || null,
        status: data.status,
        featured: data.featured,
        sortOrder: data.sortOrder,
        publishedAt:
          data.status === PublishStatus.PUBLISHED ? new Date() : null,
      },
    });

    if (data.seo) {
      await setSiteConfigJson(guideSeoKey(id), data.seo);
    }

    await invalidateGuideCaches();
    revalidatePath("/guides");
    revalidatePath(`/guides/${guide.slug}`);
    return { guide };
  });
}

export async function deleteGuide(id: string) {
  return toActionResult(async () => {
    await requireWriteAccess();
    await prisma.guide.delete({ where: { id } });
    await invalidateGuideCaches();
    revalidatePath("/guides");
    return { deleted: true };
  });
}

// fix mistaken import in guides.ts - remove blogSeoKey import