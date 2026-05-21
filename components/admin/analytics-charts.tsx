"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyMetric } from "@/lib/analytics-admin";

export function AnalyticsCharts({ data }: { data: DailyMetric[] }) {
  if (data.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No chart data for this period.
      </p>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="pv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#00D4FF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="date"
            tick={{ fill: "hsl(var(--muted))", fontSize: 11 }}
            tickFormatter={(v) => v.slice(5)}
          />
          <YAxis tick={{ fill: "hsl(var(--muted))", fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              background: "hsl(var(--surface))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
            }}
          />
          <Area
            type="monotone"
            dataKey="pageViews"
            stroke="#00D4FF"
            fill="url(#pv)"
            name="Page views"
          />
          <Area
            type="monotone"
            dataKey="linkClicks"
            stroke="#7B61FF"
            fill="transparent"
            name="Link clicks"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
