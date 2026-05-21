import Link from "next/link";
import { ExternalLink, GraduationCap } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  faqJsonLd,
} from "@/lib/seo";
import { SCHOLARSHIPS, SCHOLARSHIP_FAQ } from "@/lib/scholarships";

export const metadata = buildPageMetadata({
  title: "UK Scholarships for International Students",
  description:
    "Explore Chevening, Commonwealth, Gates Cambridge, GREAT Scholarships, and university awards for international students in the UK.",
  path: "/scholarships",
});

export const revalidate = 86400;

export default function ScholarshipsPage() {
  return (
    <section className="py-12 md:py-16">
      <Container>
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Scholarships", path: "/scholarships" },
          ])}
        />
        <JsonLd data={faqJsonLd(SCHOLARSHIP_FAQ)} />
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Scholarships" },
          ]}
        />

        <header className="mb-12 max-w-3xl">
          <p className="mb-3 inline-flex items-center gap-2 font-heading text-xs font-semibold uppercase tracking-widest text-accent">
            <GraduationCap className="h-4 w-4" aria-hidden />
            Funding your UK degree
          </p>
          <h1 className="gradient-heading font-heading text-4xl font-bold md:text-5xl">
            UK scholarships for international students
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Major funding pathways for postgraduate and exceptional undergraduate
            applicants. Always confirm deadlines on official scheme websites.
          </p>
        </header>

        <ul className="grid gap-6 lg:grid-cols-2">
          {SCHOLARSHIPS.map((scholarship) => (
            <li key={scholarship.id}>
              <Card className="h-full glow-accent-hover">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-xl">{scholarship.name}</CardTitle>
                    {scholarship.featured && (
                      <Badge variant="default">Featured</Badge>
                    )}
                  </div>
                  <p className="text-sm text-accent">{scholarship.provider}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                      Award
                    </p>
                    <p className="mt-1 text-foreground">{scholarship.amount}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                      Eligibility
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {scholarship.eligibility}
                    </p>
                  </div>
                  <p className="text-sm text-muted">
                    Deadline: {scholarship.deadline}
                  </p>
                  <Button variant="secondary" size="sm" asChild>
                    <a
                      href={scholarship.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Official website
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>

        <section
          className="mt-16"
          aria-labelledby="scholarship-faq"
        >
          <h2
            id="scholarship-faq"
            className="font-heading text-2xl font-semibold text-foreground"
          >
            Frequently asked questions
          </h2>
          <dl className="mt-8 space-y-6">
            {SCHOLARSHIP_FAQ.map((item) => (
              <div
                key={item.question}
                className="glass rounded-lg p-6"
              >
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

        <div className="mt-12 text-center">
          <Button asChild>
            <Link href="/guides">Prepare your UK arrival</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
