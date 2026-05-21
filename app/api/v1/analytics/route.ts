import { trackEvent } from "@/lib/analytics";
import { apiSuccess } from "@/lib/api/response";
import { createApiHandler } from "@/lib/api/handler";
import { getSessionIdFromHeaders } from "@/lib/analytics";
import { trackEventSchema } from "@/lib/validations/analytics";

export const POST = createApiHandler(
  async (request, { body }) => {
    const sessionId =
      body.sessionId ?? getSessionIdFromHeaders(request.headers);

    await trackEvent({
      eventType: body.eventType,
      path: body.path,
      referrer: body.referrer ?? request.headers.get("referer") ?? undefined,
      sessionId,
      userAgent: request.headers.get("user-agent") ?? undefined,
      country: body.country,
      metadata: body.metadata,
    });

    return apiSuccess({ tracked: true }, 201);
  },
  { schema: trackEventSchema, rateLimit: "analytics" }
);
