import { Container } from "@/components/ui/container";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPageMetadata, breadcrumbJsonLd } from "@/lib/seo";

export const metadata = buildPageMetadata({
  title: "Privacy Policy",
  description: "FreshStart UK privacy policy — how we collect, use, and protect your data.",
  path: "/privacy",
  noIndex: true,
});

export default function PrivacyPage() {
  return (
    <section className="py-12 md:py-16">
      <Container size="narrow">
        <JsonLd
          data={breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Privacy Policy", path: "/privacy" },
          ])}
        />
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Privacy Policy" },
          ]}
        />
        <h1 className="gradient-heading font-heading text-4xl font-bold md:text-5xl">
          Privacy Policy
        </h1>
        <div className="prose-freshstart mt-8 space-y-6 text-muted-foreground">
          <p>
            FreshStart UK (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) is committed to protecting your privacy.
            This policy explains how we collect, use, and safeguard your personal information
            when you visit our website at freshstartuk.co.uk.
          </p>

          <h2 className="font-heading text-2xl font-semibold text-foreground">Information We Collect</h2>
          <p>
            We collect minimal personal data. Specifically, we may collect: anonymous analytics
            data (page views, link clicks, tool usage patterns) to improve our content; email
            addresses voluntarily provided through our newsletter signup; and cookies necessary
            for site functionality and authentication.
          </p>

          <h2 className="font-heading text-2xl font-semibold text-foreground">How We Use Your Information</h2>
          <p>
            We use collected information to: improve our website content and user experience;
            send newsletter updates (only to subscribers who have opted in); maintain site
            security and prevent abuse; and comply with legal obligations. We do not sell,
            rent, or share your personal information with third parties for marketing purposes.
          </p>

          <h2 className="font-heading text-2xl font-semibold text-foreground">Cookies</h2>
          <p>
            Our site uses essential cookies for authentication and session management. We also
            use analytics cookies to understand how visitors interact with our content. You can
            control cookie preferences through your browser settings.
          </p>

          <h2 className="font-heading text-2xl font-semibold text-foreground">Affiliate Links</h2>
          <p>
            Some links on our site are affiliate links, meaning we may earn a commission if you
            click through and make a purchase or sign up. These partnerships do not influence
            our editorial content. We clearly disclose affiliate relationships on relevant pages.
          </p>

          <h2 className="font-heading text-2xl font-semibold text-foreground">Your Rights</h2>
          <p>
            Under the UK General Data Protection Regulation (UK GDPR), you have the right to:
            access your personal data; request correction or deletion of your data; object to
            processing; and request data portability. To exercise these rights, contact us at
            privacy@freshstartuk.co.uk.
          </p>

          <h2 className="font-heading text-2xl font-semibold text-foreground">Contact</h2>
          <p>
            If you have questions about this privacy policy, please email
            privacy@freshstartuk.co.uk. This policy was last updated in May 2025.
          </p>
        </div>
      </Container>
    </section>
  );
}
