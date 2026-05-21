import { Suspense } from "react";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { GuidesExplorer } from "@/components/guides/guides-explorer";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPageMetadata, breadcrumbJsonLd, itemListJsonLd } from "@/lib/seo";
import { extractCategories } from "@/lib/content";
import { fetchPublishedGuides } from "@/lib/data";
import { GuidesGridSkeleton } from "@/components/guides/guides-skeleton";

export const metadata = buildPageMetadata({
  title: "Student Guides",
  description:
    "Practical UK arrival guides for international students — banking, SIM cards, NI numbers, GP registration, and more.",
  path: "/guides",
  keywords: ["UK student guides", "banking UK", "SIM card UK", "GP registration", "NI number"],
});

export const revalidate = 3600;

export default async function GuidesPage() {
  const guides = await fetchPublishedGuides({ limit: 50 });
  const categories = extractCategories(guides);

  return (
    <section className="py-12 md:py-16">
      <Container>
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
          ])}
        />
        <JsonLd
          data={itemListJsonLd(
            guides.map((g) => ({ name: g.title, path: `/guides/${g.slug}` }))
          )}
        />
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Guides" },
          ]}
        />
        <header className="mb-10 max-w-2xl">
          <h1 className="gradient-heading font-heading text-4xl font-bold md:text-5xl">
            Student guides
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Step-by-step help for settling in the UK — from your first bank
            account to your first GP appointment.
          </p>
        </header>
        <Suspense fallback={<GuidesGridSkeleton />}>
          <GuidesExplorer guides={guides} categories={categories} />
        </Suspense>
      </Container>
    </section>
  );
}
