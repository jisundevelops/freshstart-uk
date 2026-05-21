import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { fontDmSans, fontSyne } from "@/lib/fonts";
import { buildRootMetadata } from "@/lib/seo";
import { AffiliateDisclosure } from "@/components/layout/affiliate-disclosure";
import { Footer } from "@/components/layout/footer";
import { Navigation } from "@/components/layout/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { websiteJsonLd } from "@/lib/seo";
import { GridOverlay } from "@/components/ui/grid-overlay";
import "./globals.css";

export const metadata: Metadata = buildRootMetadata();

export const viewport: Viewport = {
  themeColor: "#04080F",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = headers().get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html
      lang="en-GB"
      className={`dark ${fontSyne.variable} ${fontDmSans.variable}`}
    >
      <body className="relative flex min-h-screen flex-col bg-background">
        {isAdmin ? (
          children
        ) : (
          <>
            <GridOverlay />
            <Navigation />
            <JsonLd data={websiteJsonLd()} />
            <main className="relative z-10 flex-1">{children}</main>
            <AffiliateDisclosure />
            <Footer />
          </>
        )}
      </body>
    </html>
  );
}
