import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";
import { FOOTER_LINKS, SITE_TAGLINE } from "@/lib/constants";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-auto border-t border-border/50 bg-surface/30">
      <Container className="py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo />
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              {SITE_TAGLINE}
            </p>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">
              Platform
            </h4>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-underline text-sm text-muted-foreground transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-foreground">
              Legal
            </h4>
            <ul className="mt-4 space-y-2">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="link-underline text-sm text-muted-foreground transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-border/60" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted sm:flex-row">
          <p>&copy; {year} FreshStart UK. All rights reserved.</p>
          <p className="text-muted-foreground">
            Built for international students in the United Kingdom
          </p>
        </div>
      </Container>
    </footer>
  );
}
