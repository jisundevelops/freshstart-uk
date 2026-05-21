import { AnalyticsEventType } from "@prisma/client";
import { z } from "zod";

export const trackEventSchema = z.object({
  eventType: z.nativeEnum(AnalyticsEventType),
  path: z.string().min(1).max(500),
  referrer: z.string().max(500).optional(),
  sessionId: z.string().max(100).optional(),
  country: z.string().length(2).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type TrackEventInput = z.infer<typeof trackEventSchema>;

export const analyticsQuerySchema = z.object({
  days: z.coerce.number().int().min(1).max(90).default(7),
});
