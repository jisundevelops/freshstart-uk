import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Terms of Service",
  description: "FreshStart UK terms of service — the rules and guidelines for using our platform.",
  path: "/terms",
  noIndex: true,
});

export default function TermsPage() {
  return (
    <section className="py-12 md:py-16">
      <Container size="narrow">
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Terms of Service", path: "/terms" },
          ])}
        />
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Terms of Service" },
          ]}
        />
        <h1 className="gradient-heading font-heading text-4xl font-bold md:text-5xl">
          Terms of Service
        </h1>
        <div className="prose-freshstart mt-8 space-y-6 text-muted-foreground">
          <p>
            By accessing and using FreshStart UK (&quot;the Site&quot;), you agree to be bound by these
            Terms of Service. If you do not agree with any part of these terms, you should not
            use the Site.
          </p>

          <h2 className="font-heading text-2xl font-semibold text-foreground">Use of the Site</h2>
          <p>
            FreshStart UK provides informational content, guides, and interactive tools for
            international students in the United Kingdom. The content is provided for general
            information purposes only and does not constitute financial, legal, or immigration
            advice. You should always verify information with official sources and qualified
            professionals.
          </p>

          <h2 className="font-heading text-2xl font-semibold text-foreground">Accuracy of Information</h2>
          <p>
            While we strive to keep information accurate and up to date, we make no warranties
            or representations about the completeness, reliability, or accuracy of the content.
            Bank account features, SIM card plans, and living costs may change without notice.
            Always check the latest terms directly with the service provider.
          </p>

          <h2 className="font-heading text-2xl font-semibold text-foreground">Affiliate Relationships</h2>
          <p>
            The Site contains affiliate links to third-party services. If you use these links,
            we may receive a commission at no additional cost to you. Affiliate relationships
            do not influence our editorial recommendations. We only link to services we believe
            are genuinely useful for international students.
          </p>

          <h2 className="font-heading text-2xl font-semibold text-foreground">Intellectual Property</h2>
          <p>
            All content on FreshStart UK, including text, graphics, logos, and software, is the
            property of FreshStart UK and is protected by copyright law. You may not reproduce,
            distribute, or create derivative works without our prior written consent.
          </p>

          <h2 className="font-heading text-2xl font-semibold text-foreground">Limitation of Liability</h2>
          <p>
            FreshStart UK shall not be liable for any direct, indirect, incidental, or
            consequential damages arising from the use of or inability to use the Site. This
            includes, but is not limited to, damages for loss of profits, data, or other
            intangible losses.
          </p>

          <h2 className="font-heading text-2xl font-semibold text-foreground">Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. Continued use of the Site
            after changes constitutes acceptance of the new terms. For questions about these
            terms, contact us at legal@freshstartuk.co.uk.
          </p>
        </div>
      </Container>
    </section>
  );
}
