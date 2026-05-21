import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import type { NextRequest } from "next/server";

export type RateLimitPreset = "api" | "auth" | "analytics";

const PRESETS: Record<
  RateLimitPreset,
  { requests: number; window: `${number} s` | `${number} m` }
> = {
  api: { requests: 60, window: "1 m" },
  auth: { requests: 10, window: "1 m" },
  analytics: { requests: 120, window: "1 m" },
};

const limiters = new Map<RateLimitPreset, Ratelimit>();

function getEdgeRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function getLimiter(preset: RateLimitPreset): Ratelimit | null {
  const redis = getEdgeRedis();
  if (!redis) return null;

  const existing = limiters.get(preset);
  if (existing) return existing;

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

function getIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? "127.0.0.1";
  return ip;
}

export async function checkRateLimit(
  request: NextRequest,
  preset: RateLimitPreset
): Promise<{ success: boolean; retryAfter?: number }> {
  const limiter = getLimiter(preset);

  if (!limiter) {
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
