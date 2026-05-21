export const SITE_NAME = "FreshStart UK";
export const SITE_TAGLINE =
  "Your guide to settling in as an international student in the United Kingdom";
export const SITE_DESCRIPTION =
  "Practical guides, resources, and tools for international students arriving in the UK.";

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/guides", label: "Guides" },
  { href: "/blog", label: "Blog" },
  { href: "/tools", label: "Tools" },
  { href: "/scholarships", label: "Scholarships" },
] as const;

export const FOOTER_LINKS = {
  platform: [
    { href: "/guides", label: "Guides" },
    { href: "/blog", label: "Blog" },
    { href: "/tools", label: "Tools" },
    { href: "/scholarships", label: "Scholarships" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
  ],
} as const;
