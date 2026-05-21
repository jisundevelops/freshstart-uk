import type { AnalyticsEventType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { cacheKey, cacheGetOrSet } from "@/lib/redis";

export interface TrackEventInput {
  eventType: AnalyticsEventType;
  path: string;
  referrer?: string;
  sessionId?: string;
  userAgent?: string;
  country?: string;
  metadata?: Prisma.InputJsonValue | Record<string, unknown>;
}

export async function trackEvent(input: TrackEventInput): Promise<void> {
  await prisma.analytics.create({
    data: {
      eventType: input.eventType,
      path: input.path,
      referrer: input.referrer,
      sessionId: input.sessionId,
      userAgent: input.userAgent,
      country: input.country,
      metadata: input.metadata as Prisma.InputJsonValue | undefined,
    },
  });
}

export interface AnalyticsSummary {
  totalEvents: number;
  pageViews: number;
  linkClicks: number;
  topPaths: { path: string; count: number }[];
}

export async function getAnalyticsSummary(
  days = 7
): Promise<AnalyticsSummary> {
  const key = cacheKey("analytics", `summary:${days}`);

  return cacheGetOrSet(
    key,
    async () => {
      const since = new Date();
      since.setDate(since.getDate() - days);

      const [totalEvents, pageViews, linkClicks, pathGroups] =
        await Promise.all([
          prisma.analytics.count({ where: { createdAt: { gte: since } } }),
          prisma.analytics.count({
            where: { createdAt: { gte: since }, eventType: "PAGE_VIEW" },
          }),
          prisma.analytics.count({
            where: { createdAt: { gte: since }, eventType: "LINK_CLICK" },
          }),
          prisma.analytics.groupBy({
            by: ["path"],
            where: { createdAt: { gte: since } },
            _count: { path: true },
            orderBy: { _count: { path: "desc" } },
            take: 10,
          }),
        ]);

      return {
        totalEvents,
        pageViews,
        linkClicks,
        topPaths: pathGroups.map((group) => ({
          path: group.path,
          count: group._count.path,
        })),
      };
    },
    300
  );
}

export function getSessionIdFromHeaders(headers: Headers): string {
  return (
    headers.get("x-session-id") ??
    headers.get("x-analytics-session") ??
    crypto.randomUUID()
  );
}
