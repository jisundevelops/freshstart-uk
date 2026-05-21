"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import {
  getSiteConfigJson,
  setSiteConfigJson,
  SITE_CONFIG_KEYS,
} from "@/lib/admin/site-config";
import {
  requireAdminSession,
  requireSettingsAccess,
  requireWriteAccess,
} from "@/actions/admin/guard";
import {
  changePasswordSchema,
  siteSettingsSchema,
  type SiteSettingsInput,
} from "@/lib/validations/admin/settings";
import { toActionResult, ValidationError } from "@/lib/errors";

export async function getSiteSettings() {
  return toActionResult(async () => {
    await requireAdminSession();
    const { SITE_NAME, SITE_DESCRIPTION } = await import("@/lib/constants");
    return getSiteConfigJson(SITE_CONFIG_KEYS.settings, {
      siteName: SITE_NAME,
      siteDescription: SITE_DESCRIPTION,
      defaultOgImage: "",
      twitterHandle: "",
      disclosureText:
        "FreshStart UK may earn a commission when you use partner links.",
    });
  });
}

export async function saveSiteSettings(input: SiteSettingsInput) {
  return toActionResult(async () => {
    await requireWriteAccess();
    const data = siteSettingsSchema.parse(input);
    await setSiteConfigJson(SITE_CONFIG_KEYS.settings, data);
    return { saved: true };
  });
}

export async function changeAdminPassword(input: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) {
  return toActionResult(async () => {
    const session = await requireSettingsAccess();
    const parsed = changePasswordSchema.safeParse(input);
    if (!parsed.success) throw new ValidationError(parsed.error.message);

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { admin: true },
    });
    if (!user?.admin) throw new ValidationError("Admin not found");

    const valid = await bcrypt.compare(
      parsed.data.currentPassword,
      user.admin.passwordHash
    );
    if (!valid) throw new ValidationError("Current password is incorrect");

    const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
    await prisma.admin.update({
      where: { id: user.admin.id },
      data: { passwordHash },
    });

    return { changed: true };
  });
}
