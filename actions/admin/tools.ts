"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  getSiteConfigJson,
  setSiteConfigJson,
  SITE_CONFIG_KEYS,
} from "@/lib/admin/site-config";
import { requireAdminSession, requireWriteAccess } from "@/actions/admin/guard";
import { toActionResult } from "@/lib/errors";
import { BANK_CONFIGS } from "@/lib/tools/bank-compare";
import { SIM_CONFIGS } from "@/lib/tools/sim-guide";
import { COST_CITIES } from "@/lib/tools/cost-calculator";

const jsonSchema = z.record(z.unknown());

export async function listAdminToolsRegistry() {
  return toActionResult(async () => {
    await requireAdminSession();
    return prisma.tool.findMany({ orderBy: { sortOrder: "asc" } });
  });
}

export async function getToolConfigs() {
  return toActionResult(async () => {
    await requireAdminSession();
    const [bank, sim, cost] = await Promise.all([
      getSiteConfigJson(SITE_CONFIG_KEYS.toolsBank, BANK_CONFIGS),
      getSiteConfigJson(SITE_CONFIG_KEYS.toolsSim, SIM_CONFIGS),
      getSiteConfigJson(SITE_CONFIG_KEYS.toolsCost, {
        cities: COST_CITIES,
        rentBase: { shared: 550, private: 750, studio: 950 },
      }),
    ]);
    return { bank, sim, cost };
  });
}

export async function saveToolConfig(
  key: "bank" | "sim" | "cost",
  data: unknown
) {
  return toActionResult(async () => {
    await requireWriteAccess();
    const parsed = jsonSchema.parse(data);
    const map = {
      bank: SITE_CONFIG_KEYS.toolsBank,
      sim: SITE_CONFIG_KEYS.toolsSim,
      cost: SITE_CONFIG_KEYS.toolsCost,
    } as const;
    await setSiteConfigJson(map[key], parsed);
    await import("@/lib/redis").then((r) =>
      r.cacheInvalidatePattern("tools")
    );
    revalidatePath("/tools/bank-compare");
    revalidatePath("/tools/sim-guide");
    revalidatePath("/tools/cost-calculator");
    return { saved: true };
  });
}
