import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { MarkdownContent } from "@/lib/markdown";
import { SanitizedHtml } from "@/components/content/sanitized-html";
import { isHtmlContent } from "@/lib/admin/sanitize";
import { SocialShare } from "@/components/content/social-share";
import { RelatedPosts } from "@/components/content/related-posts";
import { Badge } from "@/components/ui/badge";
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
import { fetchBlogPostBySlug, fetchPublishedBlogPosts } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { PublishStatus } from "@prisma/client";
import type { Metadata } from "next";

export const revalidate = 3600;

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateStaticParams() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: PublishStatus.PUBLISHED },
      select: { slug: true },
    });
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const post = await fetchBlogPostBySlug(params.slug);
  if (!post) {
    return { title: "Article not found" };
  }
  return buildPageMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt?.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
    tags: post.tags,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await fetchBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const readingMinutes = calculateReadingTime(post.content);
  const allPosts = await fetchPublishedBlogPosts({ limit: 20 });
  const related = allPosts
    .filter((p) => p.slug !== post.slug)
    .filter(
      (p) => p.tags.some((tag) => post.tags.includes(tag)) || p.featured
    )
    .slice(0, 3);

  return (
    <article className="py-12 md:py-16">
      <Container size="narrow">
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
            { name: post.title, path: `/blog/${post.slug}` },
          ])}
        />
        <JsonLd
          data={articleJsonLd({
            title: post.title,
            description: post.excerpt,
            path: `/blog/${post.slug}`,
            datePublished:
              post.publishedAt?.toISOString() ?? post.createdAt.toISOString(),
            dateModified: post.updatedAt.toISOString(),
            authorName: post.authorName,
          })}
        />
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: post.title },
          ]}
        />

        <header className="mb-10">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="mt-4 font-heading text-4xl font-bold text-foreground md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{post.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden />
              {readingMinutes} min read
            </span>
            <span>By {post.authorName}</span>
            {post.publishedAt && (
              <time dateTime={post.publishedAt.toISOString()}>
                {formatDate(post.publishedAt)}
              </time>
            )}
          </div>
        </header>

        <div className="border-t border-border/50 pt-10">
          {isHtmlContent(post.content) ? (
            <SanitizedHtml html={post.content} />
          ) : (
            <MarkdownContent content={post.content} />
          )}
        </div>

        <div className="mt-10 border-t border-border/50 pt-8">
          <SocialShare title={post.title} path={`/blog/${post.slug}`} />
        </div>

        <RelatedPosts posts={related} />
      </Container>
    </article>
  );
}
