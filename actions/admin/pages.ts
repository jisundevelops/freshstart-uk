"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sanitizeRichText } from "@/lib/admin/sanitize";
import {
  getSiteConfigJson,
  setSiteConfigJson,
  SITE_CONFIG_KEYS,
} from "@/lib/admin/site-config";
import { requireAdminSession, requireWriteAccess } from "@/actions/admin/guard";
import { toActionResult, ValidationError } from "@/lib/errors";
import { publishStatusSchema } from "@/lib/validations/admin/shared";

const pageFormSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  status: publishStatusSchema,
});

const homepageSchema = z.object({
  heroTitle: z.string().min(1).max(120),
  heroSubtitle: z.string().min(10).max(300),
  ctaPrimary: z.string().min(1).max(60),
  ctaSecondary: z.string().min(1).max(60),
  stats: z.array(
    z.object({ value: z.string(), label: z.string() })
  ).max(6),
});

const footerSchema = z.object({
  tagline: z.string().max(300),
  copyright: z.string().max(120),
});

export type HomepageConfig = z.infer<typeof homepageSchema>;
export type FooterConfig = z.infer<typeof footerSchema>;

export async function listAdminPages() {
  return toActionResult(async () => {
    await requireAdminSession();
    return prisma.page.findMany({ orderBy: { title: "asc" } });
  });
}

export async function getCmsSections() {
  return toActionResult(async () => {
    await requireAdminSession();
    const [homepage, footer, disclosure] = await Promise.all([
      getSiteConfigJson(SITE_CONFIG_KEYS.homepage, {
        heroTitle: "FreshStart UK",
        heroSubtitle:
          "Your guide to settling in as an international student in the United Kingdom",
        ctaPrimary: "Explore guides",
        ctaSecondary: "Find scholarships",
        stats: [
          { value: "4+", label: "Essential guides" },
          { value: "9+", label: "Partner providers" },
        ],
      }),
      getSiteConfigJson(SITE_CONFIG_KEYS.footer, {
        tagline:
          "Practical guides for international students in the United Kingdom",
        copyright: "FreshStart UK",
      }),
      getSiteConfigJson(SITE_CONFIG_KEYS.disclosure, {
        text: "FreshStart UK may earn a commission when you use partner links.",
      }),
    ]);
    return { homepage, footer, disclosure };
  });
}

export async function saveCmsSections(input: {
  homepage: HomepageConfig;
  footer: FooterConfig;
  disclosure: { text: string };
}) {
  return toActionResult(async () => {
    await requireWriteAccess();
    const homepage = homepageSchema.parse(input.homepage);
    const footer = footerSchema.parse(input.footer);
    const disclosure = z
      .object({ text: z.string().min(10).max(1200) })
      .parse(input.disclosure);

    await Promise.all([
      setSiteConfigJson(SITE_CONFIG_KEYS.homepage, homepage),
      setSiteConfigJson(SITE_CONFIG_KEYS.footer, footer),
      setSiteConfigJson(SITE_CONFIG_KEYS.disclosure, disclosure),
    ]);

    revalidatePath("/");
    return { saved: true };
  });
}

export async function savePage(
  input: z.infer<typeof pageFormSchema>,
  id?: string
) {
  return toActionResult(async () => {
    await requireWriteAccess();
    const data = pageFormSchema.parse(input);
    const page = id
      ? await prisma.page.update({
          where: { id },
          data: {
            ...data,
            content: sanitizeRichText(data.content),
          },
        })
      : await prisma.page.create({
          data: {
            ...data,
            content: sanitizeRichText(data.content),
          },
        });
    revalidatePath("/");
    return { page };
  });
}
