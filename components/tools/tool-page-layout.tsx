import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import type { BreadcrumbItem } from "@/components/seo/breadcrumbs";

interface ToolPageLayoutProps {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  description: string;
  children: React.ReactNode;
  faq?: { question: string; answer: string }[];
}

export function ToolPageLayout({
  breadcrumbs,
  title,
  description,
  children,
  faq,
}: ToolPageLayoutProps) {
  const jsonBreadcrumbs = breadcrumbs.map((b) => ({
    name: b.label,
    path: b.href ?? "#",
  }));

  return (
    <section className="py-10 md:py-14">
      <Container>
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Tools", path: "/tools" },
            ...jsonBreadcrumbs.filter((b) => b.path !== "#"),
          ])}
        />
        {faq && faq.length > 0 && <JsonLd data={faqJsonLd(faq)} />}
        <Breadcrumbs items={breadcrumbs} />
        <header className="mb-8 max-w-3xl">
          <h1 className="gradient-heading font-heading text-3xl font-bold md:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{description}</p>
        </header>
        {children}
        {faq && faq.length > 0 && (
          <section className="mt-16" aria-labelledby="tool-faq-heading">
            <h2
              id="tool-faq-heading"
              className="font-heading text-2xl font-semibold text-foreground"
            >
              Frequently asked questions
            </h2>
            <dl className="mt-6 space-y-4">
              {faq.map((item) => (
                <div key={item.question} className="glass rounded-lg p-5">
                  <dt className="font-heading font-semibold text-foreground">
                    {item.question}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </Container>
    </section>
  );
}
