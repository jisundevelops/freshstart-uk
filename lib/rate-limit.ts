import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";

export type RateLimitPreset = "api" | "auth" | "analytics" | "admin";

const PRESETS: Record<
  RateLimitPreset,
  { requests: number; window: `${number} s` | `${number} m` }
> = {
  api: { requests: 60, window: "1 m" },
  auth: { requests: 10, window: "1 m" },
  analytics: { requests: 120, window: "1 m" },
  admin: { requests: 30, window: "1 m" },
};

const limiters = new Map<RateLimitPreset, Ratelimit>();

/** Cached edge Redis instance — avoids creating a new client per request */
let edgeRedis: Redis | null = null;

function getEdgeRedis(): Redis | null {
  if (edgeRedis) return edgeRedis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  edgeRedis = new Redis({ url, token });
  return edgeRedis;
}

function getLimiter(preset: RateLimitPreset): Ratelimit | null {
  const existing = limiters.get(preset);
  if (existing) return existing;

  const redis = getEdgeRedis();
  if (!redis) return null;

  const config = PRESETS[preset];
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(config.requests, config.window),
    prefix: `freshstart:ratelimit:${preset}`,
    analytics: true,
  });

  limiters.set(preset, limiter);
  return limiter;
}

/** Extract real client IP — uses last entry in x-forwarded-for (Vercel CDN appends real IP last) */
function getIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ips = forwarded.split(",").map((ip) => ip.trim());
    const realIp = ips[ips.length - 1];
    if (realIp && realIp !== "unknown") return realIp;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return `anon:${request.headers.get("user-agent")?.slice(0, 50) ?? "unknown"}`;
}

export async function checkRateLimit(
  request: NextRequest,
  preset: RateLimitPreset
): Promise<{ success: boolean; retryAfter?: number }> {
  const limiter = getLimiter(preset);

  if (!limiter) {
    if (process.env.NODE_ENV === "production") {
      console.warn("[rate-limit] Redis unavailable — rate limiting bypassed");
    }
    return { success: true };
  }

  const identifier = getIdentifier(request);
  const result = await limiter.limit(identifier);

  if (!result.success) {
    const retryAfter = Math.ceil((result.reset - Date.now()) / 1000);
    return { success: false, retryAfter: Math.max(retryAfter, 1) };
  }

  return { success: true };
}
