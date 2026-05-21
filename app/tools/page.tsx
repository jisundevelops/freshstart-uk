import Link from "next/link";
import type { ReactNode } from "react";
import {
  Calculator,
  Landmark,
  Smartphone,
  ArrowRight,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPageMetadata, breadcrumbJsonLd } from "@/lib/seo";
import { fetchToolsCatalog } from "@/lib/tools/fetch";
import { resolveToolHref } from "@/lib/tools/routes";

export const metadata = buildPageMetadata({
  title: "Interactive Tools",
  description:
    "Compare UK student banks, SIM plans, and estimate your monthly cost of living as an international student.",
  path: "/tools",
});

export const revalidate = 3600;

const ICONS: Record<string, ReactNode> = {
  landmark: <Landmark className="h-6 w-6" aria-hidden />,
  smartphone: <Smartphone className="h-6 w-6" aria-hidden />,
  calculator: <Calculator className="h-6 w-6" aria-hidden />,
};

export default async function ToolsIndexPage() {
  const tools = await fetchToolsCatalog();

  return (
    <section className="py-12 md:py-16">
      <Container>
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
          ])}
        />
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Tools" },
          ]}
        />
        <header className="mb-10 max-w-2xl">
          <h1 className="gradient-heading font-heading text-4xl font-bold md:text-5xl">
            Interactive tools
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Practical calculators and comparisons built for international
            students arriving in the UK.
          </p>
        </header>

        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const href = resolveToolHref(tool.slug, tool.href);
            const icon = ICONS[tool.icon ?? "calculator"] ?? ICONS.calculator;
            return (
              <li key={tool.id}>
                <Card className="h-full glow-accent-hover">
                  <Link href={href} className="flex h-full flex-col">
                    <CardHeader className="flex flex-row items-start gap-4">
                      <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-accent/30 bg-accent/10 text-accent">
                        {icon}
                      </span>
                      <CardTitle className="text-xl">{tool.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="mt-auto">
                      <p className="text-sm text-muted-foreground">
                        {tool.description}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent">
                        Open tool
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </CardContent>
                  </Link>
                </Card>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
