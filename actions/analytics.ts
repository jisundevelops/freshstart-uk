"use server";

import { trackEvent } from "@/lib/analytics";
import { requireAdmin } from "@/lib/auth-session";
import { toActionResult, ValidationError } from "@/lib/errors";
import {
  analyticsQuerySchema,
  trackEventSchema,
} from "@/lib/validations/analytics";

export async function trackAnalyticsEvent(
  input: unknown
): Promise<
  | { success: true; data: { tracked: true } }
  | { success: false; error: string }
> {
  return toActionResult(async () => {
    const parsed = trackEventSchema.safeParse(input);
    if (!parsed.success) {
      throw new ValidationError(parsed.error.message);
    }

    await trackEvent(parsed.data as Parameters<typeof trackEvent>[0]);
    return { tracked: true };
  });
}

export async function getAdminAnalyticsSummary(input?: { days?: number }) {
  return toActionResult(async () => {
    await requireAdmin(["SUPER_ADMIN", "EDITOR", "VIEWER"]);

    const parsed = analyticsQuerySchema.safeParse(input ?? {});
    if (!parsed.success) {
      throw new ValidationError(parsed.error.message);
    }

    const { getAnalyticsSummary } = await import("@/lib/analytics");
    return getAnalyticsSummary(parsed.data.days);
  });
}
