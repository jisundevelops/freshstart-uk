import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { BlogExplorer } from "@/components/blog/blog-explorer";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPageMetadata, breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";
import { extractTags } from "@/lib/content";
import { fetchPublishedBlogPosts } from "@/lib/data";
import { BlogGridSkeleton } from "@/components/blog/blog-skeleton";

export const metadata = buildPageMetadata({
  title: "Blog",
  description:
    "Stories, budgeting tips, and visa advice for international students living in the United Kingdom.",
  path: "/blog",
  keywords: ["UK student blog", "international student tips", "budgeting UK", "visa advice"],
});

export const revalidate = 3600;

export default async function BlogPage() {
  const posts = await fetchPublishedBlogPosts({ limit: 50 });
  const tags = extractTags(posts);

  return (
    <section className="py-12 md:py-16">
      <Container>
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ])}
        />
        <JsonLd
          data={itemListJsonLd(
            posts.map((p) => ({ name: p.title, path: `/blog/${p.slug}` }))
          )}
        />
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Blog" },
          ]}
        />
        <header className="mb-10 max-w-2xl">
          <h1 className="gradient-heading font-heading text-4xl font-bold md:text-5xl">
            Blog
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Real-world advice from students who have navigated arrival, budgets,
            and life admin in the UK.
          </p>
        </header>
        <Suspense fallback={<BlogGridSkeleton />}>
          <BlogExplorer posts={posts} tags={tags} />
        </Suspense>
      </Container>
    </section>
  );
}
