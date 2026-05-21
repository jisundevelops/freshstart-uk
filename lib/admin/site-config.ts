import { prisma } from "@/lib/prisma";
import { cacheDel, cacheGetOrSet, cacheKey } from "@/lib/redis";

export async function getSiteConfigJson<T>(key: string, fallback: T): Promise<T> {
  return cacheGetOrSet(
    cacheKey("site-config", key),
    async () => {
      const row = await prisma.siteConfig.findUnique({ where: { key } });
      if (!row?.value) return fallback;
      try {
        return JSON.parse(row.value) as T;
      } catch {
        return fallback;
      }
    },
    300
  );
}

export async function setSiteConfigJson<T>(key: string, value: T): Promise<void> {
  await prisma.siteConfig.upsert({
    where: { key },
    update: { value: JSON.stringify(value) },
    create: { key, value: JSON.stringify(value) },
  });
  await cacheDel(cacheKey("site-config", key));
}

export const SITE_CONFIG_KEYS = {
  settings: "cms:settings",
  homepage: "cms:homepage",
  footer: "cms:footer",
  disclosure: "cms:disclosure",
  toolsBank: "cms:tools:bank",
  toolsSim: "cms:tools:sim",
  toolsCost: "cms:tools:cost",
  seoDefaults: "cms:seo:defaults",
} as const;

export function guideSeoKey(id: string): string {
  return `cms:seo:guide:${id}`;
}

export function blogSeoKey(id: string): string {
  return `cms:seo:blog:${id}`;
}
