import Link from "next/link";
import type { ReactNode } from "react";
import {
  Landmark,
  Smartphone,
  ArrowRight,
  Wrench,
  Calculator,
} from "lucide-react";
import { resolveToolHref } from "@/lib/tools/routes";
import { HeroSection } from "@/components/home/hero";
import { StatsBar } from "@/components/home/stats-bar";
import { SectionHeader } from "@/components/home/section-header";
import { TestimonialsCarousel } from "@/components/home/testimonials-carousel";
import { NewsletterSignup } from "@/components/home/newsletter-signup";
import { GuideCard } from "@/components/content/guide-card";
import { BlogCard } from "@/components/content/blog-card";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { faqJsonLd } from "@/lib/seo";
import {
  fetchPublishedBlogPosts,
  fetchPublishedGuides,
  fetchPublishedTools,
} from "@/lib/data";

const HOME_FAQ = [
  {
    question: "What is FreshStart UK?",
    answer:
      "FreshStart UK is a free resource platform helping international students settle in the United Kingdom with practical guides on banking, mobile, healthcare, and more.",
  },
  {
    question: "Who are the guides for?",
    answer:
      "Our content is written for international students on Student visas, exchange students, and anyone relocating to the UK for university study.",
  },
  {
    question: "Are partner links paid?",
    answer:
      "Some links to banks and SIM providers are affiliate links. We disclose this clearly and only recommend services useful for students.",
  },
];

export default async function HomePage() {
  const [featuredGuides, latestPosts, tools] = await Promise.all([
    fetchPublishedGuides({ featured: true, limit: 3 }),
    fetchPublishedBlogPosts({ limit: 3 }),
    fetchPublishedTools(),
  ]);

  const iconMap: Record<string, ReactNode> = {
    landmark: <Landmark className="h-6 w-6" aria-hidden />,
    smartphone: <Smartphone className="h-6 w-6" aria-hidden />,
    calculator: <Calculator className="h-6 w-6" aria-hidden />,
    wrench: <Wrench className="h-6 w-6" aria-hidden />,
  };

  return (
    <>
      <JsonLd data={faqJsonLd(HOME_FAQ)} />
      <HeroSection />
      <StatsBar />

      <section className="py-16 md:py-20" aria-labelledby="featured-guides">
        <Container>
          <SectionHeader
            title="Featured guides"
            description="Start with the essentials every international student needs in their first weeks."
            href="/guides"
          />
          {featuredGuides.length > 0 ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredGuides.map((guide) => (
                <li key={guide.id}>
                  <GuideCard guide={guide} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">
              Guides are loading soon. Check back shortly.
            </p>
          )}
        </Container>
      </section>

      <section
        className="border-y border-border/40 bg-surface/20 py-16 md:py-20"
        aria-labelledby="tools-preview"
      >
        <Container>
          <SectionHeader
            title="Interactive tools"
            description="Compare banks, SIM plans, and essentials — built for student arrivals."
            href="/tools"
            linkLabel="Browse tools"
          />
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <li key={tool.id}>
                <Card className="glow-accent-hover h-full">
                  <Link
                    href={resolveToolHref(tool.slug, tool.href)}
                    className="block h-full"
                  >
                    <CardHeader className="flex flex-row items-start gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent">
                        {iconMap[tool.icon ?? "wrench"] ?? iconMap.wrench}
                      </span>
                      <div>
                        <CardTitle className="text-xl">{tool.name}</CardTitle>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {tool.description}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <span className="inline-flex items-center gap-1 text-sm font-medium text-accent">
                        Open tool
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </CardContent>
                  </Link>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <TestimonialsCarousel />

      <section className="py-16 md:py-20" aria-labelledby="latest-blog">
        <Container>
          <SectionHeader
            title="Latest from the blog"
            description="Budgeting, visas, and real student life in the UK."
            href="/blog"
          />
          {latestPosts.length > 0 ? (
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
                <li key={post.id}>
                  <BlogCard post={post} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No blog posts yet.</p>
          )}
        </Container>
      </section>

      <NewsletterSignup />

      <section className="pb-8">
        <Container className="text-center">
          <Button size="lg" asChild>
            <Link href="/scholarships">
              Explore UK scholarships
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Container>
      </section>
    </>
  );
}
