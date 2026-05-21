import { notFound } from "next/navigation";
import Link from "next/link";
import { Clock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { MarkdownContent } from "@/lib/markdown";
import { SanitizedHtml } from "@/components/content/sanitized-html";
import { isHtmlContent } from "@/lib/admin/sanitize";
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
import { fetchGuideBySlug, fetchPublishedGuides } from "@/lib/data";
import { formatLabel } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { PublishStatus } from "@prisma/client";
import type { Metadata } from "next";

export const revalidate = 3600;

interface GuidePageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  try {
    const guides = await prisma.guide.findMany({
      where: { status: PublishStatus.PUBLISHED },
      select: { slug: true },
    });
    return guides.map((guide) => ({ slug: guide.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const guide = await fetchGuideBySlug(params.slug);
  if (!guide) {
    return { title: "Guide not found" };
  }
  return buildPageMetadata({
    title: guide.title,
    description: guide.excerpt,
    path: `/guides/${guide.slug}`,
    type: "article",
    publishedTime: guide.publishedAt?.toISOString(),
    modifiedTime: guide.updatedAt.toISOString(),
  });
}

export default async function GuidePage({ params }: GuidePageProps) {
  const guide = await fetchGuideBySlug(params.slug);

  if (!guide) {
    notFound();
  }

  const readingMinutes = calculateReadingTime(guide.content);
  const allGuides = await fetchPublishedGuides({ limit: 20 });
  const related = allGuides
    .filter((g) => g.slug !== guide.slug && g.category === guide.category)
    .slice(0, 3);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Guides", href: "/guides" },
    { label: guide.title },
  ];

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
            datePublished:
              guide.publishedAt?.toISOString() ?? guide.createdAt.toISOString(),
            dateModified: guide.updatedAt.toISOString(),
          })}
        />
        <Breadcrumbs items={breadcrumbs} />

        <header className="mb-10">
          <Link
            href={`/guides?category=${guide.category}`}
            className="text-sm font-medium uppercase tracking-wider text-accent hover:underline"
          >
            {formatLabel(guide.category)}
          </Link>
          <h1 className="mt-3 font-heading text-4xl font-bold text-foreground md:text-5xl">
            {guide.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{guide.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden />
              {readingMinutes} min read
            </span>
            {guide.publishedAt && (
              <time dateTime={guide.publishedAt.toISOString()}>
                Published {formatDate(guide.publishedAt)}
              </time>
            )}
          </div>
        </header>

        <div className="border-t border-border/50 pt-10">
          {isHtmlContent(guide.content) ? (
            <SanitizedHtml html={guide.content} />
          ) : (
            <MarkdownContent content={guide.content} />
          )}
        </div>

        <RelatedGuides guides={related} />
      </Container>
    </article>
  );
}
