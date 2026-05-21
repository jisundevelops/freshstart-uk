import { AnalyticsEventType } from "@prisma/client";
import { trackEvent, type TrackEventInput as AnalyticsTrackEventInput } from "@/lib/analytics";
import { apiSuccess } from "@/lib/api/response";
import { createApiHandler } from "@/lib/api/handler";
import { getSessionIdFromHeaders } from "@/lib/analytics";
import { trackEventSchema } from "@/lib/validations/analytics";

interface AnalyticsBody {
  eventType: AnalyticsEventType;
  path: string;
  referrer?: string;
  sessionId?: string;
  country?: string;
  metadata?: Record<string, unknown>;
}

export const POST = createApiHandler<AnalyticsBody>(
  async (request, { body }) => {
    const sessionId =
      body.sessionId ?? getSessionIdFromHeaders(request.headers);

    const input: AnalyticsTrackEventInput = {
      eventType: body.eventType,
      path: body.path,
      referrer: body.referrer ?? request.headers.get("referer") ?? undefined,
      sessionId,
      userAgent: request.headers.get("user-agent") ?? undefined,
      country: body.country,
      metadata: body.metadata,
    };

    await trackEvent(input);

    return apiSuccess({ tracked: true }, 201);
  },
  { schema: trackEventSchema as unknown as import("zod").ZodType<AnalyticsBody>, rateLimit: "analytics" }
);
