import Link from "next/link";
import {
  BarChart3,
  Eye,
  MousePointerClick,
  Plus,
  BookOpen,
  Newspaper,
} from "lucide-react";
import { getAdminDashboardData } from "@/lib/analytics-admin";
import { getAdminContext } from "@/lib/admin/session";
import { AnalyticsCharts } from "@/components/admin/analytics-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const { session } = await getAdminContext();
  const data = await getAdminDashboardData();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="gradient-heading font-heading text-3xl font-bold">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back, {session.user.email}
          </p>
        </div>
        <Badge variant="secondary">{session.user.role}</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Events (7d)"
          value={data.summary7.totalEvents}
          icon={<BarChart3 className="h-5 w-5 text-accent" />}
        />
        <StatCard
          label="Page views (7d)"
          value={data.summary7.pageViews}
          icon={<Eye className="h-5 w-5 text-accent" />}
        />
        <StatCard
          label="Link clicks (7d)"
          value={data.summary7.linkClicks}
          icon={<MousePointerClick className="h-5 w-5 text-accent" />}
        />
        <StatCard
          label="Events (30d)"
          value={data.summary30.totalEvents}
          icon={<BarChart3 className="h-5 w-5 text-accent-secondary" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="glass lg:col-span-2">
          <CardHeader>
            <CardTitle>Traffic (7 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <AnalyticsCharts data={data.summary7.daily} />
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="secondary" className="w-full justify-start" asChild>
              <Link href="/admin/guides/new">
                <Plus className="h-4 w-4" />
                New guide
              </Link>
            </Button>
            <Button variant="secondary" className="w-full justify-start" asChild>
              <Link href="/admin/blog/new">
                <Plus className="h-4 w-4" />
                New blog post
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/guides">
                <BookOpen className="h-4 w-4" />
                Manage guides
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/admin/blog">
                <Newspaper className="h-4 w-4" />
                Manage blog
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Top pages (7d)</CardTitle>
          </CardHeader>
          <CardContent>
            {data.summary7.topPaths.length === 0 ? (
              <p className="text-sm text-muted-foreground">No data yet.</p>
            ) : (
              <ul className="space-y-2">
                {data.summary7.topPaths.map((item) => (
                  <li
                    key={item.path}
                    className="flex justify-between text-sm border-b border-border/30 pb-2"
                  >
                    <span className="truncate pr-4">{item.path}</span>
                    <span className="text-muted">{item.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Affiliate clicks (30d)</CardTitle>
          </CardHeader>
          <CardContent>
            {data.affiliateClicks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No clicks tracked.</p>
            ) : (
              <ul className="space-y-2">
                {data.affiliateClicks.slice(0, 8).map((item) => (
                  <li
                    key={item.slug}
                    className="flex justify-between text-sm"
                  >
                    <span>{item.name}</span>
                    <span className="text-accent">{item.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent events.</p>
          ) : (
            <ul className="divide-y divide-border/30">
              {data.recentActivity.map((event) => (
                <li
                  key={event.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
                >
                  <span className="font-medium text-accent">
                    {event.eventType}
                  </span>
                  <span className="text-muted-foreground truncate max-w-md">
                    {event.path}
                  </span>
                  <time className="text-xs text-muted">
                    {formatDate(event.createdAt)}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <Card className="glass glow-accent-hover">
      <CardContent className="flex items-center gap-4 p-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
          {icon}
        </span>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="font-heading text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
