import { apiSuccess } from "@/lib/api/response";
import { createApiHandler } from "@/lib/api/handler";

export const GET = createApiHandler(
  async () => {
    const checks: Record<string, string> = {
      status: "ok",
      service: "freshstart-uk",
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? "0.1.0",
    };

    // Check Redis connectivity
    try {
      const { getRedis } = await import("@/lib/redis");
      const redis = getRedis();
      if (redis) {
        await redis.ping();
        checks.redis = "connected";
      } else {
        checks.redis = "not_configured";
      }
    } catch {
      checks.redis = "error";
      checks.status = "degraded";
    }

    // Check database connectivity
    try {
      const { prisma } = await import("@/lib/prisma");
      await prisma.$queryRaw`SELECT 1`;
      checks.database = "connected";
    } catch {
      checks.database = "error";
      checks.status = "degraded";
    }

    return apiSuccess(checks);
  },
  { rateLimit: "api", methods: ["GET"] }
);
