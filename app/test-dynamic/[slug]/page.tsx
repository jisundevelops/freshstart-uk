import { prisma } from "@/lib/prisma";
import { PublishStatus } from "@prisma/client";
import { notFound } from "next/navigation";
import { cacheGetOrSet, cacheKey } from "@/lib/redis";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { MarkdownContent } from "@/lib/markdown";
import { RelatedGuides } from "@/components/content/related-guides";
import { JsonLd } from "@/components/seo/json-ld";
import {
  articleJsonLd,
  breadcrumbJsonLd,
  buildPageMetadata,
} from "@/lib/seo";
import {
  calculateReadingTime,
  formatDate,
} from "@/lib/content";
import { formatLabel } from "@/lib/utils";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const guide = await cacheGetOrSet(
      cacheKey("guides", `slug:${params.slug}`),
      () =>
        prisma.guide.findFirst({
          where: { slug: params.slug, status: PublishStatus.PUBLISHED },
        }),
      600
    );
    if (!guide) return { title: "Guide not found" };
    return buildPageMetadata({
      title: guide.title,
      description: guide.excerpt,
      path: `/guides/${guide.slug}`,
      type: "article",
      publishedTime: guide.publishedAt?.toISOString(),
      modifiedTime: guide.updatedAt.toISOString(),
      imagePath: guide.coverImage ?? undefined,
      keywords: [formatLabel(guide.category), "UK student guide", guide.title],
    });
  } catch {
    return { title: "Guide" };
  }
}

export default async function TestDynamicPage({ params }: Props) {
  let guide;
  try {
    guide = await cacheGetOrSet(
      cacheKey("guides", `slug:${params.slug}`),
      () =>
        prisma.guide.findFirst({
          where: { slug: params.slug, status: PublishStatus.PUBLISHED },
        }),
      600
    );
  } catch {
    notFound();
  }

  if (!guide) {
    notFound();
  }

  const readingMinutes = calculateReadingTime(guide.content);

  let related: Awaited<ReturnType<typeof getRelatedGuides>> = [];
  try {
    related = await getRelatedGuides(guide.slug, guide.category);
  } catch {}

  return (
    <article className="py-12 md:py-16">
      <Container size="narrow">
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
            { name: guide.title, path: `/guides/${guide.slug}` },
          ])}
        />
        <JsonLd
          data={articleJsonLd({
            title: guide.title,
            description: guide.excerpt,
            path: `/guides/${guide.slug}`,
            datePublished: guide.publishedAt?.toISOString() ?? guide.createdAt.toISOString(),
            dateModified: guide.updatedAt.toISOString(),
            imagePath: guide.coverImage ?? undefined,
            wordCount: guide.content.split(/\s+/).length,
          })}
        />
        <Breadcrumbs items={[
          { label: "Home", href: "/" },
          { label: "Guides", href: "/guides" },
          { label: guide.title },
        ]} />
        <header className="mb-10">
          <h1 className="mt-3 font-heading text-4xl font-bold text-foreground md:text-5xl">
            {guide.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{guide.excerpt}</p>
          <div className="mt-6 text-sm text-muted">
            {readingMinutes} min read
          </div>
        </header>
        <div className="border-t border-border/50 pt-10">
          <MarkdownContent content={guide.content} />
        </div>
        <RelatedGuides guides={related} />
      </Container>
    </article>
  );
}

async function getRelatedGuides(currentSlug: string, category: string) {
  return prisma.guide.findMany({
    where: { status: PublishStatus.PUBLISHED, category, slug: { not: currentSlug } },
    orderBy: [{ sortOrder: "asc" }, { publishedAt: "desc" }],
    take: 3,
    select: { id: true, slug: true, title: true, excerpt: true, category: true, coverImage: true, featured: true, publishedAt: true },
  });
}
