import { Redis } from "@upstash/redis";
import { hasRedis, serverEnv } from "@/lib/env";

let redis: Redis | null = null;

function createRedisClient(): Redis | null {
  if (!hasRedis()) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[redis] UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN is missing"
      );
    }
    return null;
  }

  return new Redis({
    url: serverEnv.UPSTASH_REDIS_REST_URL!,
    token: serverEnv.UPSTASH_REDIS_REST_TOKEN!,
  });
}

export function getRedis(): Redis | null {
  if (!redis) {
    redis = createRedisClient();
  }
  return redis;
}

const CACHE_PREFIX = "freshstart:cache:";

export function cacheKey(namespace: string, key: string): string {
  return `${CACHE_PREFIX}${namespace}:${key}`;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const client = getRedis();
  if (!client) return null;
  try {
    return await client.get<T>(key);
  } catch (error) {
    console.error("[redis] cacheGet failed:", error);
    return null;
  }
}

export async function cacheSet(
  key: string,
  value: unknown,
  ttlSeconds = 3600
): Promise<boolean> {
  const client = getRedis();
  if (!client) return false;
  try {
    await client.set(key, value, { ex: ttlSeconds });
    return true;
  } catch (error) {
    console.error("[redis] cacheSet failed:", error);
    return false;
  }
}

export async function cacheDel(key: string): Promise<boolean> {
  const client = getRedis();
  if (!client) return false;
  try {
    await client.del(key);
    return true;
  } catch (error) {
    console.error("[redis] cacheDel failed:", error);
    return false;
  }
}

export async function cacheGetOrSet<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds = 3600
): Promise<T> {
  const cached = await cacheGet<T>(key);
  if (cached !== null) return cached;

  const fresh = await fetcher();
  await cacheSet(key, fresh, ttlSeconds);
  return fresh;
}

export async function cacheInvalidatePattern(
  namespace: string
): Promise<void> {
  const client = getRedis();
  if (!client) return;

  const pattern = `${CACHE_PREFIX}${namespace}:*`;
  try {
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(...keys);
    }
  } catch (error) {
    console.error("[redis] cacheInvalidatePattern failed:", error);
  }
}
