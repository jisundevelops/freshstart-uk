import type { Metadata } from "next";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/constants";
import { absoluteUrl } from "@/lib/utils";

const DEFAULT_OG_IMAGE = "/opengraph-image";

export interface PageSeoInput {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  imagePath?: string;
  noIndex?: boolean;
  keywords?: string[];
}

export function buildPageMetadata(input: PageSeoInput): Metadata {
  const url = absoluteUrl(input.path);
  const ogImage = absoluteUrl(input.imagePath ?? DEFAULT_OG_IMAGE);

  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords?.join(", "),
    alternates: {
      canonical: url,
      languages: {
        "en-GB": url,
        "x-default": url,
      },
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: SITE_NAME,
      locale: "en_GB",
      type: input.type ?? "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: input.title }],
      ...(input.publishedTime
        ? { publishedTime: input.publishedTime }
        : {}),
      ...(input.modifiedTime ? { modifiedTime: input.modifiedTime } : {}),
      ...(input.tags ? { tags: input.tags } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [ogImage],
    },
    robots: {
      index: !input.noIndex,
      follow: !input.noIndex,
      ...(input.noIndex ? { googleBot: { index: false, follow: false } } : {}),
    },
  };
}

export function buildRootMetadata(): Metadata {
  return {
    ...buildPageMetadata({
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      path: "/",
    }),
    title: {
      default: SITE_NAME,
      template: `%s | ${SITE_NAME}`,
    },
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
    ),
    openGraph: {
      title: SITE_NAME,
      description: SITE_TAGLINE,
      type: "website",
      locale: "en_GB",
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleJsonLd(input: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  imagePath?: string;
  wordCount?: number;
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    image: absoluteUrl(input.imagePath ?? DEFAULT_OG_IMAGE),
    author: {
      "@type": "Organization",
      name: input.authorName ?? SITE_NAME,
      url: absoluteUrl("/"),
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: absoluteUrl("/"),
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl(DEFAULT_OG_IMAGE),
      },
    },
    inLanguage: "en-GB",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(input.path),
    },
    ...(input.wordCount ? { wordCount: input.wordCount } : {}),
  };
}

export function faqJsonLd(
  items: { question: string; answer: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

/** SoftwareApplication JSON-LD for interactive tool pages */
export function softwareApplicationJsonLd(input: {
  name: string;
  description: string;
  path: string;
  applicationCategory: string;
  operatingSystem?: string;
  offers?: { price: string; priceCurrency: string };
}): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    applicationCategory: input.applicationCategory,
    operatingSystem: input.operatingSystem ?? "Web",
    offers: input.offers ?? {
      "@type": "Offer",
      price: "0",
      priceCurrency: "GBP",
    },
    inLanguage: "en-GB",
  };
}

/** ItemList JSON-LD for listing pages */
export function itemListJsonLd(
  items: { name: string; path: string }[]
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

export function websiteJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: absoluteUrl("/"),
    inLanguage: "en-GB",
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/guides")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
