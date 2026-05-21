"use server";

import { AnalyticsEventType } from "@prisma/client";
import { z } from "zod";
import { trackEvent } from "@/lib/analytics";
import { toActionResult, ValidationError } from "@/lib/errors";

const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export async function subscribeNewsletter(email: string) {
  return toActionResult(async () => {
    const parsed = newsletterSchema.safeParse({ email });
    if (!parsed.success) {
      throw new ValidationError(parsed.error.message);
    }

    await trackEvent({
      eventType: AnalyticsEventType.SIGNUP,
      path: "/",
      metadata: { type: "newsletter", email: parsed.data.email },
    });

    return { subscribed: true };
  });
}
