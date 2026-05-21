import { getBanks, getSimProviders } from "@/actions/affiliates";
import { getPublishedTools } from "@/actions/tools";
import { cacheKey, cacheGetOrSet } from "@/lib/redis";
import {
  BANK_CONFIGS,
  mergeBankRows,
  type BankConfig,
} from "@/lib/tools/bank-compare";
import {
  SIM_CONFIGS,
  mergeSimRows,
  type SimConfig,
} from "@/lib/tools/sim-guide";
import { getSiteConfigJson, SITE_CONFIG_KEYS } from "@/lib/admin/site-config";
import type { BankCompareRow, SimGuideRow } from "@/types/tools";
import type { ToolListItem } from "@/types/content";

export async function fetchBankCompareRows(): Promise<BankCompareRow[]> {
  return cacheGetOrSet(
    cacheKey("tools", "bank-compare-rows"),
    async () => {
      const result = await getBanks();
      const affiliates = result.success ? result.data : [];
      const configs = await getSiteConfigJson<BankConfig[]>(
        SITE_CONFIG_KEYS.toolsBank,
        BANK_CONFIGS
      );
      return mergeBankRows(affiliates, configs);
    },
    600
  );
}

export async function fetchSimGuideRows(): Promise<SimGuideRow[]> {
  return cacheGetOrSet(
    cacheKey("tools", "sim-guide-rows"),
    async () => {
      const result = await getSimProviders();
      const affiliates = result.success ? result.data : [];
      const configs = await getSiteConfigJson<SimConfig[]>(
        SITE_CONFIG_KEYS.toolsSim,
        SIM_CONFIGS
      );
      return mergeSimRows(affiliates, configs);
    },
    600
  );
}

export async function fetchToolsCatalog(): Promise<ToolListItem[]> {
  const result = await getPublishedTools();
  return result.success ? result.data : [];
}
