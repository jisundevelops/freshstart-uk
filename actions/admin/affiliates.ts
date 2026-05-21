"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminSession, requireWriteAccess } from "@/actions/admin/guard";
import {
  affiliateFormSchema,
  type AffiliateFormInput,
} from "@/lib/validations/admin/affiliates";
import { toActionResult, ValidationError } from "@/lib/errors";
import { cacheInvalidatePattern } from "@/lib/redis";

export async function listAdminAffiliates(category?: string) {
  return toActionResult(async () => {
    await requireAdminSession();
    return prisma.affiliateLink.findMany({
      where: category
        ? { category: category as never }
        : undefined,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    });
  });
}

export async function getAdminAffiliate(id: string) {
  return toActionResult(async () => {
    await requireAdminSession();
    const link = await prisma.affiliateLink.findUnique({ where: { id } });
    if (!link) throw new ValidationError("Affiliate not found");
    return link;
  });
}

export async function saveAffiliate(input: AffiliateFormInput, id?: string) {
  return toActionResult(async () => {
    await requireWriteAccess();
    const parsed = affiliateFormSchema.safeParse(input);
    if (!parsed.success) throw new ValidationError(parsed.error.message);
    const data = parsed.data;

    const link = id
      ? await prisma.affiliateLink.update({
          where: { id },
          data: {
            ...data,
            logoUrl: data.logoUrl || null,
            promoCode: data.promoCode || null,
          },
        })
      : await prisma.affiliateLink.create({
          data: {
            ...data,
            logoUrl: data.logoUrl || null,
            promoCode: data.promoCode || null,
          },
        });

    await cacheInvalidatePattern("affiliates");
    revalidatePath("/tools/bank-compare");
    revalidatePath("/tools/sim-guide");
    return { link };
  });
}

export async function deleteAffiliate(id: string) {
  return toActionResult(async () => {
    await requireWriteAccess();
    await prisma.affiliateLink.delete({ where: { id } });
    await cacheInvalidatePattern("affiliates");
    return { deleted: true };
  });
}

export async function getAffiliateClickCounts() {
  return toActionResult(async () => {
    await requireAdminSession();
    const { getAffiliateClickStats } = await import("@/lib/analytics-admin");
    return getAffiliateClickStats(30);
  });
}
