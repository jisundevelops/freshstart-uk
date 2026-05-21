"use server";

import { AnalyticsEventType } from "@prisma/client";
import { trackEvent } from "@/lib/analytics";
import { toActionResult } from "@/lib/errors";
import { z } from "zod";

const affiliateClickSchema = z.object({
  path: z.string().min(1).max(500),
  affiliateSlug: z.string().min(1).max(120),
  providerName: z.string().min(1).max(120),
  toolSlug: z.string().min(1).max(80),
});

export async function trackAffiliateClick(input: {
  path: string;
  affiliateSlug: string;
  providerName: string;
  toolSlug: string;
}) {
  return toActionResult(async () => {
    const parsed = affiliateClickSchema.safeParse(input);
    if (!parsed.success) {
      return { tracked: false };
    }

    await trackEvent({
      eventType: AnalyticsEventType.LINK_CLICK,
      path: parsed.data.path,
      metadata: {
        affiliateSlug: parsed.data.affiliateSlug,
        providerName: parsed.data.providerName,
        toolSlug: parsed.data.toolSlug,
      },
    });

    return { tracked: true };
  });
}

export async function trackToolUse(toolSlug: string, path: string) {
  return toActionResult(async () => {
    await trackEvent({
      eventType: AnalyticsEventType.TOOL_USE,
      path,
      metadata: { toolSlug },
    });
    return { tracked: true };
  });
}
