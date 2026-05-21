import { AnalyticsEventType, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { cacheKey, cacheGetOrSet } from "@/lib/redis";

export interface DailyMetric {
  date: string;
  pageViews: number;
  linkClicks: number;
  total: number;
}

export interface AdminDashboardData {
  summary7: Awaited<ReturnType<typeof getAdminAnalytics>>;
  summary30: Awaited<ReturnType<typeof getAdminAnalytics>>;
  affiliateClicks: { slug: string; name: string; count: number }[];
  recentActivity: {
    id: string;
    eventType: AnalyticsEventType;
    path: string;
    createdAt: Date;
  }[];
}

async function getAdminAnalytics(days: number) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const events = await prisma.analytics.findMany({
    where: { createdAt: { gte: since } },
    select: { eventType: true, path: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const dailyMap = new Map<string, DailyMetric>();

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dailyMap.set(key, {
      date: key,
      pageViews: 0,
      linkClicks: 0,
      total: 0,
    });
  }

  let pageViews = 0;
  let linkClicks = 0;
  const pathCounts = new Map<string, number>();

  for (const event of events) {
    const dayKey = event.createdAt.toISOString().slice(0, 10);
    const day = dailyMap.get(dayKey);
    if (day) {
      day.total += 1;
      if (event.eventType === "PAGE_VIEW") day.pageViews += 1;
      if (event.eventType === "LINK_CLICK") day.linkClicks += 1;
    }
    if (event.eventType === "PAGE_VIEW") pageViews += 1;
    if (event.eventType === "LINK_CLICK") linkClicks += 1;
    pathCounts.set(event.path, (pathCounts.get(event.path) ?? 0) + 1);
  }

  const topPaths = Array.from(pathCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([path, count]) => ({ path, count }));

  return {
    totalEvents: events.length,
    pageViews,
    linkClicks,
    topPaths,
    daily: Array.from(dailyMap.values()),
  };
}

export async function getAffiliateClickStats(days = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const clicks = await prisma.analytics.findMany({
    where: {
      eventType: AnalyticsEventType.LINK_CLICK,
      createdAt: { gte: since },
    },
    select: { metadata: true },
  });

  const counts = new Map<string, { slug: string; name: string; count: number }>();

  for (const click of clicks) {
    const meta = click.metadata as Prisma.JsonObject | null;
    const slug = (meta?.affiliateSlug as string) ?? "unknown";
    const name = (meta?.providerName as string) ?? slug;
    const existing = counts.get(slug);
    if (existing) existing.count += 1;
    else counts.set(slug, { slug, name, count: 1 });
  }

  return Array.from(counts.values()).sort((a, b) => b.count - a.count);
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  return cacheGetOrSet(
    cacheKey("analytics", "admin-dashboard"),
    async () => {
      const [summary7, summary30, affiliateClicks, recentActivity] =
        await Promise.all([
          getAdminAnalytics(7),
          getAdminAnalytics(30),
          getAffiliateClickStats(30),
          prisma.analytics.findMany({
            orderBy: { createdAt: "desc" },
            take: 20,
            select: {
              id: true,
              eventType: true,
              path: true,
              createdAt: true,
            },
          }),
        ]);

      return { summary7, summary30, affiliateClicks, recentActivity };
    },
    120
  );
}
